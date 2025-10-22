import { CreateUserPrams, SignInParams, User } from "@/type";
import * as Sentry from "@sentry/react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Storage,
} from "react-native-appwrite";

if (!process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) {
  throw new Error("Missing EXPO_PUBLIC_APPWRITE_ENDPOINT environment variable");
}

if (!process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) {
  throw new Error(
    "Missing EXPO_PUBLIC_APPWRITE_PROJECT_ID environment variable"
  );
}

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.tbg.mennu",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: "68f73b6f002be00f3eaa",
  bucketId: "68f80104002b5e2aae2b",
  userTable: "user",
  categoryTable: "category",
  menuTable: "menu",
  customizationTable: "customization",
  menuCustomizationTable: "menu_customizations",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserPrams) => {
  try {
    console.log("Checking if user exists...");
    try {
      // Try to create a session - if it succeeds, user exists
      await account.createEmailPasswordSession(email, password);
      throw new Error("User already exists with this email");
    } catch (e) {
      // If error is not "Invalid credentials", rethrow it
      if (e instanceof Error && !e.message.includes("Invalid credentials")) {
        throw e;
      }
      // Otherwise proceed with user creation
    }

    console.log("Creating new user account...");
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitialsURL(name).toString();

    console.log("Creating user document...");
    // Create user document with the SAME ID as the account
    const userDoc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userTable,
      newAccount.$id, // Use account ID as document ID to prevent duplicates
      {
        account: newAccount.$id,
        email,
        name,
        avatar: avatarUrl,
        // Add permissions as a document field
        $permissions: [
          `read("user:${newAccount.$id}")`,
          `update("user:${newAccount.$id}")`,
          `write("user:${newAccount.$id}")`,
          `delete("user:${newAccount.$id}")`,
        ],
      }
    );

    console.log("Creating session...");
    // Create session directly instead of using signIn to avoid duplicate checks
    const session = await account.createEmailPasswordSession(email, password);

    return {
      user: userDoc,
      session,
    };
  } catch (e) {
    console.log("Create user error:", e);
    Sentry.captureEvent(e as any);
    throw new Error(e instanceof Error ? e.message : "Failed to create user");
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    console.log("Attempting to sign in with email:", email);
    const session = await account.createEmailPasswordSession(email, password);
    if (!session) {
      console.log("Failed to create session");
      throw new Error("Failed to create session");
    }

    console.log("Session created successfully, fetching user data");
    try {
      // Try to get existing user data
      const userData = await getCurrentUser();
      return { session, userData };
    } catch (userError) {
      // If user document doesn't exist, create it
      console.log("User document not found, creating new user document", userError);
      const currentAccount = await account.get();

      const avatarUrl = avatars.getInitialsURL(currentAccount.name).toString();

      // Create user document with all required fields and permissions
      // Use the account ID as the document ID
      const newUserData = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userTable,
        currentAccount.$id, // Use account ID as document ID
        {
          account: currentAccount.$id,
          email: currentAccount.email,
          name: currentAccount.name,
          avatar: avatarUrl,
          // Add permissions as a document field
          $permissions: [
            `read("user:${currentAccount.$id}")`,
            `update("user:${currentAccount.$id}")`,
            `write("user:${currentAccount.$id}")`,
            `delete("user:${currentAccount.$id}")`,
          ],
        }
      );

      return {
        session,
        userData: {
          ...newUserData,
          account: currentAccount.$id,
          name: currentAccount.name,
          email: currentAccount.email,
          avatar: avatarUrl,
        } as User,
      };
    }
  } catch (e) {
    console.log("Sign in error:", e);
    Sentry.captureEvent(e as any);
    const errorMessage = e instanceof Error ? e.message : "Failed to sign in";
    throw new Error(errorMessage);
  }
};
export const getCurrentUser = async () => {
  try {
    console.log("Getting current account...");
    const currentAccount = await account.get();
    if (!currentAccount) {
      console.log("No current account found");
      throw new Error("No current account found");
    }

    console.log("Getting user document...");
    try {
      // Try to get user document directly using account ID
      const userData = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userTable,
        currentAccount.$id // Use account ID as document ID
      );

      return {
        ...userData,
        account: currentAccount.$id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
      } as User;
    } catch (docError) {
      console.log("Failed to get user document:", docError);
      throw new Error("User document not found");
    }
  } catch (e) {
    console.log("getCurrentUser error:", e);
    Sentry.captureEvent(e as any);
    throw new Error(
      e instanceof Error ? e.message : "Failed to get current user"
    );
  }
};
