<template>
    <div id="tab_list" :style="{height: tabHeight}">
        <template v-for="(page, index) in pageList">
            <div class="tab_item"
                 @click="clickTabItem(page)"
                 :class="{active: page.active, inactive: !page.active}"
                 :style="{
                     left: (tabWidth * index) + 'px',
                     height: tabHeight + 'px',
                     width: tabWidth + 'px',
                     lineHeight: tabHeight + 'px',
                  }">
                <div class="tab_icon">
                    <img :src="page.iconUrl()" width="18px" height="18px">
                </div>
                <div class="tab_title" :style="{width: tabTitleWidth + 'px'}">{{ page.title }}</div>
                <div class="tab_close_btn">
                    <!--<img :src="tabCloseBtnIcon" width="8px" height="8px" style="top: 0px; left: 0px;">-->
                </div>
            </div>
        </template>
    </div>

</template>

<script>
  import { IconUrl, Sizes } from '../../client/constants'
  import { mapMutations } from 'vuex'

  export default {
    name: 'TabList',
    data () {
      let self = this
      return {
        pageList: self.$store.state.Content.pageList
      }
    },
    computed: {
      tabHeight () {
        return Sizes.TAB_HEIGHT
      },
      tabWidth () {
        return Sizes.TAB_MAX_WIDTH
      },
      tabTitleWidth () {
        return this.tabWidth - 70
      },
      selectedPage () {
        return this.$store.state.Content.selectedPage
      },
      tabCloseBtnIcon () {
        return IconUrl.TAB_CLOSE_BTN
      }
    },
    methods: {
      ...mapMutations([
        'SELECT_PAGE'
      ]),
      clickTabItem (page) {
        this.SELECT_PAGE(page)
      },
      closeTabItem (page) {

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
    }

    #tab_list > .active {
        color: #cacaca;
        background-color: #252525;
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
        width: 8px;
        height: 8px;
        background-image: url(/static/img/tab_close_btn_2.svg);
        background-size: 8px 8px;
    }
</style>