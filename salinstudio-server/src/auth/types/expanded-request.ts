import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

export type ExpandedRequest = Request & {
  user?: User;
};
