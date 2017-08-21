<template>
  <router-view>
  </router-view>
</template>

<script>
import Fingerprint2 from 'fingerprintjs2';
import "normalize.css";

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

<style scoped>
@font-face {
  font-family: 'pixelated';
  src: url('../fonts/PixellettersFull.ttf');
}

#app {
  height: 100%;
  width: 100%;
}
</style>
