import { motion } from "framer-motion";
import { Calendar, Flame, Heart, Sparkles } from "lucide-react";
import type { WorkoutPlan } from "@/lib/workoutGenerator";

interface Props {
  plan: WorkoutPlan;
}

const ResultsSection = ({ plan }: Props) => (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="mx-auto max-w-3xl px-4 pb-16"
  >
    <div className="rounded-2xl border bg-card p-6 shadow-lg shadow-primary/5 md:p-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold">Your Workout Plan</h2>
        <p className="text-muted-foreground">{plan.summary}</p>
        <span className="mt-3 inline-block rounded-full bg-blush px-4 py-1 text-sm font-medium text-primary">
          {plan.split}
        </span>
      </div>

      {/* Days */}
      <div className="mb-8 space-y-4">
        {plan.days.map((day, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border bg-secondary/50 p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Day {i + 1}: {day.focus}</h3>
            </div>
            <ul className="mb-3 grid gap-1.5 sm:grid-cols-2">
              {day.exercises.map((ex, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {ex}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              {day.sets} • Rest: {day.rest}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <div className="rounded-xl bg-warm-beige p-4">
          <div className="mb-1 flex items-center gap-2 font-medium">
            <Flame className="h-4 w-4 text-primary" />
            Intensity
          </div>
          <p className="text-sm text-foreground/80">{plan.intensityNote}</p>
        </div>

        <div className="rounded-xl bg-blush p-4">
          <div className="mb-1 flex items-center gap-2 font-medium">
            <Heart className="h-4 w-4 text-primary" />
            Cycle-Aware Insight
          </div>
          <p className="text-sm text-foreground/80">{plan.cycleNote}</p>
        </div>

        <div className="rounded-xl bg-lavender/30 p-4 text-center">
          <Sparkles className="mx-auto mb-2 h-5 w-5 text-accent-foreground" />
          <p className="text-lg font-medium italic text-accent-foreground">
            {plan.motivation}
          </p>
        </div>
      </div>
    </div>
  </motion.section>
);

export default ResultsSection;
