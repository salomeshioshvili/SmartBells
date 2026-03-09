import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const HeroSection = () => (
  <section className="relative overflow-hidden px-4 pt-20 pb-16 text-center md:pt-32 md:pb-24">
    {/* Decorative blobs */}
    <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blush opacity-60 blur-3xl" />
    <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-lavender opacity-40 blur-3xl animate-float" />
    
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative z-10 mx-auto max-w-2xl"
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" />
        AI-Powered Fitness
      </div>
      <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">
        HerFit <span className="text-primary">AI</span>
      </h1>
      <p className="mb-3 text-xl font-medium text-foreground/80 md:text-2xl">
        Personalized workout plans designed for women.
      </p>
      <p className="mx-auto max-w-lg text-muted-foreground">
        Generate fitness routines based on your goals, experience, energy, and lifestyle.
      </p>
    </motion.div>
  </section>
);

export default HeroSection;
