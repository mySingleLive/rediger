<template>
    <div class="input-text" :class="{focus: isFocus}">
        <div class="text-container">
            <!--<div class="text-value-area" tabindex="0" @focus="onFocus" @blur="onBlur">ssssss</div>-->
            <input type="text" @focus="onFocus" @blur="onBlur" :placeholder="placeholder" :value="value">
        </div>
    </div>
</template>

<script>
  export default {
    name: 'InputText',
    props: [
      'placeholder', 'defaultValue'
    ],
    data () {
      return {
        isFocus: false,
        value: this.defaultValue
      }
    },
    methods: {
      onFocus () {
        console.log('do onFocus')
        this.isFocus = true
      },
      onBlur () {
        this.isFocus = false
      }
    }
  }
</script>

<style>

    .form > .row > .input-text {
        width: 410px;
        height: 26px;
        float: left;
    }


    .form > .row > .input-text > .text-container {
        width: 100%;
        height: 100%;
        padding: 0px 0px 0px 5px;
        border: 1px solid #859194;
        border-radius: 1px;
        background-color: #3b3f40;
    }

    .form > .row > .focus > .text-container {
        border: 1px solid #5d9bc1;
    }

    .form > .row > .input-text > .text-container > .text-value-area {
        width: 100%;
        height: 100%;
        line-height: 24px;
        outline:none
    }

    .form > .row > .input-text > .text-container > .text-value-area:hover {
        cursor: text;
    }


    .form > .row > .input-text  input {
        color: #cccccc;
        width: 100%;
        height: 20px;
        border: 0 solid rgba(0, 0, 0, 0);
        outline:none;
        line-height: 24px;
        background-color: rgba(0, 0, 0, 0);
    }

    .form > .row > .input-text  input:hover {
        cursor: text;
    }

</style>