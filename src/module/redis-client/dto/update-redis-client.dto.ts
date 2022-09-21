import { PartialType } from '@nestjs/swagger';
import { CreateRedisClientDto } from './create-redis-client.dto';

export class UpdateRedisClientDto extends PartialType(CreateRedisClientDto) {}
