import { SimpleGit } from 'simple-git';
import { Flow } from '../flows/Flow';
import { Step } from '../flows/Step';

const steps: Record<string, Step> = {
  checkStatus: {
    instructions: 'Check what files have been modified',
    hint: `git status`,
    nextStep: async (err, git: SimpleGit) => {
      const status = await git.status();
      if (status.modified.length === 0 && status.not_added.length === 0) {
        return null;
      }
      return steps.addFiles;
    }
  },
  addFiles: {
    instructions: 'Select what files you want to save changes from',
    hint: async (git: SimpleGit) =>
      `git add ${(await git.status()).modified
        .concat((await git.status()).not_added)
        .join(' ')}`,
    nextStep: async (err, git: SimpleGit, prompt) => {
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
  },

  commitChanges: {
    instructions: 'Commit your changes',
    hint: `git commit -m "Changes"`,
    nextStep: async (err) => {
      if (err?.message?.includes('CONFLICT')) {
        return steps.conflictResolution;
      }

      return null;
    }
  }
};

export const saveChanges: Flow = {
  name: 'Save changes',
  firstStep: steps.checkStatus
};
