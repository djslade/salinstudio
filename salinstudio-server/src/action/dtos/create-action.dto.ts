import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateActionDto {
  @IsNotEmpty()
  visitorId: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  path: string;

  @IsDefined()
  tag: string;
}
