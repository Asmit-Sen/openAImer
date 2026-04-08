import Chat from '@/components/chat/Chat';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-24">
        <div className='w-1/2'>
          <Chat />
        </div>
    </main>
  );
}
