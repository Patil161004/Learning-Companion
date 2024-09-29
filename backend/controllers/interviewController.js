import { askGemini } from '../services/geminiService.js';
import Interview from '../models/interview.js';

export const generateInterview = async (req, res) => {
  const { company, position, jobDescription } = req.body;
  const userId = req.user.id; // Assuming the auth middleware adds user info to req

  try {
    const prompt = `Generate 15 interview questions and answers for a ${position} role at ${company}. ${jobDescription ? `Consider the job description: "${jobDescription}".` : ''} Format the questions and answers as follows:

1. [Question 1]
Answer: [Answer 1]

2. [Question 2]
Answer: [Answer 2]

...`;

    const response = await askGemini(prompt);
    const parsedQuestions = parseInterview(response);

    const interview = new Interview({
      user: userId,
      company,
      position,
      jobDescription,
      questions: parsedQuestions,
    });
    await interview.save();

    res.status(200).json({ interview: parsedQuestions });
  } catch (error) {
    console.error('Error generating interview:', error);
    res.status(500).json({ error: 'Failed to generate interview', details: error.message });
  }
};

export const getInterviewHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const interviews = await Interview.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ interviews });
  } catch (error) {
    console.error('Error fetching interview history:', error);
    res.status(500).json({ error: 'Failed to fetch interview history', details: error.message });
  }
};

const parseInterview = (content) => {
  const qaPairs = content.split(/\d+\.\s/).filter(pair => pair.trim() !== '');
  return qaPairs.map(pair => {
    const [question, answer] = pair.split('Answer:').map(text => text.trim());
    return {
      question,
      answer
    };
  });
};