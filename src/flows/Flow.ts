import { SimpleGit } from 'simple-git';
import { Step, StepBuilder } from './Step';

export interface Flow {
  name: string;
  buildFirstStep: StepBuilder;
}
