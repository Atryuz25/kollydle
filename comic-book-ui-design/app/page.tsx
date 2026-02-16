import { ComicHeader } from "@/components/comic-header"
import { ComicGamePanel } from "@/components/comic-game-panel"
import { ComicFloatingBg } from "@/components/comic-floating-bg"

export default function Page() {
  return (
    <main className="relative min-h-screen flex flex-col items-center pb-12 transition-colors duration-300 overflow-hidden">
      <ComicFloatingBg />
      <div className="relative z-10 flex flex-col items-center w-full">
        <ComicHeader />
        <ComicGamePanel />
      </div>
    </main>
  )
}
