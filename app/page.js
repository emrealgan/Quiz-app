import Link from "next/link"
import '../styles/page.css';
export default function Home() {
  return (
    
    <main>
      <div className="container" id="main-container">
          <Link href="quiz"> <button id="start-btn">Start Quiz</button> </Link> 
      </div>
    </main>
  )
}
