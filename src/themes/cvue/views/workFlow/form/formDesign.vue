<template>
  <div class="device-bind">
    <!-- 表单 -->
    <el-card class="box-card mt-15">
      <div class="home-form">
        <el-form ref="ruleForm" label-width="80px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-button type="primary" @click="handleAdd" class="el-icon-plus">添加</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="left">
          <div class="left-top">
            选择表单
            <div class="btn-list">
              <span @click="addFormType" v-hasPermission="permission.add">新增</span>
            </div>
          </div>
          <div class="left-tree" :style="{maxHeight:height}">
            <el-tree :data="treeData" 
                  v-loading="treeLoading"
                  :props="defaultProps" 
                  :render-content="renderContent"
                  accordion
                  ref="tree"
                  node-key="id"
                  :highlight-current="true"
                   @node-click="handleNodeClick">
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="right">
          <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix fix-lh">
              <!-- <span>用户列表</span> -->
              <div class="btn-list">
                  <!-- <el-button  v-hasPermission="permission.add">导出</el-button> -->
              </div>
            </div>
            <div class="home-body">
              <cvue-table :option="tableOption" :data="tableData" ref="tbl1"
                          :isShowAdd="false" :page="page"
                          :tablePage="tablePage" :pageSize="page.pageSize"
                          :loading="tableLoading"
                          :layout = "layout"
                          @current-change="handleCurrentChange"
                          @size-change="handleSizeChange"
                          :isShowPage="true">
                <template slot-scope="scope" slot="CreateTime">
                    <span class="forbid">{{scope.row.CreateTime.replace('T', ' ')}}</span>
                </template>         
                <template slot-scope="scope" slot="TableState">
                    <span class="forbid">{{scope.row.TableState ? '启用' : '禁用'}}</span>
                </template>
                <template slot-scope="scope" slot="TableRemarkPC">
                    <span class="forbid">{{scope.row.TableRemarkPC ?  decodeURI(scope.row.TableRemarkPC) : ''}}</span>
                </template>
                <template slot-scope="scope" slot="TableRemarkH5">
                    <span class="forbid">{{scope.row.TableRemarkH5 ?decodeURI(scope.row.TableRemarkH5) : ''}}</span>
                </template>
                <!-- 操作按钮 -->
                <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                    header-align="center"  width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.row)" v-hasPermission="permission.edit">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDelete(scope.row)" v-hasPermission="permission.edit">删除</el-button>
                    </template>
                </el-table-column>
              </cvue-table>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row> 
    <!-- 新增弹窗 -->
    <form-design-edit
      v-if="dialogVisibleEdit"
      @closeDialog="closeDialog('edit')"
      @confirmDialog="confirmDialog('edit')"
      @handleClose="closeDialog('edit')"
      :dialogVisible="dialogVisibleEdit">
    </form-design-edit>
    <!-- 新增弹窗 -->
    <form-add
      @closeDialog="closeDialog('formAdd')"
      @confirmDialog="confirmDialog('formAdd')"
      @handleClose="closeDialog('formAdd')"
      :dialogVisible="dialogVisibleFormAdd">
    </form-add>  
     <!-- 编辑弹窗 -->
    <form-edit
      @closeDialog="closeDialog('formEdit')"
      @confirmDialog="confirmDialog('formEdit')"
      @handleClose="closeDialog('formEdit')"
      :dialogVisible="dialogVisibleFormEdit">
    </form-edit>        
  </div>
</template>
<script>
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import formAdd from './formAdd'
import formEdit from './formEdit'
import formDesignEdit from './formDesignEdit'
import {getClientHeight} from '@/util/tool'
import {mapState, mapGetters} from 'vuex'
export default {
  name: 'FormDesign',
  components: {
    cvueTable,
    cvueDialog,
    formDesignEdit,
    formAdd,
    formEdit
  },
  data () {
    return {
      treeLoading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      layout: 'total, prev, pager, next, jumper',
      tableLoading: false,
      dialogVisibleEdit: false,
      dialogVisibleFormAdd: false,
      dialogVisibleFormEdit: false,
      tablePage: 1,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 50, 100]
      },
      tableOption: {
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          {prop: 'Id', label: '表单模板Id', align: 'center', width: 200},
          {prop: 'TableName', label: '表单名称', align: 'center'},
          // {prop: 'typeName', label: '字段个数', align: 'center'},
          {prop: 'CreateTime', label: '创建时间', align: 'center', slotStatus: true},
          {prop: 'TableSort', label: '排序', align: 'center'},
          // {prop: 'TableRemarkPC', label: 'PC端模板', align: 'center', slotStatus: true},
          // {prop: 'TableRemarkH5', label: '移动端模板', align: 'center', slotStatus: true},
          {prop: 'TableState', label: '状态', align: 'center', slotStatus: true, width: 100}
        ]
      },
      tableData: [
      ],
      schoolId: '',
      typeId: '',
      treeNodeData: {},
      treeNodeNode: {},
      treeEditData: {},
      dialogStatus: '',
      level: '',
      rowData: {}
    }
  },
  mounted () {
    this.getTreeData()
  },
  computed: {
    height () {
      var height = getClientHeight() - 170
      return height + 'px'
    },
    ...mapGetters(['cookiesObj'])
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
    // 改变pagesize
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleList(this.typeId)
    },
    // 改变页码
    handleCurrentChange (val) {
      this.tablePage = val
      this.handleList(this.typeId)
    },
    // 搜索
    handleSearch () {
      if (this.schoolId == '') {
        this.$message({
            message: '请先选择左侧学校',
            duration: 2000,
            type: 'error'
        })
      } else {
        this.tablePage = 1
        this.deviceName = this.name
        this.deviceType = this.type
        this.handleList(this.typeId)
      }
    },
    // 列表接口
    handleList (typeId) {
      this.tableLoading = true
      var params = {
        pageSize: this.page.pageSize,
        pageIndex: this.tablePage,
        schoolId: this.cookiesObj.schoolId,
        typeId: typeId
      }
      // console.log(params)
      this.$store.dispatch('form/PageBySchoolId', params).then(res => {
        var result = JSON.parse(res)
        // console.log(result)
        if (result.Code == '200') {
          var data = result.Data
          this.tableData = data.data
          this.page.total = data.total
          this.page.currentPage = this.tablePage
          this.tableLoading = false
        } else {
          this.tableData = []
          this.page.total = 0
          this.page.currentPage = this.tablePage
          this.tableLoading = false
        }
      }).catch(err => {
          console.log(err)
          this.tableLoading = false
      })
    },
    // 关闭弹窗
    closeDialog (params) {
      if (params == 'edit') {
        this.dialogVisibleEdit = false
      }
      if (params == 'formAdd') {
        this.dialogVisibleFormAdd = false
      }
      if (params == 'formEdit') {
        this.dialogVisibleFormEdit = false
      }
    },
    // 确认
    confirmDialog (params) {
      if (params == 'edit') {
        this.dialogVisibleEdit = false
        if (this.dialogStatus == 'add') {
          this.$refs.tree.append(this.treeEditData, this.$refs.tree.getNode(this.treeNodeData))
        } else if (this.dialogStatus == 'edit') {
          this.treeNodeData.label = this.treeEditData.label
        } else {
          this.getTreeData()
        }
      }
      if (params == 'formAdd') {
        this.dialogVisibleFormAdd = false
        this.tablePage = 1
        this.handleList(this.typeId)
      }
       if (params == 'formEdit') {
        this.dialogVisibleFormEdit = false
        this.tablePage = 1
        this.handleList(this.typeId)
      }
    },
    // 删除
    handleDelete (row) {
      console.log(row)
      this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        // 判断是否可以删除
        var params = {
          formId: row.Id
        }
        this.$store.dispatch('workFlow/CanDeleteForm', params).then(res => {
          var result = JSON.parse(res)
          // console.log(result)
          if (result.Code == 200) {
            if (result.Data) {
              this.DeleteById(row.Id)
            } else {
              this.$message({
                message: '有流程使用中,不允许删除'
              })
            }
          }
        })
      }).catch(() => {
      })
    },
    // 删除表单请求
    DeleteById (id) {
        var params = {
          _id: id
        }
      this.$store.dispatch('form/DeleteById', params).then(res => {
        var result = JSON.parse(res)
        // console.log(result)
        if (result.Code == '200') {
          this.$message({
            message: result.Msg,
            duration: 2000,
            type: 'success'
          })
          this.tablePage = 1
          this.handleList(this.typeId)
        } else {
          this.$message({
            message: result.Msg,
            duration: 2000,
            type: 'success'
          })
        }
      })
    },
    // 编辑
    handleEdit (row) {
      // console.log(row)
      this.rowData = row
      this.dialogVisibleFormEdit = true
    },
    // 新增
    handleAdd () {
      if (this.typeId == '') {
        this.$message({message: '请选择表单类型', duration: 2000, type: 'error'})
        return
      }
      this.dialogVisibleFormAdd = true
    },
    getTreeData () {
      // console.log(this.cookiesObj)
      var params = {
        schoolId: this.cookiesObj.schoolId,
        parentId: ''
      }
      this.treeLoading = true
      this.$store.dispatch('form/ListBySchoolIdFormType', params).then(res => {
        this.treeLoading = false
        var result = JSON.parse(res)
        // console.log(result)
        if (result.Code == '200') {
          this.treeData = result.Data
          // console.log(this.treeData)
        }
      })
    },
    handleNodeClick (data) {
      // console.log(data)
      this.typeId = data.id
      this.tablePage = 1
      this.handleList(this.typeId)
    },
    renderContent (h, { node, data, store }) {
       return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.append(data, event, node) }>添加</el-button>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.edit(data, event, node) }>编辑</el-button>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.delete(data, event, node) }>删除</el-button>
          </span>
        </span>)
    },
    // 添加
    addFormType () {
      this.level = 'top'
      this.dialogStatus = 'top'
      this.dialogVisibleEdit = true
    },
    // 添加
    append (data, event, node) {
      window.event ? window.event.cancelBubble = true : event.stopPropagation()
      this.treeNodeData = data
      console.log(this.treeNodeData)
      this.treeNodeNode = node
      this.dialogStatus = 'add'
      // console.log(this.treeNodeData)
      this.dialogVisibleEdit = true
    },
    // 编辑
    edit (data, event, node) {
      console.log(data)
      window.event ? window.event.cancelBubble = true : event.stopPropagation()
      this.treeNodeData = data
      this.treeNodeNode = node
      this.dialogStatus = 'edit'
      this.dialogVisibleEdit = true
    },
    // 删除
    delete (data, event, node) {
      // console.log(data)
      window.event ? window.event.cancelBubble = true : event.stopPropagation()
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          _id: data.id
        }
        this.$store.dispatch('form/DeleteByIdFormType', params).then(res => {
          // console.log(res)
          var result = JSON.parse(res)
          if (result.Code == '200') {
            this.$message({
                message: result.Msg,
                duration: 2000,
                type: 'success'
            })
            this.$refs.tree.remove(data)
            this.tableData = []
          } else {
            this.$message({
              message: result.Msg,
              duration: 2000,
              type: 'error'
            })
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss">
  .device-bind{
    .left-tree{
      width: 100%;
      min-height:600px;
      overflow: auto;
    }
    .left{
      min-height:500px;
      background:#fff;
    }
    .left-top{
      width: 100%;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      color: #333;
      background: #e2e2e2;
    }
    .right-main{
      margin-top:15px;
      background:#fff;
      min-height:150px;
      padding: 0 0 20px;
    }
    .el-date-editor{
      width:100%;
    }
    .tabs-card .el-card{
      box-shadow:none;
      border:none;
    }
    .tabs-card .el-card__header{
      // padding: 0 15px 15px!important;
    }
    padding: 0px!important;
    height: auto!important;
    .home-body{
      margin-top: -15px;
    }
    .btn-list{
      float: right;
      margin-right: 10px;
      font-size: 12px;
      color: #409EFF;
      cursor: pointer;
    }
    .el-card__header{
      border-bottom: none;
    }
    .fix-lh{
      line-height: 32px;
    }
    .text-right{
      text-align: right;
    }
    .el-card__header,.el-card__body{
      padding: 15px;
    }
    .el-input.is-disabled .el-input__inner{
      color: #606266;
    }
    .el-table__body{
      // tr td:nth-child(5) span{
      //     color: #409EFF;
      //     cursor: pointer;
      // }
    }
    .table-body{
      margin-top: 20px;
    }
    .total{
      margin-top:20px;
    }
    .total p{
      margin-bottom:10px;
    }
    .forbid{
      margin-right: 15px;
      color: #656565;
    }
    .normal{
      margin-left: 15px;
      color: #4b98ff;
    }
  } 
</style>
