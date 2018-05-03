<template>
  <li class="list-item"
    @dblclick="openNode(node)"
    @click="selectNode"
    :class="{ 'list-item-single-selected': singleSelected, 'list-item-opend': doubleSelected }"
    :style="{ paddingLeft: leftSpace + (indent * indentSpace) + 'px' }"
   >
      <div class="list-item-content">
          <div class="list-item-expand-area" @click="switchExpand(node)">
            <div v-if="!node.leaf && node.opened" :class="{ 'list-item-expand': !node.expanded, 'list-item-unexpand': node.expanded }"></div>
          </div>
          <div v-if="node.iconUrl() !== undefined" class="list-item-icon"><img :src="node.iconUrl()" width="18px" height="18px" alt=""></div>
          <template v-if="node.type === 'server'"><ServerNode :node="node"/></template>
          <div v-else class="text"><span class="node-name" >{{ node.name }} </span><span class="node-description" v-html="node.simpleInfo()"></span></div>
      </div>
  </li>
</template>

<script>
  import { mapMutations } from 'vuex'
  import ServerNode from './ServerNode'

  const context = {
    lastSingleSelected: undefined,
    lastDoubleSelected: undefined,
    currentDbSelected: undefined
  }

  export default {
    name: 'AppTreeNode',
    props: ['node', 'indent', 'options'],
    computed: {
      leftSpace () {
        return this.$store.state.Content.menu.leftSpace
      },
      indentSpace () {
        return this.$store.state.Content.menu.indentSpace
      }
    },
    components: {
      ServerNode
    },
    data () {
      return {
        singleSelected: false,
        doubleSelected: false
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
        if (context.currentDbSelected !== undefined && context.currentDbSelected !== this) {
          context.currentDbSelected.doubleSelected = true
        }
      },
      expand: function (n) {
        n.expand()
        let opts = this.options || {}
        if (opts.onExpand !== undefined) {
          opts.onExpand()
        }
      },
      unexpand: function (n) {
        n.unexpand()
        let opts = this.options || {}
        if (opts.onUnexpand !== undefined) {
          opts.onUnexpand()
        }
      },
      switchExpand: function (n) {
        if (!n.opened) {
          return
        }
        let opts = this.options || {}
        console.log('switchExpand!!', opts)
        if (!n.expanded) {
          this.expand(n)
        } else {
          this.unexpand(n)
        }
      },
      openNode: function (n) {
        let opt = this.options || {}
        let self = this
        if (!n.opened) {
          n.open(function (node) {
            if (opt.onSelect !== undefined) {
              opt.onSelect(node)
            }
            self.expand(node)
          })
        } else {
          this.switchExpand(n)
        }
        if (n.leaf) {
          let lastDoubleSelected = context.lastDoubleSelected
          if (lastDoubleSelected !== undefined) {
            lastDoubleSelected.doubleSelected = false
          }
          context.lastDoubleSelected = this
          this.singleSelected = false
          this.doubleSelected = true
          context.currentDbSelected = this
        }
      }
    }
  }
</script>

