<template>
<div style="padding: 15px">
  <h3 class="vheader">财务明细</h3>
  <div class="vsearch">
    <el-form ref="params" :inline="true" :model="params">
      <el-form-item v-if="IsCenter == 1" label="选择代理">
        <el-select v-model="params.agents" filterable clearable placeholder="请选择">
          <el-option v-for="data in agents" :key="data.ChannelId" :label="data.ChannelName" :value="data.ChannelId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="IsCenter == 1" label="选择类型">
        <el-select v-model="params.type" clearable placeholder="请选择">
          <el-option v-for="data in typeModel" :key="data.type" :label="data.name" :value="data.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="IsCenter == 0" label="账单编号">
        <el-input v-model="params.billid"></el-input>
      </el-form-item>
      <el-form-item v-if="IsCenter == 0" label="选择代理">
        <el-select v-model="params.agents" filterable clearable placeholder="全部">
          <el-option v-for="data in agents" :key="data.ChannelId" :label="data.ChannelName" :value="data.ChannelId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="IsCenter == 0" label="资金流向">
        <el-select v-model="params.type" clearable placeholder="全部">
          <el-option v-for="data in typeModelChannel" :key="data.type" :label="data.name" :value="data.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="IsCenter == 0" label="">
        <el-date-picker v-model="params.starttime" type="date" placeholder="开始日期" :clearable="clearable">
        </el-date-picker>
        <span>-</span>
        <el-date-picker v-model="params.endtime" type="date" placeholder="结束日期" :clearable="clearable">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table v-if="IsCenter == 1" :data="tableData" border style="width: 100%">
    <el-table-column prop="ProvinceName" label="省" width="110">
    </el-table-column>
    <el-table-column prop="CityName" label="市" width="110">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理" min-width="150">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理" min-width="100">
    </el-table-column>
    <el-table-column v-if="params.type == 1" prop="Amount" label="支出" width="120">
    </el-table-column>
    <el-table-column v-if="params.type == 2" prop="Amount" label="充值金额" width="120">
    </el-table-column>
    <el-table-column prop="Balance" label="余额" width="120">
    </el-table-column>
    <el-table-column prop="Description" label="描述" width="250">
    </el-table-column>
    <el-table-column prop="BillTime" label="操作时间" width="200">
    </el-table-column>
    <el-table-column label="操作" width="120">
      <template slot-scope="scope">
          <el-button @click="financeView(scope.row)" type="text" size="small" v-if="scope.row.OrderId && scope.row.Category != 3 && scope.row.Category != 6">查看订单</el-button>
        </template>
    </el-table-column>
  </el-table>
  <el-table v-if="IsCenter == 0" :data="tableData" border style="width: 100%">
    <el-table-column prop="BillId" label="账单编号" width="160">
    </el-table-column>
    <el-table-column prop="BillTime" label="操作时间" width="120">
    </el-table-column>
    <el-table-column prop="ChannelName1" label="一级代理" min-width="150">
    </el-table-column>
    <el-table-column prop="ChannelName2" label="二级代理" min-width="100">
    </el-table-column>
    <el-table-column prop="Description" label="描述" width="250">
    </el-table-column>
    <el-table-column prop="Income" label="收入" width="100">
    </el-table-column>
    <el-table-column prop="Amount" label="支出" width="100">
    </el-table-column>
    <el-table-column prop="Balance" label="余额" width="120">
    </el-table-column>
    <el-table-column label="操作" width="120">
      <template slot-scope="scope">
        <el-button  v-if="scope.row.Category == 1 && scope.row.Status && scope.row.OrderCategory != 2" @click="financeView(scope.row)" type="text" size="small">查看订单</el-button>
        <el-button  v-if="scope.row.Category == 1 && scope.row.Status && scope.row.OrderCategory == 2" @click="financeView(scope.row)" type="text" size="small">查看订单</el-button>
        <!-- <el-button  v-if="scope.row.Category == 1 && !scope.row.Status" @click="msgAlert(scope.row)" type="text" size="small">已退单订单</el-button> -->
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
    style="text-align:center; margin:20px;">
  </el-pagination>
</div>
</template>

<script>
import {
  rechargeDetail,
  agents,
  orderTitle,
  financeDetailList
} from '../api/api'
import AddOrder from '../components/addOrder2'
import zcAddOrder from '../components/ZCaddOrder.vue'
import Dialog from '../service/dialog.js'
export default {
  data: function() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      agents: [],
      params: {
        channelname: '',
        agents: '',
        type: 0
      },
      typeModel: [{
        name: '支付',
        type: 1
      }, {
        name: '充值',
        type: 2
      }],
      typeModelChannel: [{
        name: '全部',
        type: 0
      }, {
        name: '充值明细',
        type: 2
      }, {
        name: '支付明细',
        type: 1
      }],
      IsCenter: '',
      clearable: false
    }
  },
  created() {
    // 需要处理接口是代理商请求不同的接口
    var userInfos = JSON.parse(sessionStorage.getItem('userInfo'))
    this.IsCenter = userInfos.IsCenter
    this.params.type = this.IsCenter ? 1 : 0
    this.fetchData()
    this.getAgents()
  },
  methods: {
    fetchData() {
      let limit = this.pagination.pageSize
      let offset = (this.pagination.currentPage - 1) * limit
      let channelId = this.params.agents
      let type = this.params.type
      let billid = this.params.billid
      let starttime = this.params.starttime
      let endtime = this.params.endtime
      if (this.IsCenter === 1) {
        rechargeDetail({
          limit: limit,
          offset: offset,
          channelId: channelId,
          type: type
        }).then((res) => {
          this.tableData = res.data
          this.pagination.total = res.Count
        })
      } else {
        financeDetailList({
          limit: limit,
          offset: offset,
          channelId: channelId,
          type: type,
          billid: billid,
          starttime: starttime,
          endtime: endtime
        }).then((res) => {
          this.tableData = res.data
          this.pagination.total = res.Count
        })
      }
    },
    getAgents() {
      agents().then((res) => {
        this.agents = res.data
      })
    },
    goView(row) {
      let obj = {
        orderId: row.OrderId,
        view: 3
      }
      if (row.OrderCategory === 2) {
        orderTitle(row.OrderId).then(res => {
          if (res.status) {
            if (res.data) {
              var postData = res.data
              Dialog(zcAddOrder, {
                postData: postData,
                channelid: row.Channelid
              })
            }
          }
        })
      } else {
        this.$router.push({name: 'main.editOrder', params: obj})
      }
    },
    financeView(row) {
      var postData = ''
      orderTitle(row.OrderId).then(res => {
        if (res.status) {
          if (res.data) {
            postData = res.data
            if (postData.Category === 2) {
              Dialog(zcAddOrder, {
                postData: postData,
                channelid: row.Channelid
              })
            } else {
              Dialog(AddOrder, {
                postData: postData,
                channelid: row.Channelid
              })
            }
          } else {
            this.$message({
              message: '该订单已退单',
              type: 'warning'
            })
            return
          }
        }
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchData()
    }
  }
}
</script>

<style scoped>
</style>
