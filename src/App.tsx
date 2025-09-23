import styles from "./app.module.css"
import { Header } from "./components/Header"

export default function App() {

  function handleRestartGame(){
    alert("Reinicia o jogo!")
  }

  return (
    <div className={styles.container}>
      <main>
        <Header current={2} max={4} onRestart={handleRestartGame}/>
      </main>
    </div>
  )
}
