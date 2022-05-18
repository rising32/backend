import { Request, Response, NextFunction } from 'express';

import { AppDataSource } from '../../data-source';
import User from '../../entity/User';
import { UserRole } from '../../lib/consts/role.enum';
import { JwtPayload } from '../../lib/types/JwtPayload';
import { createJwtToken } from '../../lib/utils/createJwtToken';
import { CustomError } from '../../lib/utils/response/custom-error/CustomError';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  try {
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
      return next(customError);
    }

    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect password']);
      return next(customError);
    }

    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.display_name,
      email: user.email,
      role: user.role as UserRole,
      created_at: user.created_at,
    };

    try {
      const token = createJwtToken(jwtPayload);
      res.status(200).json(`Bearer ${token}`);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', "Token can't be created", null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
