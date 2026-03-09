import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, signup } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      if (!name.trim()) { toast.error("Name is required."); return; }
      const err = signup(name.trim(), email.trim(), password);
      if (err) { toast.error(err); return; }
      toast.success("Account created! Welcome to SmartBells 🎉");
    } else {
      const err = login(email.trim(), password);
      if (err) { toast.error(err); return; }
      toast.success("Welcome back! 💪");
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blush opacity-40 blur-[100px]" />
        <div className="absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-lavender opacity-30 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Dumbbell className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">
              {mode === "login" ? "Welcome Back" : "Join SmartBells"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "login"
                ? "Log in to access your dashboard"
                : "Create your account and start training"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-4 w-4 text-primary" /> Name
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="h-11 rounded-xl bg-secondary/50"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <Mail className="h-4 w-4 text-primary" /> Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-xl bg-secondary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <Lock className="h-4 w-4 text-primary" /> Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-xl bg-secondary/50"
                required
              />
            </div>

            <Button type="submit" className="mt-6 h-12 w-full rounded-2xl text-base font-semibold shadow-md shadow-primary/20" size="lg">
              {mode === "login" ? "Log In" : "Create Account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
