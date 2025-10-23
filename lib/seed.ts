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
    | "side";
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
  customizations: string[];
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clearAll(collectionId: string): Promise<void> {
  try {
    console.log(`Clearing collection: ${collectionId}...`);
    const list = await databases.listDocuments(
      appwriteConfig.databaseId,
      collectionId
    );

    // Delete documents sequentially to avoid rate limits
    for (const doc of list.documents) {
      try {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          collectionId,
          doc.$id
        );
        await delay(100); // Add small delay between deletions
      } catch (error: any) {
        // Only log as error if it's not a "document not found" error
        if (
          error?.message?.includes(
            "Document with the requested ID could not be found"
          )
        ) {
          console.log(`Document ${doc.$id} already deleted.`);
        } else {
          console.error(`Failed to delete document ${doc.$id}:`, error);
        }
      }
    }
    console.log(`Collection ${collectionId} cleared.`);
  } catch (error) {
    console.error(`Error clearing collection ${collectionId}:`, error);
    // Don't throw the error, just log it and continue
    console.log("Continuing with seeding...");
  }
}

async function clearStorage(): Promise<void> {
  try {
    console.log("Clearing storage...");
    const list = await storage.listFiles(appwriteConfig.bucketId);

    // Delete files sequentially to avoid rate limits
    for (const file of list.files) {
      try {
        await storage.deleteFile(appwriteConfig.bucketId, file.$id);
        await delay(100); // Add small delay between deletions
      } catch (error: any) {
        // Only log as error if it's not a "file not found" error
        if (
          error?.message?.includes(
            "File with the requested ID could not be found"
          )
        ) {
          console.log(`File ${file.$id} already deleted.`);
        } else {
          console.error(`Failed to delete file ${file.$id}:`, error);
        }
      }
    }
    console.log("Storage cleared.");
  } catch (error) {
    console.error("Error clearing storage:", error);
    // Don't throw the error, just log it and continue
    console.log("Continuing with seeding...");
  }
}

// Function to get alternative public image URL
function getPublicImageUrl(itemName: string): string {
  const imageMap: Record<string, string> = {
    "Classic Cheeseburger":
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500",
    "Pepperoni Pizza":
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500",
    "Bean Burrito":
      "https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?q=80&w=500",
    "BBQ Bacon Burger":
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=500",
    "Chicken Caesar Wrap":
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=500",
    "Grilled Veggie Sandwich":
      "https://images.unsplash.com/photo-1540914124281-342587941389?q=80&w=500",
    "Double Patty Burger":
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=500",
    "Paneer Tikka Wrap":
      "https://images.unsplash.com/photo-1667207393917-ae9aeade6da3?q=80&w=500",
    "Mexican Burrito Bowl":
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=500",
    "Spicy Chicken Sandwich":
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=500",
    "Classic Margherita Pizza":
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=500",
    "Protein Power Bowl":
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500",
    "Paneer Burrito":
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=500",
    "Chicken Club Sandwich":
      "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?q=80&w=500",
  };

  return (
    imageMap[itemName] ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500"
  ); // Default food image
}

async function uploadImageToStorage(imageUrl: string) {
  try {
    console.log(`Uploading image from ${imageUrl}...`);

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    const fileObj = {
      name: `food-${Date.now()}.jpg`,
      type: "image/jpeg",
      size: blob.size,
      uri: imageUrl,
    };

    console.log(`Uploading image of size: ${Math.round(blob.size / 1024)}KB`);

    const file = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      fileObj
    );

    await delay(500);
    console.log(`Image uploaded successfully with ID: ${file.$id}`);

    // Generate file view URL using storage service
    const fileUrl = storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
    return { id: file.$id, url: fileUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
async function seed(): Promise<void> {
  try {
    console.log("Starting database seed...");

    // 1. Clear existing data
    await clearAll(appwriteConfig.categoryTable);
    await clearAll(appwriteConfig.customizationTable);
    await clearAll(appwriteConfig.menuTable);
    await clearAll(appwriteConfig.menuCustomizationTable);
    await clearStorage();

    console.log("All collections cleared. Starting to seed...");

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    console.log("Creating categories...");
    for (const cat of data.categories) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.categoryTable,
        ID.unique(),
        cat
      );
      categoryMap[cat.name] = doc.$id;
      await delay(100); // Add small delay between creations
    }
    console.log("Categories created successfully.");

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    console.log("Creating customizations...");
    for (const cus of data.customizations) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.customizationTable,
        ID.unique(),
        cus
      );
      customizationMap[cus.name] = doc.$id;
      await delay(100); // Add small delay between creations
    }
    console.log("Customizations created successfully.");

    // 4. Create Menu Items
    console.log("Creating menu items...");
    for (const item of data.menu) {
      try {
        console.log(`Processing menu item: ${item.name}`);

        // Get a reliable public image URL based on the item name
        const publicImageUrl = getPublicImageUrl(item.name);
        const imageData = await uploadImageToStorage(publicImageUrl);

        // Skip this item if file upload failed
        if (!imageData) {
          console.log(`Skipping ${item.name} due to failed image upload.`);
          continue;
        }

        // Create menu document
        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.menuTable,
          ID.unique(),
          {
            name: item.name,
            description: item.description,
            image_id: imageData.id, // Store the file ID
            image_url: imageData.url, // Store the complete URL
            price: item.price,
            rating: item.rating,
            calories: item.calories,
            protein: item.protein,
            category: categoryMap[item.category_name],
          }
        ); // Create customization links
        for (const cusName of item.customizations) {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCustomizationTable,
            ID.unique(),
            {
              menu: doc.$id,
              customization: customizationMap[cusName], // This field name matches the Appwrite schema
            }
          );
          await delay(100); // Add small delay between customization links
        }

        // Add a larger delay after processing each menu item
        await delay(500);

        console.log(`Menu item ${item.name} processed successfully.`);
      } catch (error) {
        console.error(`Error processing menu item ${item.name}:`, error);
        // Continue with next item instead of throwing
        continue;
      }
    }

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

export default seed;
