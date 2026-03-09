import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipBack, SkipForward, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DayPlan } from "@/lib/workoutGenerator";

// ── Exercise animation types ──
type AnimType = "squats" | "lunges" | "pushups" | "jumpingjacks" | "plank" | "deadlift" | "generic";

function classifyExercise(name: string): AnimType {
  const n = name.toLowerCase();
  if (n.includes("squat") || n.includes("goblet")) return "squats";
  if (n.includes("lunge") || n.includes("split squat") || n.includes("curtsy") || n.includes("step-up") || n.includes("step up")) return "lunges";
  if (n.includes("push-up") || n.includes("push up") || n.includes("pushup") || n.includes("chest") || n.includes("press") && !n.includes("leg")) return "pushups";
  if (n.includes("jack") || n.includes("jump") || n.includes("burpee") || n.includes("star") || n.includes("high knee") || n.includes("mountain")) return "jumpingjacks";
  if (n.includes("plank") || n.includes("hold") || n.includes("wall sit") || n.includes("superman")) return "plank";
  if (n.includes("deadlift") || n.includes("hip thrust") || n.includes("hinge") || n.includes("row") || n.includes("pull") || n.includes("swing")) return "deadlift";
  return "generic";
}

// ── CSS for stick figure animations ──
const playerStyles = `
  .figure-container {
    position: relative;
    width: 120px;
    height: 200px;
    margin: 0 auto;
  }
  .fig-head {
    position: absolute;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: hsl(var(--primary));
    top: 0; left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 20px hsl(var(--primary) / 0.4);
  }
  .fig-body {
    position: absolute;
    width: 6px; height: 60px;
    background: hsl(var(--primary));
    border-radius: 3px;
    top: 32px; left: 50%;
    transform: translateX(-50%);
    transform-origin: top center;
  }
  .fig-arm {
    position: absolute;
    width: 6px; height: 45px;
    background: hsl(var(--primary) / 0.85);
    border-radius: 3px;
    top: 38px;
    transform-origin: top center;
  }
  .fig-arm.left { left: calc(50% - 16px); }
  .fig-arm.right { left: calc(50% + 10px); }
  .fig-leg {
    position: absolute;
    width: 6px; height: 55px;
    background: hsl(var(--primary) / 0.85);
    border-radius: 3px;
    top: 90px;
    transform-origin: top center;
  }
  .fig-leg.left { left: calc(50% - 12px); }
  .fig-leg.right { left: calc(50% + 6px); }

  /* Squat */
  .anim-squats .fig-leg { animation: squat-legs 1.6s ease-in-out infinite; }
  .anim-squats .fig-body { animation: squat-body 1.6s ease-in-out infinite; }
  .anim-squats .fig-head { animation: squat-head 1.6s ease-in-out infinite; }
  @keyframes squat-legs { 0%,100% { height:55px; } 50% { height:35px; } }
  @keyframes squat-body { 0%,100% { height:60px; } 50% { height:42px; } }
  @keyframes squat-head { 0%,100% { top:0; } 50% { top:18px; } }

  /* Lunges */
  .anim-lunges .fig-leg.left { animation: lunge-left 2s ease-in-out infinite; }
  .anim-lunges .fig-leg.right { animation: lunge-right 2s ease-in-out infinite; }
  .anim-lunges .fig-head { animation: lunge-head 2s ease-in-out infinite; }
  @keyframes lunge-left { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-30deg); } }
  @keyframes lunge-right { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(25deg); } }
  @keyframes lunge-head { 0%,100% { top:0; } 50% { top:14px; } }

  /* Pushups */
  .anim-pushups { transform: rotate(80deg) scale(0.85); transform-origin: center; }
  .anim-pushups .fig-arm { animation: pushup-arms 1.4s ease-in-out infinite; }
  .anim-pushups .fig-body { animation: pushup-body 1.4s ease-in-out infinite; }
  @keyframes pushup-arms { 0%,100% { height:45px; } 50% { height:30px; } }
  @keyframes pushup-body { 0%,100% { transform: translateX(-50%) rotate(0deg); } 50% { transform: translateX(-50%) rotate(5deg); } }

  /* Jumping Jacks */
  .anim-jumpingjacks .fig-arm.left { animation: jj-arm-l 0.8s ease-in-out infinite; }
  .anim-jumpingjacks .fig-arm.right { animation: jj-arm-r 0.8s ease-in-out infinite; }
  .anim-jumpingjacks .fig-leg.left { animation: jj-leg-l 0.8s ease-in-out infinite; }
  .anim-jumpingjacks .fig-leg.right { animation: jj-leg-r 0.8s ease-in-out infinite; }
  .anim-jumpingjacks .fig-head { animation: jj-head 0.8s ease-in-out infinite; }
  @keyframes jj-arm-l { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-60deg); } }
  @keyframes jj-arm-r { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(60deg); } }
  @keyframes jj-leg-l { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-25deg); } }
  @keyframes jj-leg-r { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(25deg); } }
  @keyframes jj-head { 0%,100% { top:0; } 50% { top:-8px; } }

  /* Plank */
  .anim-plank { transform: rotate(80deg) scale(0.85); transform-origin: center; }
  .anim-plank .fig-body { animation: plank-pulse 2s ease-in-out infinite; }
  @keyframes plank-pulse { 0%,100% { opacity:1; } 50% { opacity:0.7; } }

  /* Deadlift */
  .anim-deadlift .fig-body { animation: dl-body 2s ease-in-out infinite; }
  .anim-deadlift .fig-head { animation: dl-head 2s ease-in-out infinite; }
  .anim-deadlift .fig-arm { animation: dl-arms 2s ease-in-out infinite; }
  @keyframes dl-body { 0%,100% { transform: translateX(-50%) rotate(0deg); } 50% { transform: translateX(-50%) rotate(45deg); } }
  @keyframes dl-head { 0%,100% { top:0; left:50%; } 50% { top:30px; left:calc(50% + 20px); } }
  @keyframes dl-arms { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(30deg); } }

  /* Generic */
  .anim-generic .fig-arm.left { animation: gen-arm 1.2s ease-in-out infinite; }
  .anim-generic .fig-arm.right { animation: gen-arm 1.2s ease-in-out infinite reverse; }
  @keyframes gen-arm { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-40deg); } }

  /* Confetti */
  .confetti-piece {
    position: absolute;
    width: 8px; height: 8px;
    border-radius: 2px;
    animation: confetti-fall 3s ease-in forwards;
    opacity: 0;
  }
  @keyframes confetti-fall {
    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
`;

const StickFigure = ({ animType }: { animType: AnimType }) => (
  <div className={`figure-container anim-${animType}`}>
    <div className="fig-head" />
    <div className="fig-body" />
    <div className="fig-arm left" />
    <div className="fig-arm right" />
    <div className="fig-leg left" />
    <div className="fig-leg right" />
  </div>
);

const ConfettiEffect = () => {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--primary) / 0.6)",
    "#FFD700",
    "#FF69B4",
    "#87CEEB",
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 20}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 2}s`,
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
};

interface WorkoutPlayerProps {
  open: boolean;
  onClose: () => void;
  day: DayPlan;
  dayIndex: number;
  onComplete?: () => void;
}

interface ExerciseStep {
  name: string;
  animType: AnimType;
  sets: number;
  reps: number;
  totalSeconds: number;
}

function parseSetsReps(setsStr: string): { sets: number; reps: number } {
  // "3-4 sets × 8-12 reps" → take first number of each
  const setsMatch = setsStr.match(/(\d+)/);
  const repsMatch = setsStr.match(/×\s*(\d+)/);
  return {
    sets: setsMatch ? parseInt(setsMatch[1]) : 3,
    reps: repsMatch ? parseInt(repsMatch[1]) : 10,
  };
}

const REST_SECONDS = 15;

const WorkoutPlayer = ({ open, onClose, day, dayIndex, onComplete }: WorkoutPlayerProps) => {
  const { sets, reps } = parseSetsReps(day.sets);

  const exercises: ExerciseStep[] = day.exercises.map((name) => ({
    name,
    animType: classifyExercise(name),
    sets,
    reps,
    // ~4 seconds per rep, per set
    totalSeconds: sets * reps * 4,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.totalSeconds ?? 30);
  const [restTime, setRestTime] = useState(REST_SECONDS);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalExercises = exercises.length;
  const progress = isComplete ? 100 : ((currentIndex + (isResting ? 0.5 : 0)) / totalExercises) * 100;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (!open || isPaused || isComplete) return;
    clearTimer();

    intervalRef.current = setInterval(() => {
      if (isResting) {
        setRestTime((t) => {
          if (t <= 1) {
            setIsResting(false);
            const nextIdx = currentIndex + 1;
            if (nextIdx >= totalExercises) {
              setIsComplete(true);
              onComplete?.();
              return REST_SECONDS;
            }
            setCurrentIndex(nextIdx);
            setTimeLeft(exercises[nextIdx].totalSeconds);
            return REST_SECONDS;
          }
          return t - 1;
        });
      } else {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsResting(true);
            setRestTime(REST_SECONDS);
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);

    return clearTimer;
  }, [open, isPaused, isResting, currentIndex, isComplete, totalExercises, exercises, clearTimer, onComplete]);

  const goNext = () => {
    if (currentIndex + 1 >= totalExercises) {
      setIsComplete(true);
      onComplete?.();
      return;
    }
    setIsResting(false);
    const next = currentIndex + 1;
    setCurrentIndex(next);
    setTimeLeft(exercises[next].totalSeconds);
    setRestTime(REST_SECONDS);
  };

  const goPrev = () => {
    if (currentIndex <= 0) return;
    setIsResting(false);
    const prev = currentIndex - 1;
    setCurrentIndex(prev);
    setTimeLeft(exercises[prev].totalSeconds);
    setRestTime(REST_SECONDS);
  };

  const reset = () => {
    setCurrentIndex(0);
    setIsResting(false);
    setIsPaused(false);
    setIsComplete(false);
    setTimeLeft(exercises[0]?.totalSeconds ?? 30);
    setRestTime(REST_SECONDS);
  };

  // Reset state when opened
  useEffect(() => {
    if (open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const current = exercises[currentIndex];

  return (
    <>
      <style>{playerStyles}</style>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1020]/95 backdrop-blur-md"
          >
            {/* Close */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>

            {isComplete ? (
              /* ── Completion Screen ── */
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative text-center px-6 max-w-md"
              >
                <ConfettiEffect />
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="relative z-10"
                >
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 border-2 border-primary/40">
                    <Trophy className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-3">Workout Complete! 🎉</h2>
                  <p className="text-white/60 mb-2">
                    Day {dayIndex + 1}: {day.focus}
                  </p>
                  <p className="text-white/40 text-sm mb-8">
                    You crushed {totalExercises} exercises. Amazing work!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={reset}
                      variant="outline"
                      className="rounded-full border-white/20 text-white hover:bg-white/10"
                    >
                      Restart
                    </Button>
                    <Button
                      onClick={onClose}
                      className="rounded-full bg-primary hover:bg-primary/90"
                    >
                      Done
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* ── Active Player ── */
              <div className="w-full max-w-lg px-6 flex flex-col items-center">
                {/* Day label */}
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
                  Day {dayIndex + 1} — {day.focus}
                </p>

                {isResting ? (
                  /* Rest screen */
                  <motion.div
                    key="rest"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <p className="text-white/50 text-sm uppercase tracking-widest mb-4">Rest</p>
                    <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
                      <svg className="absolute inset-0" viewBox="0 0 128 128">
                        <circle cx="64" cy="64" r="58" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="6" />
                        <circle
                          cx="64" cy="64" r="58" fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 58}`}
                          strokeDashoffset={`${2 * Math.PI * 58 * (1 - restTime / REST_SECONDS)}`}
                          transform="rotate(-90 64 64)"
                          style={{ transition: "stroke-dashoffset 1s linear" }}
                        />
                      </svg>
                      <span className="text-4xl font-bold text-white">{restTime}</span>
                    </div>
                    <p className="text-white/40 text-sm">
                      Next: <span className="text-white/70 font-medium">{exercises[currentIndex + 1]?.name ?? "Done!"}</span>
                    </p>
                  </motion.div>
                ) : (
                  /* Exercise screen */
                  <motion.div
                    key={`ex-${currentIndex}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="text-center w-full"
                  >
                    {/* Exercise name */}
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {current.name}
                    </h2>
                    <p className="text-white/40 text-sm mb-8">
                      {current.sets} sets × {current.reps} reps
                    </p>

                    {/* Stick figure */}
                    <div className="mb-8 flex justify-center items-center h-[220px]">
                      <StickFigure animType={current.animType} />
                    </div>

                    {/* Timer */}
                    <div className="text-5xl font-mono font-bold text-primary mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <p className="text-white/30 text-xs">
                      Exercise {currentIndex + 1} of {totalExercises}
                    </p>
                  </motion.div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-4 mt-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goPrev}
                    disabled={currentIndex === 0 && !isResting}
                    className="rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => setIsPaused(!isPaused)}
                    className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
                  >
                    {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goNext}
                    className="rounded-full text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="w-full mt-8">
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-white/30 text-xs mt-1.5 text-right">{Math.round(progress)}% complete</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WorkoutPlayer;
