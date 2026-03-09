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
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span>Smart<span className="text-primary">Bells</span></span>
        </Link>

        {/* Nav links — hidden on very small screens */}
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

        {/* Auth */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <span className="hidden md:block text-sm font-medium text-muted-foreground">
                {currentUser.name.split(" ")[0]}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
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
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
          )}
        </div>

        {/* Mobile bottom nav substitute — small screen links */}
        <div className="flex sm:hidden items-center gap-1">
          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg p-2 ${
                location.pathname === l.to ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              {l.icon}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
