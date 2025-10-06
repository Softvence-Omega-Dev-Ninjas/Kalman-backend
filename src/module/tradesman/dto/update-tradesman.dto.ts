import { PartialType } from '@nestjs/mapped-types';
import { CreateTradesManDto } from './create-tradesman.dto';
export class UpdateTradesManDto extends PartialType(CreateTradesManDto) {}
