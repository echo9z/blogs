import { FastifyFilesInterceptor } from './fastify-files.interceptor';

describe('FastifyFilesInterceptor', () => {
  it('should be defined', () => {
    expect(new FastifyFilesInterceptor()).toBeDefined();
  });
});
