import { setupServer } from 'msw/native';
import { schoolHandlers } from './handlers/schools';
import { classHandlers } from './handlers/classes';

export const server = setupServer(...schoolHandlers, ...classHandlers);
