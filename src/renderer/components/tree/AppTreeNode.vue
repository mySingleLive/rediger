<template>
  <li class="list-item"
    v-on:dblclick="openNode(node)"
    v-on:click="selectNode"
    v-bind:class="{ 'list-item-single-selected': singleSelected, 'list-item-opend': doubleSelected }"
    v-bind:style="{ paddingLeft: leftSpace + (indent * indentSpace) + 'px' }"
   >
      <div class="text">{{ node.name }}</div>
  </li>
</template>

<script>
  import { mapMutations } from 'vuex'

  const context = {
    lastSingleSelected: undefined,
    lastDoubleSelected: undefined
  }

  export default {
    name: 'AppTreeNode',
    props: ['node', 'indent', 'options', 'singleSelected', 'doubleSelected'],
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
        let lastSingleSelected = context.lastSingleSelected
        if (lastSingleSelected !== undefined) {
          lastSingleSelected.singleSelected = false
        }
        context.lastSingleSelected = this
        this.singleSelected = true
        this.doubleSelected = false
      },
      openNode: function (n) {
        let opt = this.options || {}
        n.open(opt.onSelect)

        let lastDoubleSelected = context.lastDoubleSelected
        if (lastDoubleSelected !== undefined) {
          lastDoubleSelected.doubleSelected = false
        }
        context.lastDoubleSelected = this
        this.singleSelected = false
        this.doubleSelected = true
      }
    }
  }
</script>

<style>

</style>
