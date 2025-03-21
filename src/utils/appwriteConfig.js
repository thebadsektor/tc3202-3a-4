import { Client, Account, Databases, Storage } from 'appwrite';

// Use import.meta.env for client-side in Vite
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '67da93a8003a50004c86';
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || '67da9823002456d7c1a2';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const bucketId = BUCKET_ID;

export { client };