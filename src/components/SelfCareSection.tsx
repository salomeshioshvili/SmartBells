import { motion } from "framer-motion";
import {
  Droplets,
  Flame,
  Moon,
  Wind,
  Heart,
  Info,
  Flower2,
  Spline,
  RotateCcw,
  Shield,
  Footprints,
} from "lucide-react";

const exercises = [
  {
    name: "Child's Pose",
    description: "Helps relax the lower back and reduce abdominal tension.",
    benefit: "Lower back relief",
    icon: Flower2,
    bg: "bg-blush",
    color: "text-primary",
  },
  {
    name: "Cat-Cow Stretch",
    description: "Encourages gentle spinal movement and may reduce stiffness.",
    benefit: "Spinal mobility",
    icon: Spline,
    bg: "bg-lavender/30",
    color: "text-accent-foreground",
  },
  {
    name: "Supine Twist",
    description: "Helps relieve lower back pressure and improve circulation.",
    benefit: "Circulation boost",
    icon: RotateCcw,
    bg: "bg-warm-beige",
    color: "text-primary",
  },
  {
    name: "Knees-to-Chest",
    description: "May help ease abdominal pressure and reduce cramping.",
    benefit: "Cramp relief",
    icon: Shield,
    bg: "bg-blush",
    color: "text-accent-foreground",
  },
  {
    name: "Gentle Walking",
    description: "Light movement that supports circulation and reduces fatigue.",
    benefit: "Energy support",
    icon: Footprints,
    bg: "bg-lavender/30",
    color: "text-primary",
  },
];

const tips = [
  { text: "Stay hydrated", icon: Droplets },
  { text: "Use gentle heat therapy", icon: Flame },
  { text: "Prioritize rest & sleep", icon: Moon },
  { text: "Try light stretching", icon: Heart },
  { text: "Practice deep breathing", icon: Wind },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
  }),
};

const SelfCareSection = () => (
  <section className="mx-auto max-w-5xl px-4 py-16 md:py-20">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-10 text-center"
    >
      <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Care &amp; Self-Care
      </h2>
      <p className="mx-auto max-w-xl text-muted-foreground">
        Support your body with gentle movement and recovery tips throughout your
        cycle.
      </p>
    </motion.div>

    {/* Exercise cards */}
    <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {exercises.map((ex, i) => (
        <motion.div
          key={ex.name}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="group glass-card rounded-2xl p-5 transition-shadow hover:shadow-xl hover:shadow-primary/10"
        >
          <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${ex.bg}`}>
            <ex.icon className={`h-5 w-5 ${ex.color}`} strokeWidth={1.8} />
          </div>
          <h3 className="mb-1 text-sm font-semibold text-foreground">
            {ex.name}
          </h3>
          <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
            {ex.description}
          </p>
          <span className="inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground">
            {ex.benefit}
          </span>
        </motion.div>
      ))}
    </div>

    {/* Self-care tips */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mb-8"
    >
      <h3 className="mb-5 text-center text-lg font-semibold text-foreground">
        Quick Self-Care Tips
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {tips.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={tip.text}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/70 px-4 py-3 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md hover:shadow-primary/5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lavender/30">
                <Icon className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground/85">
                {tip.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>

    {/* Disclaimer */}
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mx-auto flex max-w-md items-start gap-1.5 text-center text-[11px] leading-relaxed text-muted-foreground/70"
    >
      <Info className="mt-0.5 h-3 w-3 flex-shrink-0" />
      These exercises and tips are general wellness suggestions and not medical
      advice.
    </motion.p>
  </section>
);

export default SelfCareSection;
