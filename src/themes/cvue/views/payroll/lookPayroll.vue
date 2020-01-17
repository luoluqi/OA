<template>
  <div class="payroll">
    <div class="payroll-top">
      <h2 class="fl">历史记录</h2>
    </div>
    <div class="payroll-body">
      <cvue-table
        :option="tableOption"
        :data="tableData"
        ref="tbl1"
        :isShowAdd="false"
        :page="page"
        :tablePage="tablePage"
        :pageSize="page.pageSize"
        :loading="tableLoading"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :isShowPage="false"
      >
        <!-- 操作按钮 -->
        <el-table-column
          fixed="right"
          slot="actionMenu"
          label="操作"
          align="center"
          header-align="center"
          width="160"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="lookHistory(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </cvue-table>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
export default {
  name: 'lookPayroll',
  components: {
    cvueTable,
    cvueDialog
  },
  computed: {
    ...mapGetters(['cookiesObj'])
  },
  data () {
    return {
      tableLoading: false,
      tablePage: 1,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 50, 100]
      },
      tableOption: {
        selected: false,
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          { prop: 'monthTime', label: '月份', align: 'center' },
          { prop: 'CreateTime', label: '数据更新时间', align: 'center' },
          { prop: 'RelevantNumber', label: '有效数据人员', align: 'center' }
          // { prop: 'Name', label: '工资表模板', align: 'center', slotStatus: true }
        ]
      },
      tableData: [],
      schoolId: '',
      groupId: ''
    }
  },
  mounted () {
    this.schoolId = this.cookiesObj.schoolId
    this.groupId = this.$route.query.id
    this.getTeachSalaryFiles()
  },
  methods: {
    // 改变pagesize
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleList()
    },
    // 改变页码
    handleCurrentChange (val) {
      this.tablePage = val
      this.handleList()
    },
    // 获取列表
    getTeachSalaryFiles () {
      console.log(this.groupId)
      let params = {
        groupId: this.groupId
      }
      this.$store.dispatch('payroll/GetTeachSalaryFiles', params).then(res => {
        let result = JSON.parse(res)
        console.log(result)
        if (result.Code === '200') {
          this.tableData = result.Data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 查看
    lookHistory (row) {
      location.href = row.excelUrl
      // window.open(row.excelUrl)
    }
  }
}
</script>
<style lang='scss' scoped>
.payroll {
  width: 100%;
  height: 100%;
  .payroll-top {
    background-color: #fff;
    height: 70px;
    line-height: 70px;
    h2 {
      padding-left: 20px;
    }
    .el-button {
      margin: 20px 20px 0 0;
    }
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .payroll-body {
    background-color: #fff;
    .cvue-table {
      margin: 0 40px 0 30px;
      padding-bottom: 15px;
    }
  }
  .el-pagination {
    padding-bottom: 15px;
  }
}
</style>
