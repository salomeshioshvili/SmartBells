import { motion } from "framer-motion";
import { Target, Clock, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useStore, CHALLENGES } from "@/lib/store";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Challenges = () => {
  const { currentUser, joinChallenge, progressChallenge } = useStore();

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-8 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Target className="h-7 w-7 text-primary" /> Fitness Challenges
          </h1>
          <p className="text-muted-foreground mb-8">Join challenges, earn points, and unlock badges.</p>
        </motion.div>

        <div className="space-y-4">
          {CHALLENGES.map((ch, i) => {
            const joined = currentUser.joinedChallenges.includes(ch.id);
            const progress = currentUser.challengeProgress[ch.id] ?? 0;
            const pct = joined ? Math.round((progress / ch.target) * 100) : 0;
            const done = progress >= ch.target;

            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{ch.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold">{ch.title}</h3>
                      {done && (
                        <Badge className="rounded-lg bg-primary/10 text-primary border-0 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Complete
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{ch.description}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ch.duration}</span>
                      <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> +{ch.reward} pts</span>
                      <span>{ch.target} {ch.unit}</span>
                    </div>

                    {joined && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-medium">Progress</span>
                          <span className="text-muted-foreground">{progress} / {ch.target} {ch.unit}</span>
                        </div>
                        <Progress value={pct} className="h-2.5 rounded-full" />
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      {!joined ? (
                        <Button
                          onClick={() => { joinChallenge(ch.id); toast.success(`Joined "${ch.title}"! 🚀`); }}
                          className="rounded-xl font-semibold shadow-sm shadow-primary/10"
                        >
                          Join Challenge
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
