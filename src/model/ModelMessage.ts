import { ModelBase } from './ModelBase';

export class ModelMessage extends ModelBase {
  createTime?: number;
  receiveTime?: number;
  messageContent?: string;
  chatId?: string;
  fromName?: string;
  avatar?: string;
  /**
   * NOTE: Is a passed message
   */
  isInMsg?: boolean;
}
