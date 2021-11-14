import { saveChanges } from './lessons/save-changes';
import { prompt } from 'inquirer';
import { Step } from './flows/Step';
import * as process from 'process';
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import { callIfFunction } from './util';

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
  let step: Step | null = await callIfFunction(saveChanges.firstStep, git);

  if (!(await git.checkIsRepo())) {
    console.log("You're not inside a git repo!");
    process.exit(1);
  }

  while (step) {
    console.log(step.instructions);
    const { gitCommand }: { gitCommand: string } = await prompt([
      {
        type: 'input',
        name: 'gitCommand',
        default: await callIfFunction(step.hint, git),
        message: '>',
        prefix: '$'
      }
    ]);
    const [err, output]: any[] = await runGitCommand(git, gitCommand);
    if (output) {
      console.log(output);
    }
    step = await Promise.resolve(step.nextStep(err, git, prompt));
  }
}

main().catch(console.error);
