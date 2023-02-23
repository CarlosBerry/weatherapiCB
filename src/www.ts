import 'reflect-metadata';
import { container } from './inversify.config';
import { Server } from './server';
import { TYPES } from './types';

//const app: Express = express();//1
const server: Server = container.get<Server>(TYPES.Server);
server.init();
