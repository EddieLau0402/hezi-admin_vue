<template>

  <div id="merchants">

    <merchant-filter :filter="merchantFilter" @search="search" @export="downloadExcel" :total="merchantTotal"></merchant-filter>

    <el-table :data="merchants" height="800">
      <el-table-column label="商家信息" width="240">
        <template scope="merchant">
          <el-popover trigger="click" placement="right">
            <div>注册时间: {{ merchant.row.created_at }}</div>
            <div>注册来源: <el-tag type="gray" class="mr4">{{ merchant.row.register_from }}</el-tag>{{ merchant.row.reference }}</div>
            <div slot="reference" class="name-wrapper cursor-pointer">
              <div>账号: {{ merchant.row.email }}</div>
              <div>电话: {{ merchant.row.mobile }}</div>
              <div class="point">麦穗: {{ merchant.row.point }}</div>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应用信息" width="180">
        <template scope="merchant">
          <el-popover trigger="hover" placement="top" v-if="merchant.row.app">
            <p>类型: {{ merchant.row.app.type }}</p>
            <p>申请时间: {{ merchant.row.app.created_at }}</p>
            <p>公司: {{ merchant.row.app.company }}</p>
            <p>部门: {{ merchant.row.app.job }}</p>
            <p>申请人: {{ merchant.row.app.name }}</p>
            <div slot="reference" class="name-wrapper text-center">
              <el-tag class="cursor-default"><i class="fa fa-cube mr4"></i>{{ merchant.row.app.app_name }}</el-tag>
            </div>
          </el-popover>
          <el-tooltip content="未接入应用" placement="top" effect="dark" v-else>
            <div><i class="fa fa-minus"></i></div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column align="center" label="版本信息" width="100">
        <template scope="merchant">
          <el-tag type="gray" v-if="!merchant.row.version">试用版</el-tag>
          <el-tag v-if="merchant.row.version && merchant.row.version.status=='已过期'">{{ merchant.row.version.status }}</el-tag>

          <el-popover trigger="hover" placement="top" v-if="merchant.row.version && merchant.row.version.status!='已过期'">
            <div>有效期至: {{ merchant.row.version.expired_at }}</div>
            <div slot="reference" class="name-wrapper text-center">
              <el-tag type="warning" v-if="merchant.row.version.service_entity_id==1">{{ merchant.row.version.service_attr }}</el-tag>
              <el-tag type="primary" v-else-if="merchant.row.version.service_entity_id==2">{{ merchant.row.version.service_attr }}</el-tag>
              <el-tag type="danger" v-else-if="merchant.row.version.service_entity_id==3">{{ merchant.row.version.service_attr }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="act_count" label="活动数" width="100"></el-table-column>
      <el-table-column align="center" prop="prize_count" label="奖品" width="100"></el-table-column>

      <el-table-column align="center" label="访问/参与" width="160">
        <template scope="merchant">
          {{ merchant.row.visit_user }} / {{ merchant.row.attend_user }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录数(日/周/月)">
        <template scope="merchant">
          <div class="login-times">
            <span>{{ merchant.row.login_day_count }}</span>
            <span>{{ merchant.row.login_week_count }}</span>
            <span>{{ merchant.row.login_month_count }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="100">
        <template scope="merchant">
          <!--{{ merchant.row.blocked }} - {{ merchant.row.blocked ? '已冻结' : '正常' }}-->
          <el-switch
            v-if="merchant.row.email_checked"
            v-model="merchant.row.blocked" @change="freezeAccount(merchant.row)"
            on-text="解冻" on-color="#bfcbd9"
            off-text="冻结" off-color="#20a0ff">
          </el-switch>
          <el-button type="success" icon="share" size="small" @click="activateAccount(merchant.row)" v-else>激活</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template scope="merchant">
          <div class="pt4 pb4">
            <div class="mt2 mb2">
              <el-button size="small" @click="loginMerchant(merchant.row)">越权</el-button>
            </div>
            <div class="mt2 mb2">
              <!--<el-button size="small" :disabled="true" @click="editVersion(merchant.row)">版本修改</el-button>-->
              <version-button :merchant="merchant.row"></version-button>
            </div>
            <div class="mt2 mb2">
              <point-button :merchant="merchant.row"></point-button>
            </div>
            <div class="mt2 mb2">
              <flow-button :merchant="merchant.row"></flow-button>
            </div>
          </div>
        </template>
      </el-table-column>

    </el-table>


    <el-pagination class="mt10" v-if="pagination"
                   layout="total, prev, pager, next, jumper"
                   :current-page.sync="pagination.current_page"
                   :page-size="pagination.per_page"
                   :page-count="pagination.total"
                   :total="pagination.total"
                   @current-change="handleCurrentChange">
    </el-pagination>

  </div>

</template>


<script>

import URI from 'urijs'
import store from './../../configs/store'
import filter from './MerchantFilter'
import flowButton from './Buttons/FlowButton'
import pointButton from './Buttons/PointButton'
import versionButton from './Buttons/VersionButton'

export default {
  name: 'merchants',
  data () {
    return {
      loading: true,
      merchants: [],
      pagination: null,
      merchantFilter: {
        is_activate: '',
        service: '',
        company_status: '',
        job: '',
        app_type: '',
        register_from: ''
      }
    }
  },

  mounted () {
    this.getMerchants()
  },

  computed: {
    merchantTotal () {
      return this.pagination && this.pagination.total ? this.pagination.total : 0
    }
  },

  methods: {
    /**
     * 获取数据
     *
     * @author Eddie
     *
     * @param params
     */
    getMerchants () {
      this.merchants = [] // clear data

      this.axios.get('/merchant/query', {params: this.merchantFilter}).then(resp => {
        this.loading = false
        console.log('>>>>> get merchants success, response: ', resp)
        this.merchants = _.map(resp.data, function (row) {
          row.blocked = row.blocked==1 ? true : false
          row.email_checked = row.email_checked==1 ? true : false
          return row
        })
        this.pagination = resp.meta.pagination
      })
      .catch(err => {
        this.loading = false
        console.log('>>>>> get merchants fail, error: ', err)
      })
    },

    /**
     * 冻结/解冻 账号
     *
     * @author Eddie
     *
     * @param merchant
     */
    freezeAccount (merchant) {
      console.log('>>>> freeze-account: ', merchant)
      this.axios.post('/merchant/freeze', {merchant_id: merchant.id}).then(resp => {
        console.log('>>>>> 冻结账号 success, response: ', resp)
      })
      .catch(err => {
        console.log('>>>>> 冻结账号 fail, error: ', err)
      })
      return
    },

    /**
     * 激活账号
     *
     * @author Eddie
     *
     * @param merchant
     */
    activateAccount (merchant) {
      this.axios.post('/merchant/activate/'+merchant.id).then(resp => {
        merchant.email_checked = !merchant.email_checked
      })
      .catch(err => {
        console.log('>>>>> 激活账号 fail, error: ', err)
      })
    },

    /**
     * 越权登录
     *
     * @author Eddie
     *
     * @param merchant
     */
    loginMerchant (merchant) {
      this.axios.post('/merchant/admin-token', {merchant_id: merchant.id}).then(resp => {
        console.log('>>>>> 越权登录, 获取登录令牌 success, response: ', resp)

        let apiConfig = process.env.API
        let mcshopApiDomain = apiConfig.schema + apiConfig.mcshop +'.'+ apiConfig.base,
          houtaiDomain = apiConfig.schema + apiConfig.houtai +'.'+ apiConfig.base

        this.axios.post(mcshopApiDomain+'/merchant/login-by-token', {
          user_id: merchant.id,
          admin_token: resp.token
        }).then(resp => {
          console.log('>>>>> 越权登录 success, response: ', resp)

          let _cookiesOpts = {
            domain: apiConfig.base
          }, expiredMins = 5

          this.$cookies.put('permkey', resp.meta.perm_key, expiredMins, _cookiesOpts)
          this.$cookies.put('is_unauth', 1, expiredMins, _cookiesOpts)
          this.$cookies.put('role', resp.meta.role, expiredMins, _cookiesOpts)
          this.$cookies.put('_cookiesDomain', _cookiesOpts.domain, expiredMins, _cookiesOpts)

          window.open(houtaiDomain+'/unauth-login?token='+resp.meta.token);

        })
        .catch(err => {
          console.log('>>>>> 越权登录 fail, error: ', err)
        })
      })
      .catch(err => {
        console.log('>>>>> 越权登录, 获取登录令牌 fail, error: ', err)
      })
      return
    },

    handleSizeChange (val) {
      console.log('>>>>> handle-size-change...', val)
    },

    handleCurrentChange (val) {
      console.log('>>>>> handle-current-change...', val)
      this.merchantFilter.page = val
      this.getMerchants()
    },

    search () {
      if (this.merchantFilter.page && this.merchantFilter.page > 1) {
        this.merchantFilter.page = 1
      }

      this.getMerchants()
    },

    downloadExcel () {
      let params = {}
      _.forEach(this.merchantFilter, function (val, key) {
        if (key != 'page') {
          params[key] = val
        }
      })
      params.token = store.state.token

      let downloadPage = window.open('about:blank')
      downloadPage.location.href = URI(this.axios.defaults.baseURL).path('/merchant/export').query(params)
    }

  },

  components: {
    merchantFilter: filter,
    flowButton: flowButton,
    pointButton: pointButton,
    versionButton: versionButton,
  }
}

</script>
