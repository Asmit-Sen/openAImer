"use client";

import { MyAgentUIMessage } from "@/lib/agents/orchestrator";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { IoArrowUpOutline } from "react-icons/io5";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat<MyAgentUIMessage>();
  const endRef = useRef<HTMLDivElement | null>(null);
  const lastMessage = messages[messages.length - 1];
  const lastTextLength = lastMessage
    ? lastMessage.parts.reduce((total, part) => {
        if (part.type === "text") {
          return total + part.text.length;
        }
        return total;
      }, 0)
    : 0;

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      return;
    }
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim()) {
        return;
      }
      sendMessage({ text: input });
      setInput("");
    }
  };

  useEffect(() => {
    if (!lastMessage) {
      return;
    }
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, lastMessage?.id, lastTextLength]);

  return (
    <div className="relative">
      <div className="overflow-y-scroll h-screen pt-30 chat-scroll mask-[linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-3xl px-4 py-3 shadow-sm ${
                message.role === "user"
                  ? "bg-linear-to-b from-neutral-900/60 to-neutral-900/90 text-white rounded-br-sm"
                  : "bg-linear-0 from-neutral-100/60 to-neutral-100/80 text-neutral-900 rounded-4xl rounded-bl-sm"
              }`}
            >
              {message.role === "user" && (
                <div className="text-xs uppercase tracking-wide opacity-70 mb-1">
                  You
                </div>
              )}
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <span key={index} className="prose prose-sm lg:prose-base">
                      <ReactMarkdown>{part.text}</ReactMarkdown>
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
        <div className="h-50" ref={endRef} />
      </div>

      <form
        className="flex justify-center items-center min-w-80 w-3/4 absolute bottom-10 left-1/2 -translate-x-1/2 bg-linear-to-b from-neutral-100/30 to-neutral-100/20 shadow-neutral-100/50 shadow-2xs rounded-[38px] p-5 gap-6 backdrop-blur-2xl"
        onSubmit={handleSubmit}
      >
        <textarea
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className=" outline-0 flex-1 rounded-lg p-2 overflow-y mb-5 decoration-0 resize-none"
        />
        <button
          type="submit"
          className="text-black p-3 bg-linear-to-b from-white/70 to-neutral-400 shadow-xs shadow-black/30 rounded-full self-end"
        >
          <IoArrowUpOutline size={"20"} />
        </button>
      </form>
    </div>
  );
}
