<template>
  <div class="key-value-page">
    <div id="key-area">
        <span id="key-label">key</span> <span id="result-key"> {{ page.key }} </span>
    </div>
    <div id="value-area">
        <div class="value-area" v-html="page.jsonViewValue">
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppKeyValuePage',
  props: ['page']
}
</script>

<style>
</style>
