"use client";

import { useState } from "react";
import type { InterviewQuestion } from "@/lib/types";
import { buildQuiz, saveQuizAttempt, useBestScore } from "@/lib/quiz";
import type { QuizItem } from "@/lib/quiz";
import { useAuth } from "@/components/auth/auth-provider";
import { QuizSetup } from "./quiz-setup";
import { QuizQuestion } from "./quiz-question";
import { QuizResult, type QuizAnswer } from "./quiz-result";

type Phase = "setup" | "active" | "finished";

export function QuizRunner({
  questions,
  section,
  topicHref,
}: {
  questions: InterviewQuestion[];
  section: string;
  topicHref: string;
}) {
  const { user } = useAuth();
  const bestScore = useBestScore(section);
  const [phase, setPhase] = useState<Phase>("setup");
  const [items, setItems] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  function handleStart(count: number) {
    setItems(buildQuiz(questions, count));
    setCurrentIndex(0);
    setAnswers([]);
    setPhase("active");
  }

  function handleNext(chosen: string, correct: boolean) {
    const current = items[currentIndex];
    const nextAnswers = [...answers, { item: current, chosen, correct }];
    setAnswers(nextAnswers);

    if (currentIndex + 1 >= items.length) {
      const score = nextAnswers.filter((a) => a.correct).length;
      if (user) {
        saveQuizAttempt(user.id, section, score, nextAnswers.length);
      }
      setPhase("finished");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleRetry() {
    setPhase("setup");
  }

  if (phase === "setup") {
    return (
      <QuizSetup
        totalQuestions={questions.filter((q) => q.question_vi).length}
        bestScore={bestScore}
        isLoggedIn={!!user}
        onStart={handleStart}
      />
    );
  }

  if (phase === "active") {
    return (
      <QuizQuestion
        key={currentIndex}
        item={items[currentIndex]}
        index={currentIndex}
        total={items.length}
        onNext={handleNext}
      />
    );
  }

  return (
    <QuizResult answers={answers} topicHref={topicHref} onRetry={handleRetry} />
  );
}
