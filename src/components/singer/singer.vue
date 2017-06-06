<template>
  <div class="singer">
  </div>
</template>

<script type="text/ecmascript-6">
  import { getSingerList } from 'api/singer';
  import { ERR_OK } from 'api/config';
  import Singer from 'common/js/singer';

  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;

  export default {
    data() {
      return {
        singers: []
      };
    },
    created() {
      this._getSingerList();
    },
    methods: {
      _getSingerList() {
        getSingerList().then((response) => {
          if (response.code === ERR_OK) {
            this.singers = response.data.list;
            console.log(this._normalizeSinger(this.singers));
          }
        });
      },
      _normalizeSinger(list) {
        const map = {
          hot: {
            title: HOT_NAME,
            item: []
          }
        };
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.item.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }));
          }

          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            };
          }

          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        });

        // 为了得到有序列表而处理map
        const hot = [];
        const ret = [];
        for (const key in map) {
          const val = map[key];
          if (val.title.match(new RegExp('[a-zA-Z]'))) {
            ret.push(val);
          } else if (val.title === HOT_NAME) {
            hot.push(val);
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        return hot.concat(ret);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
