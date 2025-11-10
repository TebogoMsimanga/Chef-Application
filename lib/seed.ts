import { supabase } from './supabase';
import menuData from './data';

export async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    const categoryMap: Record<string, string> = {};
    
    for (const category of menuData.categories) {
      const { data, error } = await supabase
        .from('categories')
        .upsert({ name: category.name, description: category.description }, { onConflict: 'name' })
        .select()
        .single();

      if (error) {
        console.error(`Error creating category ${category.name}:`, error);
        continue;
      }
      categoryMap[category.name] = data.id;
      console.log(`Created/Updated category: ${category.name}`);
    }

    for (const customization of menuData.customizations) {
      const table = customization.type === 'side' ? 'sides' : 'toppings';
      
      const { error } = await supabase
        .from(table)
        .upsert(
          {
            name: customization.name,
            price: customization.price,
            type: customization.type,
            image: `https://api.dicebear.com/7.x/shapes/svg?seed=${customization.name}`
          },
          { onConflict: 'name' }
        );

      if (error) {
        console.error(`Error creating ${table} ${customization.name}:`, error);
      } else {
        console.log(`Created/Updated ${table}: ${customization.name}`);
      }
    }

    for (const item of menuData.menu) {
      const categoryId = categoryMap[item.category_name];
      
      if (!categoryId) {
        console.warn(`Category not found for ${item.name}, skipping...`);
        continue;
      }

      const imageUrl = item.image_url || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80`;

      const { error } = await supabase
        .from('menu_items')
        .upsert(
          {
            name: item.name,
            description: item.description,
            price: item.price,
            image: imageUrl,
            category_id: categoryId,
            ingredients: item.customizations || [],
            rating: item.rating,
            calories: item.calories,
            protein: item.protein
          },
          { onConflict: 'name' }
        );

      if (error) {
        console.error(`Error creating menu item ${item.name}:`, error);
      } else {
        console.log(`Created/Updated menu item: ${item.name}`);
      }
    }

    console.log('Database seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}