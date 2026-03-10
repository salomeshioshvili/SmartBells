import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SVGCharacter,
  MuscleDiagram,
  classifyExercise,
  getMuscleGradient,
} from "@/components/WorkoutPlayer";

/* ═══════════════════════════════════════════════════════════════════
   FORM TIPS — short coaching cues per animation type
   ═══════════════════════════════════════════════════════════════════ */
const formTips: Record<string, string> = {
  squats: "Keep your chest up, push your knees out over your toes, and drive through your heels.",
  lunges: "Step forward with control, keep your torso upright, and lower until your back knee nearly touches the ground.",
  pushups: "Keep your core tight, elbows at 45°, and lower with control until your chest is near the floor.",
  jumpingjacks: "Land softly on the balls of your feet, keep a steady rhythm, and fully extend your arms overhead.",
  plank: "Squeeze your glutes and core, keep a straight line from head to heels, and breathe steadily.",
  glutebridges: "Drive through your heels, squeeze your glutes at the top, and keep your core engaged throughout.",
  deadlift: "Hinge at the hips, keep your back flat, and push the floor away with your feet.",
  donkeykicks: "Keep your core braced, avoid arching your lower back, and squeeze your glute at the top.",
  pulldown: "Keep your torso upright, pull your elbows down and back, and squeeze your lats at the bottom.",
  rows: "Retract your shoulder blades, pull toward your lower chest, and keep your core stable.",
  dips: "Lower with control, keep your elbows close to your body, and press up through your palms.",
  curls: "Pin your elbows to your sides, curl with control, and avoid swinging your body.",
  lateralraise: "Lead with your elbows, raise to shoulder height, and lower slowly with control.",
  generic: "Focus on controlled movement, proper breathing, and maintaining good posture throughout.",
};

interface ExercisePreviewModalProps {
  open: boolean;
  onClose: () => void;
  exerciseName: string;
  sets: string;
  /** All exercises in the same day, for prev/next nav */
  allExercises?: string[];
  onNavigate?: (exerciseName: string) => void;
}

const ExercisePreviewModal = ({
  open,
  onClose,
  exerciseName,
  sets,
  allExercises,
  onNavigate,
}: ExercisePreviewModalProps) => {
  const { anim, muscles, needsDumbbells, needsBand } = classifyExercise(exerciseName);
  const [gradA, gradB] = getMuscleGradient(muscles);
  const isFloor = ["pushups", "plank", "glutebridges", "donkeykicks"].includes(anim);
  const tip = formTips[anim] || formTips.generic;

  // Parse sets string for display
  const setsMatch = sets.match(/(\d+)[-–]?(\d+)?\s*sets?\s*[×x]\s*(\d+)[-–]?(\d+)?\s*reps?/i);
  const setsDisplay = setsMatch ? `${setsMatch[1]}${setsMatch[2] ? `–${setsMatch[2]}` : ""} sets × ${setsMatch[3]}${setsMatch[4] ? `–${setsMatch[4]}` : ""} reps` : sets;

  // Nav
  const currentIndex = allExercises?.indexOf(exerciseName) ?? -1;
  const hasPrev = allExercises && currentIndex > 0;
  const hasNext = allExercises && currentIndex >= 0 && currentIndex < allExercises.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg"
          style={{ background: `linear-gradient(160deg, ${gradA} 0%, ${gradB} 100%)` }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Close */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg px-4 md:px-8 flex flex-col items-center"
          >
            {/* Label */}
            <p className="text-white/30 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Exercise Preview
            </p>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={exerciseName}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-2xl md:text-3xl font-bold text-white text-center mb-1"
              >
                {exerciseName}
              </motion.h2>
            </AnimatePresence>

            {/* Sets/Reps */}
            <p className="text-white/40 text-sm text-center mb-5">{setsDisplay}</p>

            {/* Animation + Muscle diagram */}
            <div className="flex items-center justify-center gap-6 md:gap-8 mb-5">
              <div className="hidden md:flex flex-col items-center gap-2">
                <MuscleDiagram active={muscles} />
                <div className="flex flex-wrap gap-1 max-w-[80px] justify-center">
                  {muscles.map((m) => (
                    <span
                      key={m}
                      className="text-[9px] font-medium text-primary/80 bg-primary/10 rounded px-1.5 py-0.5 capitalize"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={exerciseName}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center items-center"
                >
                  <SVGCharacter
                    animType={anim}
                    paused={false}
                    isFloor={isFloor}
                    needsDumbbells={needsDumbbells}
                    needsBand={needsBand}
                    faceState="exertion"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Mobile muscle tags */}
              <div className="flex md:hidden flex-col items-center gap-1.5">
                <Target className="h-4 w-4 text-white/30" />
                <div className="flex flex-col gap-1">
                  {muscles.map((m) => (
                    <span
                      key={m}
                      className="text-[9px] font-medium text-primary/80 bg-primary/10 rounded px-1.5 py-0.5 capitalize text-center"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Tip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full rounded-2xl bg-white/[0.06] border border-white/[0.08] px-5 py-4 mb-5"
            >
              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
                Form Tip
              </p>
              <p className="text-white/70 text-sm leading-relaxed">{tip}</p>
            </motion.div>

            {/* Navigation */}
            {allExercises && allExercises.length > 1 && (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!hasPrev}
                  onClick={() => hasPrev && onNavigate?.(allExercises[currentIndex - 1])}
                  className="rounded-full h-11 w-11 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-white/30 text-xs font-medium">
                  {currentIndex + 1} / {allExercises.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!hasNext}
                  onClick={() => hasNext && onNavigate?.(allExercises[currentIndex + 1])}
                  className="rounded-full h-11 w-11 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExercisePreviewModal;
