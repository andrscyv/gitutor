import { saveChanges } from './lessons/save-changes';
import { prompt, registerPrompt } from 'inquirer';
import { Step } from './flows/Step';
import * as process from 'process';
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import inquirerCommandPrompt from 'inquirer-command-prompt';

registerPrompt('command', inquirerCommandPrompt);

const options: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: 'git'
};

async function runGitCommand(git: SimpleGit, command: string) {
  try {
    return [null, await git.raw(command.split(' ').slice(1))];
  } catch (error) {
    return [error, null];
  }
}

async function main() {
  const git: SimpleGit = simpleGit(options);

  if (!(await git.checkIsRepo())) {
    console.log("You're not inside a git repo!");
    process.exit(1);
  }

  let step: Step = await saveChanges.buildFirstStep(git);
  let context = 0;

  while (step) {
    const {
      instructions,
      commandSuggestion,
      getNextStepBuilder,
      ...promptOpts
    } = step;
    console.log(instructions);
    const { gitCommand }: { gitCommand: string } = await prompt([
      {
        type: 'command',
        name: 'gitCommand',
        message: `(${commandSuggestion})`,
        prefix: '$',
        validate: (input: string) => {
          return input ? true : 'Press tab for suggestions!';
        },
        autoCompletion: () => {
          return [commandSuggestion];
        },
        context: context++,
        ...promptOpts
      }
    ]);
    const [err, output]: any[] = await runGitCommand(git, gitCommand);
    if (output) {
      console.log(output);
    }
    const buildNextStep = await Promise.resolve(
      getNextStepBuilder(err, git, prompt)
    );

    if (!buildNextStep) {
      break;
    }

    step = await Promise.resolve(buildNextStep(git));
  }
}

main().catch(console.error);
