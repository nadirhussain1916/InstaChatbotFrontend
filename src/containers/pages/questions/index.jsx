import React, { useState } from "react";
import { Box, Typography, Chip, TextField, Button } from "@mui/material";
import image from "@assets/image.jpg";
import { useAddQuestionMutation, useGetQuestionsQuery } from "@/services/private/questions";
import { useNavigate } from "react-router-dom";
import GloabalLoader from "@/containers/common/loaders/GloabalLoader";

const options = ["Reddit", "Google", "Friend", "Colleague"];

function QuestionBlock({ question, answer, onAnswerChange }) {
  return (
    <Box mb={2} textAlign="center">
      <Typography variant="h6" mb={2} fontWeight={600} color="black">
        {question.text}
      </Typography>

      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1} mb={2}>
        {options.map(opt => (
          <Chip
            key={opt}
            label={opt}
            clickable
            onClick={() => onAnswerChange(question.id, opt)}
            sx={{
              background:
                answer === opt
                  ? "#6c63ff "
                  : "linear-gradient(to right, #a855f7, #ec4899, #fb923c)",
              color: "#fff",
              fontWeight: "500",
              "&:hover": { backgroundColor: "#444" },
            }}
          />
        ))}
      </Box>

      <TextField
        variant="outlined"
        placeholder="Your answer"
        fullWidth
        value={answer}
        onChange={e => onAnswerChange(question.id, e.target.value)}
        sx={{
          backgroundColor: "",
          borderRadius: 1,
          input: { color: "black" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#777" },
        }}
      />
    </Box>
  );
}

export default function Question() {
  const { data = [], isLoading } = useGetQuestionsQuery();
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const questionsPerStep = 3;
  const totalSteps = Math.ceil(data.length / questionsPerStep);
  const [submitQuestion, {isLoading:loading}] = useAddQuestionMutation();
  const navigate = useNavigate();

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  if (isLoading) return <GloabalLoader/>;

  const questionsOnPage = data.slice(
    currentStep * questionsPerStep,
    currentStep * questionsPerStep + questionsPerStep
  );

  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleSubmit = async () => {
  const payload = {
    answers: data.map(q => ({
      question: q.id,
      answer: answers[q.id] || "",
    })),
  };
    await submitQuestion(payload).unwrap();
      navigate('/');

};

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-4"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: 4,
          borderRadius: 3,
          color: "#fff",
          width: 700,
          margin: "120px auto",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            position: 'relative',
            bottom: '31px',
            width: '700px',
            right: '33px',
            borderRadius: '10px 10px 0px 0px',
        height: '8px',
        background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
          }}
        ></div>
        {
    questionsOnPage.map(q => (
      <QuestionBlock
        key={q.id}
        question={q}
        answer={answers[q.id] || ""}
        onAnswerChange={handleAnswerChange}
      />
    ))
  }

  <Box mt={2} display="flex" alignItems="center" justifyContent="flex-end">
    <Button
      sx={{ cursor: "pointer", color: "black", fontWeight: 600 }}
      onClick={isLastStep ? handleSubmit : handleNext}
      disabled={loading}
    >
      {loading ? 'Submitting...' : isLastStep ? "Submit" : "Next"}
    </Button>
  </Box>
      </Box >
    </div >
  );
}
