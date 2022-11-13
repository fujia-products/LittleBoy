import crypto from 'crypto';

export class ModelBase {
  id: string;

  constructor() {
    this.id = crypto.randomUUID();
  }
}
