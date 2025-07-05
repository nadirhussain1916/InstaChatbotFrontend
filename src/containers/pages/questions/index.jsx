import React, { useState } from "react";
import { Box, Typography, Chip, TextField, Button } from "@mui/material";
import image from "@assets/image.jpg";
import { useAddQuestionMutation, useGetQuestionsQuery } from "@/services/private/questions";
import { useNavigate } from "react-router-dom";
import GloabalLoader from "@/containers/common/loaders/GloabalLoader";
import { updateUserDetail } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { options } from "./utilits/data";

// Helper to match choices based on question text
const getChoicesForQuestion = text => {
  const found = options.find(item => item.question === text);
  return found ? found.choices : [];
};

function QuestionBlock({ question, answer, onAnswerChange }) {
  const choices = getChoicesForQuestion(question.text);

  return (
    <Box mb={3} textAlign="center">
      <Typography variant="h6" mb={2} fontWeight={600} color="black">
        {question.text}
      </Typography>

      {/* Chips */}
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1} mb={2}>
        {choices.map((opt, i) => (
          <Chip
            key={i}
            label={opt}
            clickable
            onClick={() => onAnswerChange(question.id, opt)}
            sx={{
              background:
                answer === opt
                  ? "#6c63ff"
                  : "linear-gradient(to right, #a855f7, #ec4899, #fb923c)",
              color: "#fff",
              fontWeight: 500,
              fontSize: "11px",
              "&:hover": { backgroundColor: "#444" },
            }}
          />
        ))}
      </Box>

      {/* Text Input */}
      <TextField
        variant="outlined"
        placeholder="Your answer"
        fullWidth
        value={answer}
        onChange={e => onAnswerChange(question.id, e.target.value)}
        sx={{
          borderRadius: 1,
          input: { color: "black", fontSize: "0.875rem" }, // smaller input text size
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fb923c", // custom outline color
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#a855f7",
          },
          "& .MuiInputBase-input::placeholder": {
            fontSize: "12px",  // smaller placeholder text
            opacity: 0.7,
            padding: "3px", // adjust padding for smaller input
          },
        }}
      />

    </Box>
  );
}

export default function Question() {
  const { data = [], isLoading } = useGetQuestionsQuery();
  const [submitQuestion, { isLoading: submitting }] = useAddQuestionMutation();
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const questionsPerPage = 3;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalSteps = Math.ceil(data.length / questionsPerPage);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // const handleNext = () => {
  //   if (step < totalSteps - 1) {
  //     setStep(prev => prev + 1);
  //   }
  // };

  const handleSubmit = async () => {
    const payload = {
      answers: data.map(q => ({
        question: q.id,
        answer: answers[q.id] || "",
      })),
    };

    try {
      await submitQuestion(payload).unwrap();
      dispatch(updateUserDetail({ has_answered: true }));
      navigate("/");
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  if (isLoading) return <GloabalLoader />;

  const currentQuestions = data.slice(
    step * questionsPerPage,
    step * questionsPerPage + questionsPerPage
  );

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
          padding: 4,
          borderRadius: 3,
          color: "#fff",
          width: 700,
          margin: "120px auto",
          backgroundColor: "rgba(255,255,255,0.9)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            position: "relative",
            bottom: "31px",
            width: "700px",
            right: "33px",
            borderRadius: "10px 10px 0px 0px",
            height: "8px",
            background: "linear-gradient(to right, #a855f7, #ec4899, #fb923c)",
          }}
        />

        {currentQuestions.map(question => (
          <QuestionBlock
            key={question.id}
            question={question}
            answer={answers[question.id] || ""}
            onAnswerChange={handleAnswerChange}
          />
        ))}

       <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
  <Button
    variant="outlined"
    sx={{ cursor: "pointer", fontWeight: 400, color: "black",  }}
    onClick={() => setStep(prev => Math.max(prev - 1, 0))}
    disabled={step === 0}
  >
    Previous
  </Button>

  <Button
    variant="contained"
    sx={{
  cursor: "pointer",
  color: "white",
  fontWeight: 400,
  background: "linear-gradient(to right, #a855f7, #ec4899, #fb923c)",
  "&:hover": {
    background: "linear-gradient(to right, #a855f7, #ec4899, #fb923c)",
    opacity: 0.9, // optional: a slight effect on hover
  }
}}
    onClick={step === totalSteps - 1 ? handleSubmit : () => setStep(prev => Math.min(prev + 1, totalSteps - 1))}
    disabled={submitting}
  >
    {submitting ? "Submitting..." : step === totalSteps - 1 ? "Submit" : "Next"}
  </Button>
</Box>

      </Box>
    </div>
  );
}
