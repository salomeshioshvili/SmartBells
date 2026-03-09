import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy, Flame, Star, Users, Target, Dumbbell, ChevronRight,
  UserPlus, Check, X, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStore, CHALLENGES, BADGES } from "@/lib/store";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const { currentUser, allUsers, completeWorkout, sendFriendRequest, acceptFriendRequest, declineFriendRequest } = useStore();
  const [friendInput, setFriendInput] = useState("");

  if (!currentUser) return null;

  const activeChallenges = CHALLENGES.filter((c) => currentUser.joinedChallenges.includes(c.id));
  const earnedBadges = BADGES.filter((b) => currentUser.badges.includes(b.id));
  const friends = allUsers.filter((u) => currentUser.friends.includes(u.id));
  const pendingRequests = allUsers.filter((u) => currentUser.friendRequests.includes(u.id));

  const handleSendFriendRequest = () => {
    if (!friendInput.trim()) return;
    const err = sendFriendRequest(friendInput.trim());
    if (err) toast.error(err);
    else { toast.success("Friend request sent!"); setFriendInput(""); }
  };

  const handleCompleteWorkout = () => {
    completeWorkout();
    toast.success("+50 points! Workout completed 🎉");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-20">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold">Hey, {currentUser.name.split(" ")[0]}! 👋</h1>
          <p className="mt-1 text-muted-foreground">Here's your fitness overview.</p>
        </motion.div>

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Total Points", value: currentUser.points.toLocaleString(), icon: <Star className="h-5 w-5 text-primary" />, color: "bg-blush" },
            { label: "Workouts", value: currentUser.workoutsCompleted, icon: <Dumbbell className="h-5 w-5 text-primary" />, color: "bg-warm-beige" },
            { label: "Streak", value: `${currentUser.streak} days`, icon: <Flame className="h-5 w-5 text-primary" />, color: "bg-lavender/30" },
            { label: "Badges", value: earnedBadges.length, icon: <Trophy className="h-5 w-5 text-primary" />, color: "bg-accent/15" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card rounded-2xl p-5 ${s.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
                {s.icon}
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick action */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
          <Button onClick={handleCompleteWorkout} className="h-12 rounded-2xl px-6 font-semibold shadow-md shadow-primary/20 gap-2">
            <Dumbbell className="h-5 w-5" /> Complete Today's Workout (+50 pts)
          </Button>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Challenges */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Active Challenges</h2>
                <Link to="/challenges" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              {activeChallenges.length === 0 ? (
                <div className="glass-card rounded-2xl p-6 text-center text-muted-foreground">
                  No active challenges. <Link to="/challenges" className="text-primary hover:underline">Join one!</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeChallenges.map((ch) => {
                    const progress = currentUser.challengeProgress[ch.id] ?? 0;
                    const pct = Math.round((progress / ch.target) * 100);
                    const done = progress >= ch.target;
                    return (
                      <div key={ch.id} className="glass-card rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{ch.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold">{ch.title}</h3>
                            <p className="text-xs text-muted-foreground">{ch.duration} · +{ch.reward} pts</p>
                          </div>
                          {done && <Badge className="rounded-lg bg-primary/10 text-primary border-0">Complete ✓</Badge>}
                        </div>
                        <Progress value={pct} className="h-2 rounded-full" />
                        <p className="mt-2 text-xs text-muted-foreground">{progress} / {ch.target} {ch.unit}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Badges */}
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Trophy className="h-5 w-5 text-primary" /> Your Badges</h2>
              {earnedBadges.length === 0 ? (
                <div className="glass-card rounded-2xl p-6 text-center text-muted-foreground">
                  Complete workouts and challenges to earn badges!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {earnedBadges.map((b) => (
                    <div key={b.id} className="glass-card rounded-2xl p-4 text-center">
                      <span className="text-3xl mb-2 block">{b.icon}</span>
                      <p className="text-sm font-semibold">{b.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{b.description}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* Locked badges */}
              {BADGES.filter((b) => !currentUser.badges.includes(b.id)).length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Locked</p>
                  <div className="flex flex-wrap gap-2">
                    {BADGES.filter((b) => !currentUser.badges.includes(b.id)).map((b) => (
                      <div key={b.id} className="flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                        <span className="opacity-40">{b.icon}</span> {b.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right column — Friends */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Users className="h-5 w-5 text-primary" /> Friends</h2>

              {/* Add friend */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={friendInput}
                  onChange={(e) => setFriendInput(e.target.value)}
                  placeholder="Email or name…"
                  className="h-10 rounded-xl bg-secondary/50 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSendFriendRequest()}
                />
                <Button size="icon" className="h-10 w-10 rounded-xl flex-shrink-0 bg-primary hover:bg-primary/90" onClick={handleSendFriendRequest}>
                  <Dumbbell className="h-4 w-4 text-primary-foreground" />
                </Button>
              </div>

              {/* Pending requests */}
              {pendingRequests.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requests</p>
                  {pendingRequests.map((u) => (
                    <div key={u.id} className="glass-card rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.points} pts</p>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10" onClick={() => { acceptFriendRequest(u.id); toast.success(`${u.name} added as friend!`); }}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10" onClick={() => declineFriendRequest(u.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Friends list */}
              {friends.length === 0 ? (
                <div className="glass-card rounded-2xl p-5 text-center text-sm text-muted-foreground">
                  Add friends by email or name to compete together!
                </div>
              ) : (
                <div className="space-y-2">
                  {friends.map((f) => (
                    <div key={f.id} className="glass-card rounded-xl p-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {f.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.points} pts · {f.streak}🔥</p>
                      </div>
                      {f.joinedChallenges.length > 0 && (
                        <Badge variant="secondary" className="rounded-lg text-[10px]">
                          {f.joinedChallenges.length} challenge{f.joinedChallenges.length > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Leaderboard teaser */}
            <Link to="/leaderboard" className="block glass-card rounded-2xl p-5 hover:bg-secondary/40 transition-colors group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /> Leaderboard</p>
                  <p className="text-xs text-muted-foreground mt-1">See how you rank against others</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
