import { Client, Account, Databases } from 'appwrite';

// Use import.meta.env for client-side in Vite
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '67da93a8003a50004c86';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export { client };