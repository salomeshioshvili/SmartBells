import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Flame, Heart, Sparkles, Target, TrendingUp, Zap, Moon, Dumbbell, Timer, Play, Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categorizeExercise, CATEGORY_LOTTIE } from "@/lib/exerciseCategory";
import { getVideoForPlan, getThumbnailUrl } from "@/lib/videoMapping";
import VideoModal from "@/components/VideoModal";
import WorkoutPlayer from "@/components/WorkoutPlayer";
import type { WorkoutPlan, WorkoutInput, DayPlan } from "@/lib/workoutGenerator";

interface Props {
  plan: WorkoutPlan;
  input: WorkoutInput;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ExerciseIcon = ({ name }: { name: string }) => {
  const cat = categorizeExercise(name);
  const src = CATEGORY_LOTTIE[cat];
  return (
    <lottie-player
      src={src}
      background="transparent"
      speed="1"
      style={{ width: "36px", height: "36px" }}
      hover
      loop
    />
  );
};

const VideoThumbnail = ({ videoId, onClick }: { videoId: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group relative mt-3 w-full overflow-hidden rounded-xl border border-border/50 transition-shadow hover:shadow-md"
  >
    <img
      src={getThumbnailUrl(videoId)}
      alt="Follow along video"
      className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
    />
    <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 group-hover:bg-foreground/10 transition-colors">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
        <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
      </div>
    </div>
  </button>
);

const ResultsSection = ({ plan, input }: Props) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<{ day: DayPlan; index: number } | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerDay, setPlayerDay] = useState<{ day: DayPlan; index: number } | null>(null);

  const video = getVideoForPlan(input.goal, input.experience, input.cyclePhase);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const openVideoForDay = (day: DayPlan, index: number) => {
    setModalDay({ day, index });
    setModalOpen(true);
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl px-4 pb-20"
      >
        <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
          {/* Confetti — one-shot */}
          {showConfetti && (
            <div className="pointer-events-none absolute -top-4 -right-4 z-20">
              <lottie-player
                src="https://assets6.lottiefiles.com/packages/lf20_obhph3t0.json"
                background="transparent"
                speed="1"
                style={{ width: "200px", height: "200px" }}
                autoplay
              />
            </div>
          )}

          {/* Follow Along CTA */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <Button
              onClick={() => {
                setPlayerDay({ day: plan.days[0], index: 0 });
                setPlayerOpen(true);
              }}
              className="w-full h-14 rounded-2xl text-base font-semibold gap-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
              size="lg"
            >
              <Play className="h-5 w-5" />
              ▶ Start Workout
            </Button>
          </motion.div>

          {/* Header */}
          <div className="mb-8 text-center relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10"
            >
              <Dumbbell className="h-6 w-6 text-primary" />
            </motion.div>
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">Your Workout Plan</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{plan.summary}</p>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1 text-xs font-medium">
                <Target className="h-3 w-3" /> {capitalize(input.goal)}
              </Badge>
              <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1 text-xs font-medium">
                <TrendingUp className="h-3 w-3" /> {capitalize(input.experience)}
              </Badge>
              <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1 text-xs font-medium">
                <Zap className="h-3 w-3" /> {capitalize(input.energyLevel)} energy
              </Badge>
              {input.cyclePhase !== "prefer not to say" && (
                <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1 text-xs font-medium">
                  <Moon className="h-3 w-3" /> {capitalize(input.cyclePhase)}
                </Badge>
              )}
            </div>
          </div>

          {/* Split label */}
          <div className="mb-5 flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {plan.split}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Days */}
          <div className="mb-8 space-y-3">
            {plan.days.map((day, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="group rounded-2xl border border-border/60 bg-secondary/30 p-5 transition-colors hover:bg-secondary/60"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <h3 className="font-semibold">{day.focus}</h3>
                    {/* Watch & Follow badge */}
                    <button
                      onClick={() => openVideoForDay(day, i)}
                      className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-0.5 text-[10px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Video className="h-3 w-3" />
                      Watch & Follow
                    </button>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {day.sets}
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3" /> {day.rest}
                    </span>
                  </div>
                </div>

                {/* Mobile meta */}
                <div className="flex sm:hidden items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {day.sets}
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="h-3 w-3" /> {day.rest}
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {day.exercises.map((ex, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-foreground/80">
                      <ExerciseIcon name={ex} />
                      {ex}
                    </div>
                  ))}
                </div>

                {/* Video thumbnail preview */}
                <VideoThumbnail
                  videoId={video.id}
                  onClick={() => openVideoForDay(day, i)}
                />
              </motion.div>
            ))}
          </div>

          {/* Insight cards */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border/40 bg-warm-beige/60 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Flame className="h-4 w-4 text-primary" />
                Intensity
              </div>
              <p className="text-sm leading-relaxed text-foreground/75">{plan.intensityNote}</p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-blush/50 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Heart className="h-4 w-4 text-primary" />
                Cycle-Aware Insight
              </div>
              <p className="text-sm leading-relaxed text-foreground/75">{plan.cycleNote}</p>
            </div>
          </div>

          {/* Motivation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-5 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-center"
          >
            <Sparkles className="mx-auto mb-2 h-5 w-5 text-accent-foreground/70" />
            <p className="text-base font-medium italic text-accent-foreground/90">
              {plan.motivation}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Video Modal */}
      {modalDay && (
        <VideoModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          videoId={video.id}
          videoTitle={video.title}
          day={modalDay.day}
          dayIndex={modalDay.index}
        />
      )}

      {/* Workout Player */}
      {playerDay && (
        <WorkoutPlayer
          open={playerOpen}
          onClose={() => setPlayerOpen(false)}
          day={playerDay.day}
          dayIndex={playerDay.index}
        />
      )}
    </>
  );
};

export default ResultsSection;
