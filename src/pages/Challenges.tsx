import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Clock, Trophy, CheckCircle2, Sparkles, ArrowRight, Flame, Dumbbell, Timer, Zap, Footprints, StretchHorizontal, Sunrise } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useStore, CHALLENGES, BADGES } from "@/lib/store";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const challengeIconMap: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  flame: { icon: Flame, bg: "bg-gradient-to-br from-pink-100 to-rose-50", color: "text-primary" },
  dumbbell: { icon: Dumbbell, bg: "bg-gradient-to-br from-lavender/40 to-purple-50", color: "text-purple-500" },
  timer: { icon: Timer, bg: "bg-gradient-to-br from-blue-50 to-sky-100", color: "text-blue-500" },
  zap: { icon: Zap, bg: "bg-gradient-to-br from-amber-50 to-yellow-100", color: "text-amber-500" },
  footprints: { icon: Footprints, bg: "bg-gradient-to-br from-emerald-50 to-green-100", color: "text-emerald-500" },
  "stretch-horizontal": { icon: StretchHorizontal, bg: "bg-gradient-to-br from-violet-50 to-fuchsia-50", color: "text-violet-500" },
  sunrise: { icon: Sunrise, bg: "bg-gradient-to-br from-orange-50 to-amber-50", color: "text-orange-500" },
};

const cardAnim = (i: number) => ({
  initial: { opacity: 0, y: 24 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
});

const Challenges = () => {
  const { currentUser, joinChallenge, progressChallenge } = useStore();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <Target className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to view Challenges</h2>
          <p className="text-muted-foreground mb-6">Join challenges, earn points, and compete with friends.</p>
          <Button onClick={() => navigate("/auth")} className="rounded-2xl px-8 h-12 font-semibold shadow-md shadow-primary/20">
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  const joinedCount = currentUser.joinedChallenges.length;
  const completedCount = CHALLENGES.filter(
    (c) => currentUser.joinedChallenges.includes(c.id) && (currentUser.challengeProgress[c.id] ?? 0) >= c.target
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pt-8 pb-20">
        {/* Header */}
        <motion.div {...cardAnim(0)} className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Target className="h-7 w-7 text-primary" /> Fitness Challenges
          </h1>
          <p className="text-muted-foreground">Join challenges, earn points, and unlock badges.</p>
          {/* Stats strip */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 rounded-xl bg-blush/50 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{joinedCount} Joined</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-lavender/20 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-semibold">{completedCount} Completed</span>
            </div>
          </div>
        </motion.div>

        {/* Challenge grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {CHALLENGES.map((ch, i) => {
            const joined = currentUser.joinedChallenges.includes(ch.id);
            const progress = currentUser.challengeProgress[ch.id] ?? 0;
            const pct = joined ? Math.round((progress / ch.target) * 100) : 0;
            const done = progress >= ch.target;

            // Badge preview for this challenge
            const rewardBadge = done ? BADGES.find((b) => b.id === "challenge_winner") : null;

            return (
              <motion.div
                key={ch.id}
                {...cardAnim(i + 1)}
                className={`glass-card rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 ${
                  done ? "ring-1 ring-primary/20 bg-gradient-to-br from-blush/30 to-card" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {(() => {
                    const iconData = challengeIconMap[ch.icon];
                    if (!iconData) return <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl">{ch.icon}</div>;
                    const IconComp = iconData.icon;
                    return (
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${iconData.bg} shadow-sm`}
                      >
                        <IconComp className={`h-5.5 w-5.5 ${iconData.color}`} size={22} strokeWidth={1.8} />
                      </motion.div>
                    );
                  })()}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold">{ch.title}</h3>
                      {done && (
                        <Badge className="rounded-lg bg-primary/10 text-primary border-0 gap-1 text-[10px]">
                          <CheckCircle2 className="h-3 w-3" /> Complete
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{ch.description}</p>

                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1">
                        <Clock className="h-3 w-3" /> {ch.duration}
                      </span>
                      <span className="flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1">
                        <Trophy className="h-3 w-3" /> +{ch.reward} pts
                      </span>
                      <span className="rounded-md bg-secondary/60 px-2 py-1">
                        {ch.target} {ch.unit}
                      </span>
                    </div>

                    {joined && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-medium">Progress</span>
                          <span className="font-semibold text-primary">{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-2.5 rounded-full" />
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {progress} / {ch.target} {ch.unit}
                        </p>
                      </div>
                    )}

                    {/* Badge reward preview */}
                    {done && rewardBadge && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-blush/40 px-3 py-2">
                        <span className="text-lg">{rewardBadge.icon}</span>
                        <div>
                          <p className="text-xs font-semibold">Badge Earned!</p>
                          <p className="text-[10px] text-muted-foreground">{rewardBadge.title}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      {!joined ? (
                        <Button
                          onClick={() => { joinChallenge(ch.id); toast.success(`Joined "${ch.title}"! 🚀`); }}
                          className="rounded-xl font-semibold shadow-sm shadow-primary/10 gap-1.5"
                        >
                          Join Challenge <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : !done ? (
                        <Button
                          variant="secondary"
                          onClick={() => { progressChallenge(ch.id); toast.success("+1 progress! Keep going 💪"); }}
                          className="rounded-xl font-semibold"
                        >
                          Log Progress (+1)
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Challenges;
