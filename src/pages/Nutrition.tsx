import { useState } from "react";
import { motion } from "framer-motion";
import {
  Apple, Beef, Coffee, Droplets, Flame, Heart, Info, Leaf, Plus, Salad,
  Sparkles, Sun, UtensilsCrossed, Zap, GlassWater, Cookie,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getNutritionPlan, type Meal, type NutritionPlan } from "@/lib/nutritionData";

const GOALS = ["fat loss", "strength", "muscle tone", "endurance", "general fitness", "flexibility"] as const;

const goalIcons: Record<string, React.ReactNode> = {
  "fat loss": <Flame className="h-4 w-4" />,
  strength: <Zap className="h-4 w-4" />,
  "muscle tone": <Heart className="h-4 w-4" />,
  endurance: <Sun className="h-4 w-4" />,
  "general fitness": <Sparkles className="h-4 w-4" />,
  flexibility: <Leaf className="h-4 w-4" />,
};

const anim = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const MealCard = ({ meal }: { meal: Meal }) => (
  <div className="rounded-2xl border border-border/50 bg-card p-4 hover:shadow-md transition-shadow">
    <h4 className="font-semibold text-sm mb-1">{meal.name}</h4>
    <p className="text-xs text-muted-foreground mb-3">{meal.description}</p>
    <div className="flex gap-3 mb-3">
      <span className="flex items-center gap-1 text-xs font-medium text-primary">
        <Flame className="h-3 w-3" /> {meal.calories} cal
      </span>
      <span className="flex items-center gap-1 text-xs font-medium text-accent-foreground">
        <Beef className="h-3 w-3" /> {meal.protein}g protein
      </span>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {meal.ingredients.map((ing, i) => (
        <span key={i} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
          {ing}
        </span>
      ))}
    </div>
  </div>
);

const MealSection = ({ title, icon, meals }: { title: string; icon: React.ReactNode; meals: Meal[] }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      {meals.map((m, i) => <MealCard key={i} meal={m} />)}
    </div>
  </div>
);

const Nutrition = () => {
  const [goal, setGoal] = useState<string>("general fitness");
  const [waterGlasses, setWaterGlasses] = useState(0);
  const plan: NutritionPlan = getNutritionPlan(goal);

  const waterProgress = Math.min((waterGlasses * 0.25) / plan.waterGoalL * 100, 100);
  const waterCurrent = (waterGlasses * 0.25).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 pb-20">
        {/* Page header */}
        <motion.div {...anim} className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Apple className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl mb-2">Nutrition Guide</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Personalized meal suggestions to fuel your fitness goals.
          </p>
        </motion.div>

        {/* Goal selector */}
        <motion.div {...anim} transition={{ delay: 0.1 }} className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 text-center">
            Select your goal
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => { setGoal(g); setWaterGlasses(0); }}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  goal === g
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {goalIcons[g]}
                <span className="capitalize">{g}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview card */}
        <motion.div {...anim} transition={{ delay: 0.15 }} className="rounded-3xl border border-border/50 bg-card p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="text-center">
              <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">{plan.dailyCalories}</p>
              <p className="text-xs text-muted-foreground">Daily Calories</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Beef className="h-5 w-5 text-accent-foreground" />
              </div>
              <p className="text-2xl font-bold">{plan.dailyProtein}g</p>
              <p className="text-xs text-muted-foreground">Daily Protein</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <Droplets className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{plan.waterGoalL}L</p>
              <p className="text-xs text-muted-foreground">Hydration Goal</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold capitalize">{goal.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">Focus</p>
            </div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4">
            <p className="text-sm text-foreground/80 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              {plan.tip}
            </p>
          </div>
        </motion.div>

        {/* Meal sections */}
        <motion.div {...anim} transition={{ delay: 0.2 }} className="space-y-8 mb-10">
          <MealSection title="Breakfast" icon={<Coffee className="h-4 w-4" />} meals={plan.breakfast} />
          <MealSection title="Lunch" icon={<Salad className="h-4 w-4" />} meals={plan.lunch} />
          <MealSection title="Dinner" icon={<UtensilsCrossed className="h-4 w-4" />} meals={plan.dinner} />
          <MealSection title="Healthy Snacks" icon={<Cookie className="h-4 w-4" />} meals={plan.snacks} />
        </motion.div>

        {/* Pre/Post workout */}
        <motion.div {...anim} transition={{ delay: 0.25 }} className="grid gap-4 md:grid-cols-2 mb-10">
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold">Pre-Workout Fuel</h3>
            </div>
            <div className="space-y-3">
              {plan.preWorkout.map((item, i) => (
                <div key={i} className="rounded-xl bg-secondary/40 p-3">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/20">
                <Heart className="h-4 w-4 text-accent-foreground" />
              </div>
              <h3 className="font-semibold">Post-Workout Recovery</h3>
            </div>
            <div className="space-y-3">
              {plan.postWorkout.map((item, i) => (
                <div key={i} className="rounded-xl bg-secondary/40 p-3">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              Eating within 30-60 minutes post-workout helps muscle repair and glycogen replenishment.
            </p>
          </div>
        </motion.div>

        {/* Hydration tracker */}
        <motion.div {...anim} transition={{ delay: 0.3 }} className="rounded-3xl border border-border/50 bg-card p-6 mb-10 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
              <GlassWater className="h-4 w-4 text-blue-500" />
            </div>
            <h3 className="font-semibold">Hydration Tracker</h3>
            <span className="ml-auto text-sm text-muted-foreground">{waterCurrent}L / {plan.waterGoalL}L</span>
          </div>
          <Progress value={waterProgress} className="h-3 mb-4" />
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={() => setWaterGlasses((g) => g + 1)}
              size="sm"
              className="rounded-full gap-1.5 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="h-4 w-4" /> Log Water (250ml)
            </Button>
            {waterGlasses > 0 && (
              <Button
                onClick={() => setWaterGlasses((g) => Math.max(0, g - 1))}
                size="sm"
                variant="outline"
                className="rounded-full"
              >
                Undo
              </Button>
            )}
            <div className="flex gap-1 ml-auto">
              {Array.from({ length: Math.min(waterGlasses, 12) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-6 w-4 rounded-sm bg-blue-400/70"
                />
              ))}
            </div>
          </div>
          {waterProgress >= 100 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm font-medium text-blue-600 flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" /> Hydration goal reached! Great job! 💧
            </motion.p>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div {...anim} transition={{ delay: 0.35 }} className="rounded-3xl border border-border/50 bg-card p-6 mb-10 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold">Nutrition Tips</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {plan.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl bg-secondary/40 p-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground/80">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly meals */}
        <motion.div {...anim} transition={{ delay: 0.4 }} className="mb-10">
          <h3 className="font-semibold text-lg mb-4 text-center">Weekly Healthy Meal Ideas</h3>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {plan.weeklyMeals.map((meal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="rounded-2xl border border-border/50 bg-card p-4 text-center hover:shadow-md transition-shadow cursor-default"
              >
                <span className="text-3xl mb-2 block">{meal.emoji}</span>
                <p className="text-sm font-medium">{meal.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div {...anim} transition={{ delay: 0.45 }} className="rounded-xl bg-muted/50 p-4 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Info className="h-3 w-3" />
            Nutrition suggestions are general wellness guidance and not medical or dietary advice.
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Nutrition;
