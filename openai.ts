import OpenAI from 'openai';

const openai = new OpenAI({
    organization: "org-9G39q0Rn8qOA8yi9UfkNRoeH",
    apiKey: process.env.OPENAI_API_KEY,
  });

export default openai;

