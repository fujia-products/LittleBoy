<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { ipcRenderer } from 'electron';

defineProps<{
  title?: string;
}>();

const isMaximized = ref(false);

const closeWindow = () => {
  ipcRenderer.invoke('closeWindow');
};

const maximizeMainWin = () => {
  ipcRenderer.invoke('maximizeWindow');
};

const minimizeMainWindow = () => {
  ipcRenderer.invoke('minimizeWindow');
};

const unmaximizeMainWindow = () => {
  ipcRenderer.invoke('unmaximizeWindow');
};

const winMaximizeEvent = () => {
  isMaximized.value = true;
};

const winUnmaximizeEvent = () => {
  isMaximized.value = false;
};

onMounted(() => {
  ipcRenderer.on('windowMaximized', winMaximizeEvent);
  ipcRenderer.on('windowUnmaximized', winUnmaximizeEvent);
});

onUnmounted(() => {
  ipcRenderer.off('windowMaximized', winMaximizeEvent);
  ipcRenderer.off('windowUnmaximized', winUnmaximizeEvent);
});
</script>

<template>
  <div class="topBar">
    <div class="winTitle">{{ title }}</div>
    <div class="winTool">
      <div @click="minimizeMainWindow">
        <i class="icon icon-minimize" />
      </div>
      <div v-if="isMaximized" @click="unmaximizeMainWindow">
        <i class="icon icon-restore" />
      </div>
      <div v-else @click="maximizeMainWin">
        <i class="icon icon-maximize" />
      </div>
      <div @click="closeWindow">
        <i class="icon icon-close" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.topBar {
  display: flex;
  height: 25px;
  line-height: 25px;
  -webkit-app-region: drag;
  width: 100%;
}
.winTitle {
  flex: 1;
  padding-left: 12px;
  font-size: 14px;
  color: #888;
}
.winTool {
  height: 100%;
  display: flex;
  -webkit-app-region: no-drag;
}
.winTool div {
  height: 100%;
  width: 34px;
  text-align: center;
  color: #999;
  cursor: pointer;
  line-height: 25px;
}
.winTool .icon {
  font-size: 10px;
  color: #666666;
  font-weight: bold;
}
.winTool div:hover {
  background: #efefef;
}
.winTool div:last-child:hover {
  background: #ff7875;
}
.winTool div:last-child:hover i {
  color: #fff !important;
}
</style>
