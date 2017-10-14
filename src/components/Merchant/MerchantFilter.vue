<template>

    <el-form class="demo-form-inline" id="merchantFilter" :model="filter" :inline="true" @keydown.native="pressEnterKey($event)">

      <el-row class="mb10" :gutter="30">
        <el-col :span="6">
          <el-input v-model="filter.account" placeholder="商家账号" size="small">
            <template slot="prepend"><i class="fa fa-user fa-lg"></i></template>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-input v-model="filter.mobile" placeholder="手机号" size="small">
            <template slot="prepend"><i class="fa fa-mobile-phone fa-2x"></i></template>
          </el-input>
        </el-col>

        <el-col :span="6">
          <el-input v-model="filter.company" placeholder="公司名" size="small">
            <template slot="prepend"><i class="fa fa-building-o fa-lg"></i></template>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-input v-model="filter.app_name" placeholder="APP名称" size="small">
            <template slot="prepend"><i class="fa fa-cube fa-lg"></i></template>
          </el-input>
        </el-col>
      </el-row>

      <el-row class="mb10" :gutter="10">
        <el-col :span="6">
          <el-dropdown @command="selDaterangeType" size="small">
            <el-button type="primary">
              {{ displayDaterangeType }}<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(daterangeType, index) in daterangeTypes"
                :key="daterangeType.ley"
                :command="index">{{ daterangeType.val }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-date-picker
            type="daterange"
            placeholder="时间范围"
            align="right"
            format="yyyy-MM-dd"
            range-separator=" 至 "
            v-model="daterange"
            :picker-options="pickerOptions"
            @change="selDaterange()">
          </el-date-picker>
        </el-col>

        <el-col :span="2">
          <el-select v-model="filter.is_activate" placeholder="激活状态" clearable>
            <el-option
              v-for="activate in options.activates"
              :key="activate.key"
              :label="activate.val"
              :value="activate.key">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="2">
          <el-select v-model="filter.service" placeholder="服务版本" clearable>
            <el-option
              v-for="version in options.versions"
              :key="version"
              :label="version"
              :value="version">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="2">
          <el-select v-model="filter.register_from" placeholder="注册来源" clearable>
            <el-option
              v-for="regSource in options.regSources"
              :key="regSource.key"
              :label="regSource.val"
              :value="regSource.key">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="2">
          <el-select v-model="filter.company_status" placeholder="企业信息" clearable>
            <el-option
              v-for="(status, index) in options.companyStatus"
              :key="index"
              :label="status"
              :value="index">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="2">
          <el-select v-model="filter.job" placeholder="申请部门" clearable>
            <el-option
              v-for="(job, index) in options.jobs"
              :key="index"
              :label="job"
              :value="job">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="2">
          <el-select v-model="filter.app_type" placeholder="应用类型" clearable>
            <el-option
              v-for="(appType, index) in options.appTypes"
              :key="index"
              :label="appType"
              :value="index">
            </el-option>
          </el-select>
        </el-col>

      </el-row>



      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>

        <el-button :disabled="total <= 0" type="success" @click="excel">导出Excel</el-button>
      </el-form-item>

    </el-form>

</template>

<script>

export default {
  name: 'merchantFilter',
  props: {
    filter: {
      required: true
    },

    total: {
      type: Number,
      default: 0
    }
  },

  watch: {
    'filter.is_activate': 'onSubmit',
    'filter.service': 'onSubmit',
    'filter.company_status': 'onSubmit',
    'filter.job': 'onSubmit',
    'filter.app_type': 'onSubmit',
    'filter.register_from': 'onSubmit'
  },

  data () {
    return {
      daterange: '',

      daterangeTypes: [
        {key: 'register', val: '注册时间'},
        {key: 'apply', val: '申请时间'}
      ],

      dateTypeIdx: 0,
//      is_activate: null,

      options: {
        activates: [
          {key: 0, val: '未激活'},
          {key: 1, val: '已激活'}
        ],

        versions: ['免费版', '团队版', '企业版', '集团版', '已过期'],

        companyStatus: ['未完善', '已完善'],

        regSources: [
          {key: 'pc', val: 'PC端'},
          {key: 'mobile', val: '手机端'}
        ],

        jobs: ['产品', '研发IT', '市场/公关', '运营', '销售', '客服'],

        appTypes: ['APP', '公众号', '全部']
      },

      pickerOptions: {
        shortcuts: [
        {
          text: '今天',
          onClick (picker) {
            let start = moment().startOf('day'),
              end = moment().endOf('day')
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '昨天',
          onClick (picker) {
            let start = moment().add(-1, 'day').startOf('day'),
              end = moment().add(-1, 'day').startOf('day')
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '本周',
          onClick (picker) {
            let start = moment().startOf('week'),
              end = moment().endOf('week')
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '本月',
          onClick (picker) {
            let start = moment().startOf('month'),
              end = moment().endOf('month')
            picker.$emit('pick', [start, end])
          }
        }]
      }

    }
  },

  created () {
    this.filter.date_type = this.daterangeTypes[0].key
  },

  methods: {
    onSubmit () {
      this.$emit('search')
    },

    excel () {
      this.$emit('export')
    },

    selDaterangeType (idx) {
      this.dateTypeIdx = idx
      this.filter.date_type = this.daterangeTypes[idx].key

      if (this.filter.from_date && this.filter.to_date) {
        this.$emit('search')
      }
    },

    selDaterange () {
      let [frome_date, to_date] = this.daterange
      if (frome_date && to_date) {
        this.filter.from_date = moment(frome_date).format('YYYY-MM-DD 00:00')
        /// 后端时间判断范围是: frome_date <= date < to_date , 所以结束日期 +1天
        this.filter.to_date = moment(to_date).add(1, 'day').format('YYYY-MM-DD 00:00')
        this.filter.day = 'custom'
      } else {
        this.filter.day = ''
        this.filter.from_date = ''
        this.filter.to_date = ''
      }

      this.$emit('search')
    },

    pressEnterKey (e) {
      if (e.keyCode == 13) {
        this.$emit('search')
      }
      return
    }
  },

  computed: {
    displayDaterangeType () {
      return this.daterangeTypes[this.dateTypeIdx].val
    }
  }
}

</script>
