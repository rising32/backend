import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import User from './entity/User';
import { UserRole } from './lib/consts/role.enum';
import routes from './routes';
import { errorHandler } from './lib/middleware/errorHandler';

dotenv.config();

AppDataSource.initialize()
  .then(async () => {
    const app: Express = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/', routes);
    app.use(errorHandler);

    const port = process.env.PORT;

    app.get('/', (req: Request, res: Response) => {
      res.send('Express + TypeScript Server is running!!');
    });

    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    });

    const newUser = new User();
    newUser.email = 'admin@mail.com';
    newUser.password = '123456';
    newUser.hashPassword();
    newUser.phone = '18600559450';
    newUser.display_name = 'Admin User';
    newUser.role = 'ADMINISTRATOR' as UserRole;
    await AppDataSource.manager.save(newUser);
  })
  .catch((error) => console.log(error));
