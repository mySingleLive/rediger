<template>
  <div class="key-value-page" style="color: white; background: #252525">
    <div id="key-area">
        <span id="key-label">key</span> <span id="result-key"> {{ page.key }} </span>
    </div>
    <div id="value-area">
        <Box :width="200" :height="10" :top="80" :left="10" :scrollY="true">
            <div class="value-area" v-html="page.jsonViewValue">
            </div>
        </Box>
    </div>
  </div>
</template>

<script>
  import Box from '../Box'

  export default {
    name: 'AppKeyValuePage',
    props: ['page'],
    components: {
      Box
    }
  }
</script>

<style>
</style>
