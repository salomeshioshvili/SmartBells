export interface WorkoutInput {
  goal: string;
  experience: string;
  daysPerWeek: string;
  location: string;
  timePerSession: string;
  energyLevel: string;
  cyclePhase: string;
}

export interface DayPlan {
  day: string;
  focus: string;
  exercises: string[];
  sets: string;
  rest: string;
}

export interface WorkoutPlan {
  summary: string;
  split: string;
  days: DayPlan[];
  intensityNote: string;
  cycleNote: string;
  motivation: string;
}

const gymExercises: Record<string, string[]> = {
  "fat loss": ["Barbell hip thrusts", "Dumbbell lunges", "Cable kickbacks", "Lat pulldowns", "Kettlebell swings", "Box jumps", "Battle ropes", "TRX rows", "Leg press", "Incline dumbbell press"],
  strength: ["Barbell squats", "Romanian deadlifts", "Bench press", "Overhead press", "Barbell rows", "Hip thrusts", "Leg press", "Pull-ups (assisted)", "Dumbbell shoulder press", "Cable face pulls"],
  "muscle tone": ["Dumbbell goblet squats", "Cable glute kickbacks", "Lat pulldown", "Dumbbell chest fly", "Leg curls", "Seated cable rows", "Lateral raises", "Tricep pushdowns", "Bicep curls", "Leg extensions"],
  endurance: ["Rowing machine intervals", "Cycling sprints", "Stairmaster", "Light barbell squats (high rep)", "Dumbbell step-ups", "Medicine ball slams", "Jump rope intervals", "Elliptical HIIT", "Light deadlifts (high rep)", "Bodyweight circuit"],
  flexibility: ["Cable pull-throughs", "Light Romanian deadlifts", "Face pulls", "Band pull-aparts", "Yoga flow sequence", "Foam rolling circuit", "Hip flexor stretches", "Thoracic spine mobility", "Light goblet squats", "Overhead band stretches"],
  "general fitness": ["Dumbbell squats", "Incline dumbbell press", "Cable rows", "Hip thrusts", "Leg press", "Shoulder press", "Plank variations", "Bicycle crunches", "Step-ups", "Lat pulldowns"],
};

const homeExercises: Record<string, string[]> = {
  "fat loss": ["Jump squats", "Burpees", "Mountain climbers", "High knees", "Glute bridges", "Plank jacks", "Lateral lunges", "Skater jumps", "Bicycle crunches", "Squat to press (light DB)"],
  strength: ["Bulgarian split squats", "Push-ups (elevated)", "Single-leg glute bridges", "Pike push-ups", "Resistance band squats", "Resistance band rows", "Wall sits", "Diamond push-ups", "Banded hip thrusts", "Inverted rows (table)"],
  "muscle tone": ["Bodyweight squats", "Glute bridges", "Donkey kicks", "Fire hydrants", "Tricep dips (chair)", "Push-ups", "Clamshells", "Lateral band walks", "Plank shoulder taps", "Curtsy lunges"],
  endurance: ["Jumping jacks", "High knees", "Butt kicks", "Squat jumps", "Mountain climbers", "Burpees", "Plank holds", "Running in place", "Speed skaters", "Star jumps"],
  flexibility: ["Cat-cow stretches", "World's greatest stretch", "Pigeon pose", "Figure-4 stretch", "Seated forward fold", "Hip circles", "Thread the needle", "Butterfly stretch", "Child's pose", "Standing quad stretch"],
  "general fitness": ["Bodyweight squats", "Push-ups", "Glute bridges", "Lunges", "Plank", "Mountain climbers", "Donkey kicks", "Superman holds", "Bicycle crunches", "Jumping jacks"],
};

const splits: Record<string, string[]> = {
  "2": ["Full Body A", "Full Body B"],
  "3": ["Lower Body", "Upper Body", "Full Body + Core"],
  "4": ["Lower Body (Glutes)", "Upper Body (Push)", "Lower Body (Legs)", "Upper Body (Pull)"],
  "5": ["Glutes & Hamstrings", "Chest & Shoulders", "Quads & Calves", "Back & Arms", "Full Body + Core"],
  "6": ["Glutes", "Chest & Shoulders", "Quads", "Back & Biceps", "Hamstrings & Glutes", "Arms & Core"],
};

const motivationalMessages = [
  "You're stronger than you think. Every rep counts. 💪",
  "Progress isn't always visible — but it's always happening. Keep going! 🌟",
  "Your body is capable of incredible things. Trust the process. ✨",
  "Showing up is the hardest part — and you just did it. 🔥",
  "Strong women lift each other up — starting with themselves. 💜",
  "Consistency beats perfection every single time. You've got this! 🌸",
];

function pickExercises(pool: string[], count: number): string[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getIntensityNote(energy: string, experience: string): string {
  if (energy === "low") {
    return "🟢 Low intensity recommended — Focus on controlled movements, lighter weights, and longer rest periods. Listen to your body and prioritize form over volume.";
  }
  if (energy === "medium") {
    return "🟡 Moderate intensity — Work at a comfortable challenge level. Push yourself but maintain good form throughout. Take rest when needed.";
  }
  if (experience === "beginner") {
    return "🟠 High energy detected! As a beginner, channel that energy into mastering form with moderate weights. Quality over quantity.";
  }
  return "🔴 High intensity — Push yourself today! Increase weight, reduce rest periods, and aim for that extra rep. You've got the energy for it!";
}

function getCycleNote(phase: string): string {
  switch (phase) {
    case "menstrual":
      return "🌙 Menstrual phase: Your body is recovering. This plan includes gentler movements and emphasizes stretching and mobility. Reduce intensity by 20-30% if needed. Hydrate well and honor what your body needs today.";
    case "follicular":
      return "🌱 Follicular phase: Estrogen is rising — you may feel more energetic and ready to push! This is a great time for progressive overload and trying new exercises. Your body recovers faster now.";
    case "ovulatory":
      return "☀️ Ovulatory phase: Peak energy and strength! This plan takes advantage of your hormonal peak. Go for personal bests, high-intensity intervals, and challenging compound movements.";
    case "luteal":
      return "🍂 Luteal phase: Energy may start declining. This plan includes steady-state work with moderate intensity. Focus on compound movements at comfortable weights. Extra warm-up recommended.";
    default:
      return "📝 Your plan is tailored to your goals and experience. For even more personalization, tracking your cycle phase can help optimize training intensity throughout the month.";
  }
}

export function generateWorkoutPlan(input: WorkoutInput): WorkoutPlan {
  const exercisePool = input.location === "home"
    ? homeExercises[input.goal] || homeExercises["general fitness"]
    : input.location === "gym"
      ? gymExercises[input.goal] || gymExercises["general fitness"]
      : [...(gymExercises[input.goal] || gymExercises["general fitness"]), ...(homeExercises[input.goal] || homeExercises["general fitness"])];

  const dayNames = splits[input.daysPerWeek] || splits["3"];

  const timeNum = parseInt(input.timePerSession);
  const exercisesPerDay = timeNum <= 20 ? 4 : timeNum <= 30 ? 5 : timeNum <= 45 ? 6 : 7;

  const setsMap: Record<string, string> = {
    beginner: "2-3 sets × 10-12 reps",
    intermediate: "3-4 sets × 8-12 reps",
    advanced: "4-5 sets × 6-10 reps",
  };

  const restMap: Record<string, string> = {
    low: "90-120 seconds",
    medium: "60-90 seconds",
    high: "45-60 seconds",
  };

  // Adjust for cycle phase
  let adjustedEnergy = input.energyLevel;
  if (input.cyclePhase === "menstrual" && input.energyLevel === "high") adjustedEnergy = "medium";
  if (input.cyclePhase === "luteal" && input.energyLevel === "high") adjustedEnergy = "medium";

  const days: DayPlan[] = dayNames.map((focus) => ({
    day: focus,
    focus,
    exercises: pickExercises(exercisePool, exercisesPerDay),
    sets: setsMap[input.experience] || setsMap.beginner,
    rest: restMap[adjustedEnergy] || restMap.medium,
  }));

  const locationLabel = input.location === "both" ? "gym & home" : input.location;
  const summary = `${input.experience.charAt(0).toUpperCase() + input.experience.slice(1)} level • ${input.goal.charAt(0).toUpperCase() + input.goal.slice(1)} focus • ${input.daysPerWeek} days/week • ${input.timePerSession} sessions • ${locationLabel.charAt(0).toUpperCase() + locationLabel.slice(1)} workouts`;

  return {
    summary,
    split: `${input.daysPerWeek}-day ${input.goal} split`,
    days,
    intensityNote: getIntensityNote(adjustedEnergy, input.experience),
    cycleNote: getCycleNote(input.cyclePhase),
    motivation: motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
  };
}
