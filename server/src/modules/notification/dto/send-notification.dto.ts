import { IsOptional, IsString } from 'class-validator';

export class SendNotificationDTO {
  @IsString()
  readonly title: string;

  @IsString()
  readonly body: string;

  @IsString()
  readonly token: string;

  @IsString()
  readonly data: Record<string, any>;

}
