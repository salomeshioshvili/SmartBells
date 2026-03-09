import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/60 py-10 text-center">
    <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
      Built with <Heart className="h-3.5 w-3.5 text-primary" /> for{" "}
      <span className="font-semibold text-foreground">SheBuilds</span> at IE University
    </p>
  </footer>
);

export default Footer;
