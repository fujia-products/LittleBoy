<script setup lang="ts">
window.opener.postMessage({
  msgName: 'Hi',
  value: 'This is sub page',
});
</script>

<template>
  <div>account setting</div>
</template>

<style scoped lang="scss"></style>
