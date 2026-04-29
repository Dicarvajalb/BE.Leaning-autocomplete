import { Injectable } from '@nestjs/common';
import type { ClockPort } from '../ports/auth.ports';

@Injectable()
export class SystemClockAdapter implements ClockPort {
  now(): number {
    return Date.now();
  }
}
