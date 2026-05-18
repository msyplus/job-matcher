import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SCHEMA_SQL } from './schema';

@Injectable()
export class InitDbService implements OnModuleInit {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async onModuleInit() {
    const statements = SCHEMA_SQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await this.dataSource.query(stmt + ';');
    }
    console.log('Database schema initialized');
  }
}
