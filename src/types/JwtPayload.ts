import { UserRole } from 'consts/role.enum';

export type JwtPayload = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
};
