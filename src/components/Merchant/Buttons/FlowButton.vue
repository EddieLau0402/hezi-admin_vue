<template>

  <div id="flow-button">

    <el-button class="btn-ctrl-merchant" @click="toggleVisabled()">流量包</el-button>

    <el-dialog title="充值流量包"
               :visible.sync="dialogVisible"
               @open="handleOpen()"
               @close="handleClose()"
               size="tiny" top="20%"
               custom-class="add-merchant-dialog"
               :modal-append-to-body="false">
      <el-form label-width="160px">
        <el-form-item label="UV上限" class="mb5">
          <div class="text-left"><b>{{ uvLimit }}</b></div>
        </el-form-item>
        <el-form-item label="剩余接口调用次数" class="mb15">
          <div class="text-left">{{ leftCallLimit }}<span class="call-limit-total">{{ callLimit }}</span></div>
        </el-form-item>

        <div>
          <el-form-item label="添加流量包数" class="mb0">
            <div class="text-left">
              <el-input-number v-model="rechargeFlowPackageNum" :min="0" :max="99"></el-input-number>
            </div>
          </el-form-item>
          <p class="tips flow-package">(1个流量包 = 100万UV, 2500万接口次数)</p>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="toggleVisabled()">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="recharge()">确 定</el-button>
      </div>

    </el-dialog>

  </div>

</template>

<script>

const UV_LIMIT_UNIT = 10000, UV_LIMIT_UNIT_TEXT = '万',CALL_LIMIT_UNIT = 10000, CALL_LIMIT_UNIT_TEXT = '万'

export default {
  name: 'flow-button',
  props: {
    merchant: {
      required: true,
      default: null
    }
  },
  mounted () {

  },
  data () {
    return {
      dialogVisible: false,
      processing: false,
      rechargeFlowPackageNum: 0,

      appUsed: 0,
      merchantVersion: null,

      package: {
        uv_num: 1000000,
        call_num: 25000000
      }
    }
  },
  computed: {
    uvLimit () {
      let uvLimit = this.merchantVersion && this.merchantVersion.uv_limit ? parseInt(this.merchantVersion.uv_limit) : 0
      if (uvLimit > UV_LIMIT_UNIT) {
        uvLimit = (uvLimit / UV_LIMIT_UNIT) + UV_LIMIT_UNIT_TEXT
      }
      return uvLimit
    },
    callLimit () {
      let callLimit = this.merchantVersion && this.merchantVersion.call_limit ? parseInt(this.merchantVersion.call_limit) : 0
      if (callLimit > CALL_LIMIT_UNIT) {
        callLimit = (callLimit / CALL_LIMIT_UNIT) + CALL_LIMIT_UNIT_TEXT
      }
      return callLimit
    },
    leftCallLimit() {
      if (this.merchantVersion && this.merchantVersion.call_limit) {
        let leftCallLimit = parseInt(this.merchantVersion.call_limit) - parseInt(this.appUsed)
        if (leftCallLimit > CALL_LIMIT_UNIT) {
          leftCallLimit = (leftCallLimit / CALL_LIMIT_UNIT) + CALL_LIMIT_UNIT_TEXT
        }
        return leftCallLimit
      } else {
        return 0
      }
    },

    submitDisabled () {
      if (this.processing) {
        return true
      }
      return this.rechargeFlowPackageNum <= 0
    }
  },
  methods: {
    toggleVisabled () {
      this.dialogVisible = !this.dialogVisible
    },
    getVersion () {
      let params = {
        merchant_id: this.merchant.id,
        is_get_used: 1
      }
      this.axios.get('merchant/get-version', {params: params}).then(resp => {
        this.merchantVersion = resp.data
        this.appUsed = resp.meta.app_used
      })
    },
    recharge () {
      this.processing = true
      this.axios.post('/merchant/recharge', {merchant_id: this.merchant.id, num: this.rechargeFlowPackageNum, package: this.package}).then(resp => {
        this.toggleVisabled()
      })
      .catch(error => {
        this.processing = false
        console.log(error)
      })
    },
    handleOpen () {
      this.getVersion()
    },
    handleClose () {
      this.processing = false
      this.rechargeFlowPackageNum = 0
    }
  }
}

</script>
