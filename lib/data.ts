const dummyData = {
  categories: [
    { name: "Starters", description: "Stacked and stuffed sandwiches" },
    { name: "Breakfast", description: "Rolled up wraps packed with flavor" },
    { name: "Lunch", description: "Rolled Mexican delights" },
    { name: "Dinner", description: "Juicy grilled burgers" },
    { name: "Meals", description: "Oven-baked cheesy pizzas" },
    { name: "Drinks", description: "Refreshing cold beverages" },
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
    {
      name: "Classic Cheeseburger",
      description: "Beef patty, cheese, lettuce, tomato",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 25.99,
      rating: 4.5,
      calories: 550,
      protein: 25,
      category_name: "Burgers",
      customizations: ["Extra Cheese", "Coke", "Fries", "Onions", "Bacon"],
    },
    {
      name: "Pepperoni Pizza",
      description: "Loaded with cheese and pepperoni slices",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 30.99,
      rating: 4.7,
      calories: 700,
      protein: 30,
      category_name: "Pizzas",
      customizations: [
        "Extra Cheese",
        "Jalapeños",
        "Garlic Bread",
        "Coke",
        "Olives",
      ],
    },
    {
      name: "Bean Burrito",
      description: "Stuffed with beans, rice, salsa",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 20.99,
      rating: 4.2,
      calories: 480,
      protein: 18,
      category_name: "Burritos",
      customizations: ["Jalapeños", "Iced Tea", "Fries", "Salad"],
    },
    {
      name: "BBQ Bacon Burger",
      description: "Smoky BBQ sauce, crispy bacon, cheddar",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 27.5,
      rating: 4.8,
      calories: 650,
      protein: 29,
      category_name: "Burgers",
      customizations: ["Onions", "Fries", "Coke", "Bacon", "Avocado"],
    },
    {
      name: "Chicken Caesar Wrap",
      description: "Grilled chicken, lettuce, Caesar dressing",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 21.5,
      rating: 4.4,
      calories: 490,
      protein: 28,
      category_name: "Wraps",
      customizations: ["Extra Cheese", "Coke", "Potato Wedges", "Tomatoes"],
    },
    {
      name: "Grilled Veggie Sandwich",
      description: "Roasted veggies, pesto, cheese",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 19.99,
      rating: 4.1,
      calories: 420,
      protein: 19,
      category_name: "Sandwiches",
      customizations: ["Mushrooms", "Olives", "Mozzarella Sticks", "Iced Tea"],
    },
    {
      name: "Double Patty Burger",
      description: "Two juicy beef patties and cheese",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 32.99,
      rating: 4.9,
      calories: 720,
      protein: 35,
      category_name: "Burgers",
      customizations: [
        "Extra Cheese",
        "Onions",
        "Fries",
        "Coke",
        "Chicken Nuggets",
      ],
    },
    {
      name: "Paneer Tikka Wrap",
      description: "Spicy paneer, mint chutney, veggies",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 23.99,
      rating: 4.6,
      calories: 470,
      protein: 20,
      category_name: "Wraps",
      customizations: ["Jalapeños", "Tomatoes", "Salad", "Fries", "Iced Tea"],
    },
    {
      name: "Mexican Burrito Bowl",
      description: "Rice, beans, corn, guac, salsa",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 26.49,
      rating: 4.7,
      calories: 610,
      protein: 24,
      category_name: "Bowls",
      customizations: ["Avocado", "Sweet Corn", "Salad", "Iced Tea"],
    },
    {
      name: "Spicy Chicken Sandwich",
      description: "Crispy chicken, spicy sauce, pickles",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 24.99,
      rating: 4.3,
      calories: 540,
      protein: 26,
      category_name: "Sandwiches",
      customizations: [
        "Jalapeños",
        "Onions",
        "Fries",
        "Coke",
        "Choco Lava Cake",
      ],
    },
    {
      name: "Classic Margherita Pizza",
      description: "Tomato, mozzarella, fresh basil",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 26.99,
      rating: 4.1,
      calories: 590,
      protein: 21,
      category_name: "Pizzas",
      customizations: ["Extra Cheese", "Olives", "Coke", "Garlic Bread"],
    },
    {
      name: "Protein Power Bowl",
      description: "Grilled chicken, quinoa, veggies",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 29.99,
      rating: 4.8,
      calories: 580,
      protein: 38,
      category_name: "Bowls",
      customizations: ["Avocado", "Salad", "Sweet Corn", "Iced Tea"],
    },
    {
      name: "Paneer Burrito",
      description: "Paneer cubes, spicy masala, rice, beans",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 24.99,
      rating: 4.2,
      calories: 510,
      protein: 22,
      category_name: "Burritos",
      customizations: ["Jalapeños", "Fries", "Garlic Bread", "Coke"],
    },
    {
      name: "Chicken Club Sandwich",
      description: "Grilled chicken, lettuce, cheese, tomato",
      image_url: "", // Will be replaced by getPublicImageUrl
      price: 27.49,
      rating: 4.5,
      calories: 610,
      protein: 31,
      category_name: "Sandwiches",
      customizations: ["Bacon", "Tomatoes", "Mozzarella Sticks", "Iced Tea"],
    },
  ],
};

export default dummyData;
