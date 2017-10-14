<template>

  <div id="version-button">

    <el-button class="btn-ctrl-merchant" @click="toggleVisabled()">服务版本</el-button>

    <el-dialog title="设置商家服务版本"
               :visible.sync="dialogVisible"
               @open="handleOpen()"
               @close="handleClose()"
               size="tiny" top="20%" custom-class="add-merchant-dialog"
               :modal-append-to-body="false">
      <el-form label-width="100px">
        <el-form-item label="服务版本">
          <div class="text-left">
            <el-select v-model="selVersionName" placeholder="请选择服务版本" @change="selectVersion()">
              <el-option
                v-for="vOpt in versionOptions"
                :key="vOpt.service_entity_id"
                :label="vOpt.service_attr"
                :value="vOpt.service_attr">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="周期">
          <div class="text-left">
            <el-radio v-model="version.service_time" :label="time" :disabled="disableTimeRadio"
                      v-for="time in timeOptions" :key="time">{{ time }}</el-radio>

            <el-radio v-model="version.service_time" label="" :disabled="disableTimeRadio">自定义</el-radio>
            <el-date-picker
              v-model="version.expired_at"
              type="date"
              format="yyyy-MM-dd"
              placeholder="选择过期日期"
              :picker-options="pickerOption"
              @change="selExpiredDate()"
              v-if="showDatePicker">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="toggleVisabled()">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>

export default {
  name: 'version-button',
  props: {
    merchant: {
      required: true,
      default: null
    }
  },
  watch: {
    'version.service_time': 'selCustomTime',
  },
  data () {
    return {
      dialogVisible: false,
      processing: false,
      versionOptions: [
        {service_id: '1', service_entity_id: '1', service_attr: '团队版'},
        {service_id: '2', service_entity_id: '2', service_attr: '企业版'},
        {service_id: '3', service_entity_id: '3', service_attr: '集团版'}
      ],
      timeOptions: [
        '一年',
      ],
      pickerOption: {
        disabledDate(time) {
          let today = moment().format('YYYY-MM-DD')
          return time.getTime() <= moment(today).format('x')
        }
      },
      selVersionName: null,
      version: this.merchant.version ? this.merchant.version : this.newVersion()
    }
  },
  computed: {
    submitDisabled () {
      if (this.processing) {
        return true
      }

      if (this.version.service_id == null || this.version.service_entity_id == null
        || this.version.service_attr == ''
        || this.version.service_time == null
        || (this.version.custom_expired==1 && this.version.expired_at=='')) {
        return true
      }

      return false
    },
    disableTimeRadio () {
      return this.selVersionName == null ? true : false
    },
    showDatePicker () {
      return this.version.custom_expired ? true : false
    }
  },
  methods: {
    toggleVisabled () {
      if (this.dialogVisible == false) {
        this.initVersion()
      }
      this.dialogVisible = !this.dialogVisible
    },
    initVersion () {
      if (this.merchant.version) {
        this.selVersionName = this.merchant.version.service_attr
      }
    },
    newVersion () {
      return {
        service_id: null,
        service_entity_id: null,
        service_attr: '',
        service_time: null,
        custom_expired: 0,
        expired_at: ''
      }
    },
    selectVersion () {
      if (this.selVersionName == null) {
        return
      }

      let {service_id: serviceId, service_entity_id: serviceEntityId, service_attr: serviceAttr} = _.find(this.versionOptions, {service_attr: this.selVersionName})
      this.version.service_id = serviceId
      this.version.service_entity_id = serviceEntityId
      this.version.service_attr = serviceAttr
    },
    selCustomTime () {
      if (this.version.service_time == '') {
        this.version.custom_expired = 1
      } else {
        this.version.custom_expired = 0
        switch (this.version.service_time) {
          case '一年':
            this.version.expired_at = moment().add(1, 'years').format('YYYY-MM-DD')
            break;
        }
      }
    },
    selExpiredDate () {
      this.version.expired_at = moment(this.version.expired_at).format('YYYY-MM-DD')
    },
    submit () {
      this.processing = true

      this.version.merchant_id = this.merchant.id
      this.axios.post('merchant/edit-version', this.version).then(resp => {
        this.merchant.version = this.version
        this.merchant.version.status = '未过期'
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
      this.selVersionName = null
      this.merchant.version ? this.merchant.version : this.newVersion()
    }
  }
}

</script>
