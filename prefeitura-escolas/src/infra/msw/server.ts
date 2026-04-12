import { setupServer } from 'msw/native';

// Handlers will be registered in ETAPA 3
// Server is exported so handlers can be added and it can be started in _layout
export const server = setupServer();
