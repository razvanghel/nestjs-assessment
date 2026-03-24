import { Injectable, Logger } from '@nestjs/common';

import { Client as EsClient } from '@elastic/elasticsearch';

@Injectable()
export class ElasticSearch {
  private client: EsClient;
  private readonly logger = new Logger(ElasticSearch.name);

  constructor() {
    this.client = new EsClient({ node: process.env.ELASTICSEARCH_HOST });
    this.checkConnection();
  }

  async checkConnection() {
    try {
      const isAlive = await this.client.ping();
      this.logger.log('Elasticsearch cluster is up and running:', isAlive);
    } catch (error) {
      this.logger.error('Elasticsearch cluster is down!', error);
    }
  }
}
