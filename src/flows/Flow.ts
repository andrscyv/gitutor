import { SimpleGit } from 'simple-git';
import { Step } from './Step';

export interface Flow {
  name: string;
  firstStep: Step | ((git: SimpleGit) => Step);
}
