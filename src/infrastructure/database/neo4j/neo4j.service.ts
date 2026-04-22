import { Injectable, OnModuleInit } from '@nestjs/common';
import neo4j from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit {
  private driver;

  onModuleInit() {
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'password'),
    );
  }

  getSession() {
    return this.driver.session();
  }
}