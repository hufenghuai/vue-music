<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import { addClass } from 'common/js/dom';

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0,
      };
    },
    props: {
      loop: {
        type: Boolean,
        default: true,
      },
      autoPlay: {
        type: Boolean,
        default: true,
      },
      interval: {
        type: Number,
        default: 4000,
      },
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        if (this.autoPlay) {
          this._play();
        }
      }, 20);

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);

        this.slider.refresh();
      });
    },
    methods: {
      _setSliderWidth(isResize) {  // 初始化设置滚动宽度
        this.children = this.$refs.sliderGroup.children;// 选出轮播的所有节点
        let width = 0;  // sliderGroup的宽度
        const sliderWidth = this.$refs.slider.clientWidth; // 设置父容器slider的宽度
        for (let i = 0; i < this.children.length; i++) {
          const child = this.children[i];
          addClass(child, 'slider-item'); // 给每个轮播的图片动态添加className
          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }

        if (this.loop && !isResize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
        });
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX;
          if (this.loop) {
            pageIndex -= 1;
          }
          this.currentPageIndex = pageIndex;

          if (this.autoPlay) {
            clearTimeout(this.timer);
            this._play();
          }
        });
      },
      _initDots() {
        this.dots = new Array(this.children.length);
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1;
        if (this.loop) {
          pageIndex += 1;
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400);
        }, this.interval);
      },
    },
    distroyed() {
      clearTimeout(this.timer);
    },
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl";

  .slider
    min-height 1px
    .slider-group
      position relative
      overflow hidden
      white-space nowrap
      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration none
        img
          display block
          width 100%
    .dots
      position absolute
      right 0
      left 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll

</style>
