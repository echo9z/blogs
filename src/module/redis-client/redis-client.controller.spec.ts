import { Test, TestingModule } from '@nestjs/testing';
import { RedisClientController } from './redis-client.controller';
import { RedisClientService } from './redis-client.service';

describe('RedisClientController', () => {
  let controller: RedisClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedisClientController],
      providers: [RedisClientService],
    }).compile();

    controller = module.get<RedisClientController>(RedisClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
