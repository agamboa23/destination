import { createServer } from 'http';
import app from './app';

const port = 8080;

const server = createServer(app);

server.listen(port);