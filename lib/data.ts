import { Restaurant } from "./types";

export const restaurants: Restaurant[] = [
  {
    id: "1",
    slug: "the-gourmet-kitchen",
    name: "The Gourmet Kitchen",
    rating: 4.8,
    reviews: 125,
    distance: "1.2 km",
    deliveryTime: "25-35 min",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop",
    discount: 30,
    cuisine: "Continental",
    menu: [
      {
        id: "101",
        name: "Club Sandwich",
        description:
          "Classic triple-decker sandwich with chicken, bacon, lettuce, and tomato",
        price: 200,
        image:
          "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
        category: "Sandwiches",
      },
      {
        id: "102",
        name: "Corn Chaat",
        description: "Spicy and tangy corn salad with fresh herbs and spices",
        price: 150,
        image:
          "https://images.unsplash.com/photo-1625938145312-969f8b3a4cfe?w=400&h=300&fit=crop",
        category: "Appetizers",
      },
      {
        id: "103",
        name: "Grilled Chicken",
        description: "Tender grilled chicken breast with herbs and vegetables",
        price: 350,
        image:
          "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop",
        category: "Main Course",
      },
      {
        id: "104",
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with caesar dressing and croutons",
        price: 180,
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
        category: "Salads",
      },
    ],
  },
  {
    id: "2",
    slug: "pizza-palace",
    name: "Pizza Palace",
    rating: 4.6,
    reviews: 89,
    distance: "2.5 km",
    deliveryTime: "30-40 min",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop",
    cuisine: "Italian",
    menu: [
      {
        id: "201",
        name: "Margherita Pizza",
        description:
          "Classic pizza with tomato sauce, mozzarella, and fresh basil",
        price: 299,
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
        category: "Pizza",
      },
      {
        id: "202",
        name: "Pepperoni Pizza",
        description: "Loaded with pepperoni slices and extra cheese",
        price: 349,
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
        category: "Pizza",
      },
      {
        id: "203",
        name: "Vegetarian Supreme",
        description: "Loaded with bell peppers, onions, mushrooms, and olives",
        price: 329,
        image:
          "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop",
        category: "Pizza",
      },
      {
        id: "204",
        name: "Garlic Bread",
        description: "Crispy bread sticks with garlic butter and herbs",
        price: 120,
        image:
          "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&h=300&fit=crop",
        category: "Sides",
      },
    ],
  },
  {
    id: "3",
    slug: "burger-barn",
    name: "Burger Barn",
    rating: 4.5,
    reviews: 156,
    distance: "1.8 km",
    deliveryTime: "20-30 min",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop",
    isClosed: true,
    cuisine: "American",
    menu: [
      {
        id: "301",
        name: "Classic Burger",
        description: "Juicy beef patty with lettuce, tomato, and special sauce",
        price: 250,
        image:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
        category: "Burgers",
      },
      {
        id: "302",
        name: "Cheese Burger",
        description: "Double cheese with crispy bacon and caramelized onions",
        price: 290,
        image:
          "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
        category: "Burgers",
      },
      {
        id: "303",
        name: "Chicken Burger",
        description: "Crispy fried chicken with coleslaw and mayo",
        price: 230,
        image:
          "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
        category: "Burgers",
      },
      {
        id: "304",
        name: "French Fries",
        description: "Crispy golden fries with seasoning",
        price: 100,
        image:
          "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=300&fit=crop",
        category: "Sides",
      },
    ],
  },
  {
    id: "4",
    slug: "sushi-spot",
    name: "Sushi Spot",
    rating: 4.9,
    reviews: 203,
    distance: "3.2 km",
    deliveryTime: "35-45 min",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=400&fit=crop",
    discount: 15,
    cuisine: "Japanese",
    menu: [
      {
        id: "401",
        name: "California Roll",
        description: "Crab, avocado, and cucumber wrapped in seaweed and rice",
        price: 380,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
        category: "Sushi",
      },
      {
        id: "402",
        name: "Salmon Nigiri",
        description: "Fresh salmon over pressed sushi rice",
        price: 420,
        image:
          "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop",
        category: "Sushi",
      },
      {
        id: "403",
        name: "Spicy Tuna Roll",
        description: "Tuna with spicy mayo and cucumber",
        price: 400,
        image:
          "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
        category: "Sushi",
      },
      {
        id: "404",
        name: "Miso Soup",
        description: "Traditional Japanese soup with tofu and seaweed",
        price: 150,
        image:
          "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
        category: "Soup",
      },
    ],
  },
  {
    id: "5",
    slug: "spice-house",
    name: "Spice House",
    rating: 4.7,
    reviews: 178,
    distance: "2.0 km",
    deliveryTime: "30-40 min",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop",
    discount: 20,
    cuisine: "Indian",
    menu: [
      {
        id: "501",
        name: "Butter Chicken",
        description: "Creamy tomato-based curry with tender chicken pieces",
        price: 320,
        image:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
        category: "Main Course",
      },
      {
        id: "502",
        name: "Paneer Tikka",
        description: "Grilled cottage cheese marinated in spices",
        price: 280,
        image:
          "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
        category: "Appetizers",
      },
      {
        id: "503",
        name: "Biryani",
        description: "Fragrant rice dish with aromatic spices and meat",
        price: 350,
        image:
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
        category: "Main Course",
      },
      {
        id: "504",
        name: "Naan Bread",
        description: "Soft and fluffy Indian flatbread",
        price: 40,
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
        category: "Breads",
      },
    ],
  },
  {
    id: "6",
    slug: "taco-fiesta",
    name: "Taco Fiesta",
    rating: 4.6,
    reviews: 142,
    distance: "1.5 km",
    deliveryTime: "25-35 min",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=400&fit=crop",
    discount: 25,
    cuisine: "Mexican",
    menu: [
      {
        id: "601",
        name: "Beef Tacos",
        description: "Seasoned beef with fresh salsa and cheese",
        price: 220,
        image:
          "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
        category: "Tacos",
      },
      {
        id: "602",
        name: "Chicken Burrito",
        description: "Grilled chicken with rice, beans, and guacamole",
        price: 280,
        image:
          "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
        category: "Burritos",
      },
      {
        id: "603",
        name: "Nachos Supreme",
        description:
          "Crispy tortilla chips with cheese, jalapeños, and sour cream",
        price: 190,
        image:
          "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=300&fit=crop",
        category: "Appetizers",
      },
      {
        id: "604",
        name: "Quesadilla",
        description: "Grilled tortilla with melted cheese and vegetables",
        price: 210,
        image:
          "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&h=300&fit=crop",
        category: "Main Course",
      },
    ],
  },
  {
    id: "7",
    slug: "noodle-house",
    name: "Noodle House",
    rating: 4.5,
    reviews: 167,
    distance: "2.8 km",
    deliveryTime: "30-40 min",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=400&fit=crop",
    cuisine: "Chinese",
    menu: [
      {
        id: "701",
        name: "Pad Thai",
        description: "Stir-fried rice noodles with shrimp and peanuts",
        price: 290,
        image:
          "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop",
        category: "Noodles",
      },
      {
        id: "702",
        name: "Ramen Bowl",
        description: "Rich broth with noodles, egg, and pork belly",
        price: 340,
        image:
          "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&fit=crop",
        category: "Noodles",
      },
      {
        id: "703",
        name: "Spring Rolls",
        description: "Crispy vegetable rolls with sweet chili sauce",
        price: 160,
        image:
          "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?w=400&h=300&fit=crop",
        category: "Appetizers",
      },
      {
        id: "704",
        name: "Fried Rice",
        description: "Wok-tossed rice with vegetables and egg",
        price: 200,
        image:
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
        category: "Rice",
      },
    ],
  },
  {
    id: "8",
    slug: "bbq-paradise",
    name: "BBQ Paradise",
    rating: 4.8,
    reviews: 195,
    distance: "3.5 km",
    deliveryTime: "40-50 min",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop",
    discount: 10,
    cuisine: "American",
    menu: [
      {
        id: "801",
        name: "BBQ Ribs",
        description: "Slow-cooked ribs with smoky BBQ sauce",
        price: 450,
        image:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
        category: "BBQ",
      },
      {
        id: "802",
        name: "Pulled Pork Sandwich",
        description: "Tender pulled pork with coleslaw on a brioche bun",
        price: 280,
        image:
          "https://images.unsplash.com/photo-1619894989152-6e38c0d97d9d?w=400&h=300&fit=crop",
        category: "Sandwiches",
      },
      {
        id: "803",
        name: "Brisket Platter",
        description: "Smoked beef brisket with sides",
        price: 420,
        image:
          "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop",
        category: "BBQ",
      },
      {
        id: "804",
        name: "Mac & Cheese",
        description: "Creamy macaroni with melted cheese",
        price: 150,
        image:
          "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=400&h=300&fit=crop",
        category: "Sides",
      },
    ],
  },
  {
    id: "9",
    slug: "cafe-mocha",
    name: "Café Mocha",
    rating: 4.7,
    reviews: 210,
    distance: "0.8 km",
    deliveryTime: "15-25 min",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop",
    cuisine: "Dessert",
    menu: [
      {
        id: "901",
        name: "Cappuccino",
        description: "Espresso with steamed milk and foam",
        price: 120,
        image:
          "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
        category: "Drinks",
      },
      {
        id: "902",
        name: "Chocolate Cake",
        description: "Rich chocolate cake with ganache",
        price: 180,
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        category: "Dessert",
      },
      {
        id: "903",
        name: "Croissant",
        description: "Buttery, flaky French pastry",
        price: 90,
        image:
          "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
        category: "Bakery",
      },
      {
        id: "904",
        name: "Iced Latte",
        description: "Cold espresso with milk and ice",
        price: 130,
        image:
          "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        category: "Drinks",
      },
    ],
  },
  {
    id: "10",
    slug: "pasta-express",
    name: "Pasta Express",
    rating: 4.6,
    reviews: 134,
    distance: "2.2 km",
    deliveryTime: "25-35 min",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=400&fit=crop",
    discount: 15,
    cuisine: "Italian",
    menu: [
      {
        id: "1001",
        name: "Spaghetti Carbonara",
        description: "Creamy pasta with bacon and parmesan",
        price: 310,
        image:
          "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop",
        category: "Pasta",
      },
      {
        id: "1002",
        name: "Penne Arrabbiata",
        description: "Spicy tomato sauce with penne pasta",
        price: 270,
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
        category: "Pasta",
      },
      {
        id: "1003",
        name: "Lasagna",
        description: "Layered pasta with meat sauce and cheese",
        price: 350,
        image:
          "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop",
        category: "Pasta",
      },
      {
        id: "1004",
        name: "Tiramisu",
        description: "Classic Italian coffee-flavored dessert",
        price: 160,
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
        category: "Dessert",
      },
    ],
  },
  {
    id: "11",
    slug: "green-bowl",
    name: "Green Bowl",
    rating: 4.8,
    reviews: 186,
    distance: "1.6 km",
    deliveryTime: "20-30 min",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop",
    discount: 20,
    cuisine: "Healthy",
    menu: [
      {
        id: "1101",
        name: "Buddha Bowl",
        description: "Quinoa, roasted vegetables, and tahini dressing",
        price: 290,
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        category: "Bowls",
      },
      {
        id: "1102",
        name: "Avocado Toast",
        description: "Smashed avocado on sourdough with poached egg",
        price: 220,
        image:
          "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
        category: "Breakfast",
      },
      {
        id: "1103",
        name: "Smoothie Bowl",
        description: "Acai bowl topped with fresh fruits and granola",
        price: 240,
        image:
          "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
        category: "Breakfast",
      },
      {
        id: "1104",
        name: "Grilled Salmon Salad",
        description: "Fresh greens with grilled salmon and lemon dressing",
        price: 380,
        image:
          "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
        category: "Salads",
      },
    ],
  },
  {
    id: "12",
    slug: "wings-and-things",
    name: "Wings & Things",
    rating: 4.5,
    reviews: 158,
    distance: "2.7 km",
    deliveryTime: "30-40 min",
    image:
      "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&h=400&fit=crop",
    cuisine: "American",
    menu: [
      {
        id: "1201",
        name: "Buffalo Wings",
        description: "Spicy chicken wings with ranch dressing",
        price: 260,
        image:
          "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop",
        category: "Wings",
      },
      {
        id: "1202",
        name: "BBQ Wings",
        description: "Sticky BBQ glazed chicken wings",
        price: 260,
        image:
          "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop",
        category: "Wings",
      },
      {
        id: "1203",
        name: "Onion Rings",
        description: "Crispy battered onion rings",
        price: 120,
        image:
          "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop",
        category: "Sides",
      },
      {
        id: "1204",
        name: "Chicken Tenders",
        description: "Crispy fried chicken strips with honey mustard",
        price: 240,
        image:
          "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop",
        category: "Chicken",
      },
    ],
  },
  {
    id: "13",
    slug: "seafood-shack",
    name: "Seafood Shack",
    rating: 4.7,
    reviews: 172,
    distance: "3.8 km",
    deliveryTime: "40-50 min",
    image:
      "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&h=400&fit=crop",
    discount: 10,
    cuisine: "American",
    menu: [
      {
        id: "1301",
        name: "Fish & Chips",
        description: "Beer-battered fish with crispy fries",
        price: 320,
        image:
          "https://images.unsplash.com/photo-1579208570378-8c970854bc23?w=400&h=300&fit=crop",
        category: "Main Course",
      },
      {
        id: "1302",
        name: "Grilled Shrimp",
        description: "Garlic butter grilled shrimp skewers",
        price: 380,
        image:
          "https://images.unsplash.com/photo-1633504581786-316c8002b1b2?w=400&h=300&fit=crop",
        category: "Seafood",
      },
      {
        id: "1303",
        name: "Lobster Roll",
        description: "Fresh lobster meat in a butter-toasted roll",
        price: 520,
        image:
          "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
        category: "Seafood",
      },
      {
        id: "1304",
        name: "Clam Chowder",
        description: "Creamy New England style clam chowder",
        price: 180,
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
        category: "Soup",
      },
    ],
  },
  {
    id: "14",
    slug: "steak-house-prime",
    name: "Steakhouse Prime",
    rating: 4.9,
    reviews: 245,
    distance: "4.2 km",
    deliveryTime: "45-55 min",
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=400&fit=crop",
    discount: 5,
    cuisine: "Continental",
    menu: [
      {
        id: "1401",
        name: "Ribeye Steak",
        description: "Premium ribeye with garlic butter",
        price: 680,
        image:
          "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop",
        category: "Steaks",
      },
      {
        id: "1402",
        name: "Filet Mignon",
        description: "Tender beef tenderloin with red wine sauce",
        price: 720,
        image:
          "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop",
        category: "Steaks",
      },
      {
        id: "1403",
        name: "Grilled Asparagus",
        description: "Fresh asparagus with hollandaise sauce",
        price: 140,
        image:
          "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&h=300&fit=crop",
        category: "Sides",
      },
      {
        id: "1404",
        name: "Loaded Baked Potato",
        description: "Baked potato with cheese, bacon, and sour cream",
        price: 120,
        image:
          "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=300&fit=crop",
        category: "Sides",
      },
    ],
  },
  {
    id: "15",
    slug: "dim-sum-delight",
    name: "Dim Sum Delight",
    rating: 4.6,
    reviews: 189,
    distance: "2.9 km",
    deliveryTime: "35-45 min",
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=400&fit=crop",
    discount: 15,
    cuisine: "Chinese",
    menu: [
      {
        id: "1501",
        name: "Pork Dumplings",
        description: "Steamed dumplings filled with seasoned pork",
        price: 180,
        image:
          "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop",
        category: "Dim Sum",
      },
      {
        id: "1502",
        name: "Shrimp Shumai",
        description: "Open-topped steamed shrimp dumplings",
        price: 200,
        image:
          "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
        category: "Dim Sum",
      },
      {
        id: "1503",
        name: "Char Siu Bao",
        description: "Fluffy steamed buns filled with BBQ pork",
        price: 160,
        image:
          "https://images.unsplash.com/photo-1517621513467-6cba6c1b448a?w=400&h=300&fit=crop",
        category: "Dim Sum",
      },
      {
        id: "1504",
        name: "Egg Tarts",
        description: "Sweet custard tarts with flaky pastry",
        price: 100,
        image:
          "https://images.unsplash.com/photo-1612224331208-9e763f155fb4?w=400&h=300&fit=crop",
        category: "Dessert",
      },
    ],
  },
];

export const cuisineCategories = [
  { id: "1", name: "Pizza", icon: "🍕" },
  { id: "2", name: "Burger", icon: "🍔" },
  { id: "3", name: "Chinese", icon: "🥡" },
  { id: "4", name: "Healthy", icon: "🥗" },
  { id: "5", name: "Sushi", icon: "🍣" },
  { id: "6", name: "Indian", icon: "🍛" },
  { id: "7", name: "Dessert", icon: "🍰" },
  { id: "8", name: "Drinks", icon: "🥤" },
];
