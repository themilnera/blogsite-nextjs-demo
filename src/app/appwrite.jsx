import { Client, TablesDB, ID, Account } from "appwrite";

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);
const account = new Account(client);

const tablesDB = new TablesDB(client);
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const tableId = "documents";

export { databaseId, tableId, client, tablesDB, ID, account }