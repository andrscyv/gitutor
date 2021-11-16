import { PromptModule } from 'inquirer';
import { SimpleGit } from 'simple-git';

export interface Step {
  instructions: string;
  commandSuggestion: string;
  validate?: (input: string) => boolean | string;
  autoCompletion?: string[] | ((input: string) => string[]);
  getNextStepBuilder:
    | ((
        err: Error,
        git: SimpleGit,
        prompt: PromptModule
      ) => Promise<StepBuilder | null>)
    | ((
        err: Error,
        git: SimpleGit,
        prompt: PromptModule
      ) => StepBuilder | null);
}

export type StepBuilder =
  | ((git: SimpleGit) => Step)
  | ((git: SimpleGit) => Promise<Step>);
