import styles from "./app.module.css"
import { useEffect, useState } from "react"

import { WORDS, type Challenge } from "./utils/words"

import { LettersUsed, type LettersUsedProps } from "./components/LettersUsed"
import { Header } from "./components/Header"
import { Letter } from "./components/Letter"
import { Button } from "./components/Button"
import { Input } from "./components/Input"
import { Tip } from "./components/Tip"

// const ATTEMPTS_MARGIN = 

export default function App() {
  const [score, setScore] = useState(0)
  const [letter, setLetter] = useState("")
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([])
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [shake, setShake] = useState(false)
  
  function handleRestartGame(){
    const isConfirmed = window.confirm("Você tem certeza que deseja reiniciar?")

    if(isConfirmed){
      startGame()
    }
  }

  function startGame(){
    const index = Math.floor(Math.random() * WORDS.length)
    const randomWord = WORDS[index]

    setChallenge(randomWord)

    setScore(0)
    setLetter("")
    setLettersUsed([])
  }

  function endGame(message: string){
    alert(message)
    startGame()
  }

  function handleConfirm() {
    // Verifica se tem um desafio
    if(!challenge){
      return
    }

    // Verifica se o usuário digitou um caracter
    if(!letter.trim()){
      return alert("Informe uma letra!")
    }

    // Recupera o caractere digitado
    const value = letter.toUpperCase()

    // Verifica se usuário já usou a letra
    const exists = lettersUsed.find(
      (used) => used.value.toUpperCase() === value
    )

    if(exists){
      setLetter("")
      return alert(`Esse caractere "${value}" já foi informado!`)
    }

    // Minha solução
    // const correct = challenge.word.toUpperCase().includes(value) ? true : false

    const hits = challenge.word
      .toUpperCase()
      .split("")
      .filter((char) => char === value).length

    const correct = hits > 0
    const currentScore = score + hits

    setLettersUsed((prevState) => [...prevState, { value, correct }])
    setScore(currentScore)
    setLetter("")

    if(!correct){
      setShake(true)
      setTimeout(() => setShake(false), 300)
    }
  }

  useEffect(() => {
    startGame()
  },[])

  useEffect(() => {
    if(!challenge){
      return
    }

    setTimeout(() => {
      if(score === challenge.word.length){
        return endGame("Parabéns você descobriu a palavra!")
      }
      
      if(lettersUsed.length === Math.floor(challenge.word.length * 1.7)){
        return endGame("Que pena, você não descobriu a palavra.")
      }

    }, 200)

  }, [score, lettersUsed.length])

  if(!challenge){
    return
  }
  
  return (
    <div className={styles.container}>
      <main>
        <Header current={lettersUsed.length} max={Math.floor(challenge.word.length * 1.7)} onRestart={handleRestartGame}/>

        <Tip tip={challenge.tip} />

        <div className={`${styles.word} ${ shake && styles.shake}`}>
          {challenge.word.split("").map((char, index) => {
            const letterCorrect = lettersUsed.find((used) => used.value.toUpperCase() === char.toUpperCase()) 

            return <Letter key={index} value={letterCorrect?.value} color={letterCorrect ? "correct" : "default"}/>
          })}
        </div>

        <h4>Palpite</h4>

        <div className={styles.guess}>
          <Input autoFocus maxLength={1} placeholder="?" onChange={(e) => setLetter(e.target.value)} value={letter}/>
          <Button title="Confirmar" onClick={handleConfirm}/>
        </div>

        <LettersUsed data={lettersUsed}/>
      </main>
    </div>
  )
}
