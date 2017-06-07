<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            class="item"
            :data-index="index"
            :class="{'current': currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import { getData } from 'common/js/dom';

  const ANCHOR_HEIGHT = 18;

  export default {
    created() {
      this.touch = {};
      this.listenScroll = true;
      this.listHeight = [];
      this.probeType = 3;
    },
    data() { // watch
      return {
        scrollY: -1,
        currentIndex: 0
      };
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1);
        });
      }
    },
    components: {
      Scroll
    },
    watch: { // 监听data变化
      data() { // 当data发生变化，重新计算每个group高度
        setTimeout(() => {
          this._calculateHeight();
        }, 20);
      },
      scrollY(newY) { // 监测scrollY发生变化
        // newY就是scroll里面的pos.y
        const listHeight = this.listHeight;
        // 当滚动到顶部，newY > 0;
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          // listHeight.length - 1,则保证了height2即listHeight[i + 1]永远存在
          const height1 = listHeight[i];
          const height2 = listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i;
            return;
          }

          // 滚动到底部，且-newY大于最后一个元素的上限
          this.currentIndex = listHeight.length - 2;
        }
      }
    },
    methods: {
      onShortcutTouchStart(e) { // 对于包含ul、li的div来说，点击li也可触发点击事件
        const anchorIndex = getData(e.target, 'index');
        const firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(anchorIndex);
      },
      onShortcutTouchMove(e) {
        const firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        const delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
        const anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        this._scrollTo(anchorIndex);
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      _scrollTo(index) {
        this.scrollY = -this.listHeight[index]; // 点击右侧导航入口，手动设置scrollY,触发watch事件
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      },
      _calculateHeight() {
        this.listHeight = [];
        const list = this.$refs.listGroup; // 获取到所有的listGroup
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          // item为每个listGroupDOM节点，用clientHeight睡醒可以得到高元素的高度，累加之后就是距离第一个listGroup的高度了
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }

    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable';

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
