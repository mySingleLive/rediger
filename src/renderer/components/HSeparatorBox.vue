<template>
    <div class="h-separator-box" ref="box">
        <slot ref="panels"></slot>
        <template v-for="item in separators">
            <div class="layout-separator-col" style="width: 20px; background: yellow"> {{ item.index }}</div>
        </template>
    </div>
</template>

<script>
  export default {
    name: 'HSeparatorBox',
    data () {
      return {
        separators: []
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let slots = this.$slots.default
        console.log('$refs:', this.$refs, '$slots', this.$slots)
        this.panels = []
        for (let i in slots) {
          let slot = slots[i]
          console.log('Slots[' + i + ']:', slot)
          if (slot.tag !== undefined) {
            this.panels.push(slot)
          }
        }
        console.log('Init Panels:', this.panels)
        let totalLeft = 0
        for (let i in this.panels) {
          let panel = this.panels[i]
          let width = panel.width
          console.log('panel width:', width)
          if (width !== undefined && width[width.length - 1] !== '%') {
            totalLeft += parseInt(width)
          } else {
            // panel.resizePanel({
            //   left: totalLeft
            // })
            panel.data.panelLeft = totalLeft
            break
          }
        }
        console.log('total left:', totalLeft)
      }
    }
  }
</script>

<style scoped>

</style>