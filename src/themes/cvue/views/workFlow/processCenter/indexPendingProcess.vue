<template>
  <div class="device-bind">
    <!-- 表单 待处理流程 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="right">
          <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix fix-lh">
              <div class="btn-list"></div>
            </div>
            <div class="home-body">
              <cvue-table
                :option="tableOption"
                :data="tableData"
                ref="tbl1"
                :isShowAdd="false"
                :page="page"
                :tablePage="tablePage"
                :pageSize="page.pageSize"
                :loading="tableLoading"
                :layout="layout"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :isShowPage="true"
              >
                <template slot-scope="scope" slot="FlowState">
                  <el-tag v-if="scope.row.FlowState == 1">处理中</el-tag>
                  <el-tag v-else-if="scope.row.FlowState == 10" type="success">审批通过</el-tag>
                  <el-tag v-else-if="scope.row.FlowState == 20" type="danger">不通过</el-tag>
                  <el-tag v-else-if="scope.row.FlowState == 3" type="info">已取消</el-tag>
                  <el-tag v-else type="warning">驳回</el-tag>
                </template>
                <template slot-scope="scope" slot="CreateDateTime">
                  <span>{{ scope.row.CreateDateTime | getTime }}</span>
                </template>
                <!-- 操作按钮 -->
                <el-table-column
                  fixed="right"
                  slot="actionMenu"
                  label="操作"
                  align="center"
                  header-align="center"
                  width="180"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="handleLook(scope.row)"
                      v-hasPermission="permission.edit"
                    >查看</el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="handleProcess(scope.row)"
                      v-hasPermission="permission.edit"
                    >处理流程</el-button>
                  </template>
                </el-table-column>
              </cvue-table>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!-- 处理流程弹窗 -->
    <pending-deal
      v-if="dialogVisibleDeal"
      @closeDialog="closeDialog('deal')"
      @confirmDialog="confirmDialog('deal')"
      @handleClose="closeDialog('deal')"
      :dialogVisible="dialogVisibleDeal"
    ></pending-deal>
    <!-- 进度详情 -->
    <pending-detail
      v-if="dialogVisibleDetail"
      @closeDialog="closeDialog('detail')"
      @confirmDialog="confirmDialog('detail')"
      @handleClose="closeDialog('detail')"
      :dialogVisible="dialogVisibleDetail"
    ></pending-detail>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import pendingDeal from './pendingDeal'
import pendingDetail from './pendingDetail'
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
// import {getClientHeight} from '@/util/tool'
export default {
  name: 'SchoolOrder',
  components: {
    cvueTable,
    cvueDialog,
    pendingDeal,
    pendingDetail
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'areaName',
        isLeaf: 'leaf'
      },
      layout: 'total, prev, pager, next, jumper',
      tableLoading: false,
      dialogVisibleDetail: false,
      dialogVisibleDeal: false,
      tablePage: 1,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 30, 40, 50]
      },
      tableOption: {
        // selected: true,
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          // { prop: 'index', label: '', align: 'center', width: 50 },
          {
            prop: 'FlowState',
            label: '流程状态',
            align: 'center',
            slotStatus: true
          },
          { prop: 'RecordTitle', label: '流程标题', align: 'center' },
          { prop: 'RecordCode', label: '流程编号', align: 'center' },
          { prop: 'CurrentNodeName', label: '当前节点名称', align: 'center' },
          { prop: 'CreateDateTime', label: '更新时间', align: 'center', slotStatus: true },
          { prop: 'CreateUserName', label: '申请人', align: 'center' },
          { prop: 'RecordRemark', label: '流程备注', align: 'center' }
        ]
      },
      tableData: [],
      lookRow: '',
      dealRow: '',
      deptId: []
    }
  },
  computed: {
    ...mapGetters(['cookiesObj'])
  },
  mounted () {
    this.deptListByTeacherId()
    // this.handleList()
    console.log(this.cookiesObj)
  },
  filters: {
    getTime (date) {
      let arr = date.split('T')
      let d = arr[0]
      let t = arr[1]
      return d + ' ' + t
    }
  },
  methods: {
    // // 根据老师获取部门
    deptListByTeacherId () {
      let params = {
        teacherId: this.cookiesObj.teacherId
        // teacherId: '0d225865afa745aa8cbdcadb3feee129'
      }
      this.$store
        .dispatch('organization/DeptListByTeacherId', params)
        .then(res => {
          let result = JSON.parse(res)
          // console.log(result)
          if (result.Code == 200) {
            this.deptId = result.Data.map(v => {
              return v.Id
            })
            this.handleList()
          } else {
            this.$message.error(result.Msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 改变pagesize
    handleSizeChange (val) {
      this.page.pageSize = val
      this.tablePage = 1
      this.handleList()
    },
    // 改变页码
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.handleList()
    },
    // 列表接口
    handleList () {
      this.tableLoading = true
      var params = {
        pageSize: this.page.pageSize,
        pageIndex: this.page.currentPage,
        userId: this.cookiesObj.teacherId,
        deptId: this.deptId.join(),
        schoolId: this.cookiesObj.schoolId
      }
      // console.log(params)
      this.$store
        .dispatch('processCenter/PageMyPendingDeal', params)
        .then(res => {
          let result = JSON.parse(res)
          // console.log(result)
          if (result.Code == 200) {
            this.tableData = result.Data.data
            this.page.total = result.Data.total
            // this.page.currentPage = this.tablePage
          } else {
            this.tableData = []
            // this.$message.error(result.Msg)
          }
          this.tableLoading = false
        })
        .catch(err => {
          console.log(err)
          this.tableLoading = false
        })
    },
    // 关闭弹窗
    closeDialog (params) {
      if (params == 'deal') {
        this.dialogVisibleDeal = false
        this.tablePage = 1
        this.handleList()
      }
      if (params == 'detail') {
        this.dialogVisibleDetail = false
      }
    },
    // 确认
    confirmDialog (params) {
      if (params == 'deal') {
        this.dialogVisibleDeal = false
        this.tablePage = 1
        this.handleList()
      }
      if (params == 'detail') {
        this.dialogVisibleDetail = false
        this.tablePage = 1
        this.handleList()
      }
    },
    // 处理流程
    handleProcess (row) {
      this.dealRow = row
      this.dialogVisibleDeal = true
    },
    // 查看
    handleLook (row) {
      this.lookRow = row
      this.dialogVisibleDetail = true
    }
  }
}
</script>
<style lang="scss">
.device-bind {
  td {
    input {
      border: 1px solid #ccc;
    }
  }
  .left-tree {
    width: 100%;
    min-height: 600px;
    overflow: auto;
  }
  .left {
    min-height: 500px;
    background: #fff;
  }
  .left-top {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #333;
    background: #e2e2e2;
  }
  .right-main {
    margin-top: 15px;
    background: #fff;
    min-height: 150px;
    padding: 0 0 20px;
  }
  .el-date-editor {
    width: 100%;
  }
  .tabs-card .el-card {
    box-shadow: none;
    border: none;
  }
  .tabs-card .el-card__header {
    // padding: 0 15px 15px!important;
  }
  padding: 0px !important;
  height: auto !important;
  .home-body {
    margin-top: -15px;
  }
  .btn-list {
    float: right;
  }
  .el-card__header {
    border-bottom: none;
  }
  .fix-lh {
    line-height: 32px;
  }
  .text-right {
    text-align: right;
  }
  .el-card__header,
  .el-card__body {
    padding: 15px;
  }
  .el-input.is-disabled .el-input__inner {
    color: #606266;
  }
  .el-table__body {
    // tr td:nth-child(5) span{
    //     color: #409EFF;
    //     cursor: pointer;
    // }
  }
  .table-body {
    margin-top: 20px;
  }
  .total {
    margin-top: 20px;
  }
  .total p {
    margin-bottom: 10px;
  }
  .forbid {
    margin-right: 15px;
    color: #656565;
  }
  .normal {
    margin-left: 15px;
    color: #4b98ff;
  }
}
</style>
