import { ModelBase } from './ModelBase';

export class ModelChat extends ModelBase {
  fromName?: string;
  sendTime?: number | string;
  isSelected = false;
  lastMsg?: string;
  avatar?: string;
  /**
   * NOTE:
   * 0 - single chat
   * 1 - group chat
   * 2 - official account
   * 3 - file transform helper
   */
  chatType?: number;
}
