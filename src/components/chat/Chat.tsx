'use client';

import { MyAgentUIMessage } from '@/lib/agents/orchestrator';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';


export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat<MyAgentUIMessage>();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    sendMessage({ text : input });
    setInput('');
  };

  return (
    <div>
      {messages.map(message => (
        <div
        className = "p-4" 
        key={message.id}>
          <div
          className={message.role === 'user' ? 'text-right' : 'text-left'}
          >{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div className={message.role === 'user' ? 'text-right' : 'text-left'} >
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span
                  key={index}
                  className="prose lg:prose-xl"
                 >
                    <ReactMarkdown>
                      {part.text}
                    </ReactMarkdown>
                 </span>;
              }
              return null;
            })}
          </div>
        </div>
      ))}

      <form 
      className='flex justify-center items-center w-full'
      onSubmit={handleSubmit}>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className='w-3/4 border border-gray-300 rounded-lg p-2 '
        />
        <button type="submit" className='bg-emerald-500 text-white px-4 py-2 ml-2 rounded-lg'>Send</button>
      </form>
    </div>
  );
}