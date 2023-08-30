import { Client, Account, ID, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("64eb9b5656dbe66665a8");

const account= new Account(client);
const databases=new Databases(client);
const storage=new Storage(client);

export {account,databases,storage,ID};
const dbid="64eba17963e9f5d09153";
const clid="64eba2522f1a03aa94f0";