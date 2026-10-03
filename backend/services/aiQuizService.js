import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

export const generateQuiz = async ({
  topic,
  difficulty = "medium",
  questionCount = 10,
}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in .env");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  if (!topic || !topic.trim()) {
    throw new Error("Topic is required");
  }

  if (!["easy", "medium", "hard"].includes(difficulty)) {
    throw new Error("Invalid difficulty level");
  }

  if (
    !Number.isInteger(questionCount) ||
    questionCount < 1 ||
    questionCount > 20
  ) {
    throw new Error("Question count must be between 1 and 20");
  }

  const prompt = `
Generate exactly ${questionCount} multiple-choice questions
about the topic: "${topic.trim()}".

Difficulty: ${difficulty}

Rules:
- Each question must have exactly 4 options.
- Exactly one option must be correct.
- correctAnswer must be the zero-based index of the correct option.
- Questions must be clear and factually accurate.
- Do not repeat questions.
- Return only valid JSON.
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          questions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                options: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                },
                correctAnswer: { type: "INTEGER" },
                explanation: { type: "STRING" },
              },
              required: [
                "question",
                "options",
                "correctAnswer",
                "explanation",
              ],
            },
          },
        },
        required: ["questions"],
      },
    },
  });

  const result = JSON.parse(response.text);

  if (
    !Array.isArray(result.questions) ||
    result.questions.length !== questionCount
  ) {
    throw new Error("AI returned an invalid number of questions");
  }

  for (const item of result.questions) {
    if (
      typeof item.question !== "string" ||
      !item.question.trim() ||
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      item.options.some(
        (option) => typeof option !== "string" || !option.trim()
      ) ||
      !Number.isInteger(item.correctAnswer) ||
      item.correctAnswer < 0 ||
      item.correctAnswer > 3 ||
      typeof item.explanation !== "string"
    ) {
      throw new Error("AI returned an invalid question format");
    }
  }

  return result.questions;
};