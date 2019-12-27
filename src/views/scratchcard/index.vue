<template>
  <div class="body">
    <div class="control">
      <el-input-number v-model="num" :min="0" />
      <el-button type="success" @click="startConfirm">开始</el-button>

      <el-button type="primary" @click="dialogFormVisible = true">添加奖品</el-button>
      <el-button type="primary" @click="dialogTotal = true">库存</el-button>

      <el-dialog title="添加奖品" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="奖品名称">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%" />
          </el-form-item>
          <el-form-item label="奖品数量">
            <el-input-number v-model="form.number" type="number" style="width: 90%" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPrize">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="库存" :visible.sync="dialogTotal">
        <el-table :data="prizes">
          <el-table-column property="name" label="名称" width="150" />
          <el-table-column property="number" label="数量" width="200" />
        </el-table>
      </el-dialog>

    </div>
    <div class="content">
      <div v-for="(item) in data" :key="item.id" class="card">
        <span class="text">🌟{{ item.name }}🌟</span>
        <canvas class="canvas" width="750" height="280" />
      </div>
    </div>
  </div>
</template>

<script>
  import Scratchcard from './scratchcard'

  export default {
    name: 'Scratchcard',
    data() {
      return {
        dialogFormVisible: false,
        dialogTotal: false,
        num: 3,
        form: {
          name: '',
          number: 0
        },
        data: [],
        prizes: [
          {
            name: '铅笔',
            number: 1
          },
          {
            name: '橡皮',
            number: 2
          },
          {
            name: '橡皮1',
            number: 1
          },
          {
            name: '橡皮2',
            number: 1
          },
          {
            name: '橡皮3',
            number: 1
          },
          {
            name: '橡皮4',
            number: 1
          },
          {
            name: '橡皮5',
            number: 1
          },
          {
            name: '橡皮6',
            number: 1
          },
          {
            name: '橡皮7',
            number: 1
          },
          {
            name: '橡皮8',
            number: 1
          },
          {
            name: '橡皮9',
            number: 1
          },
          {
            name: '橡皮10',
            number: 1
          },
          {
            name: '橡皮11',
            number: 1
          }
        ]
      }
    },
    mounted() {
      if (localStorage.prizes) {
        this.prizes = JSON.parse(localStorage.prizes)
      }
    },
    methods: {
      /**
       * 开始确认
       */
      startConfirm() {
        this.$confirm('是否开始抽奖？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            this.init()
          })
          .catch(action => {
            // this.$message({
            //   type: 'info',
            //   message: action === 'cancel'
            //     ? '放弃保存并离开页面'
            //     : '停留在当前页面'
            // })
          })
      },
      /**
       * 初始化
       */
      init() {
        this.savePrize()
        // 清空当前页面刮刮乐
        this.data.splice(0, this.data.length)
        if (this.prizes.length > 0) {
          // const arr = []
          // 随机选三个礼物
          for (let i = 0; this.data.length < this.num && this.prizes.length > 0; i++) {
            const temp = Math.floor(Math.random() * (this.prizes.length - 1))
            // if (!arr.includes(temp)) {
            // arr.push(temp)
            this.prizes[temp].id = new Date().getTime().toString() + i
            // 添加到刮刮乐
            this.data.push(JSON.parse(JSON.stringify(this.prizes[temp])))
            // 奖品数量 -1
            this.prizes[temp].number -= 1
            // 删除用完的商品
            if (this.prizes[temp].number === 0) {
              this.prizes.splice(temp, 1)
            }
            // }
          }
        } else {
          this.$message({
            message: '没有奖品啦～',
            type: 'warning'
          })
        }
        this.$nextTick(() => {
          this.createCard()
        })
      },
      /**
       * 生成刮刮乐
       */
      createCard() {
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
      },
      /**
       * 添加奖品
       */
      addPrize() {
        if (this.form.name) {
          this.prizes.push({
            id: new Date().getTime(),
            name: this.form.name,
            number: this.form.number || 1
          })
          localStorage.prizes = JSON.stringify(this.prizes)
          this.dialogFormVisible = false

          this.$message({
            message: '添加成功～',
            type: 'success'
          })
        } else {
          this.$message({
            message: '请填写商品名称～',
            type: 'warning'
          })
        }
      },
      /**
       * 记录奖品，以免页面刷新，数据消失
       */
      savePrize() {
        localStorage.prizes = JSON.stringify(this.prizes)
      }
    }
  }
</script>

<style scoped lang="scss">
  .body {
    width: 100%;
    height: 100%;
  }

  .content {
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    overflow: auto;

    .card {
      min-width: 375px;
      height: 140px;
      /*width: 30%;*/
      /*background: #000000;*/
      /*background-size: 375px 140px;*/
      margin: 10px;
      /*padding: 0 10px;*/
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
