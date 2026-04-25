import { Shield, BookOpen, Users, Code, Sword } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="w-full max-w-[800px] mx-auto px-6">
        <div className="mb-16 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <BookOpen size={40} className="text-primary" />
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tighter">About GameVerse</h1>
          <p className="text-xl text-muted-foreground">The community-driven knowledge hub for prestige gaming.</p>
        </div>

        <div className="space-y-12">
          <section className="bg-surface border border-border2 rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Shield className="text-primary" /> Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              GameVerse was built for players who don't just beat games, but live in them. Whether you're combing through item descriptions at 2 AM to understand the lore of the Lands Between, or planning the perfect build for your next run through Night City, we believe that great games deserve great documentation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We reject the ad-cluttered, hard-to-read wiki templates of the past. GameVerse is designed from the ground up to be beautiful, fast, and respectful of the art it documents.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface2 border border-border rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Users className="text-primary" size={20} /> Community First
              </h3>
              <p className="text-sm text-muted-foreground">
                Every article, stat, and guide is contributed by passionate fans. We provide the tools, you provide the knowledge.
              </p>
            </div>
            
            <div className="bg-surface2 border border-border rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Code className="text-primary" size={20} /> Built for Speed
              </h3>
              <p className="text-sm text-muted-foreground">
                No infinite loading spinners. No intrusive popups. Just instant access to the information you need, right when you need it.
              </p>
            </div>
          </div>
          
          <section className="border-t border-border pt-12 text-center">
            <h2 className="text-2xl font-bold mb-6">Join the Vanguard</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Ready to contribute to the compendium? Sign up today and start sharing your knowledge with the world.
            </p>
            <button className="bg-white text-black hover:bg-gray-200 font-bold h-12 px-8 rounded-xl transition-colors">
              Create an Account
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
