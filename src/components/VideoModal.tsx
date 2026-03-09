import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DayPlan } from "@/lib/workoutGenerator";

interface Props {
  open: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
  day: DayPlan;
  dayIndex: number;
}

const VideoModal = ({ open, onClose, videoId, videoTitle, day, dayIndex }: Props) => {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-foreground/70 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[850px] max-h-[90vh] overflow-y-auto rounded-3xl bg-card shadow-2xl border border-border/40"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 rounded-full bg-card/80 backdrop-blur-md hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 md:px-8 md:pt-8">
              <div className="flex items-center gap-2 mb-1">
                <Play className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Follow Along
                </span>
              </div>
              <h3 className="text-xl font-bold md:text-2xl">
                Day {dayIndex + 1}: {day.focus}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{videoTitle}</p>
            </div>

            {/* YouTube embed */}
            <div className="px-6 md:px-8">
              <div className="relative w-full overflow-hidden rounded-2xl bg-foreground/5" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 h-full w-full rounded-2xl"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Exercise checklist */}
            <div className="px-6 pb-6 pt-5 md:px-8 md:pb-8">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Today's Exercises</span>
                <span className="ml-auto text-xs text-muted-foreground">{day.sets}</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                {day.exercises.map((ex, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 rounded-xl bg-secondary/40 px-4 py-2.5 text-sm"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {j + 1}
                    </span>
                    <span className="text-foreground/85">{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
