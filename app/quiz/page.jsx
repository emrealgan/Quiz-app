"use client"
import React, { useState, useEffect } from "react";
import '../../styles/quiz.css';

function quizApp() {

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [correctAnswer, setcorrectAnswer] = useState("");
  const [incorrectAnswers, setincorrectAnswers] = useState([]);
  const [combinedAnswers, setCombinedAnswers] = useState([]);
  const [isCorrect, setisCorrect] = useState(false)
  const [isSelected, setisSelected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shuffleArray, setshuffleArray] = useState([])
  
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0, 
    wrongAnswers: 0, 
  });

  const [timeLeft, setTimeLeft] = useState(60);
  const [fetchedQuizData, setfetchedQuizData] = useState({});

  
  useEffect(() => {
       
    const apiLink = "http://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";
    fetchData(apiLink);

    async function fetchData(link) {
      let response = await fetch(link);
      let data = await response.json();
      setfetchedQuizData (data.results);
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    setcorrectAnswer(fetchedQuizData[activeQuestion]?.correct_answer || '');
    setincorrectAnswers(fetchedQuizData[activeQuestion]?.incorrect_answers || []);
  }, [loading, activeQuestion]);
  
  useEffect(() => {
    setCombinedAnswers(incorrectAnswers.concat(correctAnswer));
  }, [incorrectAnswers, correctAnswer]);
  
  useEffect(() => {
    karistir(combinedAnswers);
  }, [combinedAnswers]);
   
  const onAnswerSelected = (answer) => {
    setisSelected(true)
    setSelectedAnswer(answer)
    if (answer === fetchedQuizData[activeQuestion]?.correct_answer) {
        setisCorrect(true)
    } 
    else {
      setisCorrect(false);
    }
  }
  useEffect(() => {
    if (!showResult && timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
  
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showResult]);
  
  useEffect(() => {
    if (timeLeft === 0 && !showResult) {
      nextQuestion();
    }
  }, [timeLeft, showResult]);
  
  const nextQuestion = () => {
      
    setTimeLeft(60)
    setisSelected(false)
    setisCorrect(false)
      
    setResult((prev) =>
        isCorrect ? {
              ...prev,
              score: prev.score + 1,
              correctAnswers: prev.correctAnswers + 1,
        }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
      )
      if (activeQuestion != fetchedQuizData.length - 1) {
          setActiveQuestion((prev) => prev + 1);
      } 
      else {
          setActiveQuestion(0);
          setShowResult(true);
      }
  }
  function karistir(dizi) {
    
    for (let i = dizi.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
    
        [dizi[i], dizi[j]] = [dizi[j], dizi[i]];
    }
    setshuffleArray(dizi)
  }
    
  return(
        
    <div>
      { loading ? (
          <div><strong>Data is loading...</strong></div>
        ) : 
        (!showResult ? (
          <div className='quiz-container'>
            <h2>
              {`Question: ${activeQuestion + 1}/10`}
            </h2>
                  
            <h3 dangerouslySetInnerHTML={{ __html: fetchedQuizData[activeQuestion]?.question }} />
                  
            {shuffleArray.map((answer, index) => (
              <li
                key={index}
                onClick={() =>  onAnswerSelected(answer) }
                className={isSelected && selectedAnswer == answer ? "selected" : ""}
              >
                <span dangerouslySetInnerHTML={{ __html: answer }} />
              </li>
            ))}    
          
            <p>Time Left: {timeLeft} seconds</p>
            <button onClick={nextQuestion} >
              {activeQuestion === (fetchedQuizData.length - 1)  ? 'Finish' : 'Next' }
            </button>
              
          </div>
          ) : (
            <div className='quiz-container'>
              <h3>Results</h3>
              <h3>Overall {result.score * 100/fetchedQuizData.length}%</h3>
              <p>
                Total Questions: <span>{fetchedQuizData.length}</span>
              </p>
              <p>
                Correct Answers: <span>{result.correctAnswers}</span>
              </p>
              <p>
                Wrong Answers: <span>{result.wrongAnswers}</span>
              </p>
              <button id="restart-btn" onClick={() => window.location.reload()}>Restart</button>
            </div>
          )
      )}
    </div> 
  )
}

export default quizApp