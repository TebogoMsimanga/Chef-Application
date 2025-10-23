export interface Category {
  name: string;
  description: string;
}

export interface Customization {
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

export interface MenuItem {
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

export interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const menuData: DummyData = {
  categories: [
    {
      name: "Starters",
      description:
        "Light appetizers and delightful small bites to begin your meal",
    },
    {
      name: "Breakfast",
      description:
        "Morning favorites and energizing dishes to start your day right",
    },
    {
      name: "Lunch",
      description: "Perfect midday meals and satisfying lunch options",
    },
    {
      name: "Drinks",
      description: "Refreshing beverages, fresh juices, and specialty drinks",
    },
    {
      name: "Supper",
      description: "Hearty evening meals and comforting dinner selections",
    },
    {
      name: "Meals",
      description: "Complete meal options perfect for any time of day",
    },
  ],

  customizations: [
    // Toppings
    { name: "Extra Cheese", price: 25, type: "topping" },
    { name: "Jalapeños", price: 20, type: "topping" },
    { name: "Onions", price: 10, type: "topping" },
    { name: "Olives", price: 15, type: "topping" },
    { name: "Mushrooms", price: 18, type: "topping" },
    { name: "Tomatoes", price: 10, type: "topping" },
    { name: "Bacon", price: 30, type: "topping" },
    { name: "Avocado", price: 35, type: "topping" },
    { name: "Green Peppers", price: 15, type: "topping" },
    { name: "Pineapple", price: 20, type: "topping" },

    // Sides
    { name: "Coke", price: 30, type: "side" },
    { name: "Fries", price: 35, type: "side" },
    { name: "Garlic Bread", price: 40, type: "side" },
    { name: "Chicken Nuggets", price: 50, type: "side" },
    { name: "Iced Tea", price: 28, type: "side" },
    { name: "Salad", price: 33, type: "side" },
    { name: "Potato Wedges", price: 38, type: "side" },
    { name: "Mozzarella Sticks", price: 45, type: "side" },
    { name: "Sweet Corn", price: 25, type: "side" },
    { name: "Choco Lava Cake", price: 42, type: "side" },

    // Spicy
    { name: "Spicy Mayo", price: 15, type: "spicy" },
    { name: "Hot Wings", price: 55, type: "spicy" },

    // Mild
    { name: "Mild BBQ Sauce", price: 12, type: "mild" },
    { name: "Creamy Ranch Dip", price: 15, type: "mild" },

    // Hot
    { name: "Habanero Sauce", price: 18, type: "hot" },
    { name: "Peri Peri Chicken", price: 60, type: "hot" },

    // Size
    { name: "Small", price: 10, type: "size" },
    { name: "Medium", price: 20, type: "size" },
    { name: "Large", price: 40, type: "size" },

    // Hallal
    { name: "Hallal Chicken", price: 55, type: "hallal" },
    { name: "Hallal Pepperoni", price: 50, type: "hallal" },

    // Vegetarian
    { name: "Grilled Veggies", price: 30, type: "vegeterian" },
    { name: "Paneer Cubes", price: 35, type: "vegeterian" },

    // Sweet
    { name: "Brownie", price: 40, type: "sweet" },
    { name: "Ice Cream Scoop", price: 25, type: "sweet" },

    // Bread
    { name: "Herb & Cheese Bread", price: 35, type: "bread" },
    { name: "Stuffed Crust", price: 45, type: "bread" },

    // Water
    { name: "Bottled Water", price: 20, type: "water" },
    { name: "Sparkling Water", price: 28, type: "water" },

    // Juice
    { name: "Orange Juice", price: 30, type: "juice" },
    { name: "Apple Juice", price: 32, type: "juice" },

    // Sauce
    { name: "Garlic Dip", price: 10, type: "sauce" },
    { name: "Tomato Ketchup", price: 5, type: "sauce" },
  ],

  menu: [
    // STARTERS (10+ items)
    {
      name: "Crispy Calamari",
      description:
        "Golden-fried calamari rings served with zesty marinara sauce and lemon wedges",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 9.99,
      rating: 4.5,
      calories: 320,
      protein: 15,
      category_name: "Starters",
      customizations: ["Garlic Dip", "Spicy Mayo", "Lemon"],
    },
    {
      name: "Bruschetta",
      description:
        "Toasted garlic bread topped with fresh tomatoes, basil, and olive oil",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 7.99,
      rating: 4.3,
      calories: 220,
      protein: 5,
      category_name: "Starters",
      customizations: ["Extra Cheese", "Balsamic Glaze"],
    },
    {
      name: "Spinach Artichoke Dip",
      description:
        "Creamy spinach and artichoke dip served with tortilla chips",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 8.99,
      rating: 4.6,
      calories: 380,
      protein: 10,
      category_name: "Starters",
      customizations: ["Extra Chips", "Extra Cheese"],
    },
    {
      name: "Buffalo Wings",
      description: "Crispy chicken wings tossed in spicy buffalo sauce",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 11.99,
      rating: 4.7,
      calories: 450,
      protein: 28,
      category_name: "Starters",
      customizations: ["Ranch Dip", "Celery Sticks"],
    },
    {
      name: "Loaded Nachos",
      description:
        "Tortilla chips topped with melted cheese, jalapeños, and fresh salsa",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 10.99,
      rating: 4.4,
      calories: 520,
      protein: 15,
      category_name: "Starters",
      customizations: ["Guacamole", "Sour Cream"],
    },
    {
      name: "Mozzarella Sticks",
      description: "Breaded mozzarella sticks served with marinara sauce",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 8.49,
      rating: 4.2,
      calories: 320,
      protein: 12,
      category_name: "Starters",
      customizations: ["Ranch Dip", "Extra Sauce"],
    },
    {
      name: "Garlic Knots",
      description: "Fresh-baked garlic knots brushed with herb butter",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 6.99,
      rating: 4.5,
      calories: 280,
      protein: 6,
      category_name: "Starters",
      customizations: ["Marinara Sauce", "Extra Garlic"],
    },
    {
      name: "Hummus Platter",
      description:
        "Creamy hummus served with warm pita bread and fresh vegetables",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 9.49,
      rating: 4.3,
      calories: 310,
      protein: 8,
      category_name: "Starters",
      customizations: ["Extra Pita", "Olive Oil"],
    },
    {
      name: "Potato Skins",
      description:
        "Crispy potato skins loaded with cheese, bacon, and green onions",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 8.99,
      rating: 4.4,
      calories: 420,
      protein: 14,
      category_name: "Starters",
      customizations: ["Sour Cream", "Extra Bacon"],
    },
    {
      name: "Spring Rolls",
      description: "Crispy vegetable spring rolls with sweet chili sauce",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 7.99,
      rating: 4.2,
      calories: 250,
      protein: 6,
      category_name: "Starters",
      customizations: ["Soy Sauce", "Extra Sauce"],
    },

    // BREAKFAST (10+ items)
    {
      name: "Classic American Breakfast",
      description: "Two eggs any style with bacon, hash browns, and toast",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 12.99,
      rating: 4.7,
      calories: 650,
      protein: 28,
      category_name: "Breakfast",
      customizations: ["Extra Eggs", "Wheat Toast"],
    },
    {
      name: "Belgian Waffles",
      description:
        "Fluffy Belgian waffles topped with fresh berries and whipped cream",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 10.99,
      rating: 4.5,
      calories: 520,
      protein: 12,
      category_name: "Breakfast",
      customizations: ["Maple Syrup", "Extra Berries"],
    },
    {
      name: "Eggs Benedict",
      description:
        "Poached eggs on English muffins with Canadian bacon and hollandaise sauce",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 13.99,
      rating: 4.6,
      calories: 580,
      protein: 24,
      category_name: "Breakfast",
      customizations: ["Extra Sauce", "Avocado"],
    },
    {
      name: "Breakfast Burrito",
      description:
        "Scrambled eggs, cheese, potatoes, and bacon wrapped in a flour tortilla",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 11.99,
      rating: 4.4,
      calories: 720,
      protein: 32,
      category_name: "Breakfast",
      customizations: ["Salsa", "Sour Cream"],
    },
    {
      name: "Pancake Stack",
      description:
        "Three fluffy buttermilk pancakes with butter and maple syrup",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 9.99,
      rating: 4.5,
      calories: 590,
      protein: 15,
      category_name: "Breakfast",
      customizations: ["Chocolate Chips", "Whipped Cream"],
    },
    {
      name: "Avocado Toast",
      description: "Smashed avocado on sourdough toast with poached egg",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 11.49,
      rating: 4.3,
      calories: 420,
      protein: 18,
      category_name: "Breakfast",
      customizations: ["Extra Egg", "Red Pepper Flakes"],
    },
    {
      name: "Oatmeal Bowl",
      description: "Steel-cut oats with fresh fruits, nuts, and honey",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 8.99,
      rating: 4.2,
      calories: 380,
      protein: 12,
      category_name: "Breakfast",
      customizations: ["Extra Fruits", "Brown Sugar"],
    },
    {
      name: "French Toast",
      description:
        "Thick-sliced brioche French toast with cinnamon and powdered sugar",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 10.99,
      rating: 4.6,
      calories: 540,
      protein: 14,
      category_name: "Breakfast",
      customizations: ["Maple Syrup", "Fresh Berries"],
    },
    {
      name: "Breakfast Sandwich",
      description: "Fried egg, cheese, and bacon on a toasted croissant",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 9.49,
      rating: 4.4,
      calories: 480,
      protein: 22,
      category_name: "Breakfast",
      customizations: ["Hash Browns", "Extra Bacon"],
    },
    {
      name: "Yogurt Parfait",
      description: "Greek yogurt layered with granola and fresh berries",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 7.99,
      rating: 4.3,
      calories: 320,
      protein: 16,
      category_name: "Breakfast",
      customizations: ["Extra Granola", "Honey"],
    },

    // LUNCH (10+ items)
    {
      name: "Grilled Chicken Caesar Salad",
      description:
        "Romaine lettuce, grilled chicken, parmesan, and Caesar dressing",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 13.99,
      rating: 4.5,
      calories: 450,
      protein: 32,
      category_name: "Lunch",
      customizations: ["Extra Chicken", "Croutons"],
    },
    {
      name: "Turkey Club Sandwich",
      description: "Triple-decker with turkey, bacon, lettuce, and tomato",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 12.99,
      rating: 4.6,
      calories: 520,
      protein: 28,
      category_name: "Lunch",
      customizations: ["Avocado", "Fries"],
    },
    {
      name: "Tuna Melt",
      description: "Tuna salad with melted cheese on grilled sourdough",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 11.49,
      rating: 4.3,
      calories: 480,
      protein: 24,
      category_name: "Lunch",
      customizations: ["Extra Cheese", "Tomato"],
    },
    {
      name: "Veggie Wrap",
      description: "Grilled vegetables, hummus, and feta in a spinach wrap",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 10.99,
      rating: 4.2,
      calories: 380,
      protein: 14,
      category_name: "Lunch",
      customizations: ["Avocado", "Balsamic"],
    },
    {
      name: "Chicken Quesadilla",
      description: "Grilled chicken and cheese in a crispy tortilla",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 12.49,
      rating: 4.4,
      calories: 520,
      protein: 28,
      category_name: "Lunch",
      customizations: ["Guacamole", "Sour Cream"],
    },
    {
      name: "Quinoa Bowl",
      description:
        "Quinoa with roasted vegetables, chickpeas, and tahini dressing",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 13.99,
      rating: 4.3,
      calories: 420,
      protein: 18,
      category_name: "Lunch",
      customizations: ["Avocado", "Extra Veggies"],
    },
    {
      name: "BLT Sandwich",
      description: "Bacon, lettuce, and tomato on toasted bread",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 10.99,
      rating: 4.5,
      calories: 450,
      protein: 22,
      category_name: "Lunch",
      customizations: ["Extra Bacon", "Avocado"],
    },
    {
      name: "Greek Salad",
      description: "Mixed greens with feta, olives, and Greek dressing",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 11.99,
      rating: 4.4,
      calories: 380,
      protein: 12,
      category_name: "Lunch",
      customizations: ["Extra Feta", "Grilled Chicken"],
    },
    {
      name: "Chicken Pesto Panini",
      description: "Grilled chicken with pesto and mozzarella",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 12.99,
      rating: 4.6,
      calories: 520,
      protein: 32,
      category_name: "Lunch",
      customizations: ["Extra Cheese", "Tomato"],
    },
    {
      name: "Soup of the Day",
      description: "Fresh-made soup served with crusty bread",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 8.99,
      rating: 4.3,
      calories: 280,
      protein: 12,
      category_name: "Lunch",
      customizations: ["Extra Bread", "Crackers"],
    },

    // DRINKS (10+ items)
    {
      name: "Fresh Orange Juice",
      description: "Freshly squeezed orange juice",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 4.99,
      rating: 4.7,
      calories: 120,
      protein: 2,
      category_name: "Drinks",
      customizations: ["Ice", "No Ice"],
    },
    {
      name: "Iced Coffee",
      description: "Cold-brewed coffee over ice",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 3.99,
      rating: 4.5,
      calories: 5,
      protein: 2,
      category_name: "Drinks",
      customizations: ["Milk", "Sugar"],
    },
    {
      name: "Smoothie",
      description: "Mixed berry smoothie with yogurt",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 5.99,
      rating: 4.6,
      calories: 220,
      protein: 5,
      category_name: "Drinks",
      customizations: ["Protein Powder", "Extra Berries"],
    },
    {
      name: "Lemonade",
      description: "Fresh-squeezed lemonade with mint",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 3.99,
      rating: 4.4,
      calories: 120,
      protein: 8,
      category_name: "Drinks",
      customizations: ["Extra Mint", "Less Sweet"],
    },
    {
      name: "Green Tea",
      description: "Japanese green tea, hot or iced",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 3.49,
      rating: 4.3,
      calories: 3,
      protein: 5,
      category_name: "Drinks",
      customizations: ["Honey", "Lemon"],
    },
    {
      name: "Mango Lassi",
      description: "Indian yogurt drink with mango",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 4.99,
      rating: 4.5,
      calories: 180,
      protein: 4,
      category_name: "Drinks",
      customizations: ["Extra Mango", "Less Sweet"],
    },
    {
      name: "Sparkling Water",
      description: "Carbonated water with lime",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 2.99,
      rating: 4.2,
      calories: 2,
      protein: 4,
      category_name: "Drinks",
      customizations: ["Lemon", "No Ice"],
    },
    {
      name: "Hot Chocolate",
      description: "Rich chocolate with whipped cream",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 4.49,
      rating: 4.6,
      calories: 280,
      protein: 8,
      category_name: "Drinks",
      customizations: ["Extra Cream", "Marshmallows"],
    },
    {
      name: "Chai Latte",
      description: "Spiced Indian tea with milk",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 4.49,
      rating: 4.5,
      calories: 180,
      protein: 4,
      category_name: "Drinks",
      customizations: ["Extra Spicy", "Honey"],
    },
    {
      name: "Protein Shake",
      description: "Chocolate protein shake with banana",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 6.99,
      rating: 4.4,
      calories: 320,
      protein: 30,
      category_name: "Drinks",
      customizations: ["Extra Protein", "Almond Milk"],
    },

    // SUPPER (10+ items)
    {
      name: "Grilled Salmon",
      description: "Atlantic salmon with lemon butter sauce",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 24.99,
      rating: 4.7,
      calories: 520,
      protein: 42,
      category_name: "Supper",
      customizations: ["Extra Sauce", "Asparagus"],
    },
    {
      name: "Ribeye Steak",
      description: "12oz ribeye with garlic butter",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 29.99,
      rating: 4.8,
      calories: 680,
      protein: 52,
      category_name: "Supper",
      customizations: ["Mushrooms", "Onions"],
    },
    {
      name: "Chicken Marsala",
      description: "Chicken breast in mushroom wine sauce",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 21.99,
      rating: 4.6,
      calories: 480,
      protein: 38,
      category_name: "Supper",
      customizations: ["Extra Sauce", "Pasta"],
    },
    {
      name: "Vegetable Lasagna",
      description: "Layered pasta with vegetables and cheese",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 18.99,
      rating: 4.4,
      calories: 520,
      protein: 24,
      category_name: "Supper",
      customizations: ["Extra Cheese", "Garlic Bread"],
    },
    {
      name: "Shrimp Scampi",
      description: "Garlic shrimp with white wine sauce",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 23.99,
      rating: 4.7,
      calories: 450,
      protein: 32,
      category_name: "Supper",
      customizations: ["Extra Shrimp", "Pasta"],
    },
    {
      name: "Pork Chop",
      description: "Grilled pork chop with apple sauce",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 20.99,
      rating: 4.5,
      calories: 580,
      protein: 44,
      category_name: "Supper",
      customizations: ["Extra Sauce", "Vegetables"],
    },
    {
      name: "Eggplant Parmesan",
      description: "Breaded eggplant with marinara",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 17.99,
      rating: 4.3,
      calories: 420,
      protein: 18,
      category_name: "Supper",
      customizations: ["Extra Cheese", "Pasta"],
    },
    {
      name: "Sea Bass",
      description: "Pan-seared sea bass with herbs",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 28.99,
      rating: 4.8,
      calories: 380,
      protein: 36,
      category_name: "Supper",
      customizations: ["Lemon Butter", "Rice"],
    },
    {
      name: "Beef Tenderloin",
      description: "Grilled tenderloin with red wine sauce",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 31.99,
      rating: 4.9,
      calories: 620,
      protein: 48,
      category_name: "Supper",
      customizations: ["Extra Sauce", "Potatoes"],
    },
    {
      name: "Roasted Duck",
      description: "Half duck with orange glaze",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 27.99,
      rating: 4.6,
      calories: 680,
      protein: 42,
      category_name: "Supper",
      customizations: ["Extra Glaze", "Vegetables"],
    },

    // MEALS (10+ items)
    {
      name: "Family Pizza Pack",
      description: "Large pizza with four drinks and sides",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 32.99,
      rating: 4.7,
      calories: 2400,
      protein: 80,
      category_name: "Meals",
      customizations: ["Extra Toppings", "Garlic Bread"],
    },
    {
      name: "Burger Combo",
      description: "Burger with fries and drink",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 15.99,
      rating: 4.5,
      calories: 980,
      protein: 38,
      category_name: "Meals",
      customizations: ["Cheese", "Bacon"],
    },
    {
      name: "Chicken Tender Meal",
      description: "Crispy tenders with sides",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 14.99,
      rating: 4.4,
      calories: 820,
      protein: 42,
      category_name: "Meals",
      customizations: ["Extra Sauce", "Fries"],
    },
    {
      name: "Vegan Bowl Combo",
      description: "Vegan bowl with drink and dessert",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 16.99,
      rating: 4.3,
      calories: 620,
      protein: 22,
      category_name: "Meals",
      customizations: ["Extra Veggies", "Dressing"],
    },
    {
      name: "Fish and Chips",
      description: "Battered fish with fries and coleslaw",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 17.99,
      rating: 4.6,
      calories: 880,
      protein: 38,
      category_name: "Meals",
      customizations: ["Extra Fish", "Tartar Sauce"],
    },
    {
      name: "Steak Dinner",
      description: "Steak with two sides and dessert",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 28.99,
      rating: 4.8,
      calories: 1200,
      protein: 56,
      category_name: "Meals",
      customizations: ["Sauce Choice", "Side Choice"],
    },
    {
      name: "Pasta Family Pack",
      description: "Four pasta dishes with salad and bread",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 45.99,
      rating: 4.7,
      calories: 2800,
      protein: 92,
      category_name: "Meals",
      customizations: ["Sauce Choice", "Extra Bread"],
    },
    {
      name: "Taco Meal Deal",
      description: "Six tacos with rice and beans",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 24.99,
      rating: 4.5,
      calories: 1400,
      protein: 68,
      category_name: "Meals",
      customizations: ["Extra Salsa", "Guacamole"],
    },
    {
      name: "Sushi Combo",
      description: "Assorted sushi rolls with miso soup",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 26.99,
      rating: 4.6,
      calories: 850,
      protein: 42,
      category_name: "Meals",
      customizations: ["Extra Wasabi", "Ginger"],
    },
    {
      name: "BBQ Platter",
      description: "Mixed grilled meats with sides",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 34.99,
      rating: 4.8,
      calories: 1600,
      protein: 82,
      category_name: "Meals",
      customizations: ["Extra Sauce", "Coleslaw"],
    },
  ],
};



export default menuData;
