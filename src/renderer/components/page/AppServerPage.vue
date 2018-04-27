<template>
  <div class="server-page">
    <div>
        Server Name: <span class="result-key"> {{ page.name }} </span>
    </div>
    <div>
        Host: <span class="result-key"> {{ page.host }} </span>
    </div>
    <div>
        Port: <span class="result-key"> {{ page.port }} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppServerPage',
  props: ['page']
}
</script>

<style>
  .server-page {
    margin: 0px;
    padding: 0px;
  }
</style>
