import { motion, AnimatePresence } from "framer-motion";

interface Props {
  visible: boolean;
}

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
          <lottie-player
            src="https://assets9.lottiefiles.com/packages/lf20_p8bfn5to.json"
            background="transparent"
            speed="1"
            style={{ width: "180px", height: "180px" }}
            loop
            autoplay
          />
          <p className="mt-4 text-base font-medium text-primary animate-pulse">
            Building your personalized plan…
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default LoadingOverlay;
