import { PromptModule } from 'inquirer';
import { SimpleGit } from 'simple-git';

export interface Step {
  instructions: string;
  hint:
    | string
    | ((git: SimpleGit) => Promise<string>)
    | ((git: SimpleGit) => string);
  nextStep:
    | ((
        err: Error,
        git: SimpleGit,
        prompt: PromptModule
      ) => Promise<Step | null>)
    | ((err: Error, git: SimpleGit, prompt: PromptModule) => Step | null);
}
