import { IsNotEmpty } from 'class-validator';

export class VerifyChecksumDto {
  @IsNotEmpty()
  id: string;
}
