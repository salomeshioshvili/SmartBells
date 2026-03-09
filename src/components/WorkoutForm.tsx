import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkoutInput } from "@/lib/workoutGenerator";

interface Props {
  onGenerate: (input: WorkoutInput) => void;
  isLoading: boolean;
}

const fields: { key: keyof WorkoutInput; label: string; options: { value: string; label: string }[] }[] = [
  {
    key: "goal", label: "Fitness Goal",
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
    options: [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  },
  {
    key: "daysPerWeek", label: "Days per Week",
    options: ["2", "3", "4", "5", "6"].map(v => ({ value: v, label: `${v} days` })),
  },
  {
    key: "location", label: "Workout Location",
    options: [
      { value: "gym", label: "Gym" },
      { value: "home", label: "Home" },
      { value: "both", label: "Both" },
    ],
  },
  {
    key: "timePerSession", label: "Time per Session",
    options: ["20 min", "30 min", "45 min", "60 min"].map(v => ({ value: v, label: v })),
  },
  {
    key: "energyLevel", label: "Energy Level Today",
    options: [
      { value: "low", label: "Low 🌙" },
      { value: "medium", label: "Medium ⚡" },
      { value: "high", label: "High 🔥" },
    ],
  },
  {
    key: "cyclePhase", label: "Menstrual Cycle Phase",
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
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-2xl px-4 pb-16"
    >
      <div className="rounded-2xl border bg-card p-6 shadow-lg shadow-primary/5 md:p-10">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Build Your Plan
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="text-sm font-medium">{field.label}</Label>
              <Select onValueChange={(v) => update(field.key, v)} value={form[field.key] || ""}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
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

        <Button
          onClick={handleSubmit}
          disabled={!allFilled || isLoading}
          className="mt-8 h-14 w-full text-lg font-semibold"
          size="lg"
        >
          <Dumbbell className="mr-2 h-5 w-5" />
          {isLoading ? "Generating..." : "Generate My Plan"}
        </Button>
      </div>
    </motion.section>
  );
};

export default WorkoutForm;
