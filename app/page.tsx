import Link from "next/link";
import { AiChat } from "@/components/ai-chat";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen grow">

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl text-center mb-12 flex flex-col gap-4">
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
