import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

export type ExpandedRequest = Request & {
  user?: User;
};
