import { Client, Account, Databases, Storage } from 'appwrite';

// Use import.meta.env for client-side in Vite
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const bucketId = BUCKET_ID;

export { client };