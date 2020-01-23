import { createServer } from 'http';
import app from './app';

const port = process.env.PORT || 3001;

const server = createServer(app);

server.listen(port);