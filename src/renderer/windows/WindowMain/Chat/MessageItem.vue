<script setup lang="ts">
import { ModelMessage } from '../../../../model/ModelMessage';

defineProps<{
  data: ModelMessage;
}>();
</script>

<template>
  <template v-if="data.isInMsg">
    <div class="messageItem left">
      <div class="avatar">
        <img :src="data.avatar" alt="" />
      </div>
      <div class="msgBox">
        <div class="fromName">{{ data.fromName }}</div>
        <div class="msgContent">{{ data.messageContent }}</div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="messageItem right">
      <div class="msgBox">
        <div class="msgContent">{{ data.messageContent }}</div>
      </div>
      <div class="avatar">
        <img :src="data.avatar" alt="" />
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.messageItem {
  display: flex;
  padding-top: 8px;
  padding-bottom: 8px;
  position: relative;
}
.left {
  padding-right: 30%;
  &::after {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid #fff;
    position: absolute;
    left: 60px;
    top: 38px;
    content: '';
  }
}
.right {
  padding-left: 30%;
  &::after {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid rgb(149, 236, 105);
    position: absolute;
    right: 60px;
    top: 18px;
    content: '';
  }
  .msgContent {
    background: rgb(149, 236, 105) !important;
  }
}
.avatar {
  width: 66px;
  text-align: center;
  img {
    width: 46px;
    height: 46px;
  }
}
.msgBox {
  flex: 1;
}
.fromName {
  color: rgb(178, 178, 178);
  margin-bottom: 6px;
}
.msgContent {
  background: #fff;
  border-radius: 3px;
  padding: 8px;
  line-height: 22px;
}
</style>
