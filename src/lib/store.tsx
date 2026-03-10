import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  points: number;
  badges: string[];
  streak: number;
  workoutsCompleted: number;
  joinedChallenges: string[];
  challengeProgress: Record<string, number>;
  friends: string[];
  friendRequests: string[];
  sentRequests: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: string;
  reward: number;
  duration: string;
  icon: string;
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// ── Seed Data ──────────────────────────────────────────────────────
export const CHALLENGES: Challenge[] = [
  { id: "streak7", title: "7-Day Workout Streak", description: "Complete a workout every day for 7 days straight.", target: 7, unit: "days", reward: 300, duration: "7 days", icon: "flame" },
  { id: "ten2w", title: "10 Workouts in 2 Weeks", description: "Complete 10 workouts within 14 days.", target: 10, unit: "workouts", reward: 500, duration: "2 weeks", icon: "dumbbell" },
  { id: "daily30", title: "30-Min Daily Movement", description: "Move for at least 30 minutes daily for 5 days.", target: 5, unit: "days", reward: 250, duration: "5 days", icon: "timer" },
  { id: "weekend", title: "Weekend Warrior", description: "Complete 2 workouts during the weekend.", target: 2, unit: "workouts", reward: 150, duration: "Weekend", icon: "zap" },
  { id: "steps", title: "Step Challenge", description: "Hit 10,000 steps a day for 5 days.", target: 5, unit: "days", reward: 200, duration: "5 days", icon: "footprints" },
  { id: "flex5", title: "Flexibility Focus", description: "Complete 5 flexibility or yoga sessions.", target: 5, unit: "sessions", reward: 200, duration: "Ongoing", icon: "stretch-horizontal" },
  { id: "early", title: "Early Bird", description: "Complete 3 morning workouts before 8 AM.", target: 3, unit: "workouts", reward: 150, duration: "Ongoing", icon: "sunrise" },
];

export const BADGES: BadgeDef[] = [
  { id: "first_workout", title: "First Workout", description: "Generated your first workout plan", icon: "⭐" },
  { id: "streak3", title: "3-Day Streak", description: "Maintained a 3-day workout streak", icon: "🔥" },
  { id: "streak7", title: "7-Day Streak", description: "Maintained a 7-day workout streak", icon: "💎" },
  { id: "challenge_winner", title: "Challenge Winner", description: "Completed a fitness challenge", icon: "🏆" },
  { id: "social_butterfly", title: "Social Butterfly", description: "Added 3 friends", icon: "🦋" },
  { id: "top_performer", title: "Top Performer", description: "Reached 1000 points", icon: "👑" },
  { id: "ten_workouts", title: "Dedicated", description: "Completed 10 workouts", icon: "💪" },
];

const DEMO_USERS: User[] = [
  { id: "demo1", name: "Sophia Chen", email: "sophia@demo.com", password: "", points: 1250, badges: ["first_workout", "streak7", "challenge_winner", "top_performer"], streak: 8, workoutsCompleted: 24, joinedChallenges: ["streak7", "ten2w"], challengeProgress: { streak7: 7, ten2w: 8 }, friends: ["demo2"], friendRequests: [], sentRequests: [] },
  { id: "demo2", name: "Maya Rodriguez", email: "maya@demo.com", password: "", points: 980, badges: ["first_workout", "streak3", "ten_workouts"], streak: 5, workoutsCompleted: 16, joinedChallenges: ["daily30"], challengeProgress: { daily30: 5 }, friends: ["demo1"], friendRequests: [], sentRequests: [] },
  { id: "demo3", name: "Aisha Patel", email: "aisha@demo.com", password: "", points: 720, badges: ["first_workout", "streak3"], streak: 3, workoutsCompleted: 11, joinedChallenges: ["steps"], challengeProgress: { steps: 3 }, friends: [], friendRequests: [], sentRequests: [] },
  { id: "demo4", name: "Emma Wilson", email: "emma@demo.com", password: "", points: 450, badges: ["first_workout"], streak: 1, workoutsCompleted: 6, joinedChallenges: ["flex5"], challengeProgress: { flex5: 2 }, friends: [], friendRequests: [], sentRequests: [] },
  { id: "demo5", name: "Luna Kim", email: "luna@demo.com", password: "", points: 1580, badges: ["first_workout", "streak7", "challenge_winner", "top_performer", "ten_workouts"], streak: 12, workoutsCompleted: 32, joinedChallenges: ["streak7", "ten2w", "daily30"], challengeProgress: { streak7: 7, ten2w: 10, daily30: 7 }, friends: ["demo1"], friendRequests: [], sentRequests: [] },
];

// ── Helpers ─────────────────────────────────────────────────────────
const STORAGE_KEY = "smartbells_users";
const AUTH_KEY = "smartbells_auth";

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USERS));
  return [...DEMO_USERS];
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function loadAuth(): string | null {
  return localStorage.getItem(AUTH_KEY);
}

// ── Context ─────────────────────────────────────────────────────────
interface StoreCtx {
  currentUser: User | null;
  allUsers: User[];
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, password: string) => string | null;
  logout: () => void;
  addPoints: (pts: number) => void;
  completeWorkout: () => void;
  joinChallenge: (challengeId: string) => void;
  progressChallenge: (challengeId: string, amount?: number) => void;
  sendFriendRequest: (emailOrName: string) => string | null;
  acceptFriendRequest: (userId: string) => void;
  declineFriendRequest: (userId: string) => void;
  awardBadge: (badgeId: string) => void;
}

const StoreContext = createContext<StoreCtx | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(loadUsers);
  const [authId, setAuthId] = useState<string | null>(loadAuth);

  const currentUser = users.find((u) => u.id === authId) ?? null;

  // Persist
  useEffect(() => { saveUsers(users); }, [users]);
  useEffect(() => {
    if (authId) localStorage.setItem(AUTH_KEY, authId);
    else localStorage.removeItem(AUTH_KEY);
  }, [authId]);

  const updateUser = useCallback((id: string, fn: (u: User) => User) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? fn(u) : u)));
  }, []);

  const login = useCallback((email: string, password: string): string | null => {
    const u = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!u) return "No account found with that email.";
    if (u.password && u.password !== password) return "Incorrect password.";
    setAuthId(u.id);
    return null;
  }, [users]);

  const signup = useCallback((name: string, email: string, password: string): string | null => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return "An account with that email already exists.";
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name, email, password,
      points: 0, badges: [], streak: 0, workoutsCompleted: 0,
      joinedChallenges: [], challengeProgress: {},
      friends: [], friendRequests: [], sentRequests: [],
    };
    setUsers((prev) => [...prev, newUser]);
    setAuthId(newUser.id);
    return null;
  }, [users]);

  const logout = useCallback(() => setAuthId(null), []);

  const addPoints = useCallback((pts: number) => {
    if (!authId) return;
    updateUser(authId, (u) => {
      const newPts = u.points + pts;
      const newBadges = [...u.badges];
      if (newPts >= 1000 && !newBadges.includes("top_performer")) newBadges.push("top_performer");
      return { ...u, points: newPts, badges: newBadges };
    });
  }, [authId, updateUser]);

  const completeWorkout = useCallback(() => {
    if (!authId) return;
    updateUser(authId, (u) => {
      const wc = u.workoutsCompleted + 1;
      const streak = u.streak + 1;
      const newBadges = [...u.badges];
      if (wc === 1 && !newBadges.includes("first_workout")) newBadges.push("first_workout");
      if (wc >= 10 && !newBadges.includes("ten_workouts")) newBadges.push("ten_workouts");
      if (streak >= 3 && !newBadges.includes("streak3")) newBadges.push("streak3");
      if (streak >= 7 && !newBadges.includes("streak7")) newBadges.push("streak7");

      let bonusPoints = 50;
      if (streak === 3) bonusPoints += 100;
      if (streak === 7) bonusPoints += 200;

      const newPts = u.points + bonusPoints;
      if (newPts >= 1000 && !newBadges.includes("top_performer")) newBadges.push("top_performer");

      return { ...u, workoutsCompleted: wc, streak, badges: newBadges, points: newPts };
    });
  }, [authId, updateUser]);

  const joinChallenge = useCallback((challengeId: string) => {
    if (!authId) return;
    updateUser(authId, (u) => {
      if (u.joinedChallenges.includes(challengeId)) return u;
      return {
        ...u,
        joinedChallenges: [...u.joinedChallenges, challengeId],
        challengeProgress: { ...u.challengeProgress, [challengeId]: 0 },
      };
    });
  }, [authId, updateUser]);

  const progressChallenge = useCallback((challengeId: string, amount = 1) => {
    if (!authId) return;
    const challenge = CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) return;

    updateUser(authId, (u) => {
      const prev = u.challengeProgress[challengeId] ?? 0;
      const next = Math.min(prev + amount, challenge.target);
      const newBadges = [...u.badges];
      let bonus = 0;

      if (next >= challenge.target && prev < challenge.target) {
        bonus = challenge.reward;
        if (!newBadges.includes("challenge_winner")) newBadges.push("challenge_winner");
      }

      const newPts = u.points + bonus;
      if (newPts >= 1000 && !newBadges.includes("top_performer")) newBadges.push("top_performer");

      return {
        ...u,
        challengeProgress: { ...u.challengeProgress, [challengeId]: next },
        points: newPts,
        badges: newBadges,
      };
    });
  }, [authId, updateUser]);

  const sendFriendRequest = useCallback((emailOrName: string): string | null => {
    if (!authId) return "Not logged in.";
    const target = users.find(
      (u) => u.id !== authId && (u.email.toLowerCase() === emailOrName.toLowerCase() || u.name.toLowerCase() === emailOrName.toLowerCase())
    );
    if (!target) return "User not found.";
    if (currentUser?.friends.includes(target.id)) return "Already friends!";
    if (target.friendRequests.includes(authId)) return "Request already sent.";

    updateUser(target.id, (u) => ({ ...u, friendRequests: [...u.friendRequests, authId] }));
    updateUser(authId, (u) => ({ ...u, sentRequests: [...u.sentRequests, target.id] }));
    return null;
  }, [authId, users, currentUser, updateUser]);

  const acceptFriendRequest = useCallback((userId: string) => {
    if (!authId) return;
    updateUser(authId, (u) => ({
      ...u,
      friends: [...u.friends, userId],
      friendRequests: u.friendRequests.filter((id) => id !== userId),
    }));
    updateUser(userId, (u) => ({
      ...u,
      friends: [...u.friends, authId],
      sentRequests: u.sentRequests.filter((id) => id !== authId),
    }));

    // Badge check
    updateUser(authId, (u) => {
      if (u.friends.length >= 3 && !u.badges.includes("social_butterfly")) {
        return { ...u, badges: [...u.badges, "social_butterfly"] };
      }
      return u;
    });
  }, [authId, updateUser]);

  const declineFriendRequest = useCallback((userId: string) => {
    if (!authId) return;
    updateUser(authId, (u) => ({
      ...u,
      friendRequests: u.friendRequests.filter((id) => id !== userId),
    }));
    updateUser(userId, (u) => ({
      ...u,
      sentRequests: u.sentRequests.filter((id) => id !== authId),
    }));
  }, [authId, updateUser]);

  const awardBadge = useCallback((badgeId: string) => {
    if (!authId) return;
    updateUser(authId, (u) => {
      if (u.badges.includes(badgeId)) return u;
      return { ...u, badges: [...u.badges, badgeId] };
    });
  }, [authId, updateUser]);

  return (
    <StoreContext.Provider value={{
      currentUser, allUsers: users,
      login, signup, logout,
      addPoints, completeWorkout,
      joinChallenge, progressChallenge,
      sendFriendRequest, acceptFriendRequest, declineFriendRequest,
      awardBadge,
    }}>
      {children}
    </StoreContext.Provider>
  );
}
