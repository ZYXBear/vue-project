<template>
  <div class="body">
    <div v-for="(item,i) in data" :key="i" class="card">
      <span class="text">{{ i+5 }}颗星🌟</span>
      <canvas class="canvas" width="750" height="280" />
    </div>
  </div>
</template>

<script>
  import Scratchcard from './scratchcard'

  export default {
    name: 'Scratchcard',
    data() {
      return {
        data: [
          {
            text: '恭喜你获得小可爱一枚'
          },
          {
            text: '恭喜你获得小可爱一枚'
          },
          {
            text: '恭喜你获得小可爱一枚'
          },
          {
            text: '恭喜你获得小可爱一枚'
          },
          {
            text: '恭喜你获得小可爱一枚'
          },
          {
            text: '恭喜你获得小可爱一枚'
          }
        ]
      }
    },
    mounted() {
      // window.addEventListener('touchmove', function(e) {
      //   e.preventDefault()
      // }, { passive: false })
      const arr = Array.from(document.getElementsByClassName('canvas'))
      arr.forEach(item => {
        new Scratchcard({
          canvas: item,
          // coverImg: 'scratch-2x.jpg',
          pixelRatio: 2,
          doneCallback: function() {
            console.log('done')
          }
        })
      })
    }
  }
</script>

<style scoped lang="scss">
  .body {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    overflow: auto;

    .card {
      min-width: 375px;
      height: 140px;
      /*background: #000000;*/
      background-size: 375px 140px;
      margin: 10px;
      padding: 0 10px;
      position: relative;

      .text {
        color: #000;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
      }
    }

    .card canvas {
      width: 355px;
      height: 140px;
    }
  }
</style>
