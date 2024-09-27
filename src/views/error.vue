<template>
  <div class="error-view">
    <img src="@/assets/images/404.png" />
    <p>您的页面走丢了，点击<router-link to="/">返回首页</router-link></p>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.error-view{
    text-align: center;
    margin-top: 200px;
    img{
        width: 300px;
    }
    p{
        margin-top: 20px;
        font-size: 26px;
        color: #666;
    }
}
</style>