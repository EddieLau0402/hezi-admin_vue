<template>

  <div id="point-button">

    <el-button class="btn-ctrl-merchant" @click="toggleVisabled()">麦穗充值</el-button>

    <el-dialog title="麦穗充值"
               :visible.sync="dialogVisible"
               @open="handleOpen()"
               @close="handleClose()"
               size="tiny" top="20%" custom-class="add-merchant-dialog"
               :modal-append-to-body="false">
      <el-form label-width="100px">
        <el-form-item label="当前麦穗">
          <div class="text-left"><b>{{ merchant.point }}</b></div>
        </el-form-item>
        <el-form-item label="充值麦穗数">
          <div class="text-left">
            <el-input-number v-model="rechargePoint" :min="0"></el-input-number>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="toggleVisabled()">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="recharge()">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>

export default {
  name: 'point-button',
  props: {
    merchant: {
      required: true,
      default: null
    }
  },
  data () {
    return {
      dialogVisible: false,
      processing: false,
      rechargePoint: 0
    }
  },
  computed: {
    submitDisabled () {
      if (this.processing) {
          return true
      }
      return this.rechargePoint <= 0
    }
  },
  methods: {
    toggleVisabled () {
      this.dialogVisible = !this.dialogVisible
    },
    recharge () {
      this.processing = true
      this.axios.post('/merchant/gift', {merchant_id: this.merchant.id, gift: this.rechargePoint}).then(resp => {
        this.merchant.point = parseInt(this.merchant.point)
        this.merchant.point += parseInt(this.rechargePoint)
        this.toggleVisabled()
      })
      .catch(error => {
        this.processing = false
        console.log(error)
      })
    },
    handleOpen () {
      console.log('>>>>> handle open...')
    },
    handleClose () {
      this.processing = false
      this.rechargePoint = 0
    }
  }
}

</script>
