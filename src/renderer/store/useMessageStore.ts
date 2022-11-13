import { ref } from 'vue';
import { defineStore } from 'pinia';

import { ModelChat } from '../../model/ModelChat';
import { ModelMessage } from '../../model/ModelMessage';

export const useMessageStore = defineStore('message', () => {
  const data = ref<ModelMessage[]>([]);

  const MSG_1 = `醉里挑灯看剑，梦回吹角连营。八百里分麾下灸，五十弦翻塞外声。沙场秋点兵。马作的卢飞快，弓如霹雳弦惊。了却君王天下事，嬴得生前身后名。可怜白发生`;
  const MSG_2 = `怒发冲冠，凭栏处，潇潇雨歇。抬望眼，仰天长啸，壮怀激烈。 三十功名尘与土，八千里路云和月。莫等闲，白了少年头，空悲切！ 靖康耻，犹未雪；臣子恨，何时灭?驾长车，踏破贺兰山缺！ 壮志饥餐胡虏肉，笑谈渴饮匈奴血。待从头，收拾旧山河，朝天阙！`;

  const initialFakeData = (chat: ModelChat) => {
    const result = [];

    for (let i = 0; i < 10; i++) {
      let model = new ModelMessage();
      model.createTime = Date.now();
      model.isInMsg = i % 2 === 0;
      model.messageContent = model.isInMsg ? MSG_1 : MSG_2;
      model.fromName = model.isInMsg ? chat.fromName : '我';
      model.avatar = chat.avatar;
      model.chatId = chat.id;
      result.push(model);
    }
    data.value = result;
  };

  return {
    data,
    initialFakeData,
  };
});
