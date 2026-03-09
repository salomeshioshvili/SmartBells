import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Users, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore, BADGES, CHALLENGES } from "@/lib/store";
import Navbar from "@/components/Navbar";

const cardAnim = (i: number) => ({
  initial: { opacity: 0, y: 24 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
});

const Leaderboard = () => {
  const { currentUser, allUsers } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"global" | "friends">("global");

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to view Leaderboard</h2>
          <p className="text-muted-foreground mb-6">See how you rank against the community.</p>
          <Button onClick={() => navigate("/auth")} className="rounded-2xl px-8 h-12 font-semibold shadow-md shadow-primary/20">
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  const friendIds = [currentUser.id, ...currentUser.friends];
  const filteredUsers = filter === "friends"
    ? allUsers.filter((u) => friendIds.includes(u.id))
    : allUsers;

  const sorted = [...filteredUsers].sort((a, b) => b.points - a.points);
  const top3 = sorted.slice(0, 3);

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ["h-28", "h-36", "h-24"];
  const podiumLabels = ["🥈", "🥇", "🥉"];
  const podiumBg = ["bg-lavender/20", "bg-blush/40", "bg-warm-beige/60"];

  const getChallengesCompleted = (u: typeof currentUser) => {
    return CHALLENGES.filter(
      (c) => u.joinedChallenges.includes(c.id) && (u.challengeProgress[c.id] ?? 0) >= c.target
    ).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-8 pb-20">
        {/* Header */}
        <motion.div {...cardAnim(0)} className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Trophy className="h-7 w-7 text-primary" /> Leaderboard
          </h1>
          <p className="text-muted-foreground">See how you stack up against the community.</p>
        </motion.div>

        {/* Filter */}
        <motion.div {...cardAnim(1)} className="flex gap-2 mb-8">
          <Button
            variant={filter === "global" ? "default" : "secondary"}
            onClick={() => setFilter("global")}
            className="rounded-xl font-semibold gap-1.5"
            size="sm"
          >
            <Trophy className="h-3.5 w-3.5" /> Global
          </Button>
          <Button
            variant={filter === "friends" ? "default" : "secondary"}
            onClick={() => setFilter("friends")}
            className="rounded-xl font-semibold gap-1.5"
            size="sm"
          >
            <Users className="h-3.5 w-3.5" /> Friends
          </Button>
        </motion.div>

        {/* Top 3 Podium */}
        {sorted.length >= 3 && (
          <motion.div {...cardAnim(2)} className="glass-card rounded-3xl p-6 mb-8 bg-gradient-to-br from-blush/20 to-lavender/10">
            <div className="flex items-end justify-center gap-4 md:gap-8">
              {podiumOrder.map((user, i) => {
                const isMe = user.id === currentUser.id;
                const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    {/* Avatar */}
                    <div className={`flex items-center justify-center rounded-full text-lg font-bold mb-2 shadow-lg ${
                      isMe
                        ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                        : "bg-gradient-to-br from-primary/20 to-accent/20 text-primary"
                    } ${realRank === 1 ? "h-16 w-16 ring-4 ring-primary/20" : "h-12 w-12"}`}>
                      {user.name.charAt(0)}
                    </div>
                    <p className="text-sm font-bold truncate max-w-[80px] text-center">
                      {user.name.split(" ")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.points.toLocaleString()} pts</p>

                    {/* Podium block */}
                    <div className={`${podiumHeights[i]} w-20 md:w-24 mt-2 rounded-t-2xl ${podiumBg[i]} flex items-start justify-center pt-3`}>
                      <span className="text-2xl">{podiumLabels[i]}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Full Table */}
        <div className="space-y-2">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-[3rem_1fr_5rem_4rem_4rem] gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Rank</span>
            <span>User</span>
            <span className="text-right">Points</span>
            <span className="text-center">Done</span>
            <span className="text-center">Badges</span>
          </div>

          {sorted.map((user, i) => {
            const isMe = user.id === currentUser.id;
            const isFriend = currentUser.friends.includes(user.id);
            const userBadges = BADGES.filter((b) => user.badges.includes(b.id));
            const challengesDone = getChallengesCompleted(user);

            const rankIcon = () => {
              if (i === 0) return <Crown className="h-5 w-5 text-primary" />;
              if (i === 1) return <Medal className="h-5 w-5 text-muted-foreground" />;
              if (i === 2) return <Medal className="h-5 w-5 text-accent-foreground" />;
              return <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>;
            };

            return (
              <motion.div
                key={user.id}
                {...cardAnim(3 + i)}
                className={`glass-card rounded-2xl p-4 grid grid-cols-[3rem_1fr_auto] sm:grid-cols-[3rem_1fr_5rem_4rem_4rem] gap-3 items-center transition-all hover:shadow-md hover:shadow-primary/5 ${
                  isMe ? "ring-2 ring-primary/30 bg-gradient-to-r from-blush/30 to-card" : isFriend ? "bg-lavender/10" : ""
                }`}
              >
                {/* Rank */}
                <div className="flex justify-center">{rankIcon()}</div>

                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isMe ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" : "bg-primary/10 text-primary"
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold truncate text-sm">
                        {user.name} {isMe && <span className="text-primary">(You)</span>}
                      </p>
                      {isFriend && (
                        <Badge variant="secondary" className="rounded-md text-[10px] gap-0.5 px-1.5 py-0 flex-shrink-0">
                          <Users className="h-2.5 w-2.5" /> Friend
                        </Badge>
                      )}
                    </div>
                    {/* Badge icons — mobile shows here */}
                    {userBadges.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {userBadges.slice(0, 5).map((b) => (
                          <span key={b.id} title={b.title} className="text-xs">{b.icon}</span>
                        ))}
                        {userBadges.length > 5 && (
                          <span className="text-[10px] text-muted-foreground">+{userBadges.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Points — always visible */}
                <div className="text-right sm:block">
                  <p className="text-lg font-extrabold">{user.points.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground hidden sm:block">points</p>
                </div>

                {/* Challenges — desktop */}
                <div className="hidden sm:flex justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold">
                    {challengesDone}
                  </div>
                </div>

                {/* Badge count — desktop */}
                <div className="hidden sm:flex justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold">
                    {userBadges.length}
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

export default Leaderboard;
