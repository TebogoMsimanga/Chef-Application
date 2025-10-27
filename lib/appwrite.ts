import { CreateUserPrams, GetMenuParams, SignInParams } from "@/type";
import * as Sentry from "@sentry/react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "com.tbg.mennu",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
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
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userTable,
      ID.unique(),
      { email, name, $id: newAccount.$id, avatar: avatarUrl }
    );
  } catch (e) {
    Sentry.captureEvent(e as any);
    throw new Error(e as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (e) {
    Sentry.captureEvent(e as any);
    throw new Error(e as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userTable,
      [Query.equal("$id", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (e) {
    console.log(e);
    Sentry.captureEvent(e as any);
    throw new Error(e as string);
  }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [Query.orderDesc("$createdAt"), Query.limit(20)];

    if (category) queries.push(Query.equal("category", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuTable,
      queries
    );

    // Process and validate menu items
    const processedMenus = menus.documents.map((menu) => ({
      name: menu.name,
      price: menu.price,
      image_id: menu.image_id,
      image_url: `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${menu.image_id}/view?project=${appwriteConfig.projectId}`,
      description: menu.description,
      calories: menu.calories,
      protein: menu.protein,
      rating: menu.rating,
      type: menu.type || "default",
      $id: menu.$id,
      $createdAt: menu.$createdAt,
      $updatedAt: menu.$updatedAt,
      $permissions: menu.$permissions,
      $collectionId: menu.$collectionId,
      $databaseId: menu.$databaseId,
      $sequence: menu.$sequence,
    }));

    return processedMenus;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw new Error(error as string);
  }
};

export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoryTable,
      [Query.orderAsc("name")]
    );

    const processedCategories = categories.documents.map((category) => ({
      name: category.name,
      description: category.description,
      $id: category.$id,
      $createdAt: category.$createdAt,
      $updatedAt: category.$updatedAt,
      $permissions: category.$permissions,
      $collectionId: category.$collectionId,
      $databaseId: category.$databaseId,
      $sequence: category.$sequence,
    }));

    return processedCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error as string);
  }
};


export const getFavorites = async (ids: string[]) => {
  const validIds = ids.filter(id => typeof id === 'string' && id.trim() !== '');
  if (validIds.length === 0) return [];
  try {
    const queries: string[] = [Query.equal("$id", validIds), Query.limit(100)];

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuTable,
      queries
    );

    const processedMenus = menus.documents.map((menu) => ({
      name: menu.name,
      price: menu.price,
      image_id: menu.image_id,
      image_url: `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${menu.image_id}/view?project=${appwriteConfig.projectId}`,
      description: menu.description,
      calories: menu.calories,
      protein: menu.protein,
      rating: menu.rating,
      type: menu.type || "default",
      $id: menu.$id,
      $createdAt: menu.$createdAt,
      $updatedAt: menu.$updatedAt,
      $permissions: menu.$permissions,
      $collectionId: menu.$collectionId,
      $databaseId: menu.$databaseId,
      $sequence: menu.$sequence,
    }));

    return processedMenus;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw new Error(error as string);
  }
};
