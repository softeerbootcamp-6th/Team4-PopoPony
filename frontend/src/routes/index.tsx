import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <p>토닥 서비스 준비중입니다.</p>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://github.com/softeerbootcamp-6th/Team4-PopoPony"
          target="_blank"
          rel="noopener noreferrer"
        >
          팀 레포지토리 바로가기
        </a>
      </header>
    </div>
  )
}
