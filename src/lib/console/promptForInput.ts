import { input } from '@inquirer/prompts';

export const promptForInput = async (question: string) => {
  const response = await input({
    message: question,
  });

  return response;
};
