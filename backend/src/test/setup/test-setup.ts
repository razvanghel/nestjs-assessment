import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { ElasticsearchContainer, StartedElasticsearchContainer } from '@testcontainers/elasticsearch';
import { HttpExceptionFilter } from '../../common/filters/http-exceptions.filters';
import { DataSource } from 'typeorm';
import { CocktailsModule } from '../../cocktails/cocktails.module';
import { Cocktails } from '../../cocktails/cocktails.entity';
import { CocktailsSearchModule } from 'src/elastic-search/cocktail-search.module';

jest.setTimeout(120000);

export class TestSetup {
  public static async setup(): Promise<{
    app: INestApplication;
    pgContainer: StartedPostgreSqlContainer;
    esContainer: StartedElasticsearchContainer;
  }> {
    const [pgContainer, esContainer] = await Promise.all([
      new PostgreSqlContainer('postgres:13')
        .withDatabase('testdb')
        .withUsername('testuser')
        .withPassword('testpass')
        .start(),
      new ElasticsearchContainer(
        'docker.elastic.co/elasticsearch/elasticsearch:8.6.0',
      ).withEnvironment({
        'discovery.type': 'single-node',
        'xpack.security.enabled': 'false',
        'xpack.security.http.ssl.enabled': 'false',
        'xpack.security.enrollment.enabled': 'false',
        'ES_JAVA_OPTS': '-Xms512m -Xmx512m',
      }).start(),
    ]);
    process.env.ELASTICSEARCH_NODE = esContainer.getHttpUrl();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: pgContainer.getHost(),
          port: pgContainer.getPort(),
          username: pgContainer.getUsername(),
          password: pgContainer.getPassword(),
          database: pgContainer.getDatabase(),
          entities: [Cocktails],
          synchronize: true,
          logging: false,
        }),
        CocktailsModule,
        CocktailsSearchModule,
      ],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    return { app, pgContainer, esContainer };
  }
}

export class TestTeardown {
  public static async teardown(
    app: INestApplication,
    pgContainer: StartedPostgreSqlContainer,
    esContainer: StartedElasticsearchContainer,
  ): Promise<void> {
    try {
      await app.get(DataSource).destroy();
      await app.close();
      await Promise.all([pgContainer.stop(), esContainer.stop()]);
    } catch (error) {
      console.error('Teardown error:', error);
      throw error;
    }
  }
}