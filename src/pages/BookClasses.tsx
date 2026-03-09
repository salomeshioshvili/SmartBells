import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock, MapPin, Zap, Flame, Heart, Star, Filter,
  CheckCircle2, X, Sparkles, Users, CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Sample data ── */
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
}

const CLASSES: FitnessClass[] = [
  { id: "1", studio: "CoreFlow Studio", type: "Pilates Flow", date: "Mar 10", time: "7:00 AM", location: "Downtown", duration: 50, difficulty: "Intermediate", credits: 6, spotsLeft: 4, icon: "🧘" },
  { id: "2", studio: "IronHer Gym", type: "Strength Training", date: "Mar 10", time: "8:30 AM", location: "Midtown", duration: 45, difficulty: "Advanced", credits: 8, spotsLeft: 2, icon: "💪" },
  { id: "3", studio: "Burn Lab", type: "HIIT Express", date: "Mar 10", time: "12:00 PM", location: "West Side", duration: 30, difficulty: "Intermediate", credits: 5, spotsLeft: 6, icon: "🔥" },
  { id: "4", studio: "Zen & Tone", type: "Yoga Sculpt", date: "Mar 11", time: "6:30 AM", location: "Downtown", duration: 55, difficulty: "Beginner", credits: 5, spotsLeft: 8, icon: "✨" },
  { id: "5", studio: "The Barre Room", type: "Barre Burn", date: "Mar 11", time: "9:00 AM", location: "East Village", duration: 50, difficulty: "Intermediate", credits: 7, spotsLeft: 3, icon: "🩰" },
  { id: "6", studio: "Spin Society", type: "Cycling Power", date: "Mar 11", time: "5:30 PM", location: "Midtown", duration: 45, difficulty: "Advanced", credits: 9, spotsLeft: 1, icon: "🚴" },
  { id: "7", studio: "FlowState", type: "Vinyasa Yoga", date: "Mar 12", time: "7:00 AM", location: "West Side", duration: 60, difficulty: "Beginner", credits: 4, spotsLeft: 10, icon: "🕉️" },
  { id: "8", studio: "Burn Lab", type: "HIIT Express", date: "Mar 12", time: "12:30 PM", location: "West Side", duration: 30, difficulty: "Advanced", credits: 6, spotsLeft: 5, icon: "🔥" },
  { id: "9", studio: "CoreFlow Studio", type: "Pilates Flow", date: "Mar 12", time: "6:00 PM", location: "Downtown", duration: 50, difficulty: "Beginner", credits: 5, spotsLeft: 7, icon: "🧘" },
  { id: "10", studio: "IronHer Gym", type: "Strength Training", date: "Mar 13", time: "8:00 AM", location: "Midtown", duration: 45, difficulty: "Intermediate", credits: 7, spotsLeft: 4, icon: "💪" },
  { id: "11", studio: "The Barre Room", type: "Barre Burn", date: "Mar 13", time: "10:00 AM", location: "East Village", duration: 50, difficulty: "Advanced", credits: 8, spotsLeft: 2, icon: "🩰" },
  { id: "12", studio: "Zen & Tone", type: "Yoga Sculpt", date: "Mar 13", time: "4:00 PM", location: "Downtown", duration: 55, difficulty: "Intermediate", credits: 6, spotsLeft: 5, icon: "✨" },
];

const CLASS_TYPES = ["All", "Pilates Flow", "Strength Training", "HIIT Express", "Yoga Sculpt", "Barre Burn", "Cycling Power", "Vinyasa Yoga"];
const TIMES = ["All", "Morning", "Afternoon", "Evening"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const LOCATIONS = ["All", "Downtown", "Midtown", "West Side", "East Village"];

function getTimeOfDay(time: string): string {
  const h = parseInt(time);
  const isPM = time.includes("PM");
  const hour24 = isPM && h !== 12 ? h + 12 : !isPM && h === 12 ? 0 : h;
  if (hour24 < 12) return "Morning";
  if (hour24 < 17) return "Afternoon";
  return "Evening";
}

const diffColor: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

const anim = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const BookClasses = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [locFilter, setLocFilter] = useState("All");
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [modalClass, setModalClass] = useState<FitnessClass | null>(null);

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

        {/* Filters */}
        <motion.div {...anim} transition={{ delay: 0.1 }} className="mb-8 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Filters</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Class Type" value={typeFilter} options={CLASS_TYPES} onChange={setTypeFilter} />
            <FilterSelect label="Time of Day" value={timeFilter} options={TIMES} onChange={setTimeFilter} />
            <FilterSelect label="Difficulty" value={diffFilter} options={DIFFICULTIES} onChange={setDiffFilter} />
            <FilterSelect label="Location" value={locFilter} options={LOCATIONS} onChange={setLocFilter} />
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p {...anim} transition={{ delay: 0.15 }} className="text-sm text-muted-foreground mb-4">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> classes
        </motion.p>

        {/* Class grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="rounded-2xl border border-border/50 bg-card p-5 hover:shadow-lg transition-all group"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{c.icon}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${diffColor[c.difficulty]}`}>
                  {c.difficulty}
                </span>
              </div>

              <h3 className="font-bold text-lg mb-0.5">{c.type}</h3>
              <p className="text-sm text-muted-foreground mb-4">{c.studio}</p>

              {/* Details */}
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

              {/* Footer */}
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
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Booked
                  </span>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleReserve(c)}
                    className="rounded-full text-xs h-8 px-4 bg-primary hover:bg-primary/90"
                  >
                    Reserve Spot
                  </Button>
                )}
              </div>
            </motion.div>
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

      {/* Confirmation modal */}
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

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
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

/* ── Filter dropdown ── */
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
