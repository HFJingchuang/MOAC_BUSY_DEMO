<template>
  <div id="app">
    <div id="v-content" v-bind:style="{minHeight: Height+'px'}">
      <router-view />
    </div>
    <h6 id="id_footer">&copy;2019 — 井创科技</h6>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      Height: 0
    };
  },
  mounted() {
    //动态设置内容高度 让footer始终居底   header+footer的高度是100
    this.Height = document.documentElement.clientHeight - 50; //监听浏览器窗口变化
    window.onresize = () => {
      this.Height = document.documentElement.clientHeight - 50;
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#id_footer {
  position: absolute;
  margin-bottom: 10px;
  width: 100%;
}
</style>
