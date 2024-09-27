<template>
  <div>
    <!-- 搜索 -->
    <div class="search-view">
      <div class="search-box">
        <van-icon name="search" size="20" color="#999" />
        <van-field
          v-model="searchVal"
          placeholder="Search..."
          class="ipt"
          maxlength="30"
          clearable
          @update:model-value="searchValUpdate"
          clear-trigger="always"
        />
      </div>
    </div>
    <div class="middle-box">
      <!-- 热门推荐 -->
      <div class="recommend">
        <div class="parent-tt">Recommend</div>
        <div class="recom-list">
          <div class="item" v-for="(item, index) in recommendList" :key="index">
            <div class="logo-bg">
              <img :src="item.images[2]" class="logo-img" />
            </div>
            <p class="name">{{ item.title }}</p>
            <p class="cate">{{ item.category }}</p>
          </div>
        </div>
      </div>
      <div class="app-list">
        <template v-if="!isNoData">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model:loading="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              class="scroll-list"
            >
              <div class="list-item" v-for="(item, index) in list" :key="index">
                <i class="index-i">{{ index + 1 }}</i>
                <div class="logo-bg">
                  <img :src="item.images[2]" class="logo-img" />
                </div>
                <div class="app-intro">
                  <h3>{{ item.title }}</h3>
                  <p class="cate">{{ item.category }}</p>
                  <div class="rating-box">
                    <van-rate
                      v-model="item.rating"
                      readonly
                      allow-half
                      color="#ffd21e"
                      :size="15"
                    />
                    <i class="num">({{ item.num }})</i>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </template>
        <div v-else class="no-data">
          <img src="@/assets/images/no_data.png" />
          <p>暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getTopfreeapplications,
  getTopgrossingapplications,
} from "@/request/api";
export default {
  // data() 返回的属性将会成为响应式的状态
  // 并且暴露在 `this` 上
  data() {
    return {
      searchVal: "",
      recommendList: [], //推荐列表
      refreshing: false, //下拉刷新
      finished: false, //是否已加载完成
      loading: false, //加载状态
      list: [], //列表数据
      page: 0, //页码
      limit: 10, //分页数量
      oldList: [], //所有数据
      isNoData: false, //是否无数据
    };
  },
  created() {
    // 获取推荐数据
    this.getTopfreeapplications();
  },
  methods: {
    // 获取头部列表
    async getTopfreeapplications() {
      let res = await getTopfreeapplications({
        limit: this.limit,
      });
      if (res) {
        let entryList = res.feed.entry;
        // 处理数据
        var serializedData = entryList.map((entry) => {
          return {
            name: entry["im:name"].label,
            images: entry["im:image"].map((image) => image.label),
            summary: entry.summary.label,
            price: entry["im:price"].attributes.amount,
            title: entry.title.label,
            id: entry.id.label,
            artist: entry["im:artist"].label,
            category: entry.category.attributes.label,
          };
        });

        this.recommendList = serializedData;
      }
    },
    onLoad() {
      // 搜索时不执行滚动加载事件
      if (this.searchVal) {
        return false;
      }
      this.page += 1;
      if (!this.oldList.length) {
        // 获取免费app列表
        this.getTopgrossingapplications();
      } else {
        this.processListData(); //获取数据
      }
    },
    // 下拉刷新
    onRefresh() {
      this.page = 1;
      //如果下拉拉刷新,拼接在前
      this.list = [];
      this.refreshing = false;

      this.processListData(); //获取数据
    },
    // 处理列表数据
    processListData() {
      if (this.page == 1) {
        this.list = this.oldList.slice(0, 10);
      } else {
        // 截取对应索引的值
        let startIndex = (this.page - 1) * 10;
        let endIndex = this.page * 10;
        this.list = [...this.list, ...this.oldList.slice(startIndex, endIndex)];
      }

      this.loading = false;

      // 判断是否没有了
      if (this.page * 10 >= this.oldList.length) {
        this.finished = true;
      }
    },
    // 获取数据列表
    async getTopgrossingapplications() {
      let res = await getTopgrossingapplications({ limit: 100 });
      if (res) {
        let entryList = res.feed.entry;
        // 处理数据
        var serializedData = entryList.map((entry) => {
          return {
            name: entry["im:name"].label,
            images: entry["im:image"].map((image) => image.label),
            summary: entry.summary.label,
            price: entry["im:price"].attributes.amount,
            title: entry.title.label,
            id: entry.id.label,
            artist: entry["im:artist"].label,
            category: entry.category.attributes.label,
            rating: Math.random() * 5, //星级
            num: Math.ceil(Math.random() * 1000), //评论数
          };
        });
        this.oldList = serializedData; //获取所有数据
        this.processListData(); //处理展示的数据
      }
    },
    // 搜索框值变更
    searchValUpdate() {
      this.page = 1;
      this.isNoData = false;
      if (this.searchVal) {
        const filteredData = this.oldList.filter(
          (item) =>
            item.name.includes(this.searchVal) ||
            item.artist.includes(this.searchVal) ||
            item.summary.includes(this.searchVal)
        );
        this.list = filteredData;
        this.isNoData = filteredData.length ? false : true;
      } else {
        this.list = [];
        this.processListData(); //获取数据
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search-view {
  padding: 20px;
  overflow: hidden;
  border-bottom: 1px solid #ddd;
  position: fixed;
  @include wh(100%, 120px);
  background-color: #fff;
  z-index: 10;

  .search-box {
    background-color: #eee;
    overflow: hidden;
    border-radius: 20px;
    overflow: hidden;
    width: 100%;
    @include fxs;
    padding: 0 10px;
  }

  .ipt {
    flex: 1;
    overflow: hidden;
    height: 100%;
    background-color: transparent;
    padding-left: 10px;
    :deep(.van-cell__value) {
      font-size: 30px;
      .van-field__body {
        height: 100%;
        input {
          height: 100%;
        }
      }
    }
  }
}

.middle-box {
  overflow: hidden;
  padding-top: 120px;
}

.recommend {
  overflow: hidden;
  border-bottom: 1px solid #ddd;
  .parent-tt {
    padding: 10px 20px;
    overflow: hidden;
    @include font(32px, #333);
    font-weight: 700;
  }

  .recom-list {
    width: 100%;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
    .item {
      display: inline-block;
      margin: 5px 20px;
      overflow: hidden;
      width: 150px;
      .logo-bg {
        @include wh(100%, 150px);
        overflow: hidden;
        border-radius: 30px;
        .logo-img {
          @include wh(100%, 100%);
          object-fit: contain;
        }
      }
      .name {
        @include font(30px, #333);
        font-weight: 700;
        line-height: 2;
        text-align: center;
        @include elli;
        margin: 5px auto;
      }
      .cate {
        @include font(24px, #666);
        @include elli;
        text-align: center;
      }
    }
  }
}

// 列表
.app-list {
  overflow: hidden;

  .scroll-list {
    padding: 0 20px;
  }

  .list-item {
    overflow: hidden;
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
    @include fxs;
    &:last-child {
      border-bottom: none;
    }
    &:nth-child(even) {
      .logo-bg {
        border-radius: 50%;
      }
    }

    .index-i {
      @include font(22px, #666);
      list-style: none;
    }

    .logo-bg {
      @include wh(150px, 150px);
      overflow: hidden;
      border-radius: 30px;
      margin: 0 15px;
      .logo-img {
        @include wh(100%, 100%);
        object-fit: contain;
      }
    }

    .app-intro {
      flex: 1;
      overflow: hidden;
      @include elli;
      h3 {
        @include font(30px, #333);
        font-weight: 700;
        line-height: 2;
        @include elli;
      }
      .cate {
        @include font(24px, #666);
        @include elli;
        margin: 10px auto;
      }

      .rating-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;
        .num {
          @include font(22px, #999);
          margin-left: 10px;
        }
      }
    }
  }
}

.no-data {
  overflow: hidden;
  text-align: center;
  margin-top: 50px;
  img {
    @include wh(280px, 280px);
  }
  p {
    margin-top: 20px;
    @include font(26px, #999);
  }
}

// @media (min-width: 1024px) {
//   .about {
//     min-height: 100vh;
//     display: flex;
//     align-items: center;
//   }
</style>
