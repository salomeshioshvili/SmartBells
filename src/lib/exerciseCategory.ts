type Category = "cardio" | "strength" | "flexibility" | "core";

const CARDIO_KEYWORDS = [
  "jump", "burpee", "mountain climber", "high knees", "butt kicks", "running",
  "rowing", "cycling", "stairmaster", "skater", "jacks", "battle ropes",
  "elliptical", "sprint", "star jump", "speed skater", "box jump", "rope",
  "plank jack", "HIIT", "circuit",
];

const FLEX_KEYWORDS = [
  "stretch", "yoga", "pigeon", "cat-cow", "child's pose", "butterfly",
  "fold", "hip circle", "thread the needle", "mobility", "foam roll",
  "pull-through", "band pull-apart", "figure-4",
];

const CORE_KEYWORDS = [
  "plank", "crunch", "bicycle crunch", "superman", "core", "abs",
  "shoulder tap",
];

export function categorizeExercise(name: string): Category {
  const lower = name.toLowerCase();
  if (FLEX_KEYWORDS.some((k) => lower.includes(k))) return "flexibility";
  if (CORE_KEYWORDS.some((k) => lower.includes(k))) return "core";
  if (CARDIO_KEYWORDS.some((k) => lower.includes(k))) return "cardio";
  return "strength";
}

export const CATEGORY_LOTTIE: Record<Category, string> = {
  cardio: "https://assets3.lottiefiles.com/packages/lf20_ysrn2iwp.json",
  strength: "https://assets4.lottiefiles.com/packages/lf20_syqnfe7c.json",
  flexibility: "https://assets3.lottiefiles.com/packages/lf20_gn9lnwbb.json",
  core: "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
};
