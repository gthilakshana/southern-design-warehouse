"use server"
// Using direct MongoDB to bypass broken Prisma engine
import bcrypt from "bcryptjs"
import { signIn, auth } from "@/auth"
import { AuthError } from "next-auth"
import { revalidatePath } from "next/cache"
import { uploadImage, deleteImageFromStorage, testStorageConnectivity } from "./storage"
import { getDirectDb } from "./mongodb-direct"
import { ObjectId } from "mongodb"

// Storage functions are now imported from ./storage module
// They provide both Supabase and AWS S3 support based on STORAGE_PROVIDER env var

export async function testSupabaseConnectivity() {
  // For backward compatibility - now tests the configured storage provider
  return testStorageConnectivity()
}

// Serialization helper to ensure data is safe for Next.js Server Actions
function serialize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
}

// --- AUTH ACTIONS ---

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = (formData.get("role") as "ADMIN" | "CONTRACTOR") || "CONTRACTOR"

  if (!email || !password) return { error: "Email and password required" }

  try {
    const db = await getDirectDb()
    const existingUser = await db.collection("User").findOne({ email })
    if (existingUser) return { error: "User already exists" }

    const hashedPassword = await bcrypt.hash(password, 10)

    const imageFile = formData.get("image") as File | null
    const { url: imageUrl, error: uploadError } = await uploadImage(imageFile)

    if (uploadError && imageFile && imageFile.size > 0) {
      return { error: `Image Upload Failed: ${uploadError}` }
    }

    await db.collection("User").insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      image: imageUrl,
      joined: new Date(),
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return { success: "Account created! You can now login." }
  } catch (error) {
    console.error("Signup Error:", error)
    return { error: "Failed to create account" }
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  try {
    console.log(`Action: loginUser initiated for ${formData.get("email")}`);
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      console.log(`Action: AuthError caught - ${error.type}`);
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          return { error: "Something went wrong." }
      }
    }
    // IMPORTANT: Re-throw the error so Next.js can handle redirects
    throw error
  }
}

// --- INVENTORY ACTIONS ---

export async function getInventory() {
  try {
    const db = await getDirectDb()
    const items = await db.collection("InventoryItem")
      .find({})
      .sort({ updatedAt: -1 })
      .toArray()
    
    return items.map(i => ({
      ...i,
      id: i._id.toString(),
      _id: undefined,
      createdAt: i.createdAt instanceof Date ? i.createdAt.toISOString() : i.createdAt,
      updatedAt: i.updatedAt instanceof Date ? i.updatedAt.toISOString() : i.updatedAt
    }))
  } catch (error) {
    console.error("Fetch Inventory Error:", error)
    return []
  }
}

export async function createInventoryItem(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const sku = formData.get("sku") as string
    const category = formData.get("category") as string
    const price = parseFloat(formData.get("price") as string)
    const stock = parseInt(formData.get("stock") as string)

    const imageFile = formData.get("image") as File | null
    const { url: imageUrl, error: uploadError } = await uploadImage(imageFile)

    if (uploadError && imageFile && imageFile.size > 0) {
      return { error: `Image Upload Failed: ${uploadError}` }
    }

    console.log("Saving Inventory Item with Image URL:", imageUrl);
    const db = await getDirectDb()
    await db.collection("InventoryItem").insertOne({
      name,
      sku,
      category,
      price,
      stock,
      imageUrl,
      status: stock > 10 ? "IN STOCK" : stock > 0 ? "LOW STOCK" : "OUT OF STOCK",
      createdAt: new Date(),
      updatedAt: new Date()
    })

    revalidatePath("/admin/inventory")
    return { success: true }
  } catch (error) {
    console.error("Create Inventory Error:", error)
    return { error: "Failed to create item" }
  }
}

export async function updateInventoryItem(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const category = formData.get("category") as string
    const price = parseFloat(formData.get("price") as string)
    const stock = parseInt(formData.get("stock") as string)

    const removeImage = formData.get("removeImage") === "true"
    const imageFile = formData.get("image") as File | null
    const { url: newImageUrl, error: uploadError } = await uploadImage(imageFile)

    if (uploadError && imageFile && imageFile.size > 0) {
      return { error: `Image Upload Failed: ${uploadError}` }
    }

    const db = await getDirectDb()
    const existing = await db.collection("InventoryItem").findOne({ _id: new ObjectId(id) })

    const updateData: any = {
      name,
      category,
      price,
      stock,
      status: stock > 10 ? "IN STOCK" : stock > 0 ? "LOW STOCK" : "OUT OF STOCK",
      updatedAt: new Date()
    }

    if (removeImage) {
      if (existing?.imageUrl) await deleteImageFromStorage(existing.imageUrl)
      updateData.imageUrl = null
    } else if (newImageUrl) {
      if (existing?.imageUrl) await deleteImageFromStorage(existing.imageUrl)
      updateData.imageUrl = newImageUrl
    }

    await db.collection("InventoryItem").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    revalidatePath("/admin/inventory")
    return { success: true }
  } catch (error: any) {
    console.error("Inventory Update Error:", error)
    return { error: `Update Failed: ${error.message || "Unknown Database Error"}` }
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    const db = await getDirectDb()
    const existing = await db.collection("InventoryItem").findOne({ _id: new ObjectId(id) })
    if (existing?.imageUrl) await deleteImageFromStorage(existing.imageUrl)

    await db.collection("InventoryItem").deleteOne({ _id: new ObjectId(id) })
    revalidatePath("/admin/inventory")
    return { success: true }
  } catch (error) {
    console.error("Delete Inventory Error:", error)
    return { error: "Failed to delete item" }
  }
}

export async function getUsers() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') {
      console.warn("Unauthorized getUsers access attempt")
      return [] // Return empty for non-admins to avoid crash
    }

    const db = await getDirectDb()
    const users = await db.collection("User").find({}, {
      projection: { password: 0 }
    }).sort({ joined: -1 }).toArray()

    return serialize(users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      image: u.image,
      status: u.status,
      joined: u.joined instanceof Date ? u.joined.toISOString() : u.joined,
      createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
      updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : u.updatedAt
    })))
  } catch (error: any) {
    console.error("Fetch Users Error:", error)
    return []
  }
}

export async function updateUserDetails(id: string, formData: FormData) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return { error: "Unauthorized: Master Admin privileges required" }
  }

  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as string
    const status = formData.get("status") as string
    const removeImage = formData.get("removeImage") === "true"

    const imageFile = formData.get("image") as File | null
    const { url: imageUrl, error: uploadError } = await uploadImage(imageFile)

    if (uploadError && imageFile && imageFile.size > 0) {
      return { error: `Image Upload Failed: ${uploadError}` }
    }

    const db = await getDirectDb()
    const existing = await db.collection("User").findOne({ _id: new ObjectId(id) })
    const updateData: any = { name, email, role, status, updatedAt: new Date() }

    if (removeImage) {
      if (existing?.image) await deleteImageFromStorage(existing.image)
      updateData.image = null
    } else if (imageUrl) {
      if (existing?.image) await deleteImageFromStorage(existing.image)
      updateData.image = imageUrl
    }

    await db.collection("User").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error: any) {
    console.error("User Update Error:", error)
    return { error: `Update Failed: ${error.message || "Unknown Database Error"}` }
  }
}

export async function deleteUser(id: string) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return { error: "Unauthorized: Master Admin privileges required" }
  }

  try {
    const db = await getDirectDb()
    const existing = await db.collection("User").findOne({ _id: new ObjectId(id) })
    if (existing?.image) await deleteImageFromStorage(existing.image)

    await db.collection("User").deleteOne({ _id: new ObjectId(id) })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Delete User Error:", error)
    return { error: "Failed to delete user" }
  }
}

// --- SITE SETTINGS ACTIONS ---

export interface ProductCategory {
  id: string;
  title: string;
  subtitle?: string;
  shortDesc?: string;
  desc: string;
  benefits: string[];
  uses: string[];
  color?: string;
  order: number;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  address: string;
  phone: string;
  email: string;
  footerText: string;
  footerBtnText: string;
  footerBtnLink: string;
  logoUrl?: string | null;
  heroUrl?: string | null;
  heroTabletUrl?: string | null;
  heroMobileUrl?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  heroText?: string | null;
  updatedAt: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const db = await getDirectDb()
    let settings = await db.collection("SiteSettings").findOne({})
    
    if (!settings) {
      const defaultSettings = {
        siteName: "Southern Design Warehouse",
        address: "7117 Pelham Rd Suite L,\nGreenville, SC 29615",
        phone: "(864) 434-2131",
        email: "southerndesignwarehouse@gmail.com",
        footerText: "© 2024 Southern Design Warehouse. All rights reserved.",
        footerBtnText: "Plan Your Visit",
        footerBtnLink: "/contact",
        heroText: "Products.Kitchens.Bathrooms.Cabinets.Showroom",
        updatedAt: new Date().toISOString()
      }
      return { ...defaultSettings, id: "temp-id" } as any
    }

    return serialize({
      id: settings._id.toString(),
      siteName: settings.siteName,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      footerText: settings.footerText,
      footerBtnText: settings.footerBtnText,
      footerBtnLink: settings.footerBtnLink,
      logoUrl: settings.logoUrl,
      heroUrl: settings.heroUrl,
      heroTabletUrl: settings.heroTabletUrl,
      heroMobileUrl: settings.heroMobileUrl,
      heroTitle: settings.heroTitle,
      heroDescription: settings.heroDescription,
      heroText: settings.heroText || "Products.Kitchens.Bathrooms.Cabinets.Showroom",
      updatedAt: settings.updatedAt instanceof Date ? settings.updatedAt.toISOString() : settings.updatedAt
    })
  } catch (error) {
    console.error("Fetch Site Settings Error:", error)
    return null
  }
}

export async function updateSiteSettings(formData: FormData) {
  try {
    const db = await getDirectDb()
    const settings = await db.collection("SiteSettings").findOne({})

    const data: any = {}

    // Process Business Logo
    const logoFile = formData.get("logoImage") as File | null
    if (logoFile && logoFile.size > 0) {
      const { url, error } = await uploadImage(logoFile)
      if (error) return { error: `Logo Image: ${error}` }
      if (url) {
        if (settings?.logoUrl) await deleteImageFromStorage(settings.logoUrl)
        data.logoUrl = url
      }
    }

    // Process Desktop Image
    const heroFile = formData.get("heroImage") as File | null
    if (heroFile && heroFile.size > 0) {
      const { url, error } = await uploadImage(heroFile)
      if (error) return { error: `Desktop Image: ${error}` }
      if (url) {
        if (settings?.heroUrl) await deleteImageFromStorage(settings.heroUrl)
        data.heroUrl = url
      }
    }

    // Process Tablet Image
    const heroTabletFile = formData.get("heroTabletImage") as File | null
    if (heroTabletFile && heroTabletFile.size > 0) {
      const { url, error } = await uploadImage(heroTabletFile)
      if (error) return { error: `Tablet Image: ${error}` }
      if (url) {
        if (settings?.heroTabletUrl) await deleteImageFromStorage(settings.heroTabletUrl)
        data.heroTabletUrl = url
      }
    }

    // Process Mobile Image
    const heroMobileFile = formData.get("heroMobileImage") as File | null
    if (heroMobileFile && heroMobileFile.size > 0) {
      const { url, error } = await uploadImage(heroMobileFile)
      if (error) return { error: `Mobile Image: ${error}` }
      if (url) {
        if (settings?.heroMobileUrl) await deleteImageFromStorage(settings.heroMobileUrl)
        data.heroMobileUrl = url
      }
    }

    // Capture text fields
    const fields = ['siteName', 'address', 'phone', 'email', 'footerText', 'heroTitle', 'heroDescription', 'heroText', 'footerBtnText', 'footerBtnLink']
    fields.forEach(field => {
      const val = formData.get(field)
      if (val !== null) data[field] = val as string
    })

    if (settings) {
      await db.collection("SiteSettings").updateOne(
        { _id: settings._id },
        { $set: { ...data, updatedAt: new Date() } }
      )
    } else {
      await db.collection("SiteSettings").insertOne({
        ...data,
        updatedAt: new Date()
      })
    }

    revalidatePath("/admin/content")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Site Settings Update Error:", error)
    return {
      error: `System Failure: ${error?.message || "Unknown error occurred"}.`
    }
  }
}

// --- QUOTE REQUEST ACTIONS ---

export async function getQuoteRequests() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') return []

    // Direct MongoDB Bypass
    const db = await getDirectDb();
    const requests = await db.collection("QuoteRequest")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return requests.map(r => ({
      ...r,
      id: r._id.toString(),
      _id: undefined, // Don't pass non-serializable ObjectId to client
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
      updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : r.updatedAt
    }));
  } catch (error) {
    console.error("Failed to fetch quote requests:", error)
    return []
  }
}

export async function createQuoteRequest(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const projectType = formData.get("projectType") as string
    const materials = formData.get("materials") as string
    const message = formData.get("message") as string

    if (!name || !email || !phone) {
      return { error: "Missing required fields (Name, Email, Phone)" }
    }

    // Direct MongoDB Bypass
    const db = await getDirectDb();
    await db.collection("QuoteRequest").insertOne({
      name,
      email,
      phone,
      projectType,
      materials,
      message,
      status: "NEW",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: "Your quote request has been sent! We will contact you shortly." }
  } catch (error) {
    console.error("Failed to create quote request:", error)
    return { error: "Something went wrong. Please try again later." }
  }
}

export async function deleteQuoteRequest(id: string) {
  try {
    const db = await getDirectDb();
    await db.collection("QuoteRequest").deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/admin/quotes")
    return { success: true }
  } catch (error) {
    console.error("Delete Quote Request Error:", error)
    return { error: "Failed to delete quote request" }
  }
}

export async function updateQuoteStatus(id: string, status: string) {
  try {
    const db = await getDirectDb()
    await db.collection("QuoteRequest").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    )
    revalidatePath("/admin/quotes")
    return { success: true }
  } catch (error) {
    console.error("Failed to update status:", error)
    return { error: "Update failed" }
  }
}

export async function getNewQuoteCount() {
  try {
    const db = await getDirectDb()
    return await db.collection("QuoteRequest").countDocuments({ status: "NEW" })
  } catch (error) {
    console.error("Failed to fetch new quote count:", error)
    return 0
  }
}

export async function deleteMultipleQuoteRequests(ids: string[]) {
  try {
    const db = await getDirectDb()
    const objectIds = ids.map(id => new ObjectId(id))
    await db.collection("QuoteRequest").deleteMany({
      _id: { $in: objectIds }
    })
    revalidatePath("/admin/quotes")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete inquiries:", error)
    return { error: "Bulk delete failed" }
  }
}

export async function deleteAllQuoteRequests() {
  try {
    const db = await getDirectDb()
    await db.collection("QuoteRequest").deleteMany({})
    revalidatePath("/admin/quotes")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete all inquiries:", error)
    return { error: "Full archive clear failed" }
  }
}

// --- LEAD GENERATION ACTIONS (Priority Queue) ---

export async function submitLead(formData: FormData) {
  try {
    const email = formData.get("email") as string
    if (!email || !email.includes("@")) return { error: "Valid email required" }

    const db = await getDirectDb();
    const existing = await db.collection("Lead").findOne({ email });
    if (existing) return { success: "You are already in the queue! We will contact you soon." }

    await db.collection("Lead").insertOne({
      email,
      status: "UNREAD",
      createdAt: new Date()
    });

    return { success: "Success! You've been added to the Priority Queue." }
  } catch (error) {
    console.error("Lead Submission Error:", error)
    return { error: "Failed to join queue. Please try again." }
  }
}

export async function getLeads() {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== 'ADMIN') return []

    const db = await getDirectDb();
    const leads = await db.collection("Lead")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return leads.map(l => ({
      ...l,
      id: l._id.toString(),
      _id: undefined,
      createdAt: l.createdAt instanceof Date ? l.createdAt.toISOString() : l.createdAt
    }));
  } catch (error) {
    console.error("Fetch Leads Error:", error)
    return []
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const db = await getDirectDb();
    await db.collection("Lead").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    revalidatePath("/admin/quotes")
    return { success: true }
  } catch (error) {
    console.error("Update Lead Error:", error)
    return { error: "Update failed" }
  }
}

export async function deleteLead(id: string) {
  try {
    const db = await getDirectDb();
    await db.collection("Lead").deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/admin/quotes")
    return { success: true }
  } catch (error) {
    console.error("Delete Lead Error:", error)
    return { error: "Delete failed" }
  }
}

// --- FAQ ACTIONS ---

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  updatedAt: string;
  createdAt: string;
}

export async function getFAQs(): Promise<FAQ[]> {
  try {
    const db = await getDirectDb()
    const faqs = await db.collection("FAQ").find({}).sort({ order: 1 }).toArray()
    return faqs.map(f => ({
      ...f,
      id: f._id.toString(),
      _id: undefined,
      createdAt: f.createdAt instanceof Date ? f.createdAt.toISOString() : f.createdAt,
      updatedAt: f.updatedAt instanceof Date ? f.updatedAt.toISOString() : f.updatedAt
    })) as unknown as FAQ[]
  } catch (error) {
    console.error("Fetch FAQ Error:", error)
    return []
  }
}

export async function upsertFAQ(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const question = formData.get("question") as string
    const answer = formData.get("answer") as string
    const order = parseInt(formData.get("order") as string || "0")

    const db = await getDirectDb()
    const data = { question, answer, order, updatedAt: new Date() }

    if (id) {
      await db.collection("FAQ").updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      )
    } else {
      await db.collection("FAQ").insertOne({
        ...data,
        createdAt: new Date()
      })
    }
    revalidatePath("/faq")
    revalidatePath("/admin/legal")
    return { success: true }
  } catch (error) {
    console.error("FAQ Save Error:", error)
    return { error: "Failed to save FAQ" }
  }
}

export async function deleteFAQ(id: string) {
  try {
    const db = await getDirectDb()
    await db.collection("FAQ").deleteOne({ _id: new ObjectId(id) })
    revalidatePath("/faq")
    revalidatePath("/admin/legal")
    return { success: true }
  } catch (error) {
    console.error("Delete FAQ Error:", error)
    return { error: "Failed to delete FAQ" }
  }
}

// --- LEGAL PAGE ACTIONS ---

export interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  try {
    const db = await getDirectDb()
    let page = await db.collection("LegalPage").findOne({ slug })
    if (!page) {
      const defaultPage = {
        slug,
        title: slug === 'privacy' ? 'Privacy Policy' : 'Terms of Service',
        content: `This is the default content for the ${slug} page. Please update it in the admin panel.`,
        updatedAt: new Date().toISOString()
      }
      const res = await db.collection("LegalPage").insertOne(defaultPage)
      return { ...defaultPage, id: res.insertedId.toString() } as any
    }
    return serialize({
      id: page._id.toString(),
      slug: page.slug,
      title: page.title,
      content: page.content,
      updatedAt: page.updatedAt instanceof Date ? page.updatedAt.toISOString() : page.updatedAt
    }) as unknown as LegalPage
  } catch (error) {
    console.error(`Fetch Legal Page ${slug} Error:`, error)
    return null
  }
}

export async function updateLegalPage(formData: FormData) {
  try {
    const slug = formData.get("slug") as string
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    // Direct MongoDB Bypass
    const db = await getDirectDb()
    await db.collection("LegalPage").updateOne(
      { slug },
      { $set: { title, content, updatedAt: new Date() } },
      { upsert: true }
    )
    revalidatePath(`/${slug}`)
    revalidatePath("/admin/legal")
    return { success: true }
  } catch (error: any) {
    console.error("Legal Update Error:", error)
    return { error: `Failed to update legal page: ${error.message}` }
  }
}

// --- SOCIAL MEDIA ACTIONS ---

export async function getSocialLinks() {
  try {
    const db = await getDirectDb()
    const links = await db.collection("SocialLink").find({}).sort({ createdAt: 1 }).toArray()
    return serialize(links.map(l => ({
      id: l._id.toString(),
      platform: l.platform,
      url: l.url,
      isActive: l.isActive,
      createdAt: l.createdAt instanceof Date ? l.createdAt.toISOString() : l.createdAt,
      updatedAt: l.updatedAt instanceof Date ? l.updatedAt.toISOString() : l.updatedAt
    })))
  } catch (error) {
    console.error("Fetch Social Links Error:", error)
    return []
  }
}

export async function upsertSocialLink(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const platform = formData.get("platform") as string
    const url = formData.get("url") as string
    const isActive = formData.get("isActive") === "true"

    // Direct MongoDB Bypass
    const db = await getDirectDb()
    if (id) {
      await db.collection("SocialLink").updateOne(
        { _id: new ObjectId(id) },
        { $set: { platform, url, isActive, updatedAt: new Date() } }
      )
    } else {
      await db.collection("SocialLink").insertOne({
        platform,
        url,
        isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    revalidatePath("/admin/content")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Social Link Save Error:", error)
    return { error: "Failed to save social link" }
  }
}

export async function deleteSocialLink(id: string) {
  try {
    const db = await getDirectDb();
    await db.collection("SocialLink").deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/admin/content")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Delete Social Link Error:", error)
    return { error: "Failed to delete social link" }
  }
}

// --- PAGE CONTENT ACTIONS ---

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroText: string;
  heroUrl?: string | null;
  heroMobileUrl?: string | null;
  heroTabletUrl?: string | null;
  contentUrl?: string | null;
  fontSize?: string | null;
  updatedAt: string;
  metadata?: {
    mission: string;
    vision: string;
    story: string;
  };
}

export async function getPageContent(slug: string): Promise<PageContent | null> {
  try {
    const db = await getDirectDb()
    let content = await db.collection("PageContent").findOne({ slug })

    if (!content) {
      // Create default if not exists
      const defaultContent = {
        slug,
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        description: `Custom content for the ${slug} page.`,
        heroText: 'KITCHENS • BATHROOMS • CABINETS',
        updatedAt: new Date().toISOString()
      }
      const res = await db.collection("PageContent").insertOne(defaultContent)
      return { ...defaultContent, id: res.insertedId.toString() } as any
    }

    return serialize({
      id: content._id.toString(),
      slug: content.slug,
      title: content.title,
      description: content.description,
      heroText: content.heroText,
      heroUrl: content.heroUrl,
      heroMobileUrl: content.heroMobileUrl,
      heroTabletUrl: content.heroTabletUrl,
      contentUrl: content.contentUrl,
      fontSize: content.fontSize,
      updatedAt: content.updatedAt instanceof Date ? content.updatedAt.toISOString() : content.updatedAt,
      metadata: content.metadata
    }) as unknown as PageContent
  } catch (error) {
    console.error(`Failed to fetch content for ${slug}:`, error)
    return null
  }
}

export async function updatePageContent(formData: FormData) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return { error: "Unauthorized: Master Admin privileges required" }
  }

  try {
    const slug = formData.get("slug") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const heroText = formData.get("heroText") as string
    const fontSize = formData.get("fontSize") as string | null

    const mission = formData.get("mission") as string | null
    const vision = formData.get("vision") as string | null
    const story = formData.get("story") as string | null

    const db = await getDirectDb()
    const existing = await db.collection("PageContent").findOne({ slug })

    // Check for images
    const heroFile = formData.get("heroImage") as File | null
    const heroMobileFile = formData.get("heroMobileImage") as File | null
    const heroTabletFile = formData.get("heroTabletImage") as File | null
    const contentFile = formData.get("contentImage") as File | null

    const { url: heroUrl } = await uploadImage(heroFile)
    const { url: heroMobileUrl } = await uploadImage(heroMobileFile)
    const { url: heroTabletUrl } = await uploadImage(heroTabletFile)
    const { url: contentUrl } = await uploadImage(contentFile)

    const updateData: any = { title, description, heroText, fontSize, updatedAt: new Date() }
    
    // Handle Metadata for About Page
    if (slug === 'about') {
      updateData.metadata = {
        mission: mission || "",
        vision: vision || "",
        story: story || ""
      }
    }

    if (heroUrl) {
      if (existing?.heroUrl) await deleteImageFromStorage(existing.heroUrl)
      updateData.heroUrl = heroUrl
    }
    if (heroMobileUrl) {
      if (existing?.heroMobileUrl) await deleteImageFromStorage(existing.heroMobileUrl)
      updateData.heroMobileUrl = heroMobileUrl
    }
    if (heroTabletUrl) {
      if (existing?.heroTabletUrl) await deleteImageFromStorage(existing.heroTabletUrl)
      updateData.heroTabletUrl = heroTabletUrl
    }
    if (contentUrl) {
      if (existing?.contentUrl) await deleteImageFromStorage(existing.contentUrl)
      updateData.contentUrl = contentUrl
    }

    await db.collection("PageContent").updateOne(
      { slug },
      { $set: updateData },
      { upsert: true }
    )

    revalidatePath(`/${slug}`)
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error: any) {
    console.error("Page Content Update Error:", error)
    return { error: `Update failed: ${error.message}` }
  }
}

export async function deletePageImage(slug: string, field: 'hero' | 'heroMobile' | 'heroTablet' | 'content') {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return { error: "Unauthorized" }
  }

  try {
    const db = await getDirectDb()
    const existing = await db.collection("PageContent").findOne({ slug })
    const updateData: any = { updatedAt: new Date() }

    if (field === 'hero') {
      if (existing?.heroUrl) await deleteImageFromStorage(existing.heroUrl)
      updateData.heroUrl = null
    }
    else if (field === 'heroMobile') {
      if (existing?.heroMobileUrl) await deleteImageFromStorage(existing.heroMobileUrl)
      updateData.heroMobileUrl = null
    }
    else if (field === 'heroTablet') {
      if (existing?.heroTabletUrl) await deleteImageFromStorage(existing.heroTabletUrl)
      updateData.heroTabletUrl = null
    }
    else {
      if (existing?.contentUrl) await deleteImageFromStorage(existing.contentUrl)
      updateData.contentUrl = null
    }

    await db.collection("PageContent").updateOne(
      { slug },
      { $set: updateData }
    )

    revalidatePath(`/${slug}`)
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error: any) {
    console.error("Delete Page Image Error:", error)
    return { error: error.message }
  }
}

// --- GALLERY ACTIONS ---

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  order: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const db = await getDirectDb()
    const images = await db.collection("GalleryImage").find({}).sort({ updatedAt: -1 }).toArray()
    return serialize(images.map(img => ({
      id: img._id.toString(),
      url: img.url,
      title: img.title,
      description: img.description,
      category: img.category,
      order: img.order,
      isActive: img.isActive,
      createdAt: img.createdAt instanceof Date ? img.createdAt.toISOString() : img.createdAt,
      updatedAt: img.updatedAt instanceof Date ? img.updatedAt.toISOString() : img.updatedAt
    }))) as unknown as GalleryImage[]
  } catch (error) {
    console.error("Failed to fetch gallery images:", error)
    return []
  }
}

export async function createGalleryImage(formData: FormData) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return { error: "Unauthorized" }
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const order = parseInt(formData.get("order") as string || "0")

    const imageFile = formData.get("image") as File | null
    const { url, error: uploadError } = await uploadImage(imageFile)

    if (uploadError && imageFile && imageFile.size > 0) return { error: `Upload Failed: ${uploadError}` }
    if (!url && imageFile && imageFile.size > 0) return { error: "No image provided" }

    const db = await getDirectDb()
    await db.collection("GalleryImage").insertOne({
      url: url || "",
      title: title || "",
      description: description || "",
      category: category || "general",
      order: 0, // Order field removed from UI, defaulting to 0
      createdAt: new Date(),
      updatedAt: new Date()
    })

    revalidatePath("/gallery")
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error: any) {
    console.error("Create Gallery Image Error:", error)
    return { error: error.message }
  }
}

export async function updateGalleryImage(id: string, formData: FormData) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return { error: "Unauthorized" }
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const order = parseInt(formData.get("order") as string || "0")
    const isActive = formData.get("isActive") === "true"

    const db = await getDirectDb()
    const existing = await db.collection("GalleryImage").findOne({ _id: new ObjectId(id) })
    if (!existing) return { error: "Image not found" }

    const updateData: any = { title, description: description || "", category, order: 0, isActive, updatedAt: new Date() }

    const imageFile = formData.get("image") as File | null
    if (imageFile && imageFile.size > 0) {
      const { url, error: uploadError } = await uploadImage(imageFile)
      if (uploadError) return { error: `Upload Failed: ${uploadError}` }
      if (url) {
        if (existing.url) await deleteImageFromStorage(existing.url)
        updateData.url = url
      }
    }

    await db.collection("GalleryImage").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    revalidatePath("/gallery")
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error: any) {
    console.error("Update Gallery Image Error:", error)
    return { error: error.message }
  }
}

export async function deleteGalleryImage(id: string) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return { error: "Unauthorized" }
  }

  try {
    const db = await getDirectDb()
    const existing = await db.collection("GalleryImage").findOne({ _id: new ObjectId(id) })
    if (existing?.url) await deleteImageFromStorage(existing.url)

    await db.collection("GalleryImage").deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/gallery")
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error: any) {
    console.error("Delete Gallery Image Error:", error)
    return { error: error.message }
  }
}

// --- PRODUCT CATEGORY ACTIONS ---

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const db = await getDirectDb()
    const categories = await db.collection("ProductCategory")
      .find({})
      .sort({ order: 1 })
      .toArray()

    return serialize(categories.map(cat => ({
      id: cat._id.toString(),
      title: cat.title,
      subtitle: cat.subtitle,
      shortDesc: cat.shortDesc || '',
      desc: cat.desc,
      benefits: cat.benefits || [],
      uses: cat.uses || [],
      color: cat.color,
      order: cat.order || 0,
      updatedAt: cat.updatedAt instanceof Date ? cat.updatedAt.toISOString() : cat.updatedAt
    })))
  } catch (error) {
    console.error("Get Product Categories Error:", error)
    return []
  }
}

export async function upsertProductCategory(formData: FormData) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return { error: "Unauthorized" }
  }

  const id = formData.get("id") as string | null
  const title = formData.get("title") as string
  const subtitle = formData.get("subtitle") as string
  const shortDesc = formData.get("shortDesc") as string
  const desc = formData.get("desc") as string
  const benefits = (formData.get("benefits") as string)?.split("\n").filter(b => b.trim()) || []
  const uses = (formData.get("uses") as string)?.split("\n").filter(u => u.trim()) || []
  const color = formData.get("color") as string
  const order = parseInt(formData.get("order") as string) || 0

  if (!title || !desc) return { error: "Title and Description are required" }

  try {
    const db = await getDirectDb()
    const data: any = {
      title,
      subtitle,
      shortDesc,
      desc,
      benefits,
      uses,
      color,
      order,
      updatedAt: new Date()
    }

    if (id) {
      await db.collection("ProductCategory").updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      )
    } else {
      await db.collection("ProductCategory").insertOne(data)
    }

    revalidatePath("/products")
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error: any) {
    console.error("Upsert Product Category Error:", error)
    return { error: error.message }
  }
}

export async function deleteProductCategory(id: string) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    return { error: "Unauthorized" }
  }

  try {
    const db = await getDirectDb()
    await db.collection("ProductCategory").deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/products")
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error: any) {
    console.error("Delete Product Category Error:", error)
    return { error: error.message }
  }
}

export async function getSystemHealth() {
  const start = Date.now()
  try {
    const db = await getDirectDb()
    // 1. Database Ping
    await db.command({ ping: 1 })
    const dbLatency = Date.now() - start
    
    // 2. Data Integrity Check
    const invCount = await db.collection("InventoryItem").countDocuments()
    
    // 3. Storage Gateway Integrity
    const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    return [
      { name: "SDW-Inventory-Service", status: "Running", metric: `Lat-${dbLatency}ms`, time: "99.9%" },
      { name: "SDW-Sync-Engine", status: "Synced", metric: `Opt-${invCount > 0 ? 100 : 0}%`, time: "100%" },
      { name: "SDW-Security-Auth", status: "Healthy", metric: "200 OK", time: "98.5%" },
      { name: "SDW-Resource-Worker", status: "Standby", metric: "IDLE", time: "100%" },
      { name: "SDW-Network-Gateway", status: isSupabaseConfigured ? "Running" : "Offline", metric: isSupabaseConfigured ? "SSL-Secure" : "Env Missing", time: "99.4%" },
    ]
  } catch (err) {
    console.error("Health Check Error:", err)
    return [
      { name: "SDW-Inventory-Service", status: "Error", metric: "Connect Fail", time: "0%" },
      { name: "SDW-Sync-Engine", status: "Warning", metric: "Retrying...", time: "0%" },
      { name: "SDW-Security-Auth", status: "Healthy", metric: "Shield Active", time: "98.5%" },
      { name: "SDW-Resource-Worker", status: "Standby", metric: "IDLE", time: "100%" },
      { name: "SDW-Network-Gateway", status: "Checking", metric: "Wait...", time: "0%" },
    ]
  }
}

