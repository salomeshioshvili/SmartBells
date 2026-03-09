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
   CSS STYLES — Detailed character with per-body-part animations
   ═══════════════════════════════════════════════════════════════════ */
const playerCSS = `
/* ── Character structure ── */
.char {
  position: relative;
  width: 160px;
  height: 280px;
  margin: 0 auto;
}

/* Head */
.c-head {
  position: absolute;
  width: 38px; height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
  top: 0; left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 24px hsl(var(--primary) / 0.35);
  z-index: 4;
}
.c-head::before, .c-head::after {
  content: '';
  position: absolute;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: hsl(var(--primary-foreground) / 0.8);
  top: 15px;
}
.c-head::before { left: 11px; }
.c-head::after { right: 11px; }

/* Neck */
.c-neck {
  position: absolute;
  width: 10px; height: 12px;
  background: hsl(var(--primary) / 0.7);
  border-radius: 4px;
  top: 36px; left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

/* Torso */
.c-torso {
  position: absolute;
  width: 40px; height: 65px;
  background: linear-gradient(180deg, hsl(var(--primary)), hsl(var(--primary) / 0.85));
  border-radius: 12px 12px 8px 8px;
  top: 46px; left: 50%;
  transform: translateX(-50%);
  transform-origin: top center;
  z-index: 2;
}

/* Shoulders */
.c-shoulder {
  position: absolute;
  width: 16px; height: 14px;
  background: hsl(var(--primary) / 0.9);
  border-radius: 8px;
  top: 48px;
  z-index: 3;
}
.c-shoulder.left { left: calc(50% - 36px); }
.c-shoulder.right { left: calc(50% + 20px); }

/* Upper arms */
.c-upper-arm {
  position: absolute;
  width: 12px; height: 36px;
  background: hsl(var(--primary) / 0.8);
  border-radius: 6px;
  top: 56px;
  transform-origin: top center;
  z-index: 1;
}
.c-upper-arm.left { left: calc(50% - 34px); }
.c-upper-arm.right { left: calc(50% + 22px); }

/* Forearms */
.c-forearm {
  position: absolute;
  width: 10px; height: 30px;
  background: hsl(var(--primary) / 0.7);
  border-radius: 5px;
  top: 88px;
  transform-origin: top center;
  z-index: 1;
}
.c-forearm.left { left: calc(50% - 32px); }
.c-forearm.right { left: calc(50% + 22px); }

/* Hands */
.c-hand {
  position: absolute;
  width: 10px; height: 10px;
  background: hsl(var(--primary) / 0.9);
  border-radius: 50%;
  top: 116px;
  z-index: 1;
}
.c-hand.left { left: calc(50% - 32px); }
.c-hand.right { left: calc(50% + 22px); }

/* Hips */
.c-hips {
  position: absolute;
  width: 36px; height: 14px;
  background: hsl(var(--primary) / 0.85);
  border-radius: 6px 6px 10px 10px;
  top: 110px; left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

/* Thighs */
.c-thigh {
  position: absolute;
  width: 14px; height: 50px;
  background: hsl(var(--primary) / 0.75);
  border-radius: 7px;
  top: 122px;
  transform-origin: top center;
  z-index: 1;
}
.c-thigh.left { left: calc(50% - 18px); }
.c-thigh.right { left: calc(50% + 4px); }

/* Shins */
.c-shin {
  position: absolute;
  width: 12px; height: 46px;
  background: hsl(var(--primary) / 0.65);
  border-radius: 6px;
  top: 170px;
  transform-origin: top center;
  z-index: 1;
}
.c-shin.left { left: calc(50% - 16px); }
.c-shin.right { left: calc(50% + 4px); }

/* Feet */
.c-foot {
  position: absolute;
  width: 18px; height: 8px;
  background: hsl(var(--primary) / 0.8);
  border-radius: 4px 10px 4px 4px;
  top: 214px;
  z-index: 1;
}
.c-foot.left { left: calc(50% - 20px); }
.c-foot.right { left: calc(50% + 2px); }

/* ═══════ SQUATS ═══════ */
.anim-squats .c-head { animation: sq-head 2s ease-in-out infinite; }
.anim-squats .c-torso { animation: sq-torso 2s ease-in-out infinite; }
.anim-squats .c-hips { animation: sq-hips 2s ease-in-out infinite; }
.anim-squats .c-thigh { animation: sq-thigh 2s ease-in-out infinite; }
.anim-squats .c-shin { animation: sq-shin 2s ease-in-out infinite; }
.anim-squats .c-foot { animation: sq-foot 2s ease-in-out infinite; }
.anim-squats .c-upper-arm { animation: sq-arms 2s ease-in-out infinite; }
.anim-squats .c-forearm { animation: sq-forearms 2s ease-in-out infinite; }
.anim-squats .c-hand { animation: sq-hands 2s ease-in-out infinite; }
.anim-squats .c-neck { animation: sq-neck 2s ease-in-out infinite; }
.anim-squats .c-shoulder { animation: sq-shoulder 2s ease-in-out infinite; }
@keyframes sq-head { 0%,100% { top:0; } 50% { top:40px; } }
@keyframes sq-neck { 0%,100% { top:36px; } 50% { top:76px; } }
@keyframes sq-torso { 0%,100% { height:65px; top:46px; } 50% { height:50px; top:82px; } }
@keyframes sq-shoulder { 0%,100% { top:48px; } 50% { top:84px; } }
@keyframes sq-hips { 0%,100% { top:110px; } 50% { top:130px; } }
@keyframes sq-thigh { 0%,100% { top:122px; height:50px; } 50% { top:136px; height:38px; } }
@keyframes sq-shin { 0%,100% { top:170px; } 50% { top:172px; } }
@keyframes sq-foot { 0%,100% { top:214px; } 50% { top:214px; } }
@keyframes sq-arms { 0%,100% { transform: rotate(0deg); top:56px; } 50% { transform: rotate(-50deg); top:88px; } }
@keyframes sq-forearms { 0%,100% { top:88px; transform:rotate(0deg); } 50% { top:105px; transform:rotate(-40deg); } }
@keyframes sq-hands { 0%,100% { top:116px; } 50% { top:120px; } }

/* ═══════ LUNGES ═══════ */
.anim-lunges .c-head { animation: lu-head 2.2s ease-in-out infinite; }
.anim-lunges .c-neck { animation: lu-neck 2.2s ease-in-out infinite; }
.anim-lunges .c-torso { animation: lu-torso 2.2s ease-in-out infinite; }
.anim-lunges .c-thigh.left { animation: lu-thigh-l 2.2s ease-in-out infinite; }
.anim-lunges .c-thigh.right { animation: lu-thigh-r 2.2s ease-in-out infinite; }
.anim-lunges .c-shin.left { animation: lu-shin-l 2.2s ease-in-out infinite; }
.anim-lunges .c-shin.right { animation: lu-shin-r 2.2s ease-in-out infinite; }
.anim-lunges .c-hips { animation: lu-hips 2.2s ease-in-out infinite; }
@keyframes lu-head { 0%,100% { top:0; } 50% { top:30px; } }
@keyframes lu-neck { 0%,100% { top:36px; } 50% { top:66px; } }
@keyframes lu-torso { 0%,100% { top:46px; } 50% { top:74px; } }
@keyframes lu-hips { 0%,100% { top:110px; } 50% { top:128px; } }
@keyframes lu-thigh-l { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-35deg); } }
@keyframes lu-thigh-r { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(30deg); } }
@keyframes lu-shin-l { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } }
@keyframes lu-shin-r { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-20deg); } }

/* ═══════ PUSH-UPS ═══════ */
.anim-pushups { transform: rotate(75deg) scale(0.7) translateX(-30px); transform-origin: center; }
.anim-pushups .c-upper-arm { animation: pu-arms 1.6s ease-in-out infinite; }
.anim-pushups .c-forearm { animation: pu-forearms 1.6s ease-in-out infinite; }
.anim-pushups .c-torso { animation: pu-torso 1.6s ease-in-out infinite; }
.anim-pushups .c-head { animation: pu-head 1.6s ease-in-out infinite; }
@keyframes pu-arms { 0%,100% { height:36px; } 50% { height:24px; } }
@keyframes pu-forearms { 0%,100% { height:30px; top:88px; } 50% { height:22px; top:78px; } }
@keyframes pu-torso { 0%,100% { transform: translateX(-50%) rotate(0deg); } 50% { transform: translateX(-50%) rotate(4deg); } }
@keyframes pu-head { 0%,100% { transform: translateX(-50%) rotate(0deg); } 50% { transform: translateX(-50%) rotate(5deg); } }

/* ═══════ JUMPING JACKS ═══════ */
.anim-jumpingjacks .c-upper-arm.left { animation: jj-ua-l 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-upper-arm.right { animation: jj-ua-r 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-forearm.left { animation: jj-fa-l 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-forearm.right { animation: jj-fa-r 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-hand.left { animation: jj-h-l 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-hand.right { animation: jj-h-r 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-thigh.left { animation: jj-th-l 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-thigh.right { animation: jj-th-r 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-shin.left { animation: jj-sh-l 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-shin.right { animation: jj-sh-r 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-foot.left { animation: jj-ft-l 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-foot.right { animation: jj-ft-r 0.9s ease-in-out infinite; }
.anim-jumpingjacks .c-head { animation: jj-head 0.9s ease-in-out infinite; }
@keyframes jj-ua-l { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-70deg); } }
@keyframes jj-ua-r { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(70deg); } }
@keyframes jj-fa-l { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-30deg); } }
@keyframes jj-fa-r { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(30deg); } }
@keyframes jj-h-l { 0%,100% { left: calc(50% - 32px); } 50% { left: calc(50% - 54px); } }
@keyframes jj-h-r { 0%,100% { left: calc(50% + 22px); } 50% { left: calc(50% + 44px); } }
@keyframes jj-th-l { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-20deg); } }
@keyframes jj-th-r { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(20deg); } }
@keyframes jj-sh-l { 0%,100% { left: calc(50% - 16px); } 50% { left: calc(50% - 24px); } }
@keyframes jj-sh-r { 0%,100% { left: calc(50% + 4px); } 50% { left: calc(50% + 12px); } }
@keyframes jj-ft-l { 0%,100% { left: calc(50% - 20px); } 50% { left: calc(50% - 30px); } }
@keyframes jj-ft-r { 0%,100% { left: calc(50% + 2px); } 50% { left: calc(50% + 12px); } }
@keyframes jj-head { 0%,100% { top:0; } 50% { top:-10px; } }

/* ═══════ PLANK ═══════ */
.anim-plank { transform: rotate(75deg) scale(0.7) translateX(-30px); transform-origin: center; }
.anim-plank .c-torso { animation: pk-torso 3s ease-in-out infinite; }
.anim-plank .c-head { animation: pk-head 3s ease-in-out infinite; }
@keyframes pk-torso { 0%,100% { height:65px; } 50% { height:67px; } }
@keyframes pk-head { 0%,100% { transform: translateX(-50%); } 50% { transform: translateX(-50%) translateY(2px); } }

/* ═══════ GLUTE BRIDGES ═══════ */
.anim-glutebridges { transform: rotate(75deg) scale(0.7) translateX(-30px); transform-origin: center; }
.anim-glutebridges .c-hips { animation: gb-hips 2s ease-in-out infinite; }
.anim-glutebridges .c-torso { animation: gb-torso 2s ease-in-out infinite; }
.anim-glutebridges .c-thigh { animation: gb-thigh 2s ease-in-out infinite; }
@keyframes gb-hips { 0%,100% { top:110px; } 50% { top:96px; } }
@keyframes gb-torso { 0%,100% { transform: translateX(-50%) rotate(0deg); } 50% { transform: translateX(-50%) rotate(-8deg); } }
@keyframes gb-thigh { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-15deg); } }

/* ═══════ DEADLIFT ═══════ */
.anim-deadlift .c-torso { animation: dl-torso 2.4s ease-in-out infinite; }
.anim-deadlift .c-head { animation: dl-head 2.4s ease-in-out infinite; }
.anim-deadlift .c-neck { animation: dl-neck 2.4s ease-in-out infinite; }
.anim-deadlift .c-upper-arm { animation: dl-ua 2.4s ease-in-out infinite; }
.anim-deadlift .c-forearm { animation: dl-fa 2.4s ease-in-out infinite; }
.anim-deadlift .c-shoulder { animation: dl-sh 2.4s ease-in-out infinite; }
@keyframes dl-torso { 0%,100% { transform: translateX(-50%) rotate(0deg); } 50% { transform: translateX(-50%) rotate(50deg); } }
@keyframes dl-head { 0%,100% { top:0; left:50%; } 50% { top:38px; left:calc(50% + 28px); } }
@keyframes dl-neck { 0%,100% { top:36px; } 50% { top:68px; left:calc(50% + 14px); } }
@keyframes dl-sh { 0%,100% { top:48px; } 50% { top:76px; } }
@keyframes dl-ua { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(35deg); } }
@keyframes dl-fa { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(20deg); } }

/* ═══════ DONKEY KICKS ═══════ */
.anim-donkeykicks { transform: rotate(75deg) scale(0.65) translateX(-30px); transform-origin: center; }
.anim-donkeykicks .c-thigh.right { animation: dk-thigh 1.4s ease-in-out infinite; }
.anim-donkeykicks .c-shin.right { animation: dk-shin 1.4s ease-in-out infinite; }
.anim-donkeykicks .c-foot.right { animation: dk-foot 1.4s ease-in-out infinite; }
@keyframes dk-thigh { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-50deg); } }
@keyframes dk-shin { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-35deg); } }
@keyframes dk-foot { 0%,100% { top:214px; } 50% { top:190px; } }

/* ═══════ GENERIC ═══════ */
.anim-generic .c-upper-arm.left { animation: gn-ua 1.4s ease-in-out infinite; }
.anim-generic .c-upper-arm.right { animation: gn-ua 1.4s ease-in-out infinite reverse; }
.anim-generic .c-forearm.left { animation: gn-fa 1.4s ease-in-out infinite; }
.anim-generic .c-forearm.right { animation: gn-fa 1.4s ease-in-out infinite reverse; }
@keyframes gn-ua { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-45deg); } }
@keyframes gn-fa { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-20deg); } }

/* ═══════ BREATHING (rest) ═══════ */
.breathing .c-torso { animation: breathe 3s ease-in-out infinite !important; }
.breathing .c-shoulder { animation: breathe-sh 3s ease-in-out infinite !important; }
@keyframes breathe { 0%,100% { width:40px; height:65px; } 50% { width:44px; height:68px; } }
@keyframes breathe-sh { 0%,100% { top:48px; } 50% { top:46px; } }

/* ═══════ CONFETTI ═══════ */
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

/* ═══════ REP PULSE ═══════ */
.rep-pulse { animation: rep-p 2s ease-in-out infinite; }
@keyframes rep-p { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }

/* ═══════ MUSCLE DIAGRAM ═══════ */
.muscle-sil {
  position: relative;
  width: 50px;
  height: 120px;
}
.m-part {
  position: absolute;
  border-radius: 4px;
  background: hsl(var(--primary) / 0.12);
  transition: background 0.5s ease, box-shadow 0.5s ease;
}
.m-part.active {
  background: hsl(var(--primary) / 0.6);
  box-shadow: 0 0 12px hsl(var(--primary) / 0.4);
}
.m-head-s { width:14px; height:14px; border-radius:50%; top:0; left:18px; }
.m-torso-s { width:22px; height:30px; top:16px; left:14px; border-radius:6px; }
.m-arm-l-s { width:8px; height:28px; top:18px; left:4px; border-radius:4px; }
.m-arm-r-s { width:8px; height:28px; top:18px; left:38px; border-radius:4px; }
.m-core-s { width:18px; height:14px; top:34px; left:16px; border-radius:4px; }
.m-glute-s { width:22px; height:10px; top:48px; left:14px; border-radius:4px; }
.m-leg-l-s { width:10px; height:36px; top:58px; left:10px; border-radius:5px; }
.m-leg-r-s { width:10px; height:36px; top:58px; left:30px; border-radius:5px; }
.m-sh-l-s { width:10px; height:8px; top:14px; left:6px; border-radius:4px; }
.m-sh-r-s { width:10px; height:8px; top:14px; left:34px; border-radius:4px; }
`;

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */
const Character = ({ animType, breathing }: { animType: AnimType; breathing?: boolean }) => (
  <div className={`char ${breathing ? "breathing" : `anim-${animType}`}`}>
    <div className="c-head" />
    <div className="c-neck" />
    <div className="c-shoulder left" />
    <div className="c-shoulder right" />
    <div className="c-torso" />
    <div className="c-upper-arm left" />
    <div className="c-upper-arm right" />
    <div className="c-forearm left" />
    <div className="c-forearm right" />
    <div className="c-hand left" />
    <div className="c-hand right" />
    <div className="c-hips" />
    <div className="c-thigh left" />
    <div className="c-thigh right" />
    <div className="c-shin left" />
    <div className="c-shin right" />
    <div className="c-foot left" />
    <div className="c-foot right" />
  </div>
);

const MuscleDiagram = ({ active }: { active: MuscleGroup[] }) => {
  const is = (g: MuscleGroup) => active.includes(g) || active.includes("full");
  return (
    <div className="muscle-sil">
      <div className={`m-part m-head-s`} />
      <div className={`m-part m-torso-s ${is("chest") || is("back") ? "active" : ""}`} />
      <div className={`m-part m-arm-l-s ${is("arms") ? "active" : ""}`} />
      <div className={`m-part m-arm-r-s ${is("arms") ? "active" : ""}`} />
      <div className={`m-part m-sh-l-s ${is("shoulders") ? "active" : ""}`} />
      <div className={`m-part m-sh-r-s ${is("shoulders") ? "active" : ""}`} />
      <div className={`m-part m-core-s ${is("core") ? "active" : ""}`} />
      <div className={`m-part m-glute-s ${is("glutes") ? "active" : ""}`} />
      <div className={`m-part m-leg-l-s ${is("legs") ? "active" : ""}`} />
      <div className={`m-part m-leg-r-s ${is("legs") ? "active" : ""}`} />
    </div>
  );
};

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
   PLAYER
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
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = exercises.length;
  const progress = done ? 100 : ((idx + (resting ? 0.5 : 0)) / total) * 100;

  const clear = useCallback(() => { if (ref.current) { clearInterval(ref.current); ref.current = null; } }, []);

  useEffect(() => {
    if (!open || paused || done) return;
    clear();
    ref.current = setInterval(() => {
      if (resting) {
        setRestTime((t) => {
          if (t <= 1) {
            setResting(false);
            const n = idx + 1;
            if (n >= total) { setDone(true); onComplete?.(); return REST_SECONDS; }
            setIdx(n);
            setTimeLeft(exercises[n].totalSeconds);
            setRepCount(0);
            return REST_SECONDS;
          }
          return t - 1;
        });
      } else {
        setTimeLeft((t) => {
          if (t <= 1) { setResting(true); setRestTime(REST_SECONDS); return 0; }
          // Count reps (~4s per rep)
          if (t % 4 === 0) setRepCount((r) => r + 1);
          return t - 1;
        });
      }
    }, 1000);
    return clear;
  }, [open, paused, resting, idx, done, total, exercises, clear, onComplete]);

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

  return (
    <>
      <style>{playerCSS}</style>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#130d1a]/96 backdrop-blur-lg"
          >
            <Button
              variant="ghost" size="icon" onClick={onClose}
              className="absolute top-4 right-4 z-20 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>

            {done ? (
              /* ── COMPLETE ── */
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative text-center px-6 max-w-md">
                <ConfettiEffect />
                <motion.div initial={{ y: 30 }} animate={{ y: 0 }} transition={{ delay: 0.2 }} className="relative z-10">
                  <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/20 border-2 border-primary/40">
                    <Trophy className="h-14 w-14 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-3">Workout Complete! 🎉</h2>
                  <p className="text-white/50 mb-1">Day {dayIndex + 1}: {day.focus}</p>
                  <p className="text-white/30 text-sm mb-8">You crushed {total} exercises. Amazing work!</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={reset} variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">Restart</Button>
                    <Button onClick={onClose} className="rounded-full bg-primary hover:bg-primary/90">Done</Button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* ── ACTIVE ── */
              <div className="w-full max-w-2xl px-4 md:px-8 flex flex-col items-center">
                <p className="text-white/30 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                  Day {dayIndex + 1} — {day.focus}
                </p>

                <AnimatePresence mode="wait">
                  {resting ? (
                    /* REST */
                    <motion.div
                      key="rest"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.4 }}
                      className="text-center"
                    >
                      <p className="text-white/40 text-sm uppercase tracking-[0.15em] mb-6">Rest & Breathe</p>

                      {/* Breathing character */}
                      <div className="mb-6 flex justify-center items-center h-[280px]">
                        <Character animType="generic" breathing />
                      </div>

                      {/* Circular timer */}
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
                    /* EXERCISE */
                    <motion.div
                      key={`ex-${idx}`}
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.4 }}
                      className="w-full"
                    >
                      {/* Exercise name */}
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

                      {/* Main area: character + muscle diagram */}
                      <div className="flex items-center justify-center gap-8 mb-6">
                        {/* Muscle diagram */}
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

                        {/* Character */}
                        <div className="flex justify-center items-center h-[280px] w-[160px]">
                          <Character animType={cur.anim} />
                        </div>

                        {/* Rep counter */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-white/30 text-[10px] uppercase tracking-widest">Reps</span>
                          <div className="rep-pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20">
                            <span className="text-2xl font-bold text-primary">{repCount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timer */}
                      <div className="text-center">
                        <div className="text-5xl font-mono font-bold text-primary mb-1">{fmt(timeLeft)}</div>
                        <p className="text-white/25 text-xs">Exercise {idx + 1} of {total}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Controls */}
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

                {/* Progress bar */}
                <div className="w-full mt-8 max-w-md">
                  <div className="h-2.5 w-full rounded-full bg-white/8 overflow-hidden">
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
