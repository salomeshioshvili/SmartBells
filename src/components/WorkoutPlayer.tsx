import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipBack, SkipForward, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DayPlan } from "@/lib/workoutGenerator";

/* ═══════════════════════════════════════════════════════════════════
   TYPES & CLASSIFICATION
   ═══════════════════════════════════════════════════════════════════ */
type AnimType =
  | "squats" | "lunges" | "pushups" | "jumpingjacks"
  | "plank" | "glutebridges" | "deadlift" | "donkeykicks" | "generic";

type MuscleGroup = "legs" | "chest" | "back" | "shoulders" | "core" | "glutes" | "arms" | "full";

function classifyExercise(name: string): { anim: AnimType; muscles: MuscleGroup[] } {
  const n = name.toLowerCase();
  if (n.includes("squat") || n.includes("goblet") || n.includes("wall sit"))
    return { anim: "squats", muscles: ["legs", "glutes", "core"] };
  if (n.includes("lunge") || n.includes("split squat") || n.includes("curtsy") || n.includes("step-up") || n.includes("step up"))
    return { anim: "lunges", muscles: ["legs", "glutes"] };
  if (n.includes("push-up") || n.includes("push up") || n.includes("pushup") || n.includes("chest") || (n.includes("press") && !n.includes("leg")))
    return { anim: "pushups", muscles: ["chest", "arms", "shoulders"] };
  if (n.includes("jack") || n.includes("jump") || n.includes("burpee") || n.includes("star") || n.includes("high knee") || n.includes("mountain"))
    return { anim: "jumpingjacks", muscles: ["full"] };
  if (n.includes("plank") || n.includes("superman") || n.includes("crunch") || n.includes("bicycle"))
    return { anim: "plank", muscles: ["core"] };
  if (n.includes("glute bridge") || n.includes("hip thrust"))
    return { anim: "glutebridges", muscles: ["glutes", "core"] };
  if (n.includes("deadlift") || n.includes("hinge") || n.includes("row") || n.includes("pull") || n.includes("swing"))
    return { anim: "deadlift", muscles: ["back", "legs", "glutes"] };
  if (n.includes("donkey") || n.includes("kick") || n.includes("fire hydrant") || n.includes("clamshell"))
    return { anim: "donkeykicks", muscles: ["glutes"] };
  return { anim: "generic", muscles: ["full"] };
}

/* ═══════════════════════════════════════════════════════════════════
   MUSCLE-BASED GRADIENT BACKGROUNDS
   ═══════════════════════════════════════════════════════════════════ */
const muscleGradients: Record<string, [string, string]> = {
  legs: ["#2a1a2e", "#1e1028"],
  chest: ["#1e1530", "#2a1a35"],
  back: ["#1a1e30", "#151828"],
  shoulders: ["#251530", "#1e1028"],
  core: ["#151e30", "#101828"],
  glutes: ["#2e1a28", "#281020"],
  arms: ["#201530", "#1a1028"],
  full: ["#1e1525", "#151020"],
};

function getMuscleGradient(muscles: MuscleGroup[]): [string, string] {
  return muscleGradients[muscles[0]] || muscleGradients.full;
}

/* ═══════════════════════════════════════════════════════════════════
   SVG ANIMATED CHARACTER — requestAnimationFrame + sine waves
   ═══════════════════════════════════════════════════════════════════ */
const SKIN = "#F4A4A4";
const SKIN_SHADOW = "#E08E8E";
const OUTFIT = "#2D2D2D";
const OUTFIT_LIGHT = "#3D3D3D";
const HAIR = "#4A2C2A";
const SHOE = "#1A1A1A";

interface CharacterProps {
  animType: AnimType;
  breathing?: boolean;
  paused?: boolean;
}

const SVGCharacter = ({ animType, breathing, paused }: CharacterProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  const isFloor = ["pushups", "plank", "glutebridges", "donkeykicks"].includes(animType);

  useEffect(() => {
    if (paused) { cancelAnimationFrame(rafRef.current); return; }

    const animate = () => {
      tRef.current += 0.025;
      const t = tRef.current;
      const svg = svgRef.current;
      if (!svg) return;

      const s = Math.sin;
      const $ = (id: string) => svg.getElementById(id);

      if (breathing) {
        // Gentle breathing
        const b = s(t * 1.5) * 0.02 + 1;
        const torso = $("torso");
        if (torso) torso.setAttribute("transform", `scale(${b}, ${b})`);
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Reset transforms
      const ids = ["body-group", "head-g", "torso", "l-upper-arm", "l-forearm",
        "r-upper-arm", "r-forearm", "l-thigh", "l-shin", "r-thigh", "r-shin",
        "hip-g"];
      ids.forEach((id) => {
        const el = $(id);
        if (el) el.setAttribute("transform", "");
      });

      switch (animType) {
        case "squats": {
          const d = s(t * 2.5) * 0.5 + 0.5; // 0→1→0
          const drop = d * 35;
          const kneeAngle = d * 45;
          const armAngle = d * -50;
          $("body-group")?.setAttribute("transform", `translate(0, ${drop})`);
          $("l-thigh")?.setAttribute("transform", `rotate(${kneeAngle}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${-kneeAngle}, 0, 0)`);
          $("l-shin")?.setAttribute("transform", `rotate(${kneeAngle * 0.6}, 0, 0)`);
          $("r-shin")?.setAttribute("transform", `rotate(${kneeAngle * 0.6}, 0, 0)`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${armAngle}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${armAngle}, 0, 0)`);
          break;
        }
        case "lunges": {
          const d = s(t * 2) * 0.5 + 0.5;
          const drop = d * 25;
          $("body-group")?.setAttribute("transform", `translate(0, ${drop})`);
          $("l-thigh")?.setAttribute("transform", `rotate(${d * -35}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${d * 30}, 0, 0)`);
          $("l-shin")?.setAttribute("transform", `rotate(${d * 15}, 0, 0)`);
          $("r-shin")?.setAttribute("transform", `rotate(${d * -25}, 0, 0)`);
          $("torso")?.setAttribute("transform", `rotate(${d * 5}, 0, 0)`);
          break;
        }
        case "pushups": {
          const d = s(t * 2.2) * 0.5 + 0.5;
          const armBend = d * 30;
          $("l-upper-arm")?.setAttribute("transform", `rotate(${armBend}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${-armBend}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${armBend * 0.8}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${-armBend * 0.8}, 0, 0)`);
          $("head-g")?.setAttribute("transform", `rotate(${d * 5}, 0, 0)`);
          $("body-group")?.setAttribute("transform", `translate(0, ${d * 8})`);
          break;
        }
        case "jumpingjacks": {
          const d = s(t * 4) * 0.5 + 0.5;
          const armAng = d * 160 - 80;
          const legAng = d * 25;
          const jump = s(t * 4) * -8;
          $("body-group")?.setAttribute("transform", `translate(0, ${jump})`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${-armAng}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${armAng}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${-d * 20}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${d * 20}, 0, 0)`);
          $("l-thigh")?.setAttribute("transform", `rotate(${-legAng}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${legAng}, 0, 0)`);
          break;
        }
        case "plank": {
          const b = s(t * 1.5) * 0.015 + 1;
          $("torso")?.setAttribute("transform", `scale(1, ${b})`);
          break;
        }
        case "glutebridges": {
          const d = s(t * 2) * 0.5 + 0.5;
          $("hip-g")?.setAttribute("transform", `translate(0, ${-d * 20})`);
          $("torso")?.setAttribute("transform", `rotate(${-d * 10}, 0, 0)`);
          $("l-thigh")?.setAttribute("transform", `rotate(${-d * 20}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${-d * 20}, 0, 0)`);
          break;
        }
        case "deadlift": {
          const d = s(t * 1.8) * 0.5 + 0.5;
          const hingeAngle = d * 55;
          $("torso")?.setAttribute("transform", `rotate(${hingeAngle}, 0, 0)`);
          $("head-g")?.setAttribute("transform", `rotate(${hingeAngle * 0.3}, 0, 0)`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${d * 25}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${d * 25}, 0, 0)`);
          $("l-thigh")?.setAttribute("transform", `rotate(${-d * 10}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${-d * 10}, 0, 0)`);
          break;
        }
        case "donkeykicks": {
          const d = s(t * 2.5) * 0.5 + 0.5;
          $("r-thigh")?.setAttribute("transform", `rotate(${-d * 55}, 0, 0)`);
          $("r-shin")?.setAttribute("transform", `rotate(${-d * 30}, 0, 0)`);
          $("torso")?.setAttribute("transform", `scale(1, ${1 + s(t * 2.5) * 0.01})`);
          break;
        }
        default: {
          // Generic — gentle sway
          const armSwing = s(t * 2) * 20;
          $("l-upper-arm")?.setAttribute("transform", `rotate(${armSwing}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${-armSwing}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${s(t * 2) * 10}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${-s(t * 2) * 10}, 0, 0)`);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animType, breathing, paused]);

  // Standing figure dimensions — pivot points for limb groups
  const cx = 100; // center x
  const headY = 18;
  const neckY = 42;
  const shoulderY = 52;
  const torsoBottom = 110;
  const hipY = 115;

  const standingFigure = (
    <g id="body-group">
      {/* ── Shadow on floor ── */}
      <ellipse cx={cx} cy={245} rx={30} ry={6} fill="rgba(0,0,0,0.15)" />

      {/* ── Hair (ponytail) ── */}
      <g id="head-g" style={{ transformOrigin: `${cx}px ${neckY}px` }}>
        <ellipse cx={cx} cy={headY} rx={16} ry={18} fill={SKIN} />
        {/* Hair top */}
        <path d={`M${cx - 14},${headY - 4} Q${cx - 16},${headY - 18} ${cx},${headY - 20} Q${cx + 16},${headY - 18} ${cx + 14},${headY - 4}`} fill={HAIR} />
        {/* Ponytail */}
        <path d={`M${cx + 10},${headY - 8} Q${cx + 28},${headY - 4} ${cx + 24},${headY + 16} Q${cx + 20},${headY + 24} ${cx + 14},${headY + 10}`} fill={HAIR} stroke={HAIR} strokeWidth="1" />
        {/* Eyes */}
        <circle cx={cx - 5} cy={headY} r={1.5} fill="#333" />
        <circle cx={cx + 5} cy={headY} r={1.5} fill="#333" />
        {/* Smile */}
        <path d={`M${cx - 3},${headY + 5} Q${cx},${headY + 8} ${cx + 3},${headY + 5}`} fill="none" stroke="#C07070" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* ── Neck ── */}
      <rect x={cx - 4} y={neckY - 6} width={8} height={12} rx={3} fill={SKIN} />

      {/* ── Torso (sports bra + waist) ── */}
      <g id="torso" style={{ transformOrigin: `${cx}px ${shoulderY}px` }}>
        {/* Sports bra */}
        <path d={`M${cx - 18},${shoulderY} Q${cx - 20},${shoulderY + 22} ${cx - 14},${shoulderY + 28} L${cx + 14},${shoulderY + 28} Q${cx + 20},${shoulderY + 22} ${cx + 18},${shoulderY}`} fill={OUTFIT} />
        {/* Midriff skin */}
        <rect x={cx - 14} y={shoulderY + 28} width={28} height={14} rx={4} fill={SKIN} />
        {/* Waist/hips */}
        <g id="hip-g" style={{ transformOrigin: `${cx}px ${hipY}px` }}>
          <path d={`M${cx - 16},${shoulderY + 40} Q${cx - 18},${torsoBottom} ${cx - 16},${hipY} L${cx + 16},${hipY} Q${cx + 18},${torsoBottom} ${cx + 16},${shoulderY + 40}`} fill={OUTFIT} />
        </g>
      </g>

      {/* ── Left Arm ── */}
      <g id="l-upper-arm" style={{ transformOrigin: `${cx - 18}px ${shoulderY + 2}px` }}>
        <rect x={cx - 23} y={shoulderY} width={10} height={32} rx={5} fill={SKIN} />
        {/* Forearm */}
        <g id="l-forearm" style={{ transformOrigin: `${cx - 23}px ${shoulderY + 30}px` }}>
          <rect x={cx - 22} y={shoulderY + 28} width={9} height={28} rx={4.5} fill={SKIN_SHADOW} />
          {/* Hand */}
          <ellipse cx={cx - 17.5} cy={shoulderY + 58} rx={5} ry={4} fill={SKIN} />
        </g>
      </g>

      {/* ── Right Arm ── */}
      <g id="r-upper-arm" style={{ transformOrigin: `${cx + 18}px ${shoulderY + 2}px` }}>
        <rect x={cx + 13} y={shoulderY} width={10} height={32} rx={5} fill={SKIN} />
        <g id="r-forearm" style={{ transformOrigin: `${cx + 23}px ${shoulderY + 30}px` }}>
          <rect x={cx + 13} y={shoulderY + 28} width={9} height={28} rx={4.5} fill={SKIN_SHADOW} />
          <ellipse cx={cx + 17.5} cy={shoulderY + 58} rx={5} ry={4} fill={SKIN} />
        </g>
      </g>

      {/* ── Left Leg ── */}
      <g id="l-thigh" style={{ transformOrigin: `${cx - 8}px ${hipY}px` }}>
        <rect x={cx - 15} y={hipY} width={14} height={44} rx={7} fill={OUTFIT} />
        <g id="l-shin" style={{ transformOrigin: `${cx - 8}px ${hipY + 42}px` }}>
          <rect x={cx - 14} y={hipY + 40} width={12} height={42} rx={6} fill={OUTFIT_LIGHT} />
          {/* Shoe */}
          <ellipse cx={cx - 8} cy={hipY + 82} rx={10} ry={5} fill={SHOE} />
        </g>
      </g>

      {/* ── Right Leg ── */}
      <g id="r-thigh" style={{ transformOrigin: `${cx + 8}px ${hipY}px` }}>
        <rect x={cx + 1} y={hipY} width={14} height={44} rx={7} fill={OUTFIT} />
        <g id="r-shin" style={{ transformOrigin: `${cx + 8}px ${hipY + 42}px` }}>
          <rect x={cx + 2} y={hipY + 40} width={12} height={42} rx={6} fill={OUTFIT_LIGHT} />
          <ellipse cx={cx + 8} cy={hipY + 82} rx={10} ry={5} fill={SHOE} />
        </g>
      </g>

      {/* ── Floor line ── */}
      <line x1="40" y1="248" x2="160" y2="248" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );

  // For floor exercises, rotate the whole scene
  const sceneTransform = isFloor
    ? `rotate(90, ${cx}, 140) translate(20, -30) scale(0.75)`
    : "";

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 260"
      width="200"
      height="260"
      style={{ overflow: "visible" }}
    >
      <g transform={sceneTransform}>
        {standingFigure}
      </g>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MUSCLE DIAGRAM (kept compact)
   ═══════════════════════════════════════════════════════════════════ */
const MuscleDiagram = ({ active }: { active: MuscleGroup[] }) => {
  const is = (g: MuscleGroup) => active.includes(g) || active.includes("full");
  const onFill = "hsl(340 65% 58% / 0.55)";
  const offFill = "hsl(340 65% 58% / 0.1)";
  const f = (g: MuscleGroup) => is(g) ? onFill : offFill;
  return (
    <svg viewBox="0 0 50 120" width="50" height="120">
      <circle cx="25" cy="8" r="7" fill={offFill} />
      <rect x="14" y="17" width="22" height="30" rx="6" fill={f("chest")} />
      <rect x="6" y="15" width="10" height="8" rx="4" fill={f("shoulders")} />
      <rect x="34" y="15" width="10" height="8" rx="4" fill={f("shoulders")} />
      <rect x="4" y="24" width="8" height="24" rx="4" fill={f("arms")} />
      <rect x="38" y="24" width="8" height="24" rx="4" fill={f("arms")} />
      <rect x="16" y="36" width="18" height="14" rx="4" fill={f("core")} />
      <rect x="14" y="50" width="22" height="10" rx="4" fill={f("glutes")} />
      <rect x="10" y="62" width="12" height="36" rx="5" fill={f("legs")} />
      <rect x="28" y="62" width="12" height="36" rx="5" fill={f("legs")} />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   CONFETTI
   ═══════════════════════════════════════════════════════════════════ */
const confettiCSS = `
.confetti-p {
  position: absolute;
  border-radius: 2px;
  animation: conf-fall 3.5s ease-in forwards;
  opacity: 0;
}
@keyframes conf-fall {
  0% { transform: translateY(-30px) rotate(0deg) scale(1); opacity:1; }
  70% { opacity:1; }
  100% { transform: translateY(100vh) rotate(1080deg) scale(0.3); opacity:0; }
}
.rep-pulse { animation: rep-p 2s ease-in-out infinite; }
@keyframes rep-p { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
`;

const ConfettiEffect = () => {
  const colors = [
    "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--primary) / 0.5)",
    "#FFD700", "#FF69B4", "#87CEEB", "#98FB98", "#DDA0DD",
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="confetti-p"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 15}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 2.5}s`,
            width: `${5 + Math.random() * 8}px`,
            height: `${5 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.4 ? "50%" : `${Math.random() * 4}px`,
          }}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   WORKOUT PLAYER
   ═══════════════════════════════════════════════════════════════════ */
interface WorkoutPlayerProps {
  open: boolean;
  onClose: () => void;
  day: DayPlan;
  dayIndex: number;
  onComplete?: () => void;
}

interface ExStep {
  name: string;
  anim: AnimType;
  muscles: MuscleGroup[];
  sets: number;
  reps: number;
  totalSeconds: number;
}

function parseSetsReps(s: string) {
  const sm = s.match(/(\d+)/);
  const rm = s.match(/×\s*(\d+)/);
  return { sets: sm ? parseInt(sm[1]) : 3, reps: rm ? parseInt(rm[1]) : 10 };
}

const REST_SECONDS = 15;

const WorkoutPlayer = ({ open, onClose, day, dayIndex, onComplete }: WorkoutPlayerProps) => {
  const { sets, reps } = parseSetsReps(day.sets);
  const exercises: ExStep[] = day.exercises.map((name) => {
    const { anim, muscles } = classifyExercise(name);
    return { name, anim, muscles, sets, reps, totalSeconds: sets * reps * 4 };
  });

  const [idx, setIdx] = useState(0);
  const [resting, setResting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.totalSeconds ?? 30);
  const [restTime, setRestTime] = useState(REST_SECONDS);
  const [done, setDone] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = exercises.length;
  const progress = done ? 100 : ((idx + (resting ? 0.5 : 0)) / total) * 100;

  const clearTimer = useCallback(() => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }, []);

  useEffect(() => {
    if (!open || paused || done) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      if (resting) {
        setRestTime((t) => {
          if (t <= 1) {
            setResting(false);
            const n = idx + 1;
            if (n >= total) { setDone(true); onComplete?.(); return REST_SECONDS; }
            setIdx(n); setTimeLeft(exercises[n].totalSeconds); setRepCount(0);
            return REST_SECONDS;
          }
          return t - 1;
        });
      } else {
        setTimeLeft((t) => {
          if (t <= 1) { setResting(true); setRestTime(REST_SECONDS); return 0; }
          if (t % 4 === 0) setRepCount((r) => r + 1);
          return t - 1;
        });
      }
    }, 1000);
    return clearTimer;
  }, [open, paused, resting, idx, done, total, exercises, clearTimer, onComplete]);

  const goNext = () => {
    if (idx + 1 >= total) { setDone(true); onComplete?.(); return; }
    setResting(false); setIdx(idx + 1); setTimeLeft(exercises[idx + 1].totalSeconds); setRestTime(REST_SECONDS); setRepCount(0);
  };
  const goPrev = () => {
    if (idx <= 0) return;
    setResting(false); setIdx(idx - 1); setTimeLeft(exercises[idx - 1].totalSeconds); setRestTime(REST_SECONDS); setRepCount(0);
  };
  const reset = () => {
    setIdx(0); setResting(false); setPaused(false); setDone(false);
    setTimeLeft(exercises[0]?.totalSeconds ?? 30); setRestTime(REST_SECONDS); setRepCount(0);
  };

  useEffect(() => { if (open) reset(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [open]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const cur = exercises[idx];
  const [gradA, gradB] = cur ? getMuscleGradient(cur.muscles) : ["#1e1525", "#151020"];

  return (
    <>
      <style>{confettiCSS}</style>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg"
            style={{ background: `linear-gradient(160deg, ${gradA} 0%, ${gradB} 100%)` }}
          >
            <Button
              variant="ghost" size="icon" onClick={onClose}
              className="absolute top-4 right-4 z-20 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>

            {done ? (
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative text-center px-6 max-w-md">
                <ConfettiEffect />
                <motion.div initial={{ y: 30 }} animate={{ y: 0 }} transition={{ delay: 0.2 }} className="relative z-10">
                  <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/20 border-2 border-primary/40">
                    <Trophy className="h-14 w-14 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-3">Workout Complete! 🎉</h2>
                  <p className="text-white/50 mb-1">Day {dayIndex + 1}: {day.focus}</p>
                  <p className="text-white/30 text-sm mb-8">You crushed {total} exercises!</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={reset} variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">Restart</Button>
                    <Button onClick={onClose} className="rounded-full bg-primary hover:bg-primary/90">Done</Button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <div className="w-full max-w-2xl px-4 md:px-8 flex flex-col items-center">
                <p className="text-white/30 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                  Day {dayIndex + 1} — {day.focus}
                </p>

                <AnimatePresence mode="wait">
                  {resting ? (
                    <motion.div
                      key="rest"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.4 }}
                      className="text-center"
                    >
                      <p className="text-white/40 text-sm uppercase tracking-[0.15em] mb-6">Rest & Breathe</p>

                      <div className="mb-6 flex justify-center items-center">
                        <SVGCharacter animType="generic" breathing />
                      </div>

                      <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
                        <svg className="absolute inset-0" viewBox="0 0 112 112">
                          <circle cx="56" cy="56" r="50" fill="none" stroke="hsl(var(--primary) / 0.12)" strokeWidth="5" />
                          <circle
                            cx="56" cy="56" r="50" fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="5" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 50}`}
                            strokeDashoffset={`${2 * Math.PI * 50 * (1 - restTime / REST_SECONDS)}`}
                            transform="rotate(-90 56 56)"
                            style={{ transition: "stroke-dashoffset 1s linear" }}
                          />
                        </svg>
                        <span className="text-3xl font-bold text-white">{restTime}</span>
                      </div>

                      <p className="text-white/35 text-sm">
                        Next: <span className="text-white/60 font-medium">{exercises[idx + 1]?.name ?? "Done!"}</span>
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`ex-${idx}`}
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.4 }}
                      className="w-full"
                    >
                      <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-2xl md:text-3xl font-bold text-white text-center mb-1"
                      >
                        {cur.name}
                      </motion.h2>
                      <p className="text-white/35 text-sm text-center mb-6">
                        {cur.sets} sets × {cur.reps} reps
                      </p>

                      <div className="flex items-center justify-center gap-8 mb-6">
                        <div className="hidden md:flex flex-col items-center gap-2">
                          <MuscleDiagram active={cur.muscles} />
                          <div className="flex flex-wrap gap-1 max-w-[80px] justify-center">
                            {cur.muscles.map((m) => (
                              <span key={m} className="text-[9px] font-medium text-primary/80 bg-primary/10 rounded px-1.5 py-0.5 capitalize">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-center items-center">
                          <SVGCharacter animType={cur.anim} paused={paused} />
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <span className="text-white/30 text-[10px] uppercase tracking-widest">Reps</span>
                          <div className="rep-pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20">
                            <span className="text-2xl font-bold text-primary">{repCount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-5xl font-mono font-bold text-primary mb-1">{fmt(timeLeft)}</div>
                        <p className="text-white/25 text-xs">Exercise {idx + 1} of {total}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-5 mt-8">
                  <Button
                    variant="ghost" size="icon" onClick={goPrev}
                    disabled={idx === 0 && !resting}
                    className="rounded-full h-11 w-11 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20"
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => setPaused(!paused)}
                    className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
                  >
                    {paused ? <Play className="h-7 w-7" /> : <Pause className="h-7 w-7" />}
                  </Button>
                  <Button
                    variant="ghost" size="icon" onClick={goNext}
                    className="rounded-full h-11 w-11 text-white/50 hover:text-white hover:bg-white/10"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>

                <div className="w-full mt-8 max-w-md">
                  <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-white/25 text-xs mt-1.5 text-right">{Math.round(progress)}%</p>
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
