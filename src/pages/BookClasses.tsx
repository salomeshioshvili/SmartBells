import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock, MapPin, Filter, CheckCircle2, X, Sparkles, Users,
  CreditCard, ChevronRight, ChevronLeft, Dumbbell, Heart, Flame, Sun,
  Leaf, Target, RotateCcw, Activity, Zap, Bike, Wind, Music, Monitor,
  Building2, Sunrise, Moon, RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */
interface FitnessClass {
  id: string;
  studio: string;
  type: string;
  date: string;
  time: string;
  location: string;
  duration: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  credits: number;
  spotsLeft: number;
  icon: string;
  tags: string[];
}

const classIconMap: Record<string, { icon: LucideIcon; bg: string; color: string }> = {
  pilates: { icon: Wind, bg: "bg-gradient-to-br from-pink-100 to-rose-50", color: "text-primary" },
  strength: { icon: Dumbbell, bg: "bg-gradient-to-br from-lavender/40 to-purple-50", color: "text-purple-500" },
  hiit: { icon: Flame, bg: "bg-gradient-to-br from-amber-50 to-orange-100", color: "text-amber-500" },
  yoga: { icon: Heart, bg: "bg-gradient-to-br from-emerald-50 to-green-100", color: "text-emerald-500" },
  barre: { icon: Activity, bg: "bg-gradient-to-br from-pink-50 to-fuchsia-50", color: "text-pink-500" },
  cycling: { icon: Bike, bg: "bg-gradient-to-br from-blue-50 to-sky-100", color: "text-blue-500" },
  outdoor: { icon: Sun, bg: "bg-gradient-to-br from-lime-50 to-emerald-50", color: "text-emerald-600" },
  dance: { icon: Music, bg: "bg-gradient-to-br from-violet-50 to-fuchsia-50", color: "text-violet-500" },
  online: { icon: Monitor, bg: "bg-gradient-to-br from-sky-50 to-blue-100", color: "text-sky-500" },
};

function getClassIconKey(c: FitnessClass): string {
  const type = c.type.toLowerCase();
  if (type.includes("pilates")) return "pilates";
  if (type.includes("strength") || type.includes("circuit")) return "strength";
  if (type.includes("hiit")) return "hiit";
  if (type.includes("yoga") || type.includes("sculpt")) return "yoga";
  if (type.includes("barre")) return "barre";
  if (type.includes("cycling") || type.includes("spin")) return "cycling";
  if (type.includes("park") || type.includes("outdoor")) return "outdoor";
  if (type.includes("dance")) return "dance";
  if (type.includes("online") || type.includes("virtual")) return "online";
  return "strength";
}

const quizIconMap: Record<string, { icon: LucideIcon; bg: string; color: string }> = {
  "1-2": { icon: Target, bg: "bg-secondary", color: "text-primary" },
  "3-4": { icon: Dumbbell, bg: "bg-lavender/30", color: "text-purple-500" },
  "5+": { icon: Flame, bg: "bg-blush", color: "text-primary" },
  toning: { icon: Dumbbell, bg: "bg-lavender/30", color: "text-purple-500" },
  "weight-loss": { icon: Flame, bg: "bg-blush", color: "text-primary" },
  flexibility: { icon: Wind, bg: "bg-emerald-50", color: "text-emerald-500" },
  endurance: { icon: Activity, bg: "bg-amber-50", color: "text-amber-500" },
  wellness: { icon: Sparkles, bg: "bg-lavender/30", color: "text-accent-foreground" },
  pilates: { icon: Wind, bg: "bg-pink-50", color: "text-primary" },
  yoga: { icon: Heart, bg: "bg-emerald-50", color: "text-emerald-500" },
  strength: { icon: Dumbbell, bg: "bg-lavender/30", color: "text-purple-500" },
  hiit: { icon: Flame, bg: "bg-amber-50", color: "text-amber-500" },
  barre: { icon: Activity, bg: "bg-pink-50", color: "text-pink-500" },
  dance: { icon: Music, bg: "bg-violet-50", color: "text-violet-500" },
  low: { icon: Leaf, bg: "bg-emerald-50", color: "text-emerald-500" },
  moderate: { icon: Zap, bg: "bg-amber-50", color: "text-amber-500" },
  high: { icon: Flame, bg: "bg-blush", color: "text-primary" },
  studio: { icon: Building2, bg: "bg-secondary", color: "text-foreground" },
  gym: { icon: Dumbbell, bg: "bg-lavender/30", color: "text-purple-500" },
  outdoor: { icon: Sun, bg: "bg-emerald-50", color: "text-emerald-600" },
  online: { icon: Monitor, bg: "bg-sky-50", color: "text-sky-500" },
  any: { icon: RefreshCw, bg: "bg-secondary", color: "text-muted-foreground" },
  morning: { icon: Sunrise, bg: "bg-amber-50", color: "text-amber-500" },
  afternoon: { icon: Sun, bg: "bg-orange-50", color: "text-orange-500" },
  evening: { icon: Moon, bg: "bg-lavender/30", color: "text-accent-foreground" },
  flexible: { icon: RefreshCw, bg: "bg-secondary", color: "text-muted-foreground" },
};

const CLASSES: FitnessClass[] = [
  { id: "1", studio: "CoreFlow Studio", type: "Pilates Flow", date: "Mar 10", time: "7:00 AM", location: "Downtown", duration: 50, difficulty: "Intermediate", credits: 6, spotsLeft: 4, icon: "🧘", tags: ["pilates", "flexibility", "toning", "moderate", "studio", "morning"] },
  { id: "2", studio: "IronHer Gym", type: "Strength Training", date: "Mar 10", time: "8:30 AM", location: "Midtown", duration: 45, difficulty: "Advanced", credits: 8, spotsLeft: 2, icon: "💪", tags: ["strength", "toning", "high", "gym", "morning"] },
  { id: "3", studio: "Burn Lab", type: "HIIT Express", date: "Mar 10", time: "12:00 PM", location: "West Side", duration: 30, difficulty: "Intermediate", credits: 5, spotsLeft: 6, icon: "🔥", tags: ["hiit", "weight-loss", "endurance", "high", "studio", "afternoon"] },
  { id: "4", studio: "Zen & Tone", type: "Yoga Sculpt", date: "Mar 11", time: "6:30 AM", location: "Downtown", duration: 55, difficulty: "Beginner", credits: 5, spotsLeft: 8, icon: "✨", tags: ["yoga", "flexibility", "wellness", "low", "studio", "morning"] },
  { id: "5", studio: "The Barre Room", type: "Barre Burn", date: "Mar 11", time: "9:00 AM", location: "East Village", duration: 50, difficulty: "Intermediate", credits: 7, spotsLeft: 3, icon: "🩰", tags: ["barre", "toning", "moderate", "studio", "morning"] },
  { id: "6", studio: "Spin Society", type: "Cycling Power", date: "Mar 11", time: "5:30 PM", location: "Midtown", duration: 45, difficulty: "Advanced", credits: 9, spotsLeft: 1, icon: "🚴", tags: ["hiit", "endurance", "high", "gym", "evening"] },
  { id: "7", studio: "FlowState", type: "Vinyasa Yoga", date: "Mar 12", time: "7:00 AM", location: "West Side", duration: 60, difficulty: "Beginner", credits: 4, spotsLeft: 10, icon: "🕉️", tags: ["yoga", "flexibility", "wellness", "low", "studio", "morning"] },
  { id: "8", studio: "Burn Lab", type: "HIIT Express", date: "Mar 12", time: "12:30 PM", location: "West Side", duration: 30, difficulty: "Advanced", credits: 6, spotsLeft: 5, icon: "🔥", tags: ["hiit", "weight-loss", "high", "studio", "afternoon"] },
  { id: "9", studio: "CoreFlow Studio", type: "Pilates Flow", date: "Mar 12", time: "6:00 PM", location: "Downtown", duration: 50, difficulty: "Beginner", credits: 5, spotsLeft: 7, icon: "🧘", tags: ["pilates", "flexibility", "toning", "low", "studio", "evening"] },
  { id: "10", studio: "IronHer Gym", type: "Strength Circuit", date: "Mar 13", time: "8:00 AM", location: "Midtown", duration: 45, difficulty: "Intermediate", credits: 7, spotsLeft: 4, icon: "💪", tags: ["strength", "toning", "moderate", "gym", "morning"] },
  { id: "11", studio: "The Barre Room", type: "Barre Burn", date: "Mar 13", time: "10:00 AM", location: "East Village", duration: 50, difficulty: "Advanced", credits: 8, spotsLeft: 2, icon: "🩰", tags: ["barre", "toning", "high", "studio", "morning"] },
  { id: "12", studio: "Zen & Tone", type: "Yoga Sculpt", date: "Mar 13", time: "4:00 PM", location: "Downtown", duration: 55, difficulty: "Intermediate", credits: 6, spotsLeft: 5, icon: "✨", tags: ["yoga", "toning", "moderate", "studio", "afternoon"] },
  { id: "13", studio: "Outdoor Fit Co.", type: "Park HIIT", date: "Mar 14", time: "6:30 AM", location: "Central Park", duration: 40, difficulty: "Intermediate", credits: 4, spotsLeft: 12, icon: "🌳", tags: ["hiit", "endurance", "weight-loss", "moderate", "outdoor", "morning"] },
  { id: "14", studio: "Dance Fusion", type: "Dance Cardio", date: "Mar 14", time: "7:00 PM", location: "Downtown", duration: 50, difficulty: "Beginner", credits: 5, spotsLeft: 9, icon: "💃", tags: ["dance", "weight-loss", "moderate", "studio", "evening"] },
  { id: "15", studio: "Virtual Sweat", type: "Online Strength", date: "Mar 14", time: "12:00 PM", location: "Online", duration: 35, difficulty: "Intermediate", credits: 3, spotsLeft: 50, icon: "💻", tags: ["strength", "toning", "moderate", "online", "afternoon"] },
];

const CLASS_TYPES = ["All", "Pilates Flow", "Strength Training", "HIIT Express", "Yoga Sculpt", "Barre Burn", "Cycling Power", "Vinyasa Yoga", "Strength Circuit", "Park HIIT", "Dance Cardio", "Online Strength"];
const TIMES = ["All", "Morning", "Afternoon", "Evening"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const LOCATIONS = ["All", "Downtown", "Midtown", "West Side", "East Village", "Central Park", "Online"];

function getTimeOfDay(time: string): string {
  const h = parseInt(time);
  const isPM = time.includes("PM");
  const hour24 = isPM && h !== 12 ? h + 12 : !isPM && h === 12 ? 0 : h;
  if (hour24 < 12) return "Morning";
  if (hour24 < 17) return "Afternoon";
  return "Evening";
}

const diffColor: Record<string, string> = {
  Beginner: "bg-secondary text-green-700",
  Intermediate: "bg-secondary text-amber-700",
  Advanced: "bg-secondary text-red-700",
};

/* ═══════════════════════════════════════════════════════════════════
   QUIZ CONFIG
   ═══════════════════════════════════════════════════════════════════ */
interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string; icon: string }[];
  multi?: boolean;
}

const QUIZ: QuizQuestion[] = [
  {
    id: "frequency",
    question: "How many classes do you usually attend per week?",
    options: [
      { label: "1–2", value: "1-2", icon: "🎯" },
      { label: "3–4", value: "3-4", icon: "💪" },
      { label: "5+", value: "5+", icon: "🔥" },
    ],
  },
  {
    id: "goals",
    question: "What are your main fitness goals?",
    multi: true,
    options: [
      { label: "Strength & toning", value: "toning", icon: "💪" },
      { label: "Weight loss", value: "weight-loss", icon: "🔥" },
      { label: "Flexibility & mobility", value: "flexibility", icon: "🧘" },
      { label: "Endurance", value: "endurance", icon: "🏃" },
      { label: "General wellness", value: "wellness", icon: "✨" },
    ],
  },
  {
    id: "types",
    question: "What type of workouts do you enjoy most?",
    multi: true,
    options: [
      { label: "Pilates", value: "pilates", icon: "🧘" },
      { label: "Yoga", value: "yoga", icon: "🕉️" },
      { label: "Strength training", value: "strength", icon: "💪" },
      { label: "HIIT / Cardio", value: "hiit", icon: "🔥" },
      { label: "Barre", value: "barre", icon: "🩰" },
      { label: "Dance fitness", value: "dance", icon: "💃" },
    ],
  },
  {
    id: "intensity",
    question: "What intensity level do you prefer?",
    options: [
      { label: "Low intensity", value: "low", icon: "🌿" },
      { label: "Moderate", value: "moderate", icon: "⚡" },
      { label: "High intensity", value: "high", icon: "🔥" },
    ],
  },
  {
    id: "venue",
    question: "Where do you prefer to train?",
    options: [
      { label: "Studio classes", value: "studio", icon: "🏢" },
      { label: "Gym classes", value: "gym", icon: "🏋️" },
      { label: "Outdoor classes", value: "outdoor", icon: "🌳" },
      { label: "Online classes", value: "online", icon: "💻" },
      { label: "No preference", value: "any", icon: "🤷" },
    ],
  },
  {
    id: "time",
    question: "What time of day do you prefer working out?",
    options: [
      { label: "Morning", value: "morning", icon: "🌅" },
      { label: "Afternoon", value: "afternoon", icon: "☀️" },
      { label: "Evening", value: "evening", icon: "🌙" },
      { label: "Flexible", value: "flexible", icon: "🔄" },
    ],
  },
];

interface QuizPreferences {
  frequency: string;
  goals: string[];
  types: string[];
  intensity: string;
  venue: string;
  time: string;
}

const PREFS_KEY = "smartbells_class_prefs";

function loadPrefs(): QuizPreferences | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function savePrefs(p: QuizPreferences) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(p));
}

function scoreClass(c: FitnessClass, prefs: QuizPreferences): number {
  let score = 0;
  for (const g of prefs.goals) { if (c.tags.includes(g)) score += 3; }
  for (const t of prefs.types) { if (c.tags.includes(t)) score += 3; }
  if (c.tags.includes(prefs.intensity)) score += 2;
  if (prefs.venue !== "any" && c.tags.includes(prefs.venue)) score += 2;
  if (prefs.time !== "flexible" && c.tags.includes(prefs.time)) score += 1;
  return score;
}

function getRecommended(prefs: QuizPreferences): FitnessClass[] {
  const scored = CLASSES.map((c) => ({ c, score: scoreClass(c, prefs) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).map((s) => s.c);
}

const anim = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const BookClasses = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [locFilter, setLocFilter] = useState("All");
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [modalClass, setModalClass] = useState<FitnessClass | null>(null);

  // Quiz state
  const [prefs, setPrefs] = useState<QuizPreferences | null>(loadPrefs);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const recommended = prefs ? getRecommended(prefs) : [];

  const filtered = CLASSES.filter((c) => {
    if (typeFilter !== "All" && c.type !== typeFilter) return false;
    if (timeFilter !== "All" && getTimeOfDay(c.time) !== timeFilter) return false;
    if (diffFilter !== "All" && c.difficulty !== diffFilter) return false;
    if (locFilter !== "All" && c.location !== locFilter) return false;
    return true;
  });

  const handleReserve = (c: FitnessClass) => {
    setBooked((prev) => new Set(prev).add(c.id));
    setModalClass(c);
  };

  /* ── Quiz helpers ── */
  const currentQ = QUIZ[quizStep];
  const quizProgress = ((quizStep) / QUIZ.length) * 100;

  const selectAnswer = (val: string) => {
    if (currentQ.multi) {
      const prev = (answers[currentQ.id] as string[]) || [];
      const next = prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val];
      setAnswers({ ...answers, [currentQ.id]: next });
    } else {
      setAnswers({ ...answers, [currentQ.id]: val });
    }
  };

  const isSelected = (val: string) => {
    const a = answers[currentQ.id];
    if (Array.isArray(a)) return a.includes(val);
    return a === val;
  };

  const canProceed = () => {
    const a = answers[currentQ.id];
    if (!a) return false;
    if (Array.isArray(a)) return a.length > 0;
    return true;
  };

  const nextStep = () => {
    if (quizStep < QUIZ.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Finish quiz
      const newPrefs: QuizPreferences = {
        frequency: (answers.frequency as string) || "1-2",
        goals: (answers.goals as string[]) || [],
        types: (answers.types as string[]) || [],
        intensity: (answers.intensity as string) || "moderate",
        venue: (answers.venue as string) || "any",
        time: (answers.time as string) || "flexible",
      };
      setPrefs(newPrefs);
      savePrefs(newPrefs);
      setQuizOpen(false);
      setQuizStep(0);
      setAnswers({});
    }
  };

  const prevStep = () => {
    if (quizStep > 0) setQuizStep(quizStep - 1);
  };

  const startQuiz = () => {
    setQuizOpen(true);
    setQuizStep(0);
    setAnswers({});
  };

  const resetPrefs = () => {
    setPrefs(null);
    localStorage.removeItem(PREFS_KEY);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 pb-20">
        {/* Header */}
        <motion.div {...anim} className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl mb-2">Book Classes</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Discover and reserve spots in top fitness classes near you.
          </p>
        </motion.div>

        {/* ═══ Quiz Entry / Recommendations ═══ */}
        {!prefs && !quizOpen && (
          <motion.div {...anim} transition={{ delay: 0.08 }} className="mb-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 md:p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-1">Find Your Perfect Classes</h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              Answer a few quick questions so we can recommend classes that fit your lifestyle and goals.
            </p>
            <Button onClick={startQuiz} className="rounded-full gap-2 px-6 bg-primary hover:bg-primary/90">
              <Target className="h-4 w-4" /> Start Quiz
            </Button>
          </motion.div>
        )}

        {prefs && !quizOpen && recommended.length > 0 && (
          <motion.div {...anim} transition={{ delay: 0.08 }} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Recommended For You
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Based on your preferences, these classes may be a great fit for you.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={startQuiz} className="rounded-full text-xs gap-1">
                  <RotateCcw className="h-3 w-3" /> Retake Quiz
                </Button>
                <Button variant="ghost" size="sm" onClick={resetPrefs} className="rounded-full text-xs text-muted-foreground">
                  Clear
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.slice(0, 6).map((c, i) => (
                <ClassCard key={c.id} c={c} i={i} booked={booked} onReserve={handleReserve} recommended />
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ Filters ═══ */}
        <motion.div {...anim} transition={{ delay: 0.1 }} className="mb-8 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">All Classes</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Class Type" value={typeFilter} options={CLASS_TYPES} onChange={setTypeFilter} />
            <FilterSelect label="Time of Day" value={timeFilter} options={TIMES} onChange={setTimeFilter} />
            <FilterSelect label="Difficulty" value={diffFilter} options={DIFFICULTIES} onChange={setDiffFilter} />
            <FilterSelect label="Location" value={locFilter} options={LOCATIONS} onChange={setLocFilter} />
          </div>
        </motion.div>

        <motion.p {...anim} transition={{ delay: 0.15 }} className="text-sm text-muted-foreground mb-4">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> classes
        </motion.p>

        {/* ═══ Class Grid ═══ */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <ClassCard key={c.id} c={c} i={i} booked={booked} onReserve={handleReserve} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No classes match your filters. Try adjusting them.</p>
          </div>
        )}

        {/* Disclaimer */}
        <motion.div {...anim} transition={{ delay: 0.3 }} className="mt-10 rounded-xl bg-muted/50 p-4 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Class booking integration prototype inspired by ClassPass.
          </p>
        </motion.div>
      </main>
      <Footer />

      {/* ═══ Quiz Modal ═══ */}
      <AnimatePresence>
        {quizOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={() => setQuizOpen(false)} />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-card p-6 md:p-8 shadow-2xl border border-border/40"
            >
              <Button
                variant="ghost" size="icon" onClick={() => setQuizOpen(false)}
                className="absolute top-3 right-3 rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Question {quizStep + 1} of {QUIZ.length}
                  </span>
                  <span className="text-[10px] font-semibold text-primary">{Math.round(quizProgress)}%</span>
                </div>
                <Progress value={quizProgress} className="h-2" />
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={quizStep}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold mb-1">{currentQ.question}</h3>
                  {currentQ.multi && (
                    <p className="text-xs text-muted-foreground mb-4">Select all that apply</p>
                  )}
                  {!currentQ.multi && (
                    <p className="text-xs text-muted-foreground mb-4">Choose one</p>
                  )}

                  <div className="grid gap-2">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          selectAnswer(opt.value);
                          // Auto-advance on single-select
                          if (!currentQ.multi) {
                            setTimeout(() => {
                              setAnswers((prev) => ({ ...prev, [currentQ.id]: opt.value }));
                              if (quizStep < QUIZ.length - 1) {
                                setQuizStep((s) => s + 1);
                              }
                            }, 200);
                          }
                        }}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                          isSelected(opt.value)
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/50 bg-secondary/30 text-foreground hover:bg-secondary/60"
                        }`}
                      >
                        {(() => {
                          const qi = quizIconMap[opt.value];
                          if (!qi) return <span className="text-xl">{opt.icon}</span>;
                          const QIcon = qi.icon;
                          return (
                            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${qi.bg}`}>
                              <QIcon className={`h-4 w-4 ${qi.color}`} strokeWidth={1.8} />
                            </div>
                          );
                        })()}
                        <span className="flex-1">{opt.label}</span>
                        {isSelected(opt.value) && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStep}
                  disabled={quizStep === 0}
                  className="rounded-full gap-1 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  size="sm"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="rounded-full gap-1 bg-primary hover:bg-primary/90 disabled:opacity-30"
                >
                  {quizStep === QUIZ.length - 1 ? "See Results" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Booking Confirmation Modal ═══ */}
      <AnimatePresence>
        {modalClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={() => setModalClass(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-sm rounded-3xl bg-card p-8 shadow-2xl border border-border/40 text-center"
            >
              <Button
                variant="ghost" size="icon" onClick={() => setModalClass(null)}
                className="absolute top-3 right-3 rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Class Booked!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your class has been booked successfully.
              </p>

              <div className="rounded-2xl bg-secondary/50 p-4 mb-5 text-left space-y-2">
                <p className="text-sm font-semibold">{modalClass.type}</p>
                <p className="text-xs text-muted-foreground">{modalClass.studio}</p>
                <div className="flex items-center gap-4 text-xs text-foreground/70">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {modalClass.date} • {modalClass.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {modalClass.location}</span>
                </div>
              </div>

              <Button onClick={() => setModalClass(null)} className="w-full rounded-full">
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */
const ClassCard = ({ c, i, booked, onReserve, recommended }: {
  c: FitnessClass; i: number; booked: Set<string>;
  onReserve: (c: FitnessClass) => void; recommended?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 + i * 0.04 }}
    className={`rounded-2xl border bg-card p-5 hover:shadow-lg transition-all group ${
      recommended ? "border-primary/30 ring-1 ring-primary/10" : "border-border/50"
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      {(() => {
        const key = getClassIconKey(c);
        const iconData = classIconMap[key];
        const IconComp = iconData.icon;
        return (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconData.bg} shadow-sm`}
          >
            <IconComp className={`h-5 w-5 ${iconData.color}`} strokeWidth={1.8} />
          </motion.div>
        );
      })()}
      <div className="flex items-center gap-1.5">
        {recommended && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
            Recommended
          </span>
        )}
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${diffColor[c.difficulty]}`}>
          {c.difficulty}
        </span>
      </div>
    </div>

    <h3 className="font-bold text-lg mb-0.5">{c.type}</h3>
    <p className="text-sm text-muted-foreground mb-4">{c.studio}</p>

    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 text-sm text-foreground/70">
        <CalendarDays className="h-3.5 w-3.5 text-primary/60" />
        {c.date} • {c.time}
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground/70">
        <MapPin className="h-3.5 w-3.5 text-primary/60" />
        {c.location}
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground/70">
        <Clock className="h-3.5 w-3.5 text-primary/60" />
        {c.duration} min
      </div>
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-border/40">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-sm font-semibold text-primary">
          <CreditCard className="h-3.5 w-3.5" /> {c.credits} credits
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" /> {c.spotsLeft} left
        </span>
      </div>
      {booked.has(c.id) ? (
        <span className="flex items-center gap-1 text-xs font-semibold text-primary">
          <CheckCircle2 className="h-3.5 w-3.5" /> Booked
        </span>
      ) : (
        <Button
          size="sm"
          onClick={() => onReserve(c)}
          className="rounded-full text-xs h-8 px-4 bg-primary hover:bg-primary/90"
        >
          Reserve Spot
        </Button>
      )}
    </div>
  </motion.div>
);

const FilterSelect = ({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default BookClasses;
