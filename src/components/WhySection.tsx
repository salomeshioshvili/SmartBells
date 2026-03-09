import { motion } from "framer-motion";
import { Info } from "lucide-react";

const WhySection = () => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="mx-auto max-w-2xl px-4 pb-16"
  >
    <div className="rounded-2xl border border-lavender/50 bg-lavender/10 p-6 md:p-8">
      <div className="mb-3 flex items-center gap-2 text-accent-foreground">
        <Info className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Why This Matters</h2>
      </div>
      <p className="leading-relaxed text-foreground/80">
        Many fitness plans are designed around male-centered training assumptions — 
        from exercise selection to recovery protocols. Women's bodies respond differently 
        to training stimuli, and factors like hormonal fluctuations throughout the menstrual 
        cycle can significantly impact energy, strength, and recovery.{" "}
        <strong className="text-foreground">
          HerFit AI offers a more personalized and women-aware starting point
        </strong>{" "}
        — because fitness should work <em>with</em> your body, not against it.
      </p>
    </div>
  </motion.section>
);

export default WhySection;
