import { createServer } from 'http';
import app from './app';

const port = 3001;

const server = createServer(app);

server.listen(port);