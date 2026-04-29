import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { IdGeneratorPort } from '../ports/auth.ports';

@Injectable()
export class SystemIdGeneratorAdapter implements IdGeneratorPort {
  generate(): string {
    return randomUUID();
  }
}
