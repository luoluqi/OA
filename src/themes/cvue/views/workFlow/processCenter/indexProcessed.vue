<template>
  <!-- 处理过的流程 -->
  <div class="device-bind">
    <el-row :gutter="20">
      <!-- <el-col :span="6">
        <div class="left">
          <div class="left-top">选择学校</div>
          <div class="left-tree">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              :render-content="renderContent"
              @node-click="handleNodeClick"
              :expand-on-click-node="false"
              accordion
              ref="tree"
              node-key="id"
              @node-expand="handleNodeExpand"
              :highlight-current="true"
              lazy
            ></el-tree>
          </div>
        </div>
      </el-col>-->
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
                  </template>
                </el-table-column>
              </cvue-table>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!-- 新增弹窗 -->
    <!-- <index-add
      @closeDialog="closeDialog('add')"
      @confirmDialog="confirmDialog('add')"
      @handleClose="closeDialog('add')"
      :dialogVisible="dialogVisibleAdd"
    ></index-add>-->
    <!-- 进度详情 -->
    <already-detail
      v-if="dialogVisibleDetail"
      @closeDialog="closeDialog('detail')"
      @confirmDialog="confirmDialog('detail')"
      @handleClose="closeDialog('detail')"
      :dialogVisible="dialogVisibleDetail"
    ></already-detail>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
// import indexAdd from './indexAdd1'
import alreadyDetail from './alreadyDetail'
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
// import {getClientHeight} from '@/util/tool'
export default {
  name: 'SchoolOrder',
  components: {
    cvueTable,
    cvueDialog,
    // indexAdd,
    alreadyDetail
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
      dialogVisibleAdd: false,
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
          { prop: 'FlowState', label: '流程状态', align: 'center', slotStatus: true },
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
      deptId: []
    }
  },
  computed: {
    ...mapGetters(['cookiesObj'])
  },
  mounted () {
    // this.handleList()
    this.deptListByTeacherId()
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
    // 格式化时间
    formatTime (time) {
      var date = new Date(time)
      var year = date.getFullYear()
      var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minute + ':' + seconds
    },
    // 根据老师获取部门
    deptListByTeacherId () {
      let params = {
        teacherId: this.cookiesObj.teacherId
        // teacherId: '0d225865afa745aa8cbdcadb3feee129'
      }
      this.$store
        .dispatch('organization/DeptListByTeacherId', params)
        .then(res => {
          let result = JSON.parse(res)
          console.log(result)
          if (result.Code == 200) {
            this.deptId = result.Data.map(v => {
              return v.Id
            })
            this.handleList()
          } else {
            // this.$message.error(result.Msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 改变pagesize
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleList()
    },
    // 改变页码
    handleCurrentChange (val) {
      // this.tablePage = val
      this.page.currentPage = val
      this.handleList()
    },
    // 搜索
    // handleSearch () {
    //   this.tablePage = 1
    //   this.handleList()
    // },
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
      this.$store.dispatch('processCenter/PageMyHasDeal', params).then(res => {
        let result = JSON.parse(res)
        console.log(result)
        if (result.Code == 200) {
          this.tableData = result.Data.data
          this.page.total = result.Data.total
          // this.page.currentPage = this.tablePage
        } else {
          // this.$message.error(result.Msg)
        }
        this.tableLoading = false
      }).catch(err => {
        console.log(err)
        this.tableLoading = false
      })
    },
    // 关闭弹窗
    closeDialog (params) {
      if (params == 'add') {
        this.dialogVisibleAdd = false
      }
      if (params == 'detail') {
        this.dialogVisibleDetail = false
      }
    },
    // 确认
    confirmDialog (params) {
      if (params == 'add') {
        this.dialogVisibleAdd = false
        this.tablePage = 1
        this.handleList()
      }
      if (params == 'detail') {
        this.dialogVisibleDetail = false
        this.tablePage = 1
        this.handleList()
      }
    },
    // 删除
    // handleDel (row) {
    //   // console.log(row)
    //   this.$confirm('确定要删除吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {

    //   }).catch(() => {
    //   })
    // },
    // 查看
    handleLook (row) {
      this.lookRow = row
      console.log(row)
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
