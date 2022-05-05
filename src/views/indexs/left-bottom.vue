<!--
 * @Author: daidai
 * @Date: 2022-03-01 09:43:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-27 14:23:03
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\left-bottom.vue
-->
<template>

  <div v-if="pageflag" class="left_boottom_wrap beautify-scroll-def" :class="{ 'overflow-y-auto': !sbtxSwiperFlag }">
    <component :is="components" :data="list" :class-option="defaultOption">
      <ul class="left_boottom ">
        <li class="left_boottom_item" v-for="(item, i) in list" :key="i">
          <span class="orderNum doudong">{{ i + 1 }}</span>
          <div class="inner_right">
            <div class="dibu"></div>
            <span class="info wangguan doudong"> {{ item.gatewayno }}</span>
            <div class="address doudong" :title="addressHandle(item)">
              {{ addressHandle(item) }}
            </div>
            <div class="time_types ">
              <span class="time doudong"> {{ item.createTime }}</span>
              <span class="types doudong"
                :class="{ typeRed: item.onlineState == 0, typeGreen: item.onlineState == 1 }">{{
                    item.onlineState == 1 ? "上线" :
                      "下线"
                }}</span>
            </div>
          </div>

        </li>
      </ul>
    </component>
  </div>

  <Reacquire v-else @onclick="getData" style="line-height:200px" />
</template>

<script>
import { currentGET } from 'api'
import vueSeamlessScroll from 'vue-seamless-scroll'  // vue2引入方式
import Kong from '../../components/kong.vue'
export default {
  components: { vueSeamlessScroll, Kong },
  data() {
    return {
      list: [

      ],
      pageflag: true,
      components: vueSeamlessScroll,
      defaultOption: {
        ...this.$store.state.setting.defaultOption,
         singleHeight: 240,
         step:0
      }
    };
  },
  computed: {
    sbtxSwiperFlag() {
      let sbtxSwiper = this.$store.state.setting.sbtxSwiper
      if (sbtxSwiper) {
        this.components = vueSeamlessScroll
      } else {
        this.components = Kong
      }
      return sbtxSwiper
    }
  },
  created() {
    this.getData()
  },

  mounted() { },
  methods: {
    addressHandle(item) {
      let name = item.provinceName
      if (item.cityName) {
        name += '/' + item.cityName
        if (item.countyName) {
          name += '/' + item.countyName
        }
      }
      return name
    },
    getData() {
      this.pageflag = true
      // this.pageflag =false
      currentGET('big3', { limitNum: 20 }).then(res => {
        console.log('设备提醒', res);
        if (res.success) {
          this.countUserNumData = res.data
          this.list = res.data.list
            let timer = setTimeout(() => {
              clearTimeout(timer)
              this.defaultOption.step=this.$store.state.setting.defaultOption.step
          }, this.$store.state.setting.defaultOption.waitTime);
        } else {
          this.pageflag = false
          this.$Message({
            text: res.msg,
            type: 'warning'
          })
        }
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.left_boottom_wrap {
  overflow: hidden;
  width: 100%;
  height: 100%;

}

.doudong {
  //  vertical-align:middle; 
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.left_boottom {
  width: 100%;
  height: 100%;

  .left_boottom_item {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 8px;
    font-size: 14px;
    margin: 10px 0;

    .orderNum {
      margin: 0 16px 0 -20px;
    }

    .info {
      color: #fff;
    }

    .inner_right {
      position: relative;
      height: 100%;
      min-width: 380px;
      max-width: 380px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;



      .dibu {
        position: absolute;
        height: 2px;
        width: 104%;
        background-image: url("../../assets/img/zuo_xuxian.png");
        bottom: -10px;
        left: -2%;
        background-size: cover;
      }
    }

    .wangguan {
      color: #1890ff;
      font-weight: 900;
      font-size: 15px;
      width: 80px;
      flex-shrink: 0;
    }

    .time_types {
      width: 154px;
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
    }

    .time {
      font-size: 12px;
      // color: rgba(211, 210, 210,.8);
      color: #FFF;
    }

    .address {
      font-size: 12px;
      cursor: pointer;
      @include text-overflow(1);
    }

    .types {
      width: 30px;
      flex-shrink: 0;
    }

    .typeRed {
      color: #fc1a1a;
    }

    .typeGreen {
      color: #29fc29;
    }
  }

}
</style>