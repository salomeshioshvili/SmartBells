import { motion, AnimatePresence } from "framer-motion";

interface Props {
  visible: boolean;
}

const dotVariants = {
  animate: (i: number) => ({
    y: [0, -12, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay: i * 0.15,
      ease: "easeInOut" as const,
    },
  }),
};

const dots = [
  "bg-primary/50",       /* light pink */
  "bg-primary/70",       /* medium pink */
  "bg-primary",          /* full pink */
  "bg-primary/70",
  "bg-primary/50",
];

const LoadingOverlay = ({ visible }: Props) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-2xl px-4 pb-20"
      >
        <div className="glass-card rounded-3xl p-10 flex flex-col items-center justify-center min-h-[320px]">
          <div className="flex items-center gap-2.5">
            {dots.map((cls, i) => (
              <motion.div
                key={i}
                custom={i}
                animate="animate"
                variants={dotVariants}
                className={`h-4 w-4 rounded-full ${cls}`}
              />
            ))}
          </div>
          <p className="mt-6 text-base font-medium text-primary animate-pulse">
            Building your personalized plan…
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default LoadingOverlay;
