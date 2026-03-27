import { INestApplication } from '@nestjs/common';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedElasticsearchContainer } from '@testcontainers/elasticsearch';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { Cocktails } from '../../cocktails/cocktails.entity';
import { TestSetup, TestTeardown } from '../setup/test-setup';

describe('Cocktails Integration Tests', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let esContainer: StartedElasticsearchContainer;
  let cocktailRepository: ReturnType<DataSource['getRepository']>;

  beforeAll(async () => {
    ({ app, pgContainer, esContainer } = await TestSetup.setup());
    cocktailRepository = app.get(DataSource).getRepository(Cocktails);
  });

  afterEach(async () => {
    await cocktailRepository.clear();
    });

  afterAll(async () => {
    await TestTeardown.teardown(app, pgContainer, esContainer);
  });


  describe('GET /cocktails', () => {
    it('should return empty array when no cocktails exist', async () => {
      const res = await request(app.getHttpServer()).get('/cocktails').expect(200);
      expect(res.body).toEqual([]);
    });

    it('should return all cocktails', async () => {
      await cocktailRepository.save([
        { title: 'Mojito', description: 'A refreshing mint cocktail', price: 8 },
        { title: 'Negroni', description: 'A bitter Italian cocktail', price: 10 },
      ]);

      const res = await request(app.getHttpServer()).get('/cocktails').expect(200);
      expect(res.body).toHaveLength(2);
    });
  });


  describe('POST /cocktails', () => {
    it('should create a cocktail and return it', async () => {
      const res = await request(app.getHttpServer())
        .post('/cocktails')
        .send({ title: 'Daiquiri', description: 'A classic rum cocktail', price: 9 })
        .expect(201);

      expect(res.body).toMatchObject({ title: 'Daiquiri', price: 9 });
      expect(res.body.id).toBeDefined();
    });

    it('should return 400 when title is too short', async () => {
      await request(app.getHttpServer())
        .post('/cocktails')
        .send({ title: 'X', description: 'A classic rum cocktail', price: 9 })
        .expect(400);
    });

    it('should return 400 when price is below minimum', async () => {
      await request(app.getHttpServer())
        .post('/cocktails')
        .send({ title: 'Daiquiri', description: 'A classic rum cocktail', price: 0 })
        .expect(400);
    });

    it('should return 400 when description is too short', async () => {
      await request(app.getHttpServer())
        .post('/cocktails')
        .send({ title: 'Daiquiri', description: 'hi', price: 9 })
        .expect(400);
    });

    it('should return 409 when title already exists', async () => {
      await cocktailRepository.save({
        title: 'Margarita',
        description: 'A classic tequila cocktail',
        price: 9,
      });

      await request(app.getHttpServer())
        .post('/cocktails')
        .send({ title: 'Margarita', description: 'A classic tequila cocktail', price: 9 })
        .expect(409);
    });

    it('should return 409 case-insensitively', async () => {
      await cocktailRepository.save({
        title: 'Margarita',
        description: 'A classic tequila cocktail',
        price: 9,
      });

      await request(app.getHttpServer())
        .post('/cocktails')
        .send({ title: 'margarita', description: 'A classic tequila cocktail', price: 9 })
        .expect(409);
    });
  });


  describe('GET /cocktails/:id', () => {
    it('should return a cocktail by id', async () => {
      const cocktail = await cocktailRepository.save({
        title: 'Aperol Spritz',
        description: 'A classic Italian aperitif',
        price: 7,
      });

      const res = await request(app.getHttpServer())
        .get(`/cocktails/${cocktail.id}`)
        .expect(200);

      expect(res.body).toMatchObject({ title: 'Aperol Spritz', price: 7 });
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer()).get('/cocktails/99999').expect(404);
    });
  });


  describe('PUT /cocktails/:id', () => {
    it('should update a cocktail price', async () => {
      const cocktail = await cocktailRepository.save({
        title: 'Old Fashioned',
        description: 'A classic whiskey cocktail',
        price: 12,
      });

      const res = await request(app.getHttpServer())
        .put(`/cocktails/${cocktail.id}`)
        .send({ price: 15 })
        .expect(200);

      expect(res.body.price).toBe(15);
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .put('/cocktails/99999')
        .send({ price: 15 })
        .expect(404);
    });

    it('should return 409 when updating to an existing title', async () => {
      await cocktailRepository.save({
        title: 'Cosmo',
        description: 'A classic vodka cocktail',
        price: 9,
      });

      const second = await cocktailRepository.save({
        title: 'Gimlet',
        description: 'A classic gin cocktail',
        price: 9,
      });

      await request(app.getHttpServer())
        .put(`/cocktails/${second.id}`)
        .send({ title: 'Cosmo' })
        .expect(409);
    });

    it('should allow updating title to same value', async () => {
      const cocktail = await cocktailRepository.save({
        title: 'Paloma',
        description: 'A classic tequila grapefruit cocktail',
        price: 9,
      });

      const res = await request(app.getHttpServer())
        .put(`/cocktails/${cocktail.id}`)
        .send({ title: 'Paloma', price: 11 })
        .expect(200);

      expect(res.body.price).toBe(11);
    });
  });


  describe('DELETE /cocktails/:id', () => {
    it('should delete a cocktail', async () => {
      const cocktail = await cocktailRepository.save({
        title: 'Sling',
        description: 'A classic gin cocktail from Singapore',
        price: 9,
      });

      const res = await request(app.getHttpServer())
        .delete(`/cocktails/${cocktail.id}`)
        .expect(200);

      expect(res.body).toEqual({ message: 'Cocktail deleted successfully' });

      await request(app.getHttpServer())
        .get(`/cocktails/${cocktail.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer()).delete('/cocktails/99999').expect(404);
    });
  });


  describe('GET /cocktails/search', () => {
    it('should return all cocktails when query is empty', async () => {
      await cocktailRepository.save([
        { title: 'Sangria', description: 'A classic Spanish wine cocktail', price: 6 },
        { title: 'Mojito', description: 'A refreshing mint cocktail', price: 8 },
      ]);

      const res = await request(app.getHttpServer())
        .get('/cocktails/search?q=')
        .expect(200);

      expect(res.body.length).toBe(2);
    });

    it('should return matching results from Elasticsearch', async () => {
      await request(app.getHttpServer())
        .post('/cocktails')
        .send({ title: 'Pina Colada', description: 'A tropical pineapple coconut cocktail', price: 8 });

      await new Promise((r) => setTimeout(r, 2000));

      const res = await request(app.getHttpServer())
        .get('/cocktails/search?q=pina')
        .expect(200);

      expect(res.body.some((c: any) => c.title === 'Pina Colada')).toBe(true);
    });

    it('should return empty array for no matches', async () => {
      await request(app.getHttpServer())
        .post('/cocktails')
        .send({ title: 'Bellini', description: 'A classic prosecco peach cocktail', price: 8 });

      await new Promise((r) => setTimeout(r, 2000));

      const res = await request(app.getHttpServer())
        .get('/cocktails/search?q=xyznonexistent')
        .expect(200);

      expect(res.body).toEqual([]);
    });
  });
});