<template>
  <li class="list-item"
    v-on:dblclick="openNode(node)"
    v-on:click="selectNode"
    v-bind:class="{ 'list-item-single-selected': singleSelected }"
    v-bind:style="{ paddingLeft: leftSpace + (indent * indentSpace) + 'px' }"
   >
      <div class="text">{{ node.name }}</div>
  </li>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'AppTreeNode',
    props: ['node', 'indent', 'options', 'singleSelected'],
    data: {

    },
    computed: {
      leftSpace () {
        return this.$store.state.Content.menu.leftSpace
      },
      indentSpace () {
        return this.$store.state.Content.menu.indentSpace
      }
    },
    methods: {
      ...mapMutations([
        'SELECT_NODE',
        'SINGLE_SELECT_NODE'
      ]),
      selectNode: function () {
        let lastSingleSelected = this.$store.state.Content.menu.lastSingleSelected
        if (lastSingleSelected !== undefined) {
          lastSingleSelected.singleSelected = false
        }
        this.SINGLE_SELECT_NODE(this)
        this.singleSelected = true
      },
      openNode: function (n) {
        this.singleSelected = false
        let opt = this.options || {}
        n.open(opt.onSelect)
      }
    }
  }
</script>

<style>

</style>
