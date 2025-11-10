import {ID} from "react-native-appwrite";
import {appwriteConfig, databases, storage} from "./appwrite";
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
// Starters
"Crispy Calamari": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52c.png",
"Bruschetta": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52d.png",
"Spinach Artichoke Dip": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52e.png",
"Buffalo Wings": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52f.png",
"Loaded Nachos": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c530.png",
"Mozzarella Sticks": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c531.png",
"Garlic Knots": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c532.png",
"Hummus Platter": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c533.png",
"Potato Skins": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c534.png",
"Spring Rolls": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c535.png",
// Breakfast
"Classic American Breakfast": "https://assets.stickpng.com/images/5e8f02adee3ef200041aa0c0.png",
"Belgian Waffles": "https://assets.stickpng.com/images/5873dda1f3a71010b5e8ef81.png",
"Eggs Benedict": "https://assets.stickpng.com/images/58da5be55f58be1227aec91e.png",
"Breakfast Burrito": "https://assets.stickpng.com/thumbs/58727fccf3a71010b5e8ef0b.png",
"Pancake Stack": "https://assets.stickpng.com/images/589603e8cba9841eabab60e3.png",
"Avocado Toast": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c53b.png",
"Oatmeal Bowl": "https://assets.stickpng.com/images/5c458614f8ab04028c27e072.png",
"French Toast": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c53d.png",
"Breakfast Sandwich": "https://assets.stickpng.com/images/58da5bef5f58be1227aec91f.png",
"Yogurt Parfait": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c53f.png",
// Lunch
"Grilled Chicken Caesar Salad": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c540.png",
"Turkey Club Sandwich": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c541.png",
"Tuna Melt": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c542.png",
"Veggie Wrap": "https://assets.stickpng.com/thumbs/5a1c3a73f65d84088faf1412.png",
"Chicken Quesadilla": "https://assets.stickpng.com/thumbs/58727f9ef3a71010b5e8ef05.png",
"Quinoa Bowl": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c545.png",
"BLT Sandwich": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c546.png",
"Greek Salad": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c547.png",
"Chicken Pesto Panini": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c548.png",
"Soup of the Day": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c549.png",
// Drinks
"Fresh Orange Juice": "https://assets.stickpng.com/images/580b57fcd9996e24bc43c168.png",
"Iced Coffee": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c54b.png",
"Smoothie": "https://assets.stickpng.com/images/5a5b7a9714d8c4188e0b08f4.png",
"Lemonade": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c54d.png",
"Green Tea": "https://assets.stickpng.com/images/580b57fcd9996e24bc43c1fe.png",
"Mango Lassi": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c54f.png",
"Sparkling Water": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c550.png",
"Hot Chocolate": "https://assets.stickpng.com/images/61195252f8fe340004e0d2ec.png",
"Chai Latte": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c552.png",
"Protein Shake": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c553.png",
// Supper
"Grilled Salmon": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c554.png",
"Ribeye Steak": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c555.png",
"Chicken Marsala": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c556.png",
"Vegetable Lasagna": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c557.png",
"Shrimp Scampi": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c558.png",
"Pork Chop": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c559.png",
"Eggplant Parmesan": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c55a.png",
"Sea Bass": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c55b.png",
"Beef Tenderloin": "https://assets.stickpng.com/images/5c308c10a97bc40295eb841e.png",
"Roasted Duck": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c55d.png",
// Meals
"Family Pizza Pack": "https://assets.stickpng.com/images/587380d3f3a71010b5e8ef3b.png",
"Burger Combo": "https://assets.stickpng.com/thumbs/5882486ce81acb96424ffaae.png",
"Chicken Tender Meal": "https://assets.stickpng.com/images/580b57fbd9996e24bc43c0cc.png",
"Vegan Bowl Combo": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c561.png",
"Fish and Chips": "https://assets.stickpng.com/images/5c346a944d5036028cf54082.png",
"Steak Dinner": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c563.png",
"Pasta Family Pack": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c564.png",
"Taco Meal Deal": "https://assets.stickpng.com/images/58727f98f3a71010b5e8ef04.png",
"Sushi Combo": "https://assets.stickpng.com/images/580b57fcd9996e24bc43c1fb.png",
"BBQ Platter": "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c567.png",
};
return (
imageMap[itemName] ||
"https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52c.png" // Default food image
);
}

async function uploadImageToStorage(imageUrl: string, retries = 3) {
  try {
    console.log(`Uploading image from ${imageUrl}... (Attempts remaining: ${retries})`);

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
      file: blob // Add the blob as a file property
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
    if (retries > 0) {
      console.log(`Retrying upload for ${imageUrl}...`);
      await delay(1000); // Wait 1 second before retrying
      return uploadImageToStorage(imageUrl, retries - 1);
    }
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
