import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell, Target, TrendingUp, Calendar, MapPin, Clock, Zap, Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { WorkoutInput } from "@/lib/workoutGenerator";

interface Props {
  onGenerate: (input: WorkoutInput) => void;
  isLoading: boolean;
}

const fields: {
  key: keyof WorkoutInput;
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "goal", label: "Fitness Goal",
    icon: <Target className="h-4 w-4 text-primary" />,
    options: [
      { value: "fat loss", label: "Fat Loss" },
      { value: "strength", label: "Strength" },
      { value: "muscle tone", label: "Muscle Tone" },
      { value: "endurance", label: "Endurance" },
      { value: "flexibility", label: "Flexibility" },
      { value: "general fitness", label: "General Fitness" },
    ],
  },
  {
    key: "experience", label: "Experience Level",
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
    options: [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  },
  {
    key: "daysPerWeek", label: "Days per Week",
    icon: <Calendar className="h-4 w-4 text-primary" />,
    options: ["2", "3", "4", "5", "6"].map((v) => ({ value: v, label: `${v} days` })),
  },
  {
    key: "location", label: "Workout Location",
    icon: <MapPin className="h-4 w-4 text-primary" />,
    options: [
      { value: "gym", label: "Gym" },
      { value: "home", label: "Home" },
      { value: "both", label: "Both" },
    ],
  },
  {
    key: "timePerSession", label: "Time per Session",
    icon: <Clock className="h-4 w-4 text-primary" />,
    options: ["20 min", "30 min", "45 min", "60 min"].map((v) => ({ value: v, label: v })),
  },
  {
    key: "energyLevel", label: "Energy Level Today",
    icon: <Zap className="h-4 w-4 text-primary" />,
    options: [
      { value: "low", label: "Low 🌙" },
      { value: "medium", label: "Medium ⚡" },
      { value: "high", label: "High 🔥" },
    ],
  },
  {
    key: "cyclePhase", label: "Cycle Phase",
    icon: <Moon className="h-4 w-4 text-primary" />,
    options: [
      { value: "menstrual", label: "Menstrual" },
      { value: "follicular", label: "Follicular" },
      { value: "ovulatory", label: "Ovulatory" },
      { value: "luteal", label: "Luteal" },
      { value: "prefer not to say", label: "Prefer not to say" },
    ],
  },
];

const WorkoutForm = ({ onGenerate, isLoading }: Props) => {
  const [form, setForm] = useState<Partial<WorkoutInput>>({});

  const update = (key: keyof WorkoutInput, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const allFilled = fields.every((f) => form[f.key]);

  const handleSubmit = () => {
    if (allFilled) onGenerate(form as WorkoutInput);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl px-4 pb-20"
    >
      <div className="glass-card rounded-3xl p-7 md:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Build Your Plan</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Answer a few questions and get your personalized routine.
          </p>
        </div>

        {/* Fields */}
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                {field.icon}
                {field.label}
              </Label>
              <Select onValueChange={(v) => update(field.key, v)} value={form[field.key] || ""}>
                <SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border/60 transition-colors focus:bg-card">
                  <SelectValue placeholder={`Select…`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!allFilled || isLoading}
          className="mt-10 h-14 w-full rounded-2xl text-base font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
          size="lg"
        >
          <Dumbbell className="mr-2 h-5 w-5" />
          {isLoading ? "Generating…" : "Generate My Plan"}
        </Button>
      </div>
    </motion.section>
  );
};

export default WorkoutForm;
