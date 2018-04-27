<template>
  <div class="key-value-page">
    <div>
        Key: <span class="result-key"> {{ page.key }} </span>
    </div>
    <div>
        Value:
        <div class="value-area" v-html="page.value">
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
  .key-value-page {
    margin: 0px;
    padding: 0px;
  }
</style>
