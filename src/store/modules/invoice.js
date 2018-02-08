import { invoiceapply } from '@/api/api'
const state = {
  tableData: [],
  selectedRows: []
}

const actions = {
  fetchinvoicelist ({commit}, payload) {
    invoiceapply(payload.params).then(res => {
      if (res.status) {
        commit('updata invoice list data', res.data)
        payload.cb && payload.cb(res)
      }
    })
  },
  updateInvoiceSelectRows ({commit}, payload) {
    commit('update invoice select rows', payload)
  }
}

const mutations = {
  'updata invoice list data': (state, payload) => {
    state.tableData = payload
  },
  'update invoice select rows': (state, payload) => {
    state.selectedRows = payload
  }
}

export default {
  state,
  actions,
  mutations
}
