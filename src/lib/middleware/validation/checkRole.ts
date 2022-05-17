import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../consts/role.enum';

import { CustomError } from '../../utils/response/custom-error/CustomError';

export const checkRole = (roles: UserRole[], isSelfAllowed = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id, role } = req.jwtPayload;
    const { id: requestId } = req.params;

    let errorSelfAllowed: string | null = null;
    if (isSelfAllowed) {
      if (id === requestId) {
        return next();
      }
      errorSelfAllowed = 'Self allowed action.';
    }

    if (roles.indexOf(role) === -1) {
      const errors = [
        'Unauthorized - Insufficient user rights',
        `Current role: ${role}. Required role: ${roles.toString()}`,
      ];
      if (errorSelfAllowed) {
        errors.push(errorSelfAllowed);
      }
      const customError = new CustomError(401, 'Unauthorized', 'Unauthorized - Insufficient user rights', errors);
      return next(customError);
    }
    return next();
  };
};