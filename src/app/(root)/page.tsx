import Chat from "@/components/chat/Chat";
import Grainient from "../../components/Gradient";

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <nav className="absolute top-0 left-0 z-10 w-full px-6 py-4 ">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full bg-white/20 px-5 py-3 backdrop-blur-xl border border-white/30">
          <div className="text-lg font-semibold tracking-wide text-white/90">
            OpenAImer
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-white/80"></div>
        </div>
      </nav>
      <div className=" absolute w-full h-full opacity-70">
        <Grainient
          color1="#FF9FFC"
          color2="#5227FF"
          color3="#B19EEF"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
      <div className="sm:w-1/2 w-[90%] h-full">
        <Chat />
      </div>
    </main>
  );
}
