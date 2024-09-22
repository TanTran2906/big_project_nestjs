import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { setupApp } from '../src/setupApp';
import { ConfigService } from '@nestjs/config';

describe('Authentication System', () => {
  let app: INestApplication;
  let email: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app, app.get(ConfigService));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    email = `testuser_${Date.now()}@example.com`;
  });

  describe('POST /auth/signup', () => {
    it('handles a sign up request', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: email,
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', email);
    });
  });
});
