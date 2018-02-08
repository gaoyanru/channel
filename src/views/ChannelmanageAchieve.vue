<template>
  <div style="padding: 15px">
    <h3 class="vheader">渠道经理业绩</h3>
    <div class="vsearch">
      <el-form ref="params" :model="params" :inline="true">
        <el-form-item label="">
          <el-date-picker v-model="params.startdate" type="date" :clearable="clearable" placeholder="开始日期">
          </el-date-picker>
          <span>-</span>
          <el-date-picker v-model="params.enddate" type="date" :clearable="clearable" placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-button type="primary" @click="onDownload()" :disabled="!tableData.length">导出</el-button>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" :max-height="tableHeight">
      <el-table-column prop="RoleName" label="角色"></el-table-column>
      <el-table-column prop="RealName" label="姓名"></el-table-column>
      <el-table-column prop="Partition" label="区域" min-width="160"></el-table-column>
      <el-table-column prop="CustomerNum" label="新增客户数"></el-table-column>
      <el-table-column prop="ordernum" label="订单数"></el-table-column>
      <el-table-column prop="ContractAmount" label="实收"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getchannelmanagereports
} from '@/api/api'
export default {
  data() {
    return {
      params: {
        startdate: '',
        enddate: ''
      },
      clearable: false,
      tableData: [],
      start: '',
      end: '',
      tableHeight: 300
    }
  },
  mounted() {
    this.tableHeight = document.querySelector('.content-right').offsetHeight - 163
  },
  created() {
    this.start = this.getNowMonthStartDate()
    this.end = this.getNowMonthLastDate()
    this.onSearch()
  },
  methods: {
    getNowMonthStartDate() {
      var date = new Date()
      date.setDate(1)
      return date
    },
    getNowMonthLastDate() {
      var date = new Date()
      date.setMonth(date.getMonth() + 1)
      date.setDate(0)
      return date
    },
    onSearch() {
      console.log(this.params.startdate, 'this.params.startdate')
      if (!this.params.startdate) {
        this.params.startdate = this.start
      }
      if (!this.params.enddate) {
        this.params.enddate = this.end
      }
      getchannelmanagereports(this.params).then(res => {
        if (res.status) {
          this.tableData = res.data
        }
      })
    },
    onDownload() {
      const {
        startdate,
        enddate
      } = this.params
      const url = `/api//report/exportchannelmanagereports?startdate=${startdate}&enddate=${enddate}`
      window.open(url)
    }
  }
}
</script>

<style>
</style>
