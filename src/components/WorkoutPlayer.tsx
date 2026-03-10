import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipBack, SkipForward, Trophy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DayPlan } from "@/lib/workoutGenerator";

/* ═══════════════════════════════════════════════════════════════════
   TYPES & CLASSIFICATION
   ═══════════════════════════════════════════════════════════════════ */
export type AnimType =
  | "squats" | "lunges" | "pushups" | "jumpingjacks"
  | "plank" | "glutebridges" | "deadlift" | "donkeykicks"
  | "pulldown" | "rows" | "dips" | "curls" | "lateralraise" | "generic";

export type MuscleGroup = "legs" | "chest" | "back" | "shoulders" | "core" | "glutes" | "arms" | "full";

function classifyExercise(name: string): { anim: AnimType; muscles: MuscleGroup[]; needsDumbbells: boolean; needsBand: boolean } {
  const n = name.toLowerCase();
  const db = n.includes("dumbbell") || n.includes("goblet") || n.includes("curl") || (n.includes("press") && !n.includes("leg"));
  const band = n.includes("band") || n.includes("resistance");

  // Lat pulldowns / pull-ups — vertical pull
  if (n.includes("pulldown") || n.includes("pull-down") || n.includes("pull-up") || n.includes("pullup") || n.includes("lat pull"))
    return { anim: "pulldown", muscles: ["back", "arms"], needsDumbbells: false, needsBand: band };
  // Rows — horizontal pull
  if (n.includes("row") || n.includes("face pull") || n.includes("cable pull"))
    return { anim: "rows", muscles: ["back", "arms"], needsDumbbells: db, needsBand: band };
  // Dips / tricep focused
  if (n.includes("dip") || n.includes("tricep") || n.includes("pushdown"))
    return { anim: "dips", muscles: ["arms", "chest", "shoulders"], needsDumbbells: false, needsBand: false };
  // Curls
  if (n.includes("curl") || n.includes("bicep"))
    return { anim: "curls", muscles: ["arms"], needsDumbbells: db, needsBand: band };
  // Lateral raises
  if (n.includes("lateral raise") || n.includes("lateral") || n.includes("shoulder raise"))
    return { anim: "lateralraise", muscles: ["shoulders"], needsDumbbells: db, needsBand: band };
  // Squats
  if (n.includes("squat") || n.includes("goblet") || n.includes("wall sit"))
    return { anim: "squats", muscles: ["legs", "glutes", "core"], needsDumbbells: db, needsBand: band };
  // Lunges
  if (n.includes("lunge") || n.includes("split squat") || n.includes("curtsy") || n.includes("step-up") || n.includes("step up"))
    return { anim: "lunges", muscles: ["legs", "glutes"], needsDumbbells: db, needsBand: band };
  // Push-ups / press
  if (n.includes("push-up") || n.includes("push up") || n.includes("pushup") || n.includes("chest") || (n.includes("press") && !n.includes("leg")))
    return { anim: "pushups", muscles: ["chest", "arms", "shoulders"], needsDumbbells: db, needsBand: band };
  // Jumping / cardio
  if (n.includes("jack") || n.includes("jump") || n.includes("burpee") || n.includes("star") || n.includes("high knee") || n.includes("mountain"))
    return { anim: "jumpingjacks", muscles: ["full"], needsDumbbells: false, needsBand: false };
  // Plank / core
  if (n.includes("plank") || n.includes("superman") || n.includes("crunch") || n.includes("bicycle"))
    return { anim: "plank", muscles: ["core"], needsDumbbells: false, needsBand: false };
  // Glute bridges
  if (n.includes("glute bridge") || n.includes("hip thrust"))
    return { anim: "glutebridges", muscles: ["glutes", "core"], needsDumbbells: db, needsBand: band };
  // Deadlifts / hinges / swings
  if (n.includes("deadlift") || n.includes("hinge") || n.includes("swing"))
    return { anim: "deadlift", muscles: ["back", "legs", "glutes"], needsDumbbells: db, needsBand: band };
  // Donkey kicks
  if (n.includes("donkey") || n.includes("kick") || n.includes("fire hydrant") || n.includes("clamshell"))
    return { anim: "donkeykicks", muscles: ["glutes"], needsDumbbells: false, needsBand: band };
  return { anim: "generic", muscles: ["full"], needsDumbbells: db, needsBand: band };
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
   SVG ANIMATED CHARACTER — Full Rebuild
   ═══════════════════════════════════════════════════════════════════ */
const SKIN = "#F4A4A4";
const SKIN_SHADOW = "#E08E8E";
const SKIN_LINE = "#D07878";
const OUTFIT = "#2D2D2D";
const OUTFIT_LIGHT = "#3D3D3D";
const OUTFIT_STRIPE = "#4A4A4A";
const HAIR = "#4A2C2A";
const HAIR_LIGHT = "#5C3835";
const SHOE = "#1A1A1A";
const SHOE_SOLE = "#E8E8E8";
const BAND_COLOR = "#E8596E";
const DB_HANDLE = "#555";
const DB_WEIGHT = "#333";

interface CharacterProps {
  animType: AnimType;
  breathing?: boolean;
  paused?: boolean;
  isFloor?: boolean;
  isHome?: boolean;
  needsDumbbells?: boolean;
  needsBand?: boolean;
  repFlash?: boolean;
  faceState?: "neutral" | "exertion" | "rest";
}

const SVGCharacter = ({ animType, breathing, paused, isFloor, isHome, needsDumbbells, needsBand, repFlash, faceState = "neutral" }: CharacterProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    if (paused) { cancelAnimationFrame(rafRef.current); return; }

    // Smooth easing helpers
    const asymmetric = (time: number, speed: number) => {
      const phase = ((time * speed) % (Math.PI * 2)) / (Math.PI * 2);
      if (phase < 0.55) {
        const p = phase / 0.55;
        return p * p * (3 - 2 * p);
      } else {
        const p = (phase - 0.55) / 0.45;
        return 1 - p * p * (3 - 2 * p);
      }
    };
    const easeInOut = (val: number) => {
      const n = Math.sin(val) * 0.5 + 0.5;
      return n * n * (3 - 2 * n);
    };

    const animate = () => {
      tRef.current += 0.018;
      const t = tRef.current;
      const svg = svgRef.current;
      if (!svg) return;

      const s = Math.sin;
      const $ = (id: string) => svg.getElementById(id);

      const breathVal = s(t * 1.57) * 0.008 + 1;
      const breathEl = $("breath-torso");
      if (breathEl) breathEl.setAttribute("transform", `scale(${breathVal}, ${breathVal})`);

      const ponyLag = s(t * 2.5 - 0.6) * 5;
      const ponyEl = $("ponytail-g");
      if (ponyEl) ponyEl.setAttribute("transform", `rotate(${ponyLag}, 124, 10)`);

      const spotEl = $("spotlight");
      if (spotEl) {
        const bodyDrop = breathing ? 0 : s(t * 2) * 6;
        spotEl.setAttribute("cy", `${140 + bodyDrop}`);
      }

      if (breathing) {
        const b = s(t * 0.785) * 0.02 + 1;
        const torso = $("torso");
        if (torso) torso.setAttribute("transform", `scale(${b}, ${b})`);
        const guideEl = $("breath-guide");
        if (guideEl) guideEl.setAttribute("transform", `scale(${s(t * 0.785) * 0.3 + 1})`);
        const guideText = $("breath-text");
        if (guideText) guideText.textContent = s(t * 0.785) > 0 ? "Inhale..." : "Exhale...";
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const ids = ["body-group", "head-g", "torso", "l-upper-arm", "l-forearm",
        "r-upper-arm", "r-forearm", "l-thigh", "l-shin", "r-thigh", "r-shin",
        "hip-g", "l-foot", "r-foot"];
      ids.forEach((id) => {
        const el = $(id);
        if (el) el.setAttribute("transform", "");
      });

      const microSway = s(t * 0.8) * 0.3;

      switch (animType) {
        case "squats": {
          const d = asymmetric(t, 2.2);
          const drop = d * 30;
          const kneeAngle = d * 45;
          const armAngle = d * -40;
          $("body-group")?.setAttribute("transform", `translate(0, ${drop}) rotate(${microSway}, 100, 115)`);
          $("torso")?.setAttribute("transform", `rotate(${d * 4}, 100, 52)`);
          $("l-thigh")?.setAttribute("transform", `rotate(${kneeAngle}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${-kneeAngle}, 0, 0)`);
          $("l-shin")?.setAttribute("transform", `rotate(${kneeAngle * 0.6}, 0, 0)`);
          $("r-shin")?.setAttribute("transform", `rotate(${kneeAngle * 0.6}, 0, 0)`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${armAngle}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${armAngle}, 0, 0)`);
          $("l-foot")?.setAttribute("transform", `scale(1, ${1 + d * 0.08})`);
          $("r-foot")?.setAttribute("transform", `scale(1, ${1 + d * 0.08})`);
          break;
        }
        case "lunges": {
          const d = asymmetric(t, 1.8);
          const drop = d * 24;
          $("body-group")?.setAttribute("transform", `translate(0, ${drop}) rotate(${microSway}, 100, 115)`);
          $("torso")?.setAttribute("transform", `rotate(${d * 3}, 100, 52)`);
          $("l-thigh")?.setAttribute("transform", `rotate(${d * -32}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${d * 28}, 0, 0)`);
          $("l-shin")?.setAttribute("transform", `rotate(${d * 15}, 0, 0)`);
          $("r-shin")?.setAttribute("transform", `rotate(${d * -22}, 0, 0)`);
          $("l-foot")?.setAttribute("transform", `scale(1, ${1 + d * 0.06})`);
          $("r-foot")?.setAttribute("transform", `rotate(${d * 10}, 0, 0)`);
          break;
        }
        case "pushups": {
          const d = asymmetric(t, 2.0);
          const armBend = d * 28;
          $("l-upper-arm")?.setAttribute("transform", `rotate(${armBend}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${-armBend}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${armBend * 0.8}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${-armBend * 0.8}, 0, 0)`);
          $("head-g")?.setAttribute("transform", `rotate(${d * 4}, 0, 0)`);
          $("body-group")?.setAttribute("transform", `translate(0, ${d * 8})`);
          break;
        }
        case "jumpingjacks": {
          const d = easeInOut(t * 3.5);
          const armAng = d * 140 - 70;
          const legAng = d * 22;
          const jump = s(t * 3.5) * -8;
          $("body-group")?.setAttribute("transform", `translate(0, ${jump})`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${-armAng}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${armAng}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${-d * 18}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${d * 18}, 0, 0)`);
          $("l-thigh")?.setAttribute("transform", `rotate(${-legAng}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${legAng}, 0, 0)`);
          if (jump < -3) {
            $("l-foot")?.setAttribute("transform", `rotate(-10, 0, 0)`);
            $("r-foot")?.setAttribute("transform", `rotate(10, 0, 0)`);
          }
          break;
        }
        case "plank": {
          const b = s(t * 1.2) * 0.012 + 1;
          $("torso")?.setAttribute("transform", `scale(1, ${b})`);
          $("body-group")?.setAttribute("transform", `rotate(${microSway * 0.5}, 100, 115)`);
          break;
        }
        case "glutebridges": {
          const d = asymmetric(t, 1.8);
          $("hip-g")?.setAttribute("transform", `translate(0, ${-d * 18})`);
          $("torso")?.setAttribute("transform", `rotate(${-d * 8}, 0, 0)`);
          $("l-thigh")?.setAttribute("transform", `rotate(${-d * 18}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${-d * 18}, 0, 0)`);
          $("l-foot")?.setAttribute("transform", `scale(1, ${1 + d * 0.08})`);
          $("r-foot")?.setAttribute("transform", `scale(1, ${1 + d * 0.08})`);
          break;
        }
        case "deadlift": {
          const d = asymmetric(t, 1.6);
          const hingeAngle = d * 45;
          $("torso")?.setAttribute("transform", `rotate(${hingeAngle}, 100, 52)`);
          $("head-g")?.setAttribute("transform", `rotate(${-hingeAngle * 0.3}, 0, 0)`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${d * 12}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${d * 12}, 0, 0)`);
          $("l-thigh")?.setAttribute("transform", `rotate(${-d * 8}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${-d * 8}, 0, 0)`);
          $("body-group")?.setAttribute("transform", `rotate(${microSway}, 100, 115)`);
          break;
        }
        case "pulldown": {
          const d = asymmetric(t, 2.0);
          const armRaise = 140 - d * 140;
          const forearmBend = d * 90;
          $("body-group")?.setAttribute("transform", `rotate(${microSway}, 100, 115)`);
          $("torso")?.setAttribute("transform", `rotate(${d * -3}, 100, 52)`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${-armRaise}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${-armRaise}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${forearmBend}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${forearmBend}, 0, 0)`);
          $("head-g")?.setAttribute("transform", `rotate(${d * 2}, 0, 0)`);
          break;
        }
        case "rows": {
          const d = asymmetric(t, 1.8);
          const armPull = d * 35;
          const forearmBend = d * 45;
          const torsoLean = 15 - d * 5;
          $("body-group")?.setAttribute("transform", `rotate(${microSway}, 100, 115)`);
          $("torso")?.setAttribute("transform", `rotate(${torsoLean}, 100, 52)`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${armPull}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${armPull}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${forearmBend}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${forearmBend}, 0, 0)`);
          $("l-thigh")?.setAttribute("transform", `rotate(${-5}, 0, 0)`);
          $("r-thigh")?.setAttribute("transform", `rotate(${-5}, 0, 0)`);
          $("head-g")?.setAttribute("transform", `rotate(${-torsoLean * 0.3}, 0, 0)`);
          break;
        }
        case "dips": {
          const d = asymmetric(t, 1.8);
          const bodyDrop = d * 14;
          const armBend = d * 35;
          $("body-group")?.setAttribute("transform", `translate(0, ${bodyDrop}) rotate(${microSway}, 100, 115)`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${armBend}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${-armBend}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${armBend * 0.9}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${-armBend * 0.9}, 0, 0)`);
          $("torso")?.setAttribute("transform", `rotate(${d * 3}, 100, 52)`);
          break;
        }
        case "curls": {
          const d = asymmetric(t, 2.2);
          const forearmCurl = d * -110;
          $("body-group")?.setAttribute("transform", `rotate(${microSway}, 100, 115)`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${d * 2}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${d * 2}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${forearmCurl}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${forearmCurl}, 0, 0)`);
          break;
        }
        case "lateralraise": {
          const d = asymmetric(t, 1.8);
          const armLift = d * -75;
          $("body-group")?.setAttribute("transform", `rotate(${microSway}, 100, 115)`);
          $("l-upper-arm")?.setAttribute("transform", `rotate(${armLift}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${-armLift}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${d * -8}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${d * 8}, 0, 0)`);
          $("torso")?.setAttribute("transform", `rotate(${d * -1}, 100, 52)`);
          break;
        }
        case "donkeykicks": {
          const d = asymmetric(t, 2.2);
          $("r-thigh")?.setAttribute("transform", `rotate(${-d * 45}, 0, 0)`);
          $("r-shin")?.setAttribute("transform", `rotate(${-d * 25}, 0, 0)`);
          $("torso")?.setAttribute("transform", `scale(1, ${1 + s(t * 2.2) * 0.008})`);
          $("r-foot")?.setAttribute("transform", `rotate(${-d * 15}, 0, 0)`);
          $("body-group")?.setAttribute("transform", `rotate(${microSway * 0.5}, 100, 115)`);
          break;
        }
        default: {
          const d = s(t * 1.8);
          const armSwing = d * 16;
          $("l-upper-arm")?.setAttribute("transform", `rotate(${armSwing}, 0, 0)`);
          $("r-upper-arm")?.setAttribute("transform", `rotate(${-armSwing}, 0, 0)`);
          $("l-forearm")?.setAttribute("transform", `rotate(${d * 8}, 0, 0)`);
          $("r-forearm")?.setAttribute("transform", `rotate(${-d * 8}, 0, 0)`);
          $("body-group")?.setAttribute("transform", `rotate(${microSway}, 100, 115)`);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animType, breathing, paused]);

  const cx = 100;
  const headY = 18;
  const neckY = 42;
  const shoulderY = 52;
  const hipY = 115;

  // Face based on state
  const eyesAndMouth = faceState === "rest" ? (
    <>
      {/* Closed eyes */}
      <path d={`M${cx - 7},${headY} Q${cx - 5},${headY - 1.5} ${cx - 3},${headY}`} fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <path d={`M${cx + 3},${headY} Q${cx + 5},${headY - 1.5} ${cx + 7},${headY}`} fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      {/* Gentle smile */}
      <path d={`M${cx - 3},${headY + 5} Q${cx},${headY + 7} ${cx + 3},${headY + 5}`} fill="none" stroke="#C07070" strokeWidth="1" strokeLinecap="round" />
    </>
  ) : faceState === "exertion" ? (
    <>
      {/* Open eyes */}
      <circle cx={cx - 5} cy={headY} r={1.8} fill="#333" />
      <circle cx={cx + 5} cy={headY} r={1.8} fill="#333" />
      <circle cx={cx - 4.5} cy={headY - 0.5} r={0.5} fill="white" />
      <circle cx={cx + 5.5} cy={headY - 0.5} r={0.5} fill="white" />
      {/* Open mouth smile */}
      <path d={`M${cx - 4},${headY + 4} Q${cx},${headY + 9} ${cx + 4},${headY + 4}`} fill="#C07070" stroke="#B06060" strokeWidth="0.8" />
    </>
  ) : (
    <>
      {/* Neutral eyes */}
      <circle cx={cx - 5} cy={headY} r={1.5} fill="#333" />
      <circle cx={cx + 5} cy={headY} r={1.5} fill="#333" />
      <circle cx={cx - 4.5} cy={headY - 0.3} r={0.4} fill="white" />
      <circle cx={cx + 5.5} cy={headY - 0.3} r={0.4} fill="white" />
      {/* Slight smile */}
      <path d={`M${cx - 3},${headY + 5} Q${cx},${headY + 7.5} ${cx + 3},${headY + 5}`} fill="none" stroke="#C07070" strokeWidth="1.1" strokeLinecap="round" />
    </>
  );

  // Dumbbell SVG element
  const dumbbell = (x: number, y: number, angle = 0) => (
    <g transform={`rotate(${angle}, ${x}, ${y})`}>
      <rect x={x - 2} y={y - 10} width={4} height={20} rx={2} fill={DB_HANDLE} />
      <rect x={x - 5} y={y - 12} width={10} height={5} rx={2} fill={DB_WEIGHT} />
      <rect x={x - 5} y={y + 7} width={10} height={5} rx={2} fill={DB_WEIGHT} />
    </g>
  );

  // Resistance band
  const resistanceBand = () => (
    <ellipse cx={cx} cy={hipY + 20} rx={28} ry={4} fill="none" stroke={BAND_COLOR} strokeWidth="3" strokeDasharray="4 2" opacity="0.7" />
  );

  const standingFigure = (
    <g id="body-group">
      {/* ── Rep flash ring ── */}
      {repFlash && (
        <circle cx={cx} cy={120} r={80} fill="none" stroke="#4ADE80" strokeWidth="3" opacity="0.6">
          <animate attributeName="r" from="60" to="90" dur="0.5s" fill="freeze" />
          <animate attributeName="opacity" from="0.7" to="0" dur="0.5s" fill="freeze" />
        </circle>
      )}

      {/* ── Shadow on floor ── */}
      <ellipse cx={cx} cy={245} rx={32} ry={7} fill="rgba(0,0,0,0.18)">
        <animate attributeName="rx" values="32;28;32" dur="2s" repeatCount="indefinite" />
      </ellipse>

      {/* ── Head & Hair ── */}
      <g id="head-g" style={{ transformOrigin: `${cx}px ${neckY}px` }}>
        <ellipse cx={cx} cy={headY} rx={16} ry={18} fill={SKIN} />
        {/* Ear */}
        <ellipse cx={cx - 15} cy={headY + 2} rx={3} ry={5} fill={SKIN_SHADOW} />
        {/* Hair top with volume */}
        <path d={`M${cx - 15},${headY - 2} Q${cx - 17},${headY - 20} ${cx - 4},${headY - 22} Q${cx + 6},${headY - 23} ${cx + 14},${headY - 18} Q${cx + 16},${headY - 6} ${cx + 15},${headY - 2}`} fill={HAIR} />
        {/* Hair fringe detail */}
        <path d={`M${cx - 10},${headY - 14} Q${cx - 5},${headY - 10} ${cx},${headY - 15} Q${cx + 5},${headY - 10} ${cx + 8},${headY - 14}`} fill={HAIR_LIGHT} opacity="0.5" />

        {/* Ponytail group (animated separately) */}
        <g id="ponytail-g" style={{ transformOrigin: `${cx + 12}px ${headY - 8}px` }}>
          <path d={`M${cx + 12},${headY - 8} Q${cx + 30},${headY - 2} ${cx + 26},${headY + 18} Q${cx + 22},${headY + 28} ${cx + 16},${headY + 14} Q${cx + 14},${headY + 4} ${cx + 12},${headY - 8}`} fill={HAIR} />
          {/* Hair band */}
          <circle cx={cx + 13} cy={headY - 6} r={2.5} fill="#E8596E" />
        </g>

        {/* Face */}
        {eyesAndMouth}
        {/* Eyebrows */}
        <path d={`M${cx - 8},${headY - 5} Q${cx - 5},${headY - 7} ${cx - 2},${headY - 5}`} fill="none" stroke={HAIR} strokeWidth="1" strokeLinecap="round" />
        <path d={`M${cx + 2},${headY - 5} Q${cx + 5},${headY - 7} ${cx + 8},${headY - 5}`} fill="none" stroke={HAIR} strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* ── Neck ── */}
      <rect x={cx - 4} y={neckY - 6} width={8} height={12} rx={3} fill={SKIN} />

      {/* ── Torso ── */}
      <g id="torso" style={{ transformOrigin: `${cx}px ${shoulderY}px` }}>
        <g id="breath-torso" style={{ transformOrigin: `${cx}px ${shoulderY + 20}px` }}>
          {/* Sports bra */}
          <path d={`M${cx - 18},${shoulderY} Q${cx - 20},${shoulderY + 22} ${cx - 14},${shoulderY + 28} L${cx + 14},${shoulderY + 28} Q${cx + 20},${shoulderY + 22} ${cx + 18},${shoulderY}`} fill={OUTFIT} />
          {/* Bra strap lines */}
          <line x1={cx - 8} y1={shoulderY - 4} x2={cx - 14} y2={shoulderY + 4} stroke={OUTFIT_STRIPE} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx + 8} y1={shoulderY - 4} x2={cx + 14} y2={shoulderY + 4} stroke={OUTFIT_STRIPE} strokeWidth="1.5" strokeLinecap="round" />
          {/* Neckline detail */}
          <path d={`M${cx - 12},${shoulderY + 2} Q${cx},${shoulderY + 8} ${cx + 12},${shoulderY + 2}`} fill="none" stroke={OUTFIT_STRIPE} strokeWidth="0.8" />

          {/* Midriff skin with subtle muscle lines */}
          <rect x={cx - 14} y={shoulderY + 28} width={28} height={14} rx={4} fill={SKIN} />
          {/* Abs definition lines */}
          <line x1={cx} y1={shoulderY + 30} x2={cx} y2={shoulderY + 40} stroke={SKIN_LINE} strokeWidth="0.5" opacity="0.3" />
          <path d={`M${cx - 6},${shoulderY + 33} Q${cx},${shoulderY + 34} ${cx + 6},${shoulderY + 33}`} fill="none" stroke={SKIN_LINE} strokeWidth="0.4" opacity="0.25" />
          <path d={`M${cx - 5},${shoulderY + 38} Q${cx},${shoulderY + 39} ${cx + 5},${shoulderY + 38}`} fill="none" stroke={SKIN_LINE} strokeWidth="0.4" opacity="0.25" />

          {/* Waist/hips — leggings */}
          <g id="hip-g" style={{ transformOrigin: `${cx}px ${hipY}px` }}>
            <path d={`M${cx - 16},${shoulderY + 40} Q${cx - 19},${shoulderY + 50} ${cx - 17},${hipY} L${cx + 17},${hipY} Q${cx + 19},${shoulderY + 50} ${cx + 16},${shoulderY + 40}`} fill={OUTFIT} />
            {/* Waistband */}
            <rect x={cx - 17} y={shoulderY + 40} width={34} height={4} rx={2} fill={OUTFIT_STRIPE} />
          </g>
        </g>
      </g>

      {/* ── Left Arm ── */}
      <g id="l-upper-arm" style={{ transformOrigin: `${cx - 18}px ${shoulderY + 2}px` }}>
        <rect x={cx - 23} y={shoulderY} width={10} height={32} rx={5} fill={SKIN} />
        {/* Bicep line */}
        <path d={`M${cx - 20},${shoulderY + 8} Q${cx - 17},${shoulderY + 14} ${cx - 20},${shoulderY + 20}`} fill="none" stroke={SKIN_LINE} strokeWidth="0.5" opacity="0.3" />
        <g id="l-forearm" style={{ transformOrigin: `${cx - 23}px ${shoulderY + 30}px` }}>
          <rect x={cx - 22} y={shoulderY + 28} width={9} height={28} rx={4.5} fill={SKIN_SHADOW} />
          {/* Hand with knuckle lines */}
          <ellipse cx={cx - 17.5} cy={shoulderY + 58} rx={5} ry={4.5} fill={SKIN} />
          <path d={`M${cx - 20},${shoulderY + 56} L${cx - 19},${shoulderY + 58}`} stroke={SKIN_LINE} strokeWidth="0.4" opacity="0.3" />
          <path d={`M${cx - 18},${shoulderY + 55} L${cx - 17},${shoulderY + 57}`} stroke={SKIN_LINE} strokeWidth="0.4" opacity="0.3" />
          <path d={`M${cx - 16},${shoulderY + 55.5} L${cx - 15.5},${shoulderY + 57.5}`} stroke={SKIN_LINE} strokeWidth="0.4" opacity="0.3" />
          {/* Dumbbell in left hand */}
          {needsDumbbells && dumbbell(cx - 17.5, shoulderY + 58)}
        </g>
      </g>

      {/* ── Right Arm ── */}
      <g id="r-upper-arm" style={{ transformOrigin: `${cx + 18}px ${shoulderY + 2}px` }}>
        <rect x={cx + 13} y={shoulderY} width={10} height={32} rx={5} fill={SKIN} />
        {/* Bicep line */}
        <path d={`M${cx + 20},${shoulderY + 8} Q${cx + 17},${shoulderY + 14} ${cx + 20},${shoulderY + 20}`} fill="none" stroke={SKIN_LINE} strokeWidth="0.5" opacity="0.3" />
        <g id="r-forearm" style={{ transformOrigin: `${cx + 23}px ${shoulderY + 30}px` }}>
          <rect x={cx + 13} y={shoulderY + 28} width={9} height={28} rx={4.5} fill={SKIN_SHADOW} />
          <ellipse cx={cx + 17.5} cy={shoulderY + 58} rx={5} ry={4.5} fill={SKIN} />
          <path d={`M${cx + 15},${shoulderY + 56} L${cx + 16},${shoulderY + 58}`} stroke={SKIN_LINE} strokeWidth="0.4" opacity="0.3" />
          <path d={`M${cx + 17},${shoulderY + 55} L${cx + 18},${shoulderY + 57}`} stroke={SKIN_LINE} strokeWidth="0.4" opacity="0.3" />
          <path d={`M${cx + 19},${shoulderY + 55.5} L${cx + 19.5},${shoulderY + 57.5}`} stroke={SKIN_LINE} strokeWidth="0.4" opacity="0.3" />
          {needsDumbbells && dumbbell(cx + 17.5, shoulderY + 58)}
        </g>
      </g>

      {/* ── Left Leg ── */}
      <g id="l-thigh" style={{ transformOrigin: `${cx - 8}px ${hipY}px` }}>
        <rect x={cx - 15} y={hipY} width={14} height={44} rx={7} fill={OUTFIT} />
        {/* Side stripe */}
        <line x1={cx - 15} y1={hipY + 4} x2={cx - 15} y2={hipY + 42} stroke={OUTFIT_STRIPE} strokeWidth="1.5" />
        {/* Quad definition */}
        <path d={`M${cx - 10},${hipY + 10} Q${cx - 7},${hipY + 22} ${cx - 10},${hipY + 34}`} fill="none" stroke={OUTFIT_STRIPE} strokeWidth="0.5" opacity="0.4" />
        <g id="l-shin" style={{ transformOrigin: `${cx - 8}px ${hipY + 42}px` }}>
          <rect x={cx - 14} y={hipY + 40} width={12} height={42} rx={6} fill={OUTFIT_LIGHT} />
          <line x1={cx - 14} y1={hipY + 42} x2={cx - 14} y2={hipY + 80} stroke={OUTFIT_STRIPE} strokeWidth="1.2" />
          {/* Shoe with sole */}
          <g id="l-foot" style={{ transformOrigin: `${cx - 8}px ${hipY + 80}px` }}>
            <ellipse cx={cx - 8} cy={hipY + 83} rx={11} ry={5.5} fill={SHOE} />
            <ellipse cx={cx - 8} cy={hipY + 86} rx={10} ry={2.5} fill={SHOE_SOLE} />
            {/* Shoe lace detail */}
            <line x1={cx - 11} y1={hipY + 81} x2={cx - 5} y2={hipY + 81} stroke="#444" strokeWidth="0.6" />
          </g>
        </g>
      </g>

      {/* ── Right Leg ── */}
      <g id="r-thigh" style={{ transformOrigin: `${cx + 8}px ${hipY}px` }}>
        <rect x={cx + 1} y={hipY} width={14} height={44} rx={7} fill={OUTFIT} />
        <line x1={cx + 15} y1={hipY + 4} x2={cx + 15} y2={hipY + 42} stroke={OUTFIT_STRIPE} strokeWidth="1.5" />
        <path d={`M${cx + 10},${hipY + 10} Q${cx + 7},${hipY + 22} ${cx + 10},${hipY + 34}`} fill="none" stroke={OUTFIT_STRIPE} strokeWidth="0.5" opacity="0.4" />
        <g id="r-shin" style={{ transformOrigin: `${cx + 8}px ${hipY + 42}px` }}>
          <rect x={cx + 2} y={hipY + 40} width={12} height={42} rx={6} fill={OUTFIT_LIGHT} />
          <line x1={cx + 14} y1={hipY + 42} x2={cx + 14} y2={hipY + 80} stroke={OUTFIT_STRIPE} strokeWidth="1.2" />
          <g id="r-foot" style={{ transformOrigin: `${cx + 8}px ${hipY + 80}px` }}>
            <ellipse cx={cx + 8} cy={hipY + 83} rx={11} ry={5.5} fill={SHOE} />
            <ellipse cx={cx + 8} cy={hipY + 86} rx={10} ry={2.5} fill={SHOE_SOLE} />
            <line x1={cx + 5} y1={hipY + 81} x2={cx + 11} y2={hipY + 81} stroke="#444" strokeWidth="0.6" />
          </g>
        </g>
      </g>

      {/* Resistance band */}
      {needsBand && resistanceBand()}
    </g>
  );

  const sceneTransform = isFloor
    ? `rotate(90, ${cx}, 140) translate(20, -30) scale(0.75)`
    : "";

  return (
    <svg
      ref={svgRef}
      viewBox="-20 -20 240 310"
      width="220"
      height="290"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Vignette gradient */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
        </radialGradient>
        {/* Spotlight */}
        <radialGradient id="spot-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Wall gradient */}
        <linearGradient id="wall-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* ── Environment ── */}
      {/* Wall */}
      <rect x="-20" y="-20" width="240" height="220" fill="url(#wall-grad)" />

      {/* Floor planks */}
      <g opacity="0.15">
        <rect x="-20" y="240" width="240" height="50" fill="rgba(139,90,43,0.3)" rx="2" />
        {[0, 48, 96, 144, 192].map((fx) => (
          <line key={fx} x1={fx - 20} y1="240" x2={fx - 20} y2="290" stroke="rgba(139,90,43,0.2)" strokeWidth="0.5" />
        ))}
        <line x1="-20" y1="258" x2="220" y2="258" stroke="rgba(139,90,43,0.15)" strokeWidth="0.5" />
        <line x1="-20" y1="275" x2="220" y2="275" stroke="rgba(139,90,43,0.12)" strokeWidth="0.5" />
      </g>

      {/* Yoga mat for home/floor exercises */}
      {(isHome || isFloor) && (
        <rect x="40" y="237" width="120" height="12" rx="3" fill="rgba(232,89,110,0.15)" stroke="rgba(232,89,110,0.1)" strokeWidth="0.5" />
      )}

      {/* Gym background - dumbbell rack silhouette */}
      {!isHome && (
        <g opacity="0.06">
          <rect x="165" y="80" width="40" height="160" rx="3" fill="white" />
          {[100, 130, 160, 190, 220].map((ry) => (
            <g key={ry}>
              <rect x="170" y={ry} width={30} height={4} rx={2} fill="white" />
              <circle cx={173} cy={ry + 2} r={5} fill="white" />
              <circle cx={197} cy={ry + 2} r={5} fill="white" />
            </g>
          ))}
        </g>
      )}

      {/* Spotlight */}
      <ellipse id="spotlight" cx="100" cy="140" rx="80" ry="120" fill="url(#spot-grad)" />

      {/* Floor line */}
      <line x1="20" y1="248" x2="180" y2="248" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Vignette overlay */}
      <rect x="-20" y="-20" width="240" height="310" fill="url(#vignette)" />

      <g transform={sceneTransform}>
        {standingFigure}
      </g>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MUSCLE DIAGRAM
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
   SVG CONFETTI — Physics-based with gravity
   ═══════════════════════════════════════════════════════════════════ */
const SVGConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const colors = ["#E8596E", "#B794D6", "#FFD700", "#FF69B4", "#87CEEB", "#98FB98", "#DDA0DD", "#FFF"];
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      w: number; h: number; rot: number; vr: number;
      color: string; life: number;
    }> = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: w / 2 + (Math.random() - 0.5) * 100,
        y: h * 0.3 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 10 - 3,
        w: 4 + Math.random() * 6,
        h: 3 + Math.random() * 5,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }

    let running = true;
    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.vy += 0.18; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vx *= 0.99;
        if (p.y > h + 20) p.life = 0;
        else if (p.y > h * 0.6) p.life -= 0.008;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        if (Math.random() > 0.5) {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (alive) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => { running = false; };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

/* ═══════════════════════════════════════════════════════════════════
   STAR BURST (every 5 reps)
   ═══════════════════════════════════════════════════════════════════ */
const StarBurst = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <svg viewBox="0 0 100 100" width="120" height="120" className="absolute">
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x2 = 50 + Math.cos(angle) * 45;
        const y2 = 50 + Math.sin(angle) * 45;
        return (
          <line key={i} x1="50" y1="50" x2={x2} y2={y2} stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.8">
            <animate attributeName="opacity" from="0.9" to="0" dur="0.8s" fill="freeze" />
            <animate attributeName="x2" from="50" to={x2} dur="0.5s" fill="freeze" />
            <animate attributeName="y2" from="50" to={y2} dur="0.5s" fill="freeze" />
          </line>
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const cx = 50 + Math.cos(angle) * 40;
        const cy = 50 + Math.sin(angle) * 40;
        return (
          <circle key={`s${i}`} cx={cx} cy={cy} r="3" fill="#FFD700">
            <animate attributeName="r" from="1" to="4" dur="0.6s" fill="freeze" />
            <animate attributeName="opacity" from="1" to="0" dur="0.8s" fill="freeze" />
          </circle>
        );
      })}
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   VICTORY CHARACTER — jumping with arms raised
   ═══════════════════════════════════════════════════════════════════ */
const VictoryCharacter = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      tRef.current += 0.03;
      const t = tRef.current;
      const svg = svgRef.current;
      if (!svg) return;

      const jump = Math.abs(Math.sin(t * 2.5)) * -20;
      const body = svg.getElementById("victory-body");
      if (body) body.setAttribute("transform", `translate(0, ${jump})`);

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const cx = 100;
  const headY = 18;
  const shoulderY = 52;
  const hipY = 115;

  return (
    <svg ref={svgRef} viewBox="0 0 200 260" width="160" height="210" style={{ overflow: "visible" }}>
      <ellipse cx={cx} cy={245} rx={30} ry={6} fill="rgba(0,0,0,0.15)" />
      <g id="victory-body">
        {/* Head */}
        <ellipse cx={cx} cy={headY} rx={16} ry={18} fill={SKIN} />
        <path d={`M${cx - 15},${headY - 2} Q${cx - 17},${headY - 20} ${cx - 4},${headY - 22} Q${cx + 6},${headY - 23} ${cx + 14},${headY - 18} Q${cx + 16},${headY - 6} ${cx + 15},${headY - 2}`} fill={HAIR} />
        <path d={`M${cx + 12},${headY - 8} Q${cx + 30},${headY - 2} ${cx + 26},${headY + 18} Q${cx + 22},${headY + 28} ${cx + 16},${headY + 14}`} fill={HAIR} />
        <circle cx={cx + 13} cy={headY - 6} r={2.5} fill="#E8596E" />
        {/* Big smile */}
        <circle cx={cx - 5} cy={headY} r={1.8} fill="#333" />
        <circle cx={cx + 5} cy={headY} r={1.8} fill="#333" />
        <path d={`M${cx - 5},${headY + 4} Q${cx},${headY + 10} ${cx + 5},${headY + 4}`} fill="#C07070" stroke="#B06060" strokeWidth="0.8" />

        {/* Neck */}
        <rect x={cx - 4} y={36} width={8} height={12} rx={3} fill={SKIN} />
        {/* Torso */}
        <path d={`M${cx - 18},${shoulderY} Q${cx - 20},${shoulderY + 22} ${cx - 14},${shoulderY + 28} L${cx + 14},${shoulderY + 28} Q${cx + 20},${shoulderY + 22} ${cx + 18},${shoulderY}`} fill={OUTFIT} />
        <rect x={cx - 14} y={shoulderY + 28} width={28} height={14} rx={4} fill={SKIN} />
        <path d={`M${cx - 16},${shoulderY + 40} Q${cx - 19},${shoulderY + 50} ${cx - 17},${hipY} L${cx + 17},${hipY} Q${cx + 19},${shoulderY + 50} ${cx + 16},${shoulderY + 40}`} fill={OUTFIT} />

        {/* Arms raised up */}
        <g transform={`rotate(-150, ${cx - 18}, ${shoulderY + 2})`}>
          <rect x={cx - 23} y={shoulderY} width={10} height={32} rx={5} fill={SKIN} />
          <rect x={cx - 22} y={shoulderY + 28} width={9} height={28} rx={4.5} fill={SKIN_SHADOW} />
          <ellipse cx={cx - 17.5} cy={shoulderY + 58} rx={5} ry={4.5} fill={SKIN} />
        </g>
        <g transform={`rotate(150, ${cx + 18}, ${shoulderY + 2})`}>
          <rect x={cx + 13} y={shoulderY} width={10} height={32} rx={5} fill={SKIN} />
          <rect x={cx + 13} y={shoulderY + 28} width={9} height={28} rx={4.5} fill={SKIN_SHADOW} />
          <ellipse cx={cx + 17.5} cy={shoulderY + 58} rx={5} ry={4.5} fill={SKIN} />
        </g>

        {/* Legs */}
        <rect x={cx - 15} y={hipY} width={14} height={44} rx={7} fill={OUTFIT} />
        <rect x={cx - 14} y={hipY + 40} width={12} height={42} rx={6} fill={OUTFIT_LIGHT} />
        <ellipse cx={cx - 8} cy={hipY + 83} rx={11} ry={5.5} fill={SHOE} />
        <rect x={cx + 1} y={hipY} width={14} height={44} rx={7} fill={OUTFIT} />
        <rect x={cx + 2} y={hipY + 40} width={12} height={42} rx={6} fill={OUTFIT_LIGHT} />
        <ellipse cx={cx + 8} cy={hipY + 83} rx={11} ry={5.5} fill={SHOE} />
      </g>
    </svg>
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
  needsDumbbells: boolean;
  needsBand: boolean;
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
    const { anim, muscles, needsDumbbells, needsBand } = classifyExercise(name);
    return { name, anim, muscles, sets, reps, totalSeconds: sets * reps * 4, needsDumbbells, needsBand };
  });

  const [idx, setIdx] = useState(0);
  const [resting, setResting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.totalSeconds ?? 30);
  const [restTime, setRestTime] = useState(REST_SECONDS);
  const [done, setDone] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [repFlash, setRepFlash] = useState(false);
  const [showStarBurst, setShowStarBurst] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = exercises.length;
  const progress = done ? 100 : ((idx + (resting ? 0.5 : 0)) / total) * 100;
  const isFloor = exercises[idx] ? ["pushups", "plank", "glutebridges", "donkeykicks"].includes(exercises[idx].anim) : false;

  const clearTimer = useCallback(() => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }, []);

  // Rep feedback
  const triggerRepFlash = useCallback(() => {
    setRepFlash(true);
    setTimeout(() => setRepFlash(false), 500);
  }, []);

  const triggerStarBurst = useCallback(() => {
    setShowStarBurst(true);
    setTimeout(() => setShowStarBurst(false), 900);
  }, []);

  useEffect(() => {
    if (!open || paused || done) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setTotalElapsed(prev => prev + 1);
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
          if (t % 4 === 0) {
            setRepCount((r) => {
              const next = r + 1;
              triggerRepFlash();
              if (next % 5 === 0) triggerStarBurst();
              return next;
            });
          }
          return t - 1;
        });
      }
    }, 1000);
    return clearTimer;
  }, [open, paused, resting, idx, done, total, exercises, clearTimer, onComplete, triggerRepFlash, triggerStarBurst]);

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
    setTimeLeft(exercises[0]?.totalSeconds ?? 30); setRestTime(REST_SECONDS); setRepCount(0); setTotalElapsed(0);
  };

  useEffect(() => { if (open) reset(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [open]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const cur = exercises[idx];
  const [gradA, gradB] = cur ? getMuscleGradient(cur.muscles) : ["#1e1525", "#151020"];
  const estimatedCalories = Math.round(totalElapsed * 0.12);

  return (
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
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative text-center px-6 max-w-md w-full">
              <SVGConfetti />
              <motion.div initial={{ y: 30 }} animate={{ y: 0 }} transition={{ delay: 0.2 }} className="relative z-10">
                <div className="mx-auto mb-4 flex justify-center">
                  <VictoryCharacter />
                </div>

                <h2 className="text-4xl font-bold text-white mb-3">Workout Complete! 🎉</h2>
                <p className="text-white/50 mb-1">Day {dayIndex + 1}: {day.focus}</p>

                {/* Stats summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-3 my-6"
                >
                  <div className="rounded-xl bg-white/5 border border-white/10 py-3 px-2">
                    <p className="text-2xl font-bold text-primary">{fmt(totalElapsed)}</p>
                    <p className="text-white/40 text-xs">Total Time</p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 py-3 px-2">
                    <p className="text-2xl font-bold text-primary">{total}</p>
                    <p className="text-white/40 text-xs">Exercises</p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 py-3 px-2">
                    <p className="text-2xl font-bold text-primary">~{estimatedCalories}</p>
                    <p className="text-white/40 text-xs">Calories</p>
                  </div>
                </motion.div>

                <div className="flex gap-3 justify-center flex-wrap">
                  <Button onClick={reset} variant="outline" className="rounded-full border-white/20 text-foreground hover:bg-white/10">Restart</Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-white/20 text-foreground hover:bg-white/10"
                    onClick={() => {
                      const text = `💪 SmartBells Workout Complete!\n📋 ${day.focus}\n⏱ ${fmt(totalElapsed)} | 🏋️ ${total} exercises | 🔥 ~${estimatedCalories} cal`;
                      if (navigator.share) navigator.share({ text }).catch(() => {});
                      else navigator.clipboard.writeText(text).catch(() => {});
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-1.5" /> Share
                  </Button>
                  <Button onClick={onClose} className="rounded-full bg-primary hover:bg-primary/90 text-foreground">Done</Button>
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
                    <p className="text-white/40 text-sm uppercase tracking-[0.15em] mb-4">Rest & Breathe</p>

                    <div className="mb-4 flex justify-center items-center">
                      <SVGCharacter animType="generic" breathing faceState="rest" isHome />
                    </div>

                    {/* Breath guide */}
                    <div className="mb-4 flex flex-col items-center">
                      <svg viewBox="0 0 80 80" width="60" height="60">
                        <circle id="breath-guide" cx="40" cy="40" r="25" fill="none" stroke="hsl(340 65% 58% / 0.3)" strokeWidth="2" style={{ transformOrigin: "40px 40px" }}>
                          <animate attributeName="r" values="20;30;20" dur="8s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="8s" repeatCount="indefinite" />
                        </circle>
                        <text id="breath-text" x="40" y="43" textAnchor="middle" fill="white" fontSize="7" opacity="0.5">Inhale...</text>
                      </svg>
                    </div>

                    <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center">
                      <svg className="absolute inset-0" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="42" fill="none" stroke="hsl(340 65% 58% / 0.12)" strokeWidth="4" />
                        <circle
                          cx="48" cy="48" r="42" fill="none"
                          stroke="hsl(340 65% 58%)"
                          strokeWidth="4" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${2 * Math.PI * 42 * (1 - restTime / REST_SECONDS)}`}
                          transform="rotate(-90 48 48)"
                          style={{ transition: "stroke-dashoffset 1s linear" }}
                        />
                      </svg>
                      <span className="text-3xl font-bold text-white">{restTime}</span>
                    </div>

                    {/* Upcoming exercise preview */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-2"
                    >
                      <p className="text-white/35 text-sm">
                        Next: <span className="text-white/60 font-medium">{exercises[idx + 1]?.name ?? "Done!"}</span>
                      </p>
                    </motion.div>
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
                    <p className="text-white/35 text-sm text-center mb-4">
                      {cur.sets} sets × {cur.reps} reps
                    </p>

                    <div className="flex items-center justify-center gap-6 md:gap-8 mb-4 relative">
                      {showStarBurst && <StarBurst />}

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
                        <SVGCharacter
                          animType={cur.anim}
                          paused={paused}
                          isFloor={isFloor}
                          needsDumbbells={cur.needsDumbbells}
                          needsBand={cur.needsBand}
                          repFlash={repFlash}
                          faceState={paused ? "neutral" : "exertion"}
                        />
                      </div>

                      {/* Rep counter with progress ring */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-white/30 text-[10px] uppercase tracking-widest">Reps</span>
                        <div className="relative flex h-16 w-16 items-center justify-center">
                          <svg className="absolute inset-0" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(340 65% 58% / 0.1)" strokeWidth="3" />
                            <circle
                              cx="32" cy="32" r="28" fill="none"
                              stroke="hsl(340 65% 58% / 0.4)"
                              strokeWidth="3" strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - Math.min(repCount / (cur.sets * cur.reps), 1))}`}
                              transform="rotate(-90 32 32)"
                              style={{ transition: "stroke-dashoffset 0.3s ease" }}
                            />
                          </svg>
                          <motion.span
                            key={repCount}
                            initial={{ scale: 1.4 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            className="text-2xl font-bold text-primary relative z-10"
                          >
                            {repCount}
                          </motion.span>
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

              <div className="flex items-center gap-5 mt-6">
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

              <div className="w-full mt-6 max-w-md">
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
  );
};

export default WorkoutPlayer;
