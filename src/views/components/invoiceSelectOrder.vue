<template>
  <el-dialog title="选择未开发票订单" :visible.sync="dialogTableVisible" size="large">
    <div class="vsearch">
      <el-form ref="params" :inline="true" :model="params">
        <el-form-item label="订单时间">
          <el-date-picker v-model="params.starttime" type="date" :clearable="clearable" placeholder="开始日期">
          </el-date-picker>
          <span>-</span>
          <el-date-picker v-model="params.endtime" type="date" :clearable="clearable" placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公司名称/法人">
          <el-input v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :height="aheight">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="公司名称" prop="Name" width="250"></el-table-column>
      <el-table-column label="法人" prop="LegalPerson"></el-table-column>
      <el-table-column label="合同号" prop="ContractNO"></el-table-column>
      <el-table-column label="提单金额" prop="ContractAmount"></el-table-column>
      <el-table-column label="可开金额" prop="BLAmount"></el-table-column>
      <el-table-column label="订单日期" prop="CreateDate" :formatter="StatusDate"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getneworders
} from '@/api/api'
import store from '@/store'
import _ from 'lodash'
import { mapState } from 'vuex'
export default {
  props: ['invoiceorderParams', 'OrderIds', 'InvoiceId'],
  data() {
    return {
      dialogTableVisible: true,
      params: {
        starttime: '',
        endtime: '',
        name: ''
      },
      aheight: '',
      clearable: false,
      tableData: []
    }
  },
  computed: {
    ...mapState({
      selectedRows (state) {
        return state.invoice.selectedRows
      }
    })
  },
  created() {
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.params.invoiceId = this.invoiceorderParams.invoiceId
      getneworders(this.params).then(res => {
        // console.log(res, 'res')
        if (res.status) {
          this.tableData = res.data
          if (res.data.length > 20) {
            this.aheight = '450'
          }
          // _.findIndex(this.tableData, row)
          let selectedRows = store.state.invoice.selectedRows.length > 0 ? store.state.invoice.selectedRows : _.filter(this.tableData, {
            InvoiceId: this.InvoiceId
          })
          this.$nextTick(() => {
            // console.log(selectedRows, 'search')
            if (selectedRows.length > 0) {
              selectedRows.forEach(row => {
                const index = _.findIndex(this.tableData, row)
                this.$refs.multipleTable.toggleRowSelection(this.tableData[index])
              })
            }
          })
          // console.log(store.state.invoice.selectedRows, 'create selectedRows')
        }
      })
    },
    handleSelectionChange(val) {
      // console.log(val, 'handleSelectionChange')
      store.dispatch('updateInvoiceSelectRows', val)
    },
    StatusDate(row) {
      var date = row.CreateDate
      return date.substring(0, 10)
    },
    submitForm() {
      const selectedRows = store.state.invoice.selectedRows
      if (selectedRows.length === 0) {
        this.$message.error('请选择未开发票订单！')
        return
      }
      let amount = window._.reduce(selectedRows, (r, t) => {
        r = r + t.BLAmount
        return r
      }, 0)
      if (amount > this.invoiceorderParams.balance) {
        this.$message.error('发票金额不允许超出' + this.invoiceorderParams.balance + '!')
        return
      }
      this.$emit('done', {
        amount: amount,
        orderIds: window._.map(selectedRows, (t) => {
          return "'" + t.OrderId + "'"
        }).join(',')
      })
      this.dialogTableVisible = false
    }
  }
}
</script>

<style lang='stylus' scoped>
</style>
