import { UserRole } from 'consts/role.enum';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './data-source';
import User from './entity/User';
import UserProfile from './entity/UserProfile';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes/index';

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use('/', routes);
    app.use(errorHandler);

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    const newUser = new User();
    newUser.email = 'admin@mail.com';
    newUser.password = '123456';
    newUser.hashPassword();
    newUser.phone = '18600559456';
    newUser.username = 'admin';
    newUser.role = 'ADMINISTRATOR' as UserRole;
    await AppDataSource.manager.save(newUser);

    const profile = new UserProfile();
    profile.display_name = 'Admin User';
    profile.user = newUser;
    await AppDataSource.manager.save(profile);
  })
  .catch((error) => console.log(error));
