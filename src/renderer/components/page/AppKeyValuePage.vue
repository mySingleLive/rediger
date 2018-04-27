<template>
  <div class="key-value-page">
    <div id="key-area">
        <span id="key-label">key</span> <span id="result-key"> {{ page.key }} </span>
    </div>
    <div id="value-area">
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
    padding: 20px 0px 0px 0px;
  }
  #key-label {
    cursor: default;
    moz-user-select: -moz-none; 
    -moz-user-select: none; 
    -o-user-select:none; 
    -webkit-user-select:none; 
    -ms-user-select:none; 
    user-select:none;
  }
  #result-key {
    margin-left: 12px;
    margin-top: 5px;
    color: rgb(5, 192, 255);
    box-sizing: border-box;
    padding: 10px 8px 10px 8px;
    text-align: center;
    border: 1px solid rgb(26, 25, 25);
  }
  #key-area {
    height: 50px;
    padding-left: 30px;
    border-bottom: 1px solid rgb(14, 13, 13);
  }
  #result-key:hover {
    border-radius: 7px;
    cursor: default;
    background: rgb(41, 39, 39);
    border: 1px solid rgb(133, 132, 132);
  }
  #value-area {
    border-top: 1px solid rgb(92, 90, 90);
    padding: 20px 0px 0px 30px;
  }
</style>
