export interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  ingredients: string[];
}

export interface NutritionPlan {
  dailyCalories: number;
  dailyProtein: number;
  waterGoalL: number;
  tip: string;
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks: Meal[];
  preWorkout: { name: string; description: string }[];
  postWorkout: { name: string; description: string }[];
  weeklyMeals: { name: string; emoji: string }[];
  tips: string[];
}

const plans: Record<string, NutritionPlan> = {
  "fat loss": {
    dailyCalories: 1600,
    dailyProtein: 120,
    waterGoalL: 2.5,
    tip: "Focus on high-protein, fiber-rich meals to stay full while in a calorie deficit.",
    breakfast: [
      { name: "Greek Yogurt Protein Bowl", description: "High protein, low sugar breakfast", calories: 320, protein: 28, ingredients: ["Greek yogurt", "mixed berries", "chia seeds", "honey drizzle"] },
      { name: "Veggie Egg White Omelette", description: "Lean protein with veggies", calories: 250, protein: 24, ingredients: ["Egg whites", "spinach", "bell peppers", "tomatoes", "feta"] },
    ],
    lunch: [
      { name: "Grilled Chicken Salad", description: "Light yet satisfying", calories: 380, protein: 35, ingredients: ["Grilled chicken", "mixed greens", "cucumber", "avocado", "lemon dressing"] },
      { name: "Turkey Lettuce Wraps", description: "Low-carb, high-flavor", calories: 300, protein: 30, ingredients: ["Ground turkey", "lettuce cups", "bell peppers", "soy sauce", "ginger"] },
    ],
    dinner: [
      { name: "Baked Salmon with Asparagus", description: "Omega-3 rich dinner", calories: 420, protein: 38, ingredients: ["Salmon fillet", "asparagus", "lemon", "olive oil", "garlic"] },
      { name: "Zucchini Noodle Stir-Fry", description: "Low-calorie comfort food", calories: 350, protein: 25, ingredients: ["Zucchini noodles", "shrimp", "garlic", "soy sauce", "sesame oil"] },
    ],
    snacks: [
      { name: "Apple with Almond Butter", description: "Sweet & satisfying", calories: 180, protein: 6, ingredients: ["Apple", "almond butter"] },
      { name: "Protein Shake", description: "Quick post-activity refuel", calories: 150, protein: 25, ingredients: ["Whey protein", "water", "ice"] },
    ],
    preWorkout: [
      { name: "Banana with Almond Butter", description: "Quick energy with healthy fats for sustained performance." },
      { name: "Rice Cake with Honey", description: "Fast-digesting carbs for an immediate energy boost." },
    ],
    postWorkout: [
      { name: "Protein Smoothie", description: "Whey protein, banana, and almond milk for muscle repair." },
      { name: "Chicken & Sweet Potato", description: "Lean protein with complex carbs to replenish glycogen." },
    ],
    weeklyMeals: [
      { name: "Grilled Chicken Quinoa Bowl", emoji: "🥗" },
      { name: "Avocado Egg Toast", emoji: "🥑" },
      { name: "Salmon with Roasted Veggies", emoji: "🐟" },
      { name: "Lentil Soup", emoji: "🍲" },
      { name: "Turkey & Veggie Wrap", emoji: "🌯" },
      { name: "Smoothie Bowl", emoji: "🫐" },
    ],
    tips: [
      "Eat protein with every meal to preserve muscle mass",
      "Drink water before meals to manage portions",
      "Prioritize whole, unprocessed foods",
      "Don't skip meals — it slows metabolism",
      "Fill half your plate with vegetables",
    ],
  },
  strength: {
    dailyCalories: 2200,
    dailyProtein: 150,
    waterGoalL: 3,
    tip: "Fuel your strength gains with adequate protein and complex carbs for energy.",
    breakfast: [
      { name: "Oatmeal Power Bowl", description: "Slow-release energy for training", calories: 450, protein: 30, ingredients: ["Oats", "whey protein", "banana", "peanut butter", "honey"] },
      { name: "Eggs & Whole Wheat Toast", description: "Classic strength breakfast", calories: 420, protein: 28, ingredients: ["Whole eggs", "whole wheat toast", "avocado", "cherry tomatoes"] },
    ],
    lunch: [
      { name: "Chicken & Rice Bowl", description: "Bodybuilder staple", calories: 550, protein: 42, ingredients: ["Grilled chicken", "brown rice", "broccoli", "teriyaki sauce"] },
      { name: "Beef & Bean Burrito Bowl", description: "Protein-packed Tex-Mex", calories: 580, protein: 40, ingredients: ["Lean ground beef", "black beans", "rice", "salsa", "cheese"] },
    ],
    dinner: [
      { name: "Steak with Sweet Potatoes", description: "Iron & protein for recovery", calories: 600, protein: 45, ingredients: ["Lean steak", "sweet potato", "green beans", "olive oil"] },
      { name: "Salmon & Quinoa Plate", description: "Complete protein meal", calories: 520, protein: 40, ingredients: ["Salmon", "quinoa", "roasted vegetables", "lemon"] },
    ],
    snacks: [
      { name: "Trail Mix & Protein Bar", description: "On-the-go energy", calories: 280, protein: 18, ingredients: ["Mixed nuts", "dark chocolate", "protein bar"] },
      { name: "Cottage Cheese & Fruit", description: "Casein protein snack", calories: 200, protein: 20, ingredients: ["Cottage cheese", "pineapple", "honey"] },
    ],
    preWorkout: [
      { name: "Oatmeal with Fruit", description: "Complex carbs for sustained energy during heavy lifts." },
      { name: "Banana & Peanut Butter", description: "Quick energy plus healthy fats for endurance." },
    ],
    postWorkout: [
      { name: "Chicken & Rice Bowl", description: "Lean protein with carbs to refuel muscles and aid recovery." },
      { name: "Protein Shake & Banana", description: "Fast-absorbing protein with simple carbs for glycogen replenishment." },
    ],
    weeklyMeals: [
      { name: "Steak & Sweet Potato Plate", emoji: "🥩" },
      { name: "Protein Pancakes", emoji: "🥞" },
      { name: "Tuna Pasta Bake", emoji: "🍝" },
      { name: "Chicken Caesar Wrap", emoji: "🌯" },
      { name: "Egg Fried Rice", emoji: "🍳" },
      { name: "Greek Yogurt Parfait", emoji: "🍨" },
    ],
    tips: [
      "Aim for 1.6-2.2g protein per kg of bodyweight",
      "Eat complex carbs before training for energy",
      "Don't skip post-workout nutrition",
      "Include creatine-rich foods like red meat",
      "Sleep 7-9 hours for optimal recovery",
    ],
  },
  "muscle tone": {
    dailyCalories: 1800,
    dailyProtein: 130,
    waterGoalL: 2.5,
    tip: "Balance protein and nutrients to build lean muscle while maintaining definition.",
    breakfast: [
      { name: "Smoothie Bowl", description: "Nutrient-dense start", calories: 380, protein: 22, ingredients: ["Frozen berries", "protein powder", "banana", "granola", "coconut flakes"] },
      { name: "Avocado Toast with Eggs", description: "Healthy fats & protein", calories: 400, protein: 20, ingredients: ["Whole grain toast", "avocado", "poached eggs", "chili flakes"] },
    ],
    lunch: [
      { name: "Mediterranean Bowl", description: "Balanced macros", calories: 450, protein: 30, ingredients: ["Chicken", "hummus", "cucumber", "quinoa", "olives", "feta"] },
      { name: "Shrimp Stir-Fry", description: "Lean and clean", calories: 400, protein: 32, ingredients: ["Shrimp", "mixed vegetables", "brown rice", "soy sauce"] },
    ],
    dinner: [
      { name: "Herb-Crusted Chicken", description: "Lean protein perfection", calories: 450, protein: 40, ingredients: ["Chicken breast", "herbs", "roasted sweet potato", "green beans"] },
      { name: "Fish Tacos", description: "Light and flavorful", calories: 420, protein: 30, ingredients: ["White fish", "corn tortillas", "slaw", "lime crema"] },
    ],
    snacks: [
      { name: "Hummus & Veggie Sticks", description: "Fiber and protein", calories: 160, protein: 8, ingredients: ["Hummus", "carrots", "celery", "bell peppers"] },
      { name: "Greek Yogurt & Berries", description: "Creamy protein boost", calories: 180, protein: 15, ingredients: ["Greek yogurt", "mixed berries", "honey"] },
    ],
    preWorkout: [
      { name: "Yogurt with Nuts", description: "Protein and healthy fats for sustained energy." },
      { name: "Banana & Honey Toast", description: "Quick carbs for a light energy boost before training." },
    ],
    postWorkout: [
      { name: "Eggs and Toast", description: "Whole eggs with whole grain toast for balanced recovery." },
      { name: "Protein Smoothie", description: "Berries, protein powder, and milk for muscle repair." },
    ],
    weeklyMeals: [
      { name: "Mediterranean Chicken Bowl", emoji: "🥙" },
      { name: "Egg & Veggie Scramble", emoji: "🍳" },
      { name: "Grilled Fish & Salad", emoji: "🐟" },
      { name: "Turkey Meatballs & Pasta", emoji: "🍝" },
      { name: "Acai Smoothie Bowl", emoji: "🫐" },
      { name: "Stuffed Bell Peppers", emoji: "🫑" },
    ],
    tips: [
      "Eat lean protein with every meal",
      "Include colorful vegetables for micronutrients",
      "Time carbs around your workouts",
      "Healthy fats support hormone balance",
      "Consistency in diet matters more than perfection",
    ],
  },
  endurance: {
    dailyCalories: 2400,
    dailyProtein: 110,
    waterGoalL: 3.5,
    tip: "Prioritize complex carbohydrates for sustained energy and electrolyte-rich foods for performance.",
    breakfast: [
      { name: "Banana Oat Pancakes", description: "Carb-loaded energy fuel", calories: 480, protein: 18, ingredients: ["Oats", "banana", "eggs", "maple syrup", "blueberries"] },
      { name: "Granola & Fruit Bowl", description: "Quick energy breakfast", calories: 420, protein: 14, ingredients: ["Granola", "mixed fruits", "yogurt", "honey"] },
    ],
    lunch: [
      { name: "Pasta Primavera", description: "Carb-rich for energy stores", calories: 520, protein: 22, ingredients: ["Whole wheat pasta", "mixed vegetables", "olive oil", "parmesan"] },
      { name: "Chicken & Quinoa Salad", description: "Balanced endurance fuel", calories: 480, protein: 35, ingredients: ["Grilled chicken", "quinoa", "avocado", "dried cranberries"] },
    ],
    dinner: [
      { name: "Salmon with Brown Rice", description: "Omega-3s & complex carbs", calories: 550, protein: 38, ingredients: ["Salmon", "brown rice", "edamame", "teriyaki glaze"] },
      { name: "Turkey Chili", description: "Protein & carbs combined", calories: 500, protein: 35, ingredients: ["Ground turkey", "kidney beans", "tomatoes", "corn", "spices"] },
    ],
    snacks: [
      { name: "Energy Balls", description: "Quick on-the-go fuel", calories: 200, protein: 8, ingredients: ["Oats", "peanut butter", "honey", "dark chocolate chips"] },
      { name: "Banana & Peanut Butter", description: "Classic endurance snack", calories: 250, protein: 8, ingredients: ["Banana", "natural peanut butter"] },
    ],
    preWorkout: [
      { name: "Oatmeal with Banana", description: "Slow-release carbs for long-lasting energy." },
      { name: "Toast with Jam", description: "Quick glycogen top-up before extended activity." },
    ],
    postWorkout: [
      { name: "Chocolate Milk", description: "Ideal carb-to-protein ratio for endurance recovery." },
      { name: "Rice Bowl with Eggs", description: "Replenish glycogen stores with carbs and protein." },
    ],
    weeklyMeals: [
      { name: "Whole Wheat Pasta & Veggies", emoji: "🍝" },
      { name: "Banana Oat Smoothie", emoji: "🍌" },
      { name: "Bean & Rice Bowl", emoji: "🍚" },
      { name: "Sweet Potato & Chicken", emoji: "🍠" },
      { name: "Trail Mix Bowl", emoji: "🥜" },
      { name: "Fruit & Yogurt Parfait", emoji: "🍓" },
    ],
    tips: [
      "Carbs are your primary fuel — don't cut them",
      "Hydrate with electrolytes during long sessions",
      "Eat within 30 minutes post-workout",
      "Include iron-rich foods to support oxygen delivery",
      "Plan carb-loading before intense training days",
    ],
  },
  "general fitness": {
    dailyCalories: 2000,
    dailyProtein: 120,
    waterGoalL: 2.5,
    tip: "Fuel your workouts with balanced meals and enough protein to support recovery.",
    breakfast: [
      { name: "Greek Yogurt Protein Bowl", description: "Balanced & nutritious", calories: 350, protein: 25, ingredients: ["Greek yogurt", "berries", "granola", "honey"] },
      { name: "Whole Grain Toast & Eggs", description: "Simple and effective", calories: 380, protein: 22, ingredients: ["Whole grain toast", "scrambled eggs", "avocado", "tomato"] },
    ],
    lunch: [
      { name: "Chicken & Veggie Wrap", description: "Portable balanced meal", calories: 450, protein: 32, ingredients: ["Grilled chicken", "whole wheat wrap", "lettuce", "tomato", "hummus"] },
      { name: "Lentil & Vegetable Soup", description: "Plant-powered nutrition", calories: 380, protein: 20, ingredients: ["Lentils", "carrots", "celery", "tomatoes", "spices"] },
    ],
    dinner: [
      { name: "Grilled Chicken Quinoa Bowl", description: "Complete balanced dinner", calories: 480, protein: 38, ingredients: ["Grilled chicken", "quinoa", "roasted vegetables", "tahini dressing"] },
      { name: "Salmon with Roasted Vegetables", description: "Heart-healthy dinner", calories: 500, protein: 36, ingredients: ["Salmon fillet", "broccoli", "bell peppers", "sweet potato"] },
    ],
    snacks: [
      { name: "Mixed Nuts & Dried Fruit", description: "Healthy fats & energy", calories: 220, protein: 7, ingredients: ["Almonds", "walnuts", "dried cranberries"] },
      { name: "Protein Smoothie", description: "Quick nutrition boost", calories: 200, protein: 20, ingredients: ["Protein powder", "banana", "almond milk", "spinach"] },
    ],
    preWorkout: [
      { name: "Banana with Peanut Butter", description: "Quick energy with healthy fats for sustained performance." },
      { name: "Oatmeal with Fruit", description: "Complex carbs for steady energy release during training." },
    ],
    postWorkout: [
      { name: "Protein Smoothie", description: "Fast-absorbing protein with carbs for muscle repair." },
      { name: "Eggs and Toast", description: "Whole protein with carbs to replenish and recover." },
    ],
    weeklyMeals: [
      { name: "Grilled Chicken Quinoa Bowl", emoji: "🥗" },
      { name: "Avocado Egg Toast", emoji: "🥑" },
      { name: "Salmon with Roasted Veggies", emoji: "🐟" },
      { name: "Lentil Salad", emoji: "🥗" },
      { name: "Smoothie Bowl", emoji: "🫐" },
      { name: "Stuffed Sweet Potato", emoji: "🍠" },
    ],
    tips: [
      "Eat protein with every meal",
      "Prioritize whole foods over processed options",
      "Stay hydrated throughout the day",
      "Eat balanced meals after workouts",
      "Don't skip recovery meals",
    ],
  },
  flexibility: {
    dailyCalories: 1800,
    dailyProtein: 100,
    waterGoalL: 2.5,
    tip: "Anti-inflammatory foods and adequate hydration support flexibility and joint health.",
    breakfast: [
      { name: "Turmeric Smoothie Bowl", description: "Anti-inflammatory start", calories: 350, protein: 18, ingredients: ["Mango", "turmeric", "yogurt", "chia seeds", "coconut flakes"] },
      { name: "Berry Overnight Oats", description: "Prep-ahead nutrition", calories: 380, protein: 16, ingredients: ["Oats", "almond milk", "mixed berries", "flaxseed", "honey"] },
    ],
    lunch: [
      { name: "Salmon Poke Bowl", description: "Omega-3 rich & fresh", calories: 450, protein: 30, ingredients: ["Salmon", "sushi rice", "avocado", "edamame", "soy sauce"] },
      { name: "Green Goddess Salad", description: "Nutrient-dense greens", calories: 380, protein: 18, ingredients: ["Mixed greens", "chickpeas", "cucumber", "herb dressing", "seeds"] },
    ],
    dinner: [
      { name: "Baked Cod with Vegetables", description: "Light & nourishing", calories: 400, protein: 32, ingredients: ["Cod fillet", "zucchini", "cherry tomatoes", "herbs", "olive oil"] },
      { name: "Vegetable Curry", description: "Warming & anti-inflammatory", calories: 420, protein: 16, ingredients: ["Mixed vegetables", "coconut milk", "curry paste", "basmati rice"] },
    ],
    snacks: [
      { name: "Turmeric Latte", description: "Anti-inflammatory drink", calories: 120, protein: 5, ingredients: ["Almond milk", "turmeric", "cinnamon", "honey"] },
      { name: "Walnuts & Dark Chocolate", description: "Omega-3 & antioxidants", calories: 200, protein: 6, ingredients: ["Walnuts", "dark chocolate squares"] },
    ],
    preWorkout: [
      { name: "Green Tea & Banana", description: "Light energy with anti-inflammatory benefits." },
      { name: "Yogurt with Berries", description: "Easy to digest, gentle on the stomach before stretching." },
    ],
    postWorkout: [
      { name: "Anti-Inflammatory Smoothie", description: "Turmeric, ginger, and berries to reduce muscle soreness." },
      { name: "Avocado Toast", description: "Healthy fats and carbs for gentle recovery." },
    ],
    weeklyMeals: [
      { name: "Salmon Poke Bowl", emoji: "🍣" },
      { name: "Turmeric Smoothie", emoji: "🥤" },
      { name: "Veggie Stir-Fry", emoji: "🥘" },
      { name: "Overnight Oats", emoji: "🥣" },
      { name: "Green Goddess Bowl", emoji: "🥗" },
      { name: "Baked Fish & Veggies", emoji: "🐟" },
    ],
    tips: [
      "Eat anti-inflammatory foods like fatty fish and turmeric",
      "Collagen-rich foods support joint health",
      "Stay hydrated for muscle and joint flexibility",
      "Include magnesium-rich foods like leafy greens",
      "Avoid excessive sugar which can increase inflammation",
    ],
  },
};

export function getNutritionPlan(goal: string): NutritionPlan {
  return plans[goal] || plans["general fitness"];
}
