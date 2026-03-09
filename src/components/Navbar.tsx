import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dumbbell, LayoutDashboard, Target, Trophy, LogOut, LogIn, Apple, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const Navbar = () => {
  const { currentUser, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home", icon: <Dumbbell className="h-4 w-4" /> },
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { to: "/challenges", label: "Challenges", icon: <Target className="h-4 w-4" /> },
    { to: "/leaderboard", label: "Leaderboard", icon: <Trophy className="h-4 w-4" /> },
    { to: "/nutrition", label: "Nutrition", icon: <Apple className="h-4 w-4" /> },
    { to: "/classes", label: "Classes", icon: <CalendarDays className="h-4 w-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 h-14 gap-2">
        {/* Left — Logo (fixed width to balance with right section) */}
        <Link to="/" className="flex shrink-0 items-center gap-2 font-display font-bold text-lg">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span>Smart<span className="text-primary">Bells</span></span>
        </Link>

        {/* Center — Desktop nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        {/* Center — Mobile nav icons */}
        <div className="flex sm:hidden flex-1 items-center justify-center gap-1 min-w-0 overflow-x-auto">
          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`shrink-0 rounded-lg p-2 transition-colors ${
                location.pathname === l.to ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.icon}
            </Link>
          ))}
        </div>

        {/* Right — Auth / Avatar */}
        <div className="flex shrink-0 items-center gap-2">
          {currentUser ? (
            <>
              <span className="hidden md:block text-sm font-medium text-muted-foreground">
                {currentUser.name.split(" ")[0]}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold transition-transform hover:scale-110 active:scale-95">
                {currentUser.name.charAt(0)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => { logout(); navigate("/"); }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl gap-1.5"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="h-4 w-4" /> <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
