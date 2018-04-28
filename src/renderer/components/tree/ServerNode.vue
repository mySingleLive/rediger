<template>
  <div class="text">{{ node.name }} <span class="node-description" v-if="node.dbsize !== undefined"> [ size: {{ node.dbsize }} ] </span></div>
</template>

<script>
  export default {
    name: 'ServerNode',
    props: ['node']
  }
</script>

<style>
</style>
