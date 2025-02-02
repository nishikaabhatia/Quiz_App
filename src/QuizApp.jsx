import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "./QuizApp.css";

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(
            "https://api.jsonserve.com/Uw5CrX"
          )}`
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        

        // Ensure the response contains questions
        if (!data || !data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error("Invalid or missing questions in API response");
        }

        // Extract and set questions
        const formattedQuestions = data.questions.map((q) => ({
          question: q.description, // Use "description" for the question text
          options: q.options.map((opt) => ({
            text: opt.description, // Use "description" for options
            isCorrect: opt.is_correct, // Correct answer flag
          })),
        }));

        setQuestions(formattedQuestions);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch quiz data.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle answer selection
  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore((prev) => prev + 1);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizStarted(false);
      setQuizCompleted(true);
    }
  };

  // Restart the quiz
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizStarted(true);
    setQuizCompleted(false);
  };

  // Loading and error handling
  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="quiz-container text-center">
      {/* Start Quiz Button */}
      {!quizStarted && !quizCompleted && (
        <Button variant="primary" className="btn-lg" onClick={() => setQuizStarted(true)}>
          Start Quiz
        </Button>
      )}

      {/* Display question and choices if quiz is started */}
      {quizStarted && !quizCompleted && questions.length > 0 ? (
        <Card className="question-card mt-4">
          <Card.Body>
            <Card.Title className="question-text">
              {questions[currentQuestionIndex]?.question || "No question found"}
            </Card.Title>
            <div className="options-container">
              {questions[currentQuestionIndex]?.options?.length > 0 ? (
                questions[currentQuestionIndex].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline-primary"
                    className="btn m-2"
                    onClick={() => handleAnswer(option.isCorrect)}
                  >
                    {option.text}
                  </Button>
                ))
              ) : (
                <p>No options available</p>
              )}
            </div>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading questions...</p>
      )}

      {/* Show score summary after quiz completion */}
      {quizCompleted && (
        <div className="results-summary mt-4">
          <h2>Your Score: {score} / {questions.length}</h2>
          <Button variant="secondary" onClick={handleRestart}>
            Restart Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;






