<template>
    <div id="tab_list" :style="{height: tabHeight}">
        <template v-for="(page, index) in $store.state.Content.pageList">
            <div class="tab_item"
                 @click="clickTabItem(page)"
                 @mousedown="onMouseDown($event, page, index)"
                 :class="{active: page.active, inactive: !page.active}"
                 :style="{
                     left: calcCurrentTabLeft(page, index) + 'px',
                     height: tabHeight + 'px',
                     width: tabWidth + 'px',
                     lineHeight: tabHeight + 'px',
                  }">
                <div class="tab_icon">
                    <img :src="page.iconUrl()" width="18px" height="18px">
                </div>
                <div class="tab_title" :style="{width: tabTitleWidth + 'px'}">{{ page.title }}</div>
                <div class="tab_close_btn" @click="closeTabItem($event, page)" @mousedown="onCloseMouseDown($event, page)">
                    <!--<img :src="tabCloseBtnIcon" width="8px" height="8px" style="top: 0px; left: 0px;">-->
                </div>
            </div>
        </template>
    </div>

</template>

<script>
  import { Sizes } from '../../client/constants'
  import { mapMutations } from 'vuex'

  export default {
    name: 'TabList',
    data () {
      return {
        tabDragging: false,
        tabPointOffset: 0,
        tabDraggingLeft: 0
      }
    },
    computed: {
      pageList () {
        return this.$store.state.Content.pageList
      },
      tabHeight () {
        return Sizes.TAB_HEIGHT
      },
      tabWidth () {
        return Sizes.TAB_MAX_WIDTH
      },
      tabTitleWidth () {
        return this.tabWidth - 70
      }
    },
    methods: {
      ...mapMutations([
        'SELECT_PAGE',
        'CLOSE_PAGE',
        'CHANGE_PAGE_POSITION'
      ]),
      normalTabLeft (index) {
        return this.tabWidth * index
      },
      calcCurrentTabLeft (page, index) {
        if (page.active && this.tabDragging) {
          return this.tabDraggingLeft
        }
        return this.normalTabLeft(index)
      },
      calcDraggingPosition (index, newPosX) {
        let deltaX = newPosX - this.normalTabLeft(index)
        if (deltaX === 0) {
          return index
        }
        let nums = Math.floor(Math.abs(deltaX) / this.tabWidth)
        if (nums !== 0) {
          if (deltaX < 0) {
            let idx = index - nums
            return idx
          } else {
            return index + nums
          }
        }
        return index
      },
      onMouseDown (event, page, index) {
        console.log('tab item mouse down:', event, ' page:', page)
        if (event.button === 0) {
          this.tabPointOffset = event.clientX
          document.onmousemove = (eventMve) => {
            if (!page.active) {
              this.SELECT_PAGE(page)
            }
            this.tabDragging = true
            this.tabDraggingLeft = this.normalTabLeft(index) + (eventMve.clientX - this.tabPointOffset)
            let newPos = this.calcDraggingPosition(index, this.tabDraggingLeft)
            let list = this.$store.state.Content.pageList
            // console.log('new pos:', newPos)
            if (newPos >= 0 && list.length > newPos) {
              this.CHANGE_PAGE_POSITION({page: page, newPosPage: list[newPos]})
            }
          }
          document.onmouseup = () => {
            this.tabDragging = false
            document.onmousemove = undefined
          }
        } else if (event.button === 1) {
          event.target.onmousewheel = () => {
            event.target.style.cursor = 'default'
            return false
          }
          event.target.onmouseup = () => {
            this.CLOSE_PAGE(page)
          }
          return false
        }
      },
      clickTabItem (page) {
        if (!page.toBeClosed) {
          console.log('click tab item, page:', page.title)
          this.SELECT_PAGE(page)
        }
      },
      closeTabItem (event, page) {
        page.toBeClosed = true
        event.target.style['background-position'] = '2px 2px'
        event.target.style['background-size'] = '8px 8px'
        this.CLOSE_PAGE(page)
      },
      onCloseMouseDown (event, page) {
        console.log('close btn down:', page.title)
        event.target.style['background-position'] = '1px 1px'
        event.target.style['background-size'] = '10px 10px'
        event.target.onmouseup = (eventUp) => {
          eventUp.target.style['background-position'] = '2px 2px'
          eventUp.target.style['background-size'] = '8px 8px'
        }
      }
    }
  }
</script>

<style lang="less">
    @tab_left_space_width: 12px;
    @tab_icon_width: 25px;
    @tab_font_size: 12px;

    #tab_list > .tab_item {
        position: absolute;
        top: 0px;
        left: 0px;
        vertical-align: center;
        cursor: default;
    }

    #tab_list > .active {
        color: #cacaca;
        background-color: #252525;
        z-index: 2000;
    }

    #tab_list > .inactive {
        color: #9a9a9a;
        background-color: #414246;
    }


    .tab_icon {
        position: absolute;
        top: 3px;
        left: @tab_left_space_width;
        width: @tab_icon_width;
    }

    .tab_title {
        position: absolute;
        top: 0px;
        left: @tab_left_space_width + @tab_icon_width;
        text-align: left;
        font-size: @tab_font_size;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .tab_close_btn {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 12px;
        height: 12px;
        background-image: url(/static/img/tab_close_btn_2.svg);
        background-repeat: no-repeat;
        background-position: 2px 2px;
        background-size: 8px 8px;
    }

    #tab_list > .inactive > .tab_close_btn {
        background-image: url(/static/img/tab_close_btn_inactive_2.svg);
        background-repeat: no-repeat;
        background-position: 2px 2px;
        background-size: 8px 8px;
    }

    #tab_list > .inactive:hover > .tab_close_btn {
        background-image: url(/static/img/tab_close_btn_2.svg);
        background-repeat: no-repeat;
        background-position: 2px 2px;
        background-size: 8px 8px;
    }

</style>