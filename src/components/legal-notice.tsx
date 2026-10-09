import { Link } from "@tanstack/react-router";

export function LegalNotice({ action = "continuing", className = "" }: { action?: string; className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      By {action}, you agree to our{" "}
      <Link to="/terms-of-service" className="font-medium text-primary underline underline-offset-2 hover:opacity-80">Terms of Service</Link>
      {" "}and acknowledge our{" "}
      <Link to="/privacy-policy" className="font-medium text-primary underline underline-offset-2 hover:opacity-80">Privacy Policy</Link>.
    </p>
  );
}