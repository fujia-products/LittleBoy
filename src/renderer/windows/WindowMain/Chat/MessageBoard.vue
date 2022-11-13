<script setup lang="ts">
import { ref } from 'vue';

import BarTop from '../../../components/BarTop.vue';
import { ModelChat } from '../../../../model/ModelChat';
import MessageItem from './MessageItem.vue';
import { useChatStore } from '../../../store/useChatStore';
import { useMessageStore } from '../../../store/useMessageStore';

const chatStore = useChatStore();
const messageStore = useMessageStore();

// let curId = '';

/**
 * NOTE: Subscribing the data changed in store
 */
// chatStore.$subscribe((mutations, state) => {
//   const item = state.data.find((v) => v.isSelected) as ModelChat;

//   if (item.id !== curId) {
//     // messageStore.initialFakeData(item);
//     curId = item.id;
//   }
// });
</script>

<template>
  <div class="MessageBoard">
    <BarTop />
    <div class="MessageList">
      <MessageItem
        :data="item"
        v-for="item in messageStore.data"
        :key="item.id"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.MessageBoard {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.MessageList {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgb(245, 245, 245);
}
</style>
