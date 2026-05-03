import { Role } from '../../flag/entities/flag.entity';

export type SecureUser = {
  id: string;
  username: string;
  role: Role;
};
