import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStore, BADGES } from "@/lib/store";
import Navbar from "@/components/Navbar";

const Leaderboard = () => {
  const { currentUser, allUsers } = useStore();

  const sorted = [...allUsers].sort((a, b) => b.points - a.points);
  const friendIds = currentUser ? [currentUser.id, ...currentUser.friends] : [];

  const rankIcon = (i: number) => {
    if (i === 0) return <Crown className="h-5 w-5 text-primary" />;
    if (i === 1) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (i === 2) return <Medal className="h-5 w-5 text-accent-foreground" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{i + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pt-8 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Trophy className="h-7 w-7 text-primary" /> Leaderboard
          </h1>
          <p className="text-muted-foreground mb-8">See how you stack up against the community.</p>
        </motion.div>

        <div className="space-y-2">
          {sorted.map((user, i) => {
            const isMe = user.id === currentUser?.id;
            const isFriend = currentUser?.friends.includes(user.id);
            const userBadges = BADGES.filter((b) => user.badges.includes(b.id));

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card rounded-2xl p-4 flex items-center gap-4 transition-colors ${
                  isMe ? "ring-2 ring-primary/40 bg-blush/30" : isFriend ? "bg-lavender/10" : ""
                }`}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-8 flex justify-center">
                  {rankIcon(i)}
                </div>

                {/* Avatar */}
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  isMe ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                }`}>
                  {user.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">
                      {user.name} {isMe && <span className="text-primary">(You)</span>}
                    </p>
                    {isFriend && (
                      <Badge variant="secondary" className="rounded-md text-[10px] gap-1 px-1.5">
                        <Users className="h-2.5 w-2.5" /> Friend
                      </Badge>
                    )}
                  </div>
                  {/* Badge icons */}
                  {userBadges.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {userBadges.map((b) => (
                        <span key={b.id} title={b.title} className="text-sm">{b.icon}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold">{user.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">points</p>
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
