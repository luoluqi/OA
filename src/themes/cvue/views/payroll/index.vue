<template>
  <div class="payroll">
    <div class="payroll-top">
      <h2 class="fl">工资条</h2>
      <el-button type="primary" class="fr" @click="handleAdd">新增工资组</el-button>
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
        <template slot-scope="scope" slot="Name">
          <el-button
            plain
            type="primary"
            size="small"
            @click.prevent="handleTemplet(scope.row)"
          >{{ scope.row.Name}}模板</el-button>
          <!-- <a href="javascript:;" download="fileName">{{ scope.row.Name}}模板</a> -->
        </template>
        <!-- 操作按钮 -->
        <el-table-column
          fixed="right"
          slot="actionMenu"
          label="历史记录"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleLook(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <!-- 操作按钮 -->
        <el-table-column
          fixed="right"
          slot="actionMenu"
          label="操作"
          align="center"
          header-align="center"
          width="400"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="primary" size="small" @click="handleRelevance(scope.row)">关联</el-button>
            <el-button type="primary" size="small" @click="handleDel(scope.row)">删除</el-button>
            <el-button type="success" size="small" @click="handleImport(scope.row)">导入工资</el-button>
          </template>
        </el-table-column>
      </cvue-table>
    </div>
    <add-payroll
      @closeDialog="closeDialog('add')"
      @confirmDialog="confirmDialog('add')"
      @handleClose="closeDialog('add')"
      :dialogVisible="dialogVisibleAdd"
    ></add-payroll>
    <edit-payroll
      @closeDialog="closeDialog('edit')"
      @confirmDialog="confirmDialog('edit')"
      @handleClose="closeDialog('edit')"
      :dialogVisible="dialogVisibleEdit"
    ></edit-payroll>
    <rela-payroll
      @closeDialog="closeDialog('rela')"
      @confirmDialog="confirmDialog('rela')"
      @handleClose="closeDialog('rela')"
      :dialogVisible="dialogVisibleRela"
    ></rela-payroll>
    <import-payroll
      @closeDialog="closeDialog('import')"
      @confirmDialog="confirmDialog('import')"
      @handleClose="closeDialog('import')"
      :dialogVisible="dialogVisibleImport"
    ></import-payroll>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import addPayroll from './addPayroll'
import editPayroll from './editPayroll'
import relaPayroll from './relaPayroll'
import importPayroll from './importPayroll'
export default {
  name: 'Payroll',
  components: {
    cvueTable,
    cvueDialog,
    addPayroll,
    editPayroll,
    relaPayroll,
    importPayroll
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
          { prop: 'Name', label: '工资组', align: 'center' },
          { prop: 'UpdateTime', label: '更新时间', align: 'center' },
          { prop: 'RelevantNumber', label: '关联人员', align: 'center' },
          { prop: 'Name', label: '工资表模板', align: 'center', slotStatus: true }
        ]
      },
      tableData: [],
      dialogVisibleAdd: false,
      dialogVisibleEdit: false,
      dialogVisibleRela: false,
      dialogVisibleImport: false,
      schoolId: '',
      editRow: '',
      importId: '',
      relevanceId: '',
      relevanceRow: '',
      fileName: ''
    }
  },
  mounted () {
    this.schoolId = this.cookiesObj.schoolId
    this.GetTeachSalaryGroupList()
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
    // 关闭弹窗
    closeDialog (params) {
      if (params == 'add') {
        this.dialogVisibleAdd = false
      }
      if (params == 'edit') {
        this.dialogVisibleEdit = false
      }
      if (params == 'rela') {
        this.dialogVisibleRela = false
      }
      if (params == 'import') {
        this.dialogVisibleImport = false
      }
    },
    // 确认
    confirmDialog (params) {
      if (params == 'add') {
        this.dialogVisibleAdd = false
        this.tablePage = 1
        this.GetTeachSalaryGroupList()
      }
      if (params == 'edit') {
        this.dialogVisibleEdit = false
        this.tablePage = 1
        this.GetTeachSalaryGroupList()
      }
      if (params == 'rela') {
        this.dialogVisibleRela = false
        this.tablePage = 1
        this.GetTeachSalaryGroupList()
      }
      if (params == 'import') {
        this.dialogVisibleImport = false
        this.tablePage = 1
        this.GetTeachSalaryGroupList()
      }
    },
    // 获取列表
    GetTeachSalaryGroupList () {
      this.tableLoading = true
      let params = {
        schoolId: this.cookiesObj.schoolId
      }
      this.$store.dispatch('payroll/GetTeachSalaryGroupList', params).then(res => {
        let result = JSON.parse(res)
        console.log(result)
        if (result.Code == '200') {
          this.tableData = result.Data
        }
        this.tableLoading = false
      }).catch(err => {
        console.log(err)
        this.tableLoading = false
      })
    },
    // 添加
    handleAdd () {
      this.dialogVisibleAdd = true
    },
    handleTemplet (row) {
      // console.log(row)
      location.href = 'http://srv.xueerqin.net/api-oa-salary/UploadFile/%E6%A8%A1%E6%9D%BF' + row.Id + '.xls'
    },
    // 查看
    handleLook (row) {
      this.$router.push({ path: '/index/lookPayroll', query: { id: row.Id } })
    },
    // 编辑
    handleEdit (row) {
      this.editRow = row
      this.dialogVisibleEdit = true
    },
    // 关联
    handleRelevance (row) {
      // console.log(row)
      this.relevanceRow = row
      this.relevanceId = row.Id
      this.dialogVisibleRela = true
    },
    // 删除
    handleDel (row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.Id
        }
        let paramsNew = { data: JSON.stringify(params) }
        this.$store.dispatch('payroll/DeleteTeachSalaryGroup', paramsNew).then(res => {
          let result = JSON.parse(res)
          if (result.Code == '200') {
            this.$message.success('删除成功')
            this.GetTeachSalaryGroupList()
          }
        }).catch(err => console.log(err))
      }).catch(err => {
        console.log(err)
      })
    },
    // 导入工资
    handleImport (row) {
      console.log(row)
      this.importId = row.Id
      this.dialogVisibleImport = true
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
      margin: 0 20px;
      padding-bottom: 15px;
    }
  }
  .el-pagination {
    padding-bottom: 15px;
  }
}
</style>
