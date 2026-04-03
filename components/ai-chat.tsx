'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A beautiful, animated chat component demonstrating the Groq provider.
 * Updated to Vercel AI SDK 6.0 patterns.
 */
export function AiChat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useChat();

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-2xl bg-background/50 backdrop-blur-xl border border-white/10 overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Groq Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-6">
          <AnimatePresence initial={false}>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-muted-foreground mt-12 space-y-4"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-foreground">How can I help today?</h3>
                <p className="max-w-sm mx-auto">Ask me about TypeScript or anything else. Powered by Groq for extreme speed.</p>
              </motion.div>
            )}
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white selection:bg-blue-400'
                      : 'bg-white/5 border border-white/10 text-foreground'
                  }`}
                >
                  {m.parts.map((part, i) => {
                    if (part.type === 'text') {
                      return <div key={`${m.id}-${i}`}>{part.text}</div>;
                    }
                    return null;
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-white/5 bg-white/5">
        <form onSubmit={handleCustomSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border-white/10 focus-visible:ring-blue-500/50"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
             'Send'
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
