import { PromptModule } from 'inquirer';
import { SimpleGit } from 'simple-git';
import { Flow } from '../flows/Flow';
import { Step, StepBuilder } from '../flows/Step';

const steps: Record<string, StepBuilder> = {
  checkStatus: function (): Step {
    return {
      instructions: 'Select what files you want to save changes from',
      commandSuggestion: 'git status',
      nextStepBuilder: async (err, git: SimpleGit) => {
        const status = await git.status();
        if (status.modified.length === 0 && status.not_added.length === 0) {
          return null;
        }
        return steps.addFiles;
      }
    };
  },
  addFiles: async function (git: SimpleGit): Promise<Step> {
    const status = await git.status();
    const unstagedAndModifiedFiles = status.modified.concat(status.not_added);
    return {
      instructions: 'Select what files you want to save changes from',
      commandSuggestion: `git add ${unstagedAndModifiedFiles.join(' ')}`,
      autoCompletion: (partialInput: string) => {
        if (!partialInput.startsWith('git add')) {
          return ['git add'];
        }

        if (partialInput.includes('git add .')) {
          return [];
        }
        const args = partialInput.split(' ').slice(2);
        return ['git add .'].concat(
          unstagedAndModifiedFiles
            .filter((file) => !args.includes(file))
            .map((file) => `${partialInput.trimEnd()} ${file}`)
        );
      },
      nextStepBuilder: async (err, git: SimpleGit, prompt: PromptModule) => {
        const status = await git.status();

        if (status.not_added.length === 0) {
          return steps.commitChanges;
        }

        const { addMoreFiles } = await prompt({
          type: 'confirm',
          name: 'addMoreFiles',
          message: 'Do you want to add more files?'
        });

        if (addMoreFiles) {
          return steps.addFiles;
        }

        return steps.commitChanges;
      }
    };
  },
  commitChanges: function () {
    return {
      instructions: 'Commit your changes',
      commandSuggestion: 'git commit -m "message"',
      nextStepBuilder: async (err) => {
        if (err?.message?.includes('CONFLICT')) {
          console.error('MISSING CONFLICT RESOLUTION LESSON');
          return null;
        }
        return null;
      }
    };
  }
};

export const saveChanges: Flow = {
  name: 'Save changes',
  buildFirstStep: async (git: SimpleGit) =>
    await Promise.resolve(steps.checkStatus(git))
};
