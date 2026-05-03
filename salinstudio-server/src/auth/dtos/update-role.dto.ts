import { IsDefined, IsNotEmpty } from 'class-validator';
import { Role } from '../../flag/entities/flag.entity';

export class UpdateRoleDto {
  @IsDefined()
  secret: string;

  @IsNotEmpty()
  role: Role;
}
