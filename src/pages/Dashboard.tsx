import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy, Flame, Star, Users, Target, Dumbbell, ChevronRight,
  UserPlus, Check, X, Clock, Zap, BarChart3, Play, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStore, CHALLENGES, BADGES } from "@/lib/store";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

// Mock activity feed
const ACTIVITY_FEED = [
  { user: "Sophia", action: "completed a HIIT workout", points: 50, icon: "🏋️", time: "2 min ago" },
  { user: "Maya", action: "joined the 10-Day Challenge", points: null, icon: "🚀", time: "15 min ago" },
  { user: "Emma", action: "earned the \"Consistency\" badge", points: null, icon: "🏅", time: "1 hr ago" },
  { user: "Luna", action: "completed a strength workout", points: 50, icon: "💪", time: "2 hrs ago" },
  { user: "Aisha", action: "hit a 3-day streak!", points: 100, icon: "🔥", time: "3 hrs ago" },
];

// Mock today's workout
const TODAYS_WORKOUT = {
  name: "Full Body Strength",
  duration: "45 min",
  intensity: "Medium",
  exercises: 6,
  completion: 0,
};

const cardAnim = (i: number) => ({
  initial: { opacity: 0, y: 24 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
});

const Dashboard = () => {
  const store = useStore();
  const { currentUser, allUsers, completeWorkout, sendFriendRequest, acceptFriendRequest, declineFriendRequest } = store;
  const [friendInput, setFriendInput] = useState("");
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sign in to access your Dashboard</h2>
          <p className="text-muted-foreground mb-6">Track your workouts, challenges, and compete with friends.</p>
          <Button onClick={() => navigate("/auth")} className="rounded-2xl px-8 h-12 font-semibold shadow-md shadow-primary/20">
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  const activeChallenges = CHALLENGES.filter((c) => currentUser.joinedChallenges.includes(c.id));
  const completedChallenges = activeChallenges.filter((c) => (currentUser.challengeProgress[c.id] ?? 0) >= c.target);
  const earnedBadges = BADGES.filter((b) => currentUser.badges.includes(b.id));
  const friends = allUsers.filter((u) => currentUser.friends.includes(u.id));
  const pendingRequests = allUsers.filter((u) => currentUser.friendRequests.includes(u.id));

  // Calculate rank
  const sorted = [...allUsers].sort((a, b) => b.points - a.points);
  const rank = sorted.findIndex((u) => u.id === currentUser.id) + 1;

  const handleSendFriendRequest = () => {
    if (!friendInput.trim()) return;
    const err = sendFriendRequest(friendInput.trim());
    if (err) toast.error(err);
    else { toast.success("Friend request sent! 🎉"); setFriendInput(""); }
  };

  const handleCompleteWorkout = () => {
    completeWorkout();
    toast.success("+50 points! Workout completed 🎉");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-20">
        {/* Welcome Header */}
        <motion.div {...cardAnim(0)} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-bold shadow-lg shadow-primary/20">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {currentUser.name.split(" ")[0]}! 👋</h1>
              <p className="mt-1 text-muted-foreground">Stay consistent and track your progress.</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Total Points", value: currentUser.points.toLocaleString(), icon: <Star className="h-5 w-5" />, gradient: "from-primary/10 to-blush" },
            { label: "Workout Streak", value: `${currentUser.streak} days`, icon: <Flame className="h-5 w-5" />, gradient: "from-accent/10 to-lavender/30" },
            { label: "Challenges Done", value: completedChallenges.length, icon: <Trophy className="h-5 w-5" />, gradient: "from-warm-beige to-blush/30" },
            { label: "Current Rank", value: `#${rank}`, icon: <BarChart3 className="h-5 w-5" />, gradient: "from-lavender/20 to-accent/10" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              {...cardAnim(i + 1)}
              className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${s.gradient} hover:shadow-lg hover:shadow-primary/5 transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {s.icon}
                </div>
              </div>
              <p className="text-3xl font-extrabold">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Today's Workout Card */}
        <motion.div {...cardAnim(5)} className="mb-8">
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Dumbbell className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">Today's Workout: {TODAYS_WORKOUT.name}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {TODAYS_WORKOUT.duration}</span>
                  <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> {TODAYS_WORKOUT.intensity}</span>
                  <span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> {TODAYS_WORKOUT.exercises} exercises</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">Completion</span>
                    <span className="text-muted-foreground">{currentUser.workoutsCompleted > 0 ? "100%" : "0%"}</span>
                  </div>
                  <Progress value={currentUser.workoutsCompleted > 0 ? 100 : 0} className="h-2 rounded-full" />
                </div>
              </div>
              <Button
                onClick={handleCompleteWorkout}
                className="rounded-2xl px-6 h-12 font-semibold shadow-md shadow-primary/20 gap-2 flex-shrink-0"
              >
                <Play className="h-4 w-4" /> Start Workout
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Challenges */}
            <motion.section {...cardAnim(6)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" /> Active Challenges
                </h2>
                <Link to="/challenges" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              {activeChallenges.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Target className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="font-medium mb-1">No active challenges</p>
                  <p className="text-sm text-muted-foreground mb-4">Join a challenge to earn bonus points!</p>
                  <Link to="/challenges">
                    <Button variant="secondary" className="rounded-xl font-semibold">Browse Challenges</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeChallenges.slice(0, 3).map((ch) => {
                    const progress = currentUser.challengeProgress[ch.id] ?? 0;
                    const pct = Math.round((progress / ch.target) * 100);
                    const done = progress >= ch.target;
                    return (
                      <div key={ch.id} className="glass-card rounded-2xl p-5 hover:shadow-md hover:shadow-primary/5 transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{ch.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{ch.title}</h3>
                              {done && (
                                <Badge className="rounded-lg bg-primary/10 text-primary border-0 text-[10px]">Complete ✓</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{ch.duration} · +{ch.reward} pts</p>
                          </div>
                          <span className="text-sm font-bold text-primary">{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-2 rounded-full" />
                        <p className="mt-2 text-xs text-muted-foreground">{progress} / {ch.target} {ch.unit} · {ch.target - progress} remaining</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.section>

            {/* Badges */}
            <motion.section {...cardAnim(7)}>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-primary" /> Your Badges
              </h2>
              {earnedBadges.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Trophy className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="font-medium mb-1">No badges yet</p>
                  <p className="text-sm text-muted-foreground">Complete workouts and challenges to earn badges!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {earnedBadges.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="glass-card rounded-2xl p-4 text-center hover:shadow-md hover:shadow-primary/5 transition-all hover:-translate-y-0.5"
                    >
                      <span className="text-3xl mb-2 block">{b.icon}</span>
                      <p className="text-sm font-semibold">{b.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{b.description}</p>
                    </motion.div>
                  ))}
                </div>
              )}
              {/* Locked badges */}
              {BADGES.filter((b) => !currentUser.badges.includes(b.id)).length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Locked</p>
                  <div className="flex flex-wrap gap-2">
                    {BADGES.filter((b) => !currentUser.badges.includes(b.id)).map((b) => (
                      <div key={b.id} className="flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                        <span className="opacity-40">{b.icon}</span> {b.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Friends Activity Feed */}
            <motion.section {...cardAnim(8)}>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" /> Activity Feed
              </h2>
              <div className="space-y-2">
                {ACTIVITY_FEED.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="glass-card rounded-xl p-3.5 flex items-start gap-3"
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{item.user}</span>{" "}
                        <span className="text-foreground/75">{item.action}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">{item.time}</span>
                        {item.points && (
                          <Badge variant="secondary" className="rounded-md text-[10px] px-1.5 py-0">
                            +{item.points} pts
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Friends */}
            <motion.section {...cardAnim(9)}>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" /> Friends
              </h2>

              {/* Add friend */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={friendInput}
                  onChange={(e) => setFriendInput(e.target.value)}
                  placeholder="Email or name…"
                  className="h-10 rounded-xl bg-secondary/50 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSendFriendRequest()}
                />
                <Button size="icon" className="h-10 w-10 rounded-xl flex-shrink-0" onClick={handleSendFriendRequest}>
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>

              {/* Pending requests */}
              {pendingRequests.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Requests</p>
                  {pendingRequests.map((u) => (
                    <div key={u.id} className="glass-card rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground">{u.points} pts</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10" onClick={() => { acceptFriendRequest(u.id); toast.success(`${u.name} added!`); }}>
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
                  Add friends to compete together!
                </div>
              ) : (
                <div className="space-y-2">
                  {friends.map((f) => (
                    <div key={f.id} className="glass-card rounded-xl p-3.5 flex items-center gap-3 hover:shadow-sm transition-shadow">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-bold text-primary">
                        {f.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.points} pts · {f.streak}🔥</p>
                      </div>
                      {f.joinedChallenges.length > 0 && (
                        <Badge variant="secondary" className="rounded-lg text-[10px]">
                          {f.joinedChallenges.length} active
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.section>

            {/* Leaderboard teaser */}
            <motion.div {...cardAnim(10)}>
              <Link to="/leaderboard" className="block glass-card rounded-2xl p-5 bg-gradient-to-r from-primary/5 to-accent/5 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /> Leaderboard</p>
                    <p className="text-xs text-muted-foreground mt-1">You're ranked #{rank} — see full rankings</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
