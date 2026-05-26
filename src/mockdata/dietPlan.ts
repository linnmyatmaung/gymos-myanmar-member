export interface Meal {
  type: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
  items: string[];
  calories: number;
}

export interface DietDay {
  day: string;
  meals: Meal[];
  totalCalories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  water: number; // L
}

const base = (day: string, total: number): DietDay => ({
  day,
  totalCalories: total,
  protein: 180,
  carbs: 240,
  fat: 70,
  water: 3.5,
  meals: [
    {
      type: "Breakfast",
      items: ["Oatmeal with berries", "4 egg whites + 1 whole egg", "Black coffee"],
      calories: 520,
    },
    {
      type: "Lunch",
      items: ["Grilled chicken breast (200g)", "Brown rice (150g)", "Steamed broccoli"],
      calories: 720,
    },
    {
      type: "Snacks",
      items: ["Greek yogurt + honey", "Mixed almonds (30g)", "Protein shake"],
      calories: 420,
    },
    {
      type: "Dinner",
      items: ["Grilled salmon (180g)", "Sweet potato mash", "Garden salad"],
      calories: 680,
    },
  ],
});

export const dietPlan: DietDay[] = [
  base("Monday", 2340),
  base("Tuesday", 2380),
  base("Wednesday", 2420),
  base("Thursday", 2360),
  base("Friday", 2300),
  base("Saturday", 2500),
  base("Sunday", 2200),
];
