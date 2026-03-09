import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

const HeroSection = () => (
  <section className="relative overflow-hidden px-4 pt-24 pb-20 text-center md:pt-32 md:pb-24">
    {/* Background decoration */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blush opacity-50 blur-[100px]" />
      <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-lavender opacity-30 blur-[100px] animate-float" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/5 blur-[80px]" />
    </div>

    <div className="relative z-10 mx-auto max-w-4xl flex flex-col md:flex-row items-center gap-6 md:gap-10">
      {/* Lottie — centered above text on mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="order-first md:order-last flex-shrink-0"
      >
        <img
          src={kettlebellImg}
          alt="Pink kettlebell"
          className="w-[280px] h-[280px] object-contain drop-shadow-xl"
        />
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 md:text-left"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/60 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-primary shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          AI-Powered Fitness for Women
        </motion.div>

        <h1 className="mb-5 text-5xl font-extrabold tracking-tight md:text-7xl">
          Smart<span className="gradient-text">Bells</span>
        </h1>

        <p className="mb-4 text-xl font-medium text-foreground/75 md:text-2xl">
          Personalized workout plans designed for women.
        </p>
        <p className="max-w-md text-base text-muted-foreground leading-relaxed md:mx-0 mx-auto">
          Generate science-backed fitness routines tailored to your goals, experience, energy, and cycle.
        </p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase text-muted-foreground/60 md:justify-start justify-center"
        >
          <Heart className="h-3 w-3" />
          Start building your plan below
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
