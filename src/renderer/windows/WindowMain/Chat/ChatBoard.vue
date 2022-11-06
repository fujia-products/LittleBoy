<script setup lang="ts">
import { onMounted } from 'vue';
import ChatSearch from './ChatSearch.vue';

onMounted(() => {});
</script>

<template>
  <div class="ChatList">
    <ChatSearch />
    <div class="ListBox"></div>
  </div>
</template>

<style scoped lang="scss">
.ChatList {
  width: 250px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
.ListBox {
  background: rgb(230, 229, 229);
  background-image: linear-gradient(
    to bottom right,
    rgb(235, 234, 233),
    rgb(240, 240, 240)
  );
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;

  border-right: 1px solid rgb(214, 214, 214);
}
</style>
