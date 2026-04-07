import { MongoClient, ObjectId } from "mongodb";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const uri = process.env.DATABASE_URL;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Helper to get a direct database connection
 */
export async function getDirectDb() {
  const client = await clientPromise;
  // Extract database name from URI if possible, or default to 'test'
  // Most MongoDB URIs are mongodb+srv://user:pass@host/dbname?options...
  const dbName = uri.split("/").pop()?.split("?")[0] || "southern-design-warehouse";
  return client.db(dbName);
}

export { clientPromise };
