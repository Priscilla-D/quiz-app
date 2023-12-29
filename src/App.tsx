import { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { fetchQuestions, Difficulty, QuestionState } from "./API";
import { GlobalStyle, Wrapper } from "./App.styles";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuestions(TOTAL_QUESTIONS, Difficulty.EASY);
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //user answer
      const answer = e.currentTarget.value;
      //check if answer is correct
      const correct = questions[number].correct_answer === answer;
      //add score in this case
      if (correct) setScore((prev) => prev + 1);
      //save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };
  const nextQuestion = () => {
    //move on to the next question if not the last one
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  const isNextButtonShow =
    !gameOver &&
    !loading &&
    userAnswers.length === number + 1 &&
    number !== TOTAL_QUESTIONS - 1;

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>React Quiz</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startTrivia}>
            start
          </button>
        ) : null}

        {!gameOver ? <p className="score">Score: {score}</p> : null}
        {loading && <p>Loading questions...</p>}
        {!loading && !gameOver && (
          <QuestionCard
            question={questions[number].question}
            answers={questions[number].answers}
            callback={checkAnswer}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
          />
        )}
        {isNextButtonShow && (
          <button className="next" onClick={nextQuestion}>
            Next question
          </button>
        )}
      </Wrapper>
    </>
  );
}

export default App;
