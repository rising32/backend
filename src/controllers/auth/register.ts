import { Request, Response, NextFunction } from 'express';

import { AppDataSource } from '../../data-source';
import User from '../../entity/User';
import UserProfile from '../../entity/UserProfile';
import { UserRole } from '../../lib/consts/role.enum';
import { CustomError } from '../../lib/utils/response/custom-error/CustomError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, phone, username, password } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  try {
    const userWithEmail = await userRepository.findOneBy({ email });
    if (userWithEmail) {
      const customError = new CustomError(400, 'General', 'Email already exists', [
        `Email '${userWithEmail.email}' already exists`,
      ]);
      return next(customError);
    }
    const userWithPhone = await userRepository.findOneBy({ phone });
    if (userWithPhone) {
      const customError = new CustomError(400, 'General', 'Phone already exists', [
        `Phone '${userWithPhone.phone}' already exists`,
      ]);
      return next(customError);
    }

    try {
      const newUser = new User();
      newUser.email = email;
      newUser.password = password;
      newUser.hashPassword();
      newUser.phone = phone;
      newUser.username = username;
      newUser.role = UserRole.User;
      await AppDataSource.manager.save(newUser);

      const profile = new UserProfile();
      profile.display_name = 'username';
      profile.user = newUser;
      await AppDataSource.manager.save(profile);

      res.status(200).json(newUser);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `User '${email}' can't be created`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
