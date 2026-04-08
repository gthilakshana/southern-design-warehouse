// Storage abstraction layer - supports both Supabase and AWS S3 with Multi-Location Support
//
// CONFIGURATION:
// 
// Single Location (Default):
//   STORAGE_PROVIDER=aws
//   AWS_REGION=us-east-1
//   AWS_S3_BUCKET_NAME=images
//
// Multiple Locations:
//   STORAGE_PROVIDER=aws
//   STORAGE_LOCATIONS=location1:us-east-1:bucket1,location2:us-west-2:bucket2,location3:eu-west-1:bucket3
//   AWS_REGION=us-east-1 (fallback if STORAGE_LOCATIONS not set)
//   AWS_S3_BUCKET_NAME=images (fallback if STORAGE_LOCATIONS not set)
//
// USAGE:
//   // Upload to primary location only (first in list or isPrimary=true)
//   const { url, error } = await uploadImage(file)
//
//   // Upload to specific location
//   const { url, error } = await uploadImage(file, 'location2')
//
//   // Delete from all locations
//   await deleteImageFromStorage(url)
//
//   // Delete from specific location
//   await deleteImageFromStorage(url, 'location2')
//
//   // Get configured locations
//   const locations = getConfiguredLocations()
//   const names = getLocationNames() // ['location1', 'location2', 'location3']

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'supabase'

// ============ MULTI-LOCATION SUPPORT ============
interface LocationConfig {
  name: string
  region: string
  bucket: string
  isPrimary?: boolean
  isEnabled?: boolean
}

// Parse locations from environment variables
// Format: STORAGE_LOCATIONS=location1:us-east-1:bucket1,location2:us-west-2:bucket2
function parseLocations(): LocationConfig[] {
  const locationsEnv = process.env.STORAGE_LOCATIONS || ''
  if (!locationsEnv) {
    // Default single location
    return [{
      name: 'primary',
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_S3_BUCKET_NAME || 'images',
      isPrimary: true,
      isEnabled: true
    }]
  }

  return locationsEnv.split(',').map((loc, idx) => {
    const [name, region, bucket] = loc.split(':')
    return {
      name: name.trim(),
      region: region.trim(),
      bucket: bucket.trim(),
      isPrimary: idx === 0,
      isEnabled: true
    }
  })
}

const LOCATIONS = parseLocations()

// ============ SUPABASE IMPLEMENTATION ============
async function uploadImageSupabase(file: File | null) {
  if (!file || typeof file === 'string' || (file instanceof File && file.size === 0)) {
    return { url: null, error: "No valid file selected" }
  }

  try {
    const { supabase } = await import('./supabase')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

    // Check if bucket exists first (informative log)
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    if (bucketError) {
      console.error("Storage list error:", bucketError.message)
    } else if (!buckets.some(b => b.name === 'images')) {
      console.warn("CRITICAL: 'images' bucket NOT FOUND in Supabase dashboard.")
    }

    // Upload to Supabase 'images' bucket
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (error) {
      console.error("Supabase API Error:", error.message)
      return { url: null, error: `Supabase: ${error.message}` }
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filename)

    return { url: publicUrlData.publicUrl, error: null }
  } catch (error: any) {
    console.error("Supabase Upload exception:", error)
    return { url: null, error: error.message || "Unknown upload critical error" }
  }
}

async function deleteImageSupabase(url: string | null) {
  if (!url || !url.includes('.supabase.co/storage/v1/object/public/images/')) return

  try {
    const { supabase } = await import('./supabase')
    const filename = url.split('/').pop()
    if (filename) {
      const { error } = await supabase.storage.from('images').remove([filename])
      if (error) console.error("Supabase direct delete error:", error.message)
    }
  } catch (error) {
    console.error("Failed to delete image from Supabase:", error)
  }
}

async function testSupabaseConnectivity() {
  try {
    const { supabase } = await import('./supabase')
    const startTime = Date.now()
    const { data, error } = await supabase.storage.listBuckets()
    const endTime = Date.now()
    const latency = endTime - startTime

    if (error) {
      return {
        success: false,
        error: `${error.message} (Status: ${error.status || 'Unknown'})`,
        latency
      }
    }

    const bucketNames = data.map(b => b.name)
    const bucketExists = bucketNames.includes('images')

    if (!bucketExists) {
      return {
        success: false,
        error: `'images' bucket not found. Available buckets: [${bucketNames.join(', ') || 'None'}]. Please create it in Supabase > Storage.`,
        latency
      }
    }

    return {
      success: true,
      message: `Verified! Latency: ${latency}ms. Storage cluster reachable.`,
      debug: { buckets: bucketNames, latency }
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown network connection failure", latency: 0 }
  }
}

// ============ AWS S3 IMPLEMENTATION ============
async function uploadImageAWS(file: File | null, targetLocation?: string) {
  if (!file || typeof file === 'string' || (file instanceof File && file.size === 0)) {
    return { url: null, error: "No valid file selected" }
  }

  try {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

    // Determine target locations
    const enabledLocations = LOCATIONS.filter(loc => loc.isEnabled)
    const locations = targetLocation 
      ? enabledLocations.filter(loc => loc.name === targetLocation)
      : [enabledLocations.find(loc => loc.isPrimary) || enabledLocations[0]!]

    if (locations.length === 0) {
      return { url: null, error: "No valid storage location configured" }
    }

    let primaryUrl = ''
    const uploadResults: { location: string; success: boolean; error?: string }[] = []

    // Upload to all specified locations
    for (const location of locations) {
      try {
        const s3Client = new S3Client({ region: location.region })

        const command = new PutObjectCommand({
          Bucket: location.bucket,
          Key: filename,
          Body: buffer,
          ContentType: file.type
        })

        await s3Client.send(command)

        const url = `https://${location.bucket}.s3.${location.region}.amazonaws.com/${filename}`
        if (location.isPrimary || !primaryUrl) {
          primaryUrl = url
        }

        uploadResults.push({ location: location.name, success: true })
      } catch (error: any) {
        console.error(`Upload to ${location.name} failed:`, error.message)
        uploadResults.push({ 
          location: location.name, 
          success: false, 
          error: error.message 
        })
      }
    }

    // If primary upload failed, return error
    const primaryResult = uploadResults.find(r => r.location === locations[0]!.name)
    if (primaryResult && !primaryResult.success) {
      return { url: null, error: `Primary location upload failed: ${primaryResult.error}` }
    }

    return { url: primaryUrl, error: null, uploadResults }
  } catch (error: any) {
    console.error("AWS S3 Upload exception:", error)
    return { url: null, error: error.message || "Unknown AWS upload error" }
  }
}

async function deleteImageAWS(url: string | null, targetLocation?: string) {
  if (!url) return

  try {
    const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3')

    // Extract filename from URL
    const filename = url.split('/').pop()
    if (!filename) return

    // Determine target locations
    const enabledLocations = LOCATIONS.filter(loc => loc.isEnabled)
    const locations = targetLocation 
      ? enabledLocations.filter(loc => loc.name === targetLocation)
      : enabledLocations

    const deleteResults: { location: string; success: boolean; error?: string }[] = []

    // Delete from all specified locations
    for (const location of locations) {
      try {
        const s3Client = new S3Client({ region: location.region })

        const command = new DeleteObjectCommand({
          Bucket: location.bucket,
          Key: filename
        })

        await s3Client.send(command)
        deleteResults.push({ location: location.name, success: true })
      } catch (error: any) {
        console.error(`Delete from ${location.name} failed:`, error.message)
        deleteResults.push({ 
          location: location.name, 
          success: false, 
          error: error.message 
        })
      }
    }

    return { success: true, deleteResults }
  } catch (error) {
    console.error("Failed to delete image from AWS S3:", error)
    return { success: false, error }
  }
}

async function testAWSConnectivity() {
  try {
    const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3')

    const enabledLocations = LOCATIONS.filter(loc => loc.isEnabled)
    const results: { location: string; success: boolean; latency: number; error?: string }[] = []

    for (const location of enabledLocations) {
      try {
        const startTime = Date.now()
        const s3Client = new S3Client({ region: location.region })

        const command = new HeadBucketCommand({ Bucket: location.bucket })
        await s3Client.send(command)

        const latency = Date.now() - startTime

        results.push({
          location: location.name,
          success: true,
          latency
        })
      } catch (err: any) {
        results.push({
          location: location.name,
          success: false,
          latency: 0,
          error: err.message
        })
      }
    }

    const allSuccess = results.every(r => r.success)
    if (allSuccess) {
      return {
        success: true,
        message: `All ${results.length} location(s) verified! Average latency: ${Math.round(results.reduce((sum, r) => sum + r.latency, 0) / results.length)}ms`,
        debug: { locations: results }
      }
    } else {
      return {
        success: false,
        error: `Some locations failed connectivity test`,
        debug: { locations: results }
      }
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to test AWS S3 connectivity",
      latency: 0
    }
  }
}

// ============ PUBLIC API - Routes to correct provider ============

export async function uploadImage(file: File | null, targetLocation?: string) {
  if (STORAGE_PROVIDER === 'aws') {
    return uploadImageAWS(file, targetLocation)
  }
  return uploadImageSupabase(file)
}

export async function deleteImageFromStorage(url: string | null, targetLocation?: string) {
  if (STORAGE_PROVIDER === 'aws') {
    return deleteImageAWS(url, targetLocation)
  }
  return deleteImageSupabase(url)
}

export async function testStorageConnectivity() {
  if (STORAGE_PROVIDER === 'aws') {
    return testAWSConnectivity()
  }
  return testSupabaseConnectivity()
}

// ============ UTILITIES ============

export function getConfiguredLocations() {
  return LOCATIONS
}

export function getLocationNames() {
  return LOCATIONS.map(loc => loc.name)
}
