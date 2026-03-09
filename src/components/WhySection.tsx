import { motion } from "framer-motion";
import { Info, CheckCircle2 } from "lucide-react";

const points = [
  "Exercise selection adapted for female biomechanics",
  "Cycle-phase awareness for smarter periodization",
  "Energy-sensitive intensity recommendations",
];

const WhySection = () => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="mx-auto max-w-2xl px-4 pb-20"
  >
    <div className="rounded-3xl border border-accent/30 bg-accent/[0.06] p-7 md:p-9">
      <div className="mb-4 flex items-center gap-2.5 text-accent-foreground">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20">
          <Info className="h-4.5 w-4.5" />
        </div>
        <h2 className="text-xl font-bold">Why This Matters</h2>
      </div>
      <p className="mb-5 leading-relaxed text-foreground/75">
        Many fitness plans are built on male-centered training assumptions.
        Women's bodies respond differently to training, and factors like hormonal cycles
        significantly impact energy and recovery.{" "}
        <strong className="text-foreground">
          HerFit AI offers a women-aware starting point.
        </strong>
      </p>
      <ul className="space-y-2.5">
        {points.map((pt) => (
          <li key={pt} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            {pt}
          </li>
        ))}
      </ul>
    </div>
  </motion.section>
);

export default WhySection;
