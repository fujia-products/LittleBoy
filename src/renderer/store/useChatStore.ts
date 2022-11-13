import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

import { ModelChat } from '../../model/ModelChat';
import { useMessageStore } from './useMessageStore';

const initialFakeData = () => {
  const result = [];

  for (let i = 0; i < 10; i++) {
    const chatItem = new ModelChat();

    chatItem.fromName = '聊天对象' + i;
    chatItem.sendTime = '昨天';
    chatItem.lastMsg = '这是此会话的最后一条消息' + i;
    chatItem.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
    result.push(chatItem);
  }

  return result;
};

/**
 * NOTE: defined one store
 */
export const useChatStore = defineStore('chat', () => {
  const data: Ref<ModelChat[]> = ref(initialFakeData());

  const selectItem = (item: ModelChat) => {
    if (item.isSelected) {
      return;
    }

    data.value.forEach((v) => (v.isSelected = false));

    item.isSelected = true;

    const messageStore = useMessageStore();
    messageStore.initialFakeData(item);
  };

  return {
    data,
    selectItem,
  };
});
