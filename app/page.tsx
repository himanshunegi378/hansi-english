import Image from "next/image";
import Link from "next/link";
import { AiChat } from "@/components/ai-chat";
import { buttonVariants } from "@/components/ui/button-variants";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-[#09090b]">
      <header className="flex items-center justify-between p-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={80}
            height={16}
            priority
          />
          <span className="text-xl font-bold tracking-tight">AI Studio</span>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/story" 
            className={cn(buttonVariants({ variant: "outline" }), "flex items-center gap-2")}
          >
            <BookOpen className="w-4 h-4" /> Story Creator
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl text-center mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Vercel AI SDK + <span className="bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Groq</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            Experience lightning-fast inference with the Llama 3.3 70B model.
          </p>
          <div className="flex justify-center pt-4">
            <Link 
              href="/story" 
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
            >
              Try Story Creator
            </Link>
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <AiChat />
        </div>
      </main>


      <footer className="w-full py-8 text-center text-sm text-zinc-400">
        Built with Vercel AI SDK and Groq Cloud.
      </footer>
    </div>
  );
}
