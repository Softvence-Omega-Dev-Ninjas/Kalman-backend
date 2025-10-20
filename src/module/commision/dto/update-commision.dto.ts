import { PartialType } from '@nestjs/swagger';
import { CreateCommisionDto } from './create-commision.dto';

export class UpdateCommisionDto extends PartialType(CreateCommisionDto) {}
