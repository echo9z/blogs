import { FastifyFileInterceptor } from './fastify-file.interceptor';

describe('FastifyFileInterceptor', () => {
  it('should be defined', () => {
    expect(new FastifyFileInterceptor()).toBeDefined();
  });
});
