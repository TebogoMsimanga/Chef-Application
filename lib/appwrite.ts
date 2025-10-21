import { CreateUserPrams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.tbg.mennu",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: "68f73b6f002be00f3eaa",
  userTable: "user",
};

export const client = new Client();

if (appwriteConfig.endpoint && appwriteConfig.projectId) {
  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);
} else {
  throw new Error("Appwrite config (endpoint or projectId) is missing!");
}

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log("Logout error (may already be logged out):", error);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    // Check if already logged in
    try {
      const current = await account.get();
      console.log("Already logged in - reusing session for:", current.email);
      return current; 
    } catch {
      // No active session - create new one
    }

    const session = await account.createEmailPasswordSession(email, password);
    // Get user data after creating session
    const user = await account.get(); 
    return user;
  } catch (error: any) {
    console.error("Sign-in error:", error);
    throw new Error(error.message || "Failed to sign in");
  }
};

export const createUser = async ({
  name,
  email,
  password,
}: CreateUserPrams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userTable,
      ID.unique(),
      {
        account: newAccount.$id,
        email,
        name,
        avatar: avatarUrl,
      }
    );
  } catch (error: any) {
    console.error("Create user error:", error);
    throw new Error(error.message || "Failed to create user");
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userTable,
      [Query.equal("account", currentAccount.$id)]
    );

    if (!currentUser.documents.length) {
      throw new Error("No user document found");
    }

    return currentUser.documents[0];
  } catch (error: any) {
    console.error("Get current user error:", error);
    throw new Error(error.message || "Failed to get current user");
  }
};