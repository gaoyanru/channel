<template>
  <div style="padding: 15px 0 15px 15px" class="order-list">
    <h3 class="vheader">我的订单</h3>
    <div class="vsearch">
      <el-form ref="params" :inline="true" :model="params">
        <div class="">
          <el-form-item label="公司名称/法人">
            <el-input v-model="params.cusname" placeholder="可搜索公司名称或法人"></el-input>
          </el-form-item>
          <el-form-item label="订单类型">
            <el-select class="inputWid" v-model="params.category">
              <el-option v-for="item in categorys" :key="item.category" :label="item.categoryName" :value="item.category">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="select-width" label="状态">
            <el-select v-model="params.status">
              <el-option v-for="item in Status" :key="item.status" :label="item.statusName" :value="item.status">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="params.start" type="date" :clearable="clearable" placeholder="开始日期">
            </el-date-picker>
            <span>-</span>
            <el-date-picker v-model="params.end" type="date" :clearable="clearable" placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-checkbox class="red" v-model="IsExpireRenew" @change="getXFList">仅显示需要续费的订单</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox class="red" v-model="IsSync" @change="getJSList">显示未经工商检索的订单</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border header-align="left" style="width: 100%">
      <el-table-column prop="Name" label="公司名称" min-width="150"></el-table-column>
      <el-table-column prop="ContractNO" label="合同号" min-width="120"></el-table-column>
      <el-table-column prop="ContractAmount" label="合同金额" width="120"></el-table-column>
      <el-table-column prop="Status" label="状态" width="100" :formatter="StatusFormat"></el-table-column>
      <el-table-column prop="CreateDate" label="订单日期" :formatter="StatusDate" width="120"></el-table-column>
      <el-table-column prop="LegalPerson" label="法人"></el-table-column>
      <el-table-column label="礼包" width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.GiftTypeId">{{scope.row.GiftTypeName + '(￥' + scope.row.GiftPrice + ')'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="PromotionName" label="活动" width="130"></el-table-column>
      <el-table-column label="到期时间" :formatter="StatusDate" width="120">
        <template slot-scope="scope">
          <span :class="{red : scope.row.IsExpireRenew}">{{scope.row.ServiceEnd.substr(0, 10)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <span v-if="(scope.row.Status == 1 || scope.row.Status == 3) && scope.row.Category < 3">
            <el-button v-if="!scope.row.FreChangeOrderId" @click="modify(scope.row)" type="text" size="small">修改</el-button>
            <el-button v-if="scope.row.FreChangeOrderId" @click="modifyChange(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="deleteItem(scope.row.OrderId)" type="text" size="small">删除</el-button>
          </span>
          <span v-if="scope.row.Status == 2 && scope.row.Category != 2">
            <el-button v-if="!scope.row.FreChangeOrderId" @click="view(scope.row)" type="text" size="small">查看</el-button>
            <el-button v-if="scope.row.FreChangeOrderId" @click="ViewChange(scope.row)" type="text" size="small">查看</el-button>
          </span>
          <span v-if="(scope.row.Status == 2 && scope.row.Category == 2) || (scope.row.Status !=2 && scope.row.Category == 3)">
            <el-button @click="modify(scope.row)" type="text" size="small">记账准备</el-button>
          </span>
          <span v-if="scope.row.Status == 2 && scope.row.IsExpireRenew == 1" style="margin-left: 10px">
            <el-button @click="XFmodify(scope.row)" type="text" size="small">续费</el-button>
          </span>
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
  ordersMy,
  deleteSearch,
  orderTitle
} from '@/api/api'
import Dialog from '@/service/dialog.js'
import ConChangeDialog from '@/components/conChangeDialog'
export default {
  data() {
    return {
      clearable: false,
      tableData: [],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      params: {
        cusname: '',
        category: 0,
        status: 0,
        start: '',
        end: '',
        limit: '',
        offset: '',
        IsExpireRenew: 0,
        IsSync: ''
      },
      IsExpireRenew: 0,
      IsSync: '',
      categorys: [
        {category: 0, categoryName: '全部'},
        {category: 1, categoryName: '正常'},
        {category: 2, categoryName: '预提单初审'},
        {category: 3, categoryName: '预提单复审'}
      ],
      Status: [
        {status: 0, statusName: '全部'},
        {status: 1, statusName: '未审核'},
        {status: 2, statusName: '通过'},
        {status: 3, statusName: '拒审'}
      ]
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.params.limit = this.pagination.pageSize
      this.params.offset = (this.pagination.currentPage - 1) * this.params.limit
      ordersMy(this.params).then((res) => {
        this.tableData = res.data
        this.pagination.total = res.Count
      })
    },
    getXFList() {
      console.log(this.params.IsExpireRenew)
      console.log(this.IsExpireRenew)
      if (this.IsExpireRenew) {
        this.params.IsExpireRenew = 1
        if (this.IsSync) {
          this.IsSync = false
          this.params.IsSync = ''
        }
      } else {
        this.params.IsExpireRenew = 0
      }
      this.onSearch()
    },
    getJSList() {
      console.log(this.IsSync, 'IsSync')
      if (this.IsSync) {
        this.params.IsSync = 0
        if (this.IsExpireRenew) {
          this.IsExpireRenew = false
          this.params.IsExpireRenew = 0
        }
      } else {
        this.params.IsSync = ''
      }
      this.onSearch()
    },
    StatusDate(row, column) {
      return row[column.property].substr(0, 10)
    },
    StatusFormat(row) {
      let status = row.Status
      switch (status) {
        case 1:
          status = '未审核'
          break
        case 2:
          status = '通过'
          break
        case 3:
          status = '拒审'
          break
      }
      return status
    },
    modify(row) {
      let obj = {
        orderId: row.OrderId,
        view: 0
      }
      this.$router.push({name: 'main.editOrder', params: obj})
    },
    view(row) {
      let obj = {
        orderId: row.OrderId,
        view: 1
      }
      this.$router.push({name: 'main.editOrder', params: obj})
    },
    modifyChange(row) {
      var postData = ''
      orderTitle(row.OrderId).then(res => {
        postData = res.data
        Dialog(ConChangeDialog, {
          postData: postData,
          channelid: row.ChannelId,
          modify: true,
          orderListmodify: true // 从我的订单进来修改
        }).then(() => {
          this.onSearch()
        })
      })
      // let obj = {
      //   orderId: row.OrderId,
      //   changeCompanyType: 1,
      //   modify: 1
      // }
      // this.$router.push({name: 'main.editOrder', params: obj})
    },
    ViewChange(row) {
      var postData = ''
      orderTitle(row.OrderId).then(res => {
        postData = res.data
        Dialog(ConChangeDialog, {
          postData: postData,
          channelid: row.ChannelId
        })
      })
    },
    XFmodify(row) {
      let obj = {
        Name: row.Name,
        ServiceEnd: row.ServiceEnd.substr(0, 10)
      }
      this.$router.push({name: 'main.xfOrder', params: obj})
    },
    deleteItem(id) {
      this.$confirm('确认删除订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSearch(id).then(res => {
          if (res.status) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.onSearch()
          }
        })
      }).catch(() => {})
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
.order-list
  .red
    color: red;
  .inputWid
    width: 130px;
</style>
