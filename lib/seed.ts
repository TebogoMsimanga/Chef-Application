import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type:
    | "topping"
    | "spicy"
    | "mild"
    | "hot"
    | "size"
    | "hallal"
    | "vegeterian"
    | "sweet"
    | "bread"
    | "water"
    | "juice"
    | "sauce"
    | "side"; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(
    appwriteConfig.databaseId,
    collectionId
  );

  await Promise.all(
    list.documents.map((doc) =>
      databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
    )
  );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appwriteConfig.bucketId);

  await Promise.all(
    list.files.map((file) =>
      storage.deleteFile(appwriteConfig.bucketId, file.$id)
    )
  );
}

async function uploadImageToStorage(imageUrl: string) {
  try {
    // Use a placeholder image if there's an issue with the original
    if (!imageUrl || imageUrl.length === 0) {
      return "https://picsum.photos/400";
    }

    console.log(`Fetching image from: ${imageUrl}`);
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      console.warn(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
      return "https://picsum.photos/400";
    }

    const blob = await response.blob();
    console.log(`Successfully got blob of size: ${blob.size} bytes`);

    // If image is too large (> 2MB), use placeholder
    if (blob.size > 2 * 1024 * 1024) {
      console.warn("Image too large (>2MB), using placeholder");
      return "https://picsum.photos/400";
    }

    const filename = `menu-item-${Date.now()}.jpg`;
    const fileObj = {
      name: filename,
      type: "image/jpeg",
      size: blob.size,
      uri: imageUrl,
    };

    console.log(`Creating file in storage: ${filename}`);
    const file = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      fileObj
    );

    const viewUrl = storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
    console.log(`File uploaded successfully. View URL: ${viewUrl}`);
    return viewUrl;
  } catch (error: any) {
    console.warn("Error uploading image:", error);
    return "https://picsum.photos/400"; // Return placeholder instead of throwing
  }
}

async function seed(): Promise<void> {
  try {
    console.log("Starting seeding process...");

    // 1. Clear all existing data
    console.log("Clearing existing data...");
    await clearAll(appwriteConfig.categoryTable);
    await clearAll(appwriteConfig.customizationTable);
    await clearAll(appwriteConfig.menuTable);
    await clearAll(appwriteConfig.menuCustomizationTable);
    await clearStorage();
    console.log("✅ All existing data cleared");

    // 2. Create Categories with rate limiting
    console.log("Creating categories...");
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
      try {
        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.categoryTable,
          ID.unique(),
          cat
        );
        categoryMap[cat.name] = doc.$id;
        console.log(`✅ Created category: ${cat.name}`);
        // Add a small delay between operations
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to create category ${cat.name}:`, error);
        throw error;
      }
    }

    // 3. Create Customizations with rate limiting
    console.log("Creating customizations...");
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
      try {
        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.customizationTable,
          ID.unique(),
          {
            name: cus.name,
            price: cus.price,
            type: cus.type,
          }
        );
        customizationMap[cus.name] = doc.$id;
        console.log(`✅ Created customization: ${cus.name}`);
        // Add a small delay between operations
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to create customization ${cus.name}:`, error);
        throw error;
      }
    }

    // 4. Create Menu Items with rate limiting
    console.log("Creating menu items...");
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
      try {
        let uploadedImage;
        try {
          uploadedImage = await uploadImageToStorage(item.image_url);
        } catch (imageError) {
          console.error(`Failed to upload image for ${item.name}:`, imageError);
          // Use a fallback image URL if the upload fails
          uploadedImage = "https://placeholder.co/400";
        }

        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.menuTable,
          ID.unique(),
          {
            name: item.name,
            description: item.description,
            image_url: uploadedImage,
            price: item.price,
            rating: item.rating,
            calories: item.calories,
            protein: item.protein,
            categories: categoryMap[item.category_name],
          }
        );

        menuMap[item.name] = doc.$id;
        console.log(`✅ Created menu item: ${item.name}`);

        // 5. Create menu_customizations for this item
        for (const cusName of item.customizations) {
          try {
            await databases.createDocument(
              appwriteConfig.databaseId,
              appwriteConfig.menuCustomizationTable,
              ID.unique(),
              {
                menu: doc.$id,
                customization: customizationMap[cusName],
              }
            );
            console.log(`✅ Added customization ${cusName} to ${item.name}`);
            // Add a small delay between operations
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (cusError) {
            console.error(
              `Failed to add customization ${cusName} to ${item.name}:`,
              cusError
            );
            // Continue with other customizations even if one fails
          }
        }

        // Add a larger delay between menu items
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to create menu item ${item.name}:`, error);
        throw error;
      }
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }

  console.log("✅ Seeding complete.");
}

export default seed;
