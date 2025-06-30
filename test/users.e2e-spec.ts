import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should retrieve all predefined users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', '1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(6);
        });
    });
  });

  describe('PATCH /users/:id', () => {
    it('should partially update a user from the predefined array', async () => {
      const updatePayload = { name: 'Alex Xavier Updated' };

      await request(app.getHttpServer())
        .patch('/users/3')
        .set('Authorization', '1')
        .send(updatePayload)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(3);
          expect(res.body.name).toBe('Alex Xavier Updated');
        });

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', '1')
        .expect(200)
        .expect((res) => {
          const updatedUser = res.body.find((user) => user.id === 3);
          expect(updatedUser.name).toBe('Alex Xavier Updated');
        });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user from the predefined array and verify its removal', async () => {
      await request(app.getHttpServer())
        .delete('/users/3')
        .set('Authorization', '1')
        .expect(204);

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', '1')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(5);
          const deletedUser = res.body.find((user) => user.id === 3);
          expect(deletedUser).toBeUndefined();
        });
    });
  });

  describe('GET /users/managed/:id', () => {
    it('should return an empty array for a non-admin user (user ID 3)', () => {
      return request(app.getHttpServer())
        .get('/users/managed/3')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([]);
        });
    });

    it('should return users from GROUP_2 for manager with ID 4', () => {
      return request(app.getHttpServer())
        .get('/users/managed/4')
        .expect(200)
        .expect((res) => {
          const ids = res.body.map((user) => user.id);
          expect(ids.sort()).toEqual([1, 2, 3]);
        });
    });

    it('should return users from GROUP_1 for manager with ID 5', () => {
      return request(app.getHttpServer())
        .get('/users/managed/5')
        .expect(200)
        .expect((res) => {
          const ids = res.body.map((user) => user.id);
          expect(ids.sort()).toEqual([1, 2, 6]);
        });
    });
  });
});
