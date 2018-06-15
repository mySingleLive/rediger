<template>
    <div class="new-connection-page">
        <div class="form">
            <div class="row">
                <div class="label">Name</div>
                <InputText id="conn-name" ref="connName" placeholder="Connection Name"></InputText>
            </div>
            <div class="row">
                <div class="label">Host</div>
                <InputText id="conn-host" ref="connHost" placeholder="Redis Server Host"></InputText>
            </div>
            <div class="row">
                <div class="label">Port</div>
                <InputText id="conn-port" ref="connPort" defaultValue="6379"></InputText>
            </div>
            <div class="row">
                <div class="label">Auth</div>
                <InputText id="conn-auth" ref="connAuth" placeholder="Authentication Password"></InputText>
            </div>
            <div class="normal-button" style="position: absolute; top: 180px; left: 0px; width: 280px">
                Test Connection
            </div>
            <div class="submit-button" style="position: absolute; top: 180px; right: 0px; width: 100px">
                Add
            </div>
        </div>
    </div>
</template>

<script>
  import InputText from '../InputText'

  export default {
    name: 'AppNewConnectionPage',
    components: {
      InputText
    }
  }
</script>

<style>

    .new-connection-page {

    }

    .new-connection-page > .form {
        position: absolute;
        left: 80px;
        top: 100px;
        width: 476px;
    }

    .new-connection-page > .form > .row {
        width: 100%;
        height: 40px;
        line-height: 26px;
        padding: 5px 0px 5px 5px;
        vertical-align: center;
    }

    .new-connection-page > .form > .row > .label {
        width: 60px;
        height: 26px;
        float: left;
        font-size: 12px;
        color: #b3b1b5;
        font-weight: bold;
    }


    .normal-button {
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #4f5456;
        border-radius: 6px;
        border: 1px solid #878989;
    }


    .submit-button {
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #445b32;
        border-radius: 6px;
        border: 1px solid #8e9a6f;
    }

</style>