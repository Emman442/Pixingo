
"use client";

import { useState, useRef, useEffect } from "react";

import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface ChatBoxProps {
  lobbyId: string;
}

export function ChatBox({ lobbyId }: ChatBoxProps) {

  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);


  const messages = [{ text: "Welcome to the arena!", senderId: "system", senderName: "System" }];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

  
    setInputText("");
  };

  return (
    <div className="flex flex-col h-[300px] glass-card rounded-2xl overflow-hidden border-primary/20">
      <div className="bg-primary/10 px-4 py-2 border-b border-white/5">
        <h4 className="text-[10px] font-headline uppercase tracking-widest text-primary font-bold">Arena Comms</h4>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages?.map((msg: any) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                // className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[8px] text-muted-foreground mb-1 uppercase tracking-tighter">
                  {msg.senderName}
                </span>
                {/* <div className={`px-3 py-1.5 rounded-2xl text-xs max-w-[80%] ${
                  msg.senderId === user?.uid 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white/5 text-foreground rounded-tl-none border border-white/5'
                }`}>
                  {msg.text}
                </div> */}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-2 bg-black/20 flex gap-2">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send coordinates..."
          className="h-8 text-xs bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
        />
        <Button size="icon" className="h-8 w-8 shrink-0 bg-primary hover:bg-primary/90">
          <Send size={12} />
        </Button>
      </form>
    </div>
  );
}
