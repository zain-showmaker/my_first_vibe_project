import { Link } from "wouter";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground bg-[radial-gradient(ellipse_at_center,_var(--surface2)_0%,_var(--bg)_100%)]">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="w-20 h-20 bg-surface3 rounded-2xl mx-auto flex items-center justify-center border border-border2 rotate-12 shadow-2xl">
          <Gamepad2 size={40} className="text-muted-foreground -rotate-12" />
        </div>
        
        <h1 className="text-4xl font-black tracking-tighter">
          404 <span className="text-muted-foreground font-normal">|</span> Lost to the Void
        </h1>
        
        <p className="text-muted-foreground text-sm">
          This page has been lost to the Lands Between, swallowed by the Nightmare, or perhaps it never existed at all.
        </p>
        
        <div className="pt-4">
          <Link href="/">
            <Button className="bg-primary text-black hover:bg-[#d4eb3a] font-bold rounded-xl h-11 px-8 border border-primary transition-all hover:scale-105">
              Return to Nexus
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
