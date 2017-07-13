<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Fingerprint2 from 'fingerprintjs2'

export default {
  name: 'app',
  created() {
    var options = {
      extendedJsFonts: true,
      excludePlugins: true,
      excludeAdBlock: true
    };

   var self = this; 
    new Fingerprint2(options).get(function (result) {
      console.log(result)
      self.$store.commit('setFingerprint', result)
    });

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
