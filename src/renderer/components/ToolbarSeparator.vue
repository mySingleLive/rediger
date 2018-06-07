<template>
    <div class="separator"
         :style="{
             'left': (leftBias + index * (43 + 2) - 9) + 'px'
         }">┋</div>
</template>

<script>
  export default {
    name: 'ToolbarSeparator',
    props: ['index', 'leftSeparator'],
    data: function () {
      return {
        leftBias: 10
      }
    }
  }
</script>

<style>

    .separator {
        position: absolute;
        width: 20px;
        height: 50px;
        top: 0px;
        color: #575a5e;
        text-align: center;
        vertical-align: center;
        line-height: 50px;
        font-size: 30px;
    }

</style>