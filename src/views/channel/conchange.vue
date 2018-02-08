<template>
  <div style="padding: 15px" class="order-list">
    <h3 class="vheader">纳税人类别变更</h3>
    <div class="vsearch">
      <el-form ref="params" :inline="true" :model="params">
        <el-form-item label="公司名称/法人">
          <el-input v-model="params.cusname" placeholder="可搜索公司名称或法人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border header-align="left" style="width: 100%">
      <el-table-column prop="Name" label="公司名称"></el-table-column>
      <el-table-column prop="ContractAmount" label="合同金额"></el-table-column>
      <el-table-column prop="LegalPerson" label="法人"></el-table-column>
      <el-table-column prop="PriceName" label="套餐类型"></el-table-column>
      <el-table-column prop="CreateDate" label="订单日期"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="changeCategory(scope.row)" type="text" size="small" :disabled="scope.row.IsChanging == 1">变更</el-button>
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
  signacontractMy,
  orderTitle
} from '@/api/api'
import Dialog from '@/service/dialog.js'
import ConChangeDialog from '@/components/conChangeDialog'
export default {
  data() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      params: {
        cusname: '',
        limit: '',
        offset: ''
      },
      tableData: []
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.params.limit = this.pagination.pageSize
      this.params.offset = (this.pagination.currentPage - 1) * this.params.limit
      signacontractMy(this.params).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    changeCategory(row) {
      var postData = ''
      orderTitle(row.OrderId).then(res => {
        postData = res.data
        Dialog(ConChangeDialog, {
          postData: $.extend(true, {}, postData),
          channelid: row.ChannelId,
          modify: true
        }).then(() => {
          this.onSearch()
        })
      })
      // let obj = {
      //   orderId: row.OrderId,
      //   changeCompanyType: 1,
      //   modify: 0
      // }
      // this.$router.push({name: 'main.editOrder', params: obj})
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.onSearch()
    }
  }
}
</script>

<style lang='stylus' scoped>
</style>
