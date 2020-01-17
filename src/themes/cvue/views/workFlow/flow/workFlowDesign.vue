<template>
  <div class="device-bind">
    <!-- 表单 -->
    <el-card class="box-card mt-15">
      <div class="home-form">
        <el-form ref="ruleForm" label-width="80px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-button type="primary" @click="handleAdd" class="el-icon-plus">添加</el-button>
              <!-- <el-button type="success" @click="handleAdd" class="el-icon-edit">编辑</el-button> -->
              <!-- <el-button type="danger" @click="handleAdd" class="el-icon-delete">删除</el-button> -->
              <!-- <el-button type="info" @click="handleAdd" class="el-icon-view">预览</el-button> -->
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-row :gutter="20">
      <el-col v-if="$store.getters.cookiesObj.roleCode != 'SchoolAdmin' " :span="$store.getters.cookiesObj.roleCode!='SchoolAdmin'? 6:0" >
        <div class="left" >
          <div class="left-top">
            选择学校
          </div>
          <div class="left-tree" :style="{maxHeight:height}">
            <el-tree :data="treeData" 
                    :props="defaultProps" 
                    @node-click="handleNodeClick"
                    :expand-on-click-node="false"
                    accordion
                    ref="tree"
                    node-key="Id"
                    :highlight-current="true"
                    :load="loadChild" 
                    lazy>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="$store.getters.cookiesObj.roleCode!='SchoolAdmin'? 18:24">
        
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
                <template slot-scope="scope" slot="LastOpDateTime">
                    <span class="forbid">{{formatTime(scope.row.LastOpDateTime)}}</span>
                    <!-- <span class="forbid">禁用</span><el-switch v-model="scope.row.deviceState" @change="handleSwitch(scope.row)"></el-switch><span class="normal">正常</span> -->
                </template>
                <template slot-scope="scope" slot="AuthorizeType">
                  {{AuthorizeTypeString[scope.row.AuthorizeType]}}
                </template>
                <template slot-scope="scope" slot="FlowSort">
                    <!-- <span class="forbid">禁用</span> -->
                    <el-switch @change="changeFlowState(scope.row)" v-model="scope.row.FlowState" ></el-switch>
                    <!-- <span class="normal">正常</span> -->
                    <!-- <span class="forbid">禁用</span><el-switch v-model="scope.row.deviceState" @change="handleSwitch(scope.row)"></el-switch><span class="normal">正常</span> -->
                </template>
                <!-- 操作按钮 -->
                <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                    header-align="center"  width="130">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope)" v-hasPermission="permission.edit">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDelete(scope.row)" v-hasPermission="permission.edit">删除</el-button>
                        <!-- <el-button type="text" size="small"  v-hasPermission="permission.edit">预览</el-button> -->
                    </template>
                </el-table-column>
              </cvue-table>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row> 
    <!-- 新增弹窗 -->
    <work-flow-design-add
      ref="flowDesignAdd"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="closeDialog"
      :activeSchool="acitveSchool"
      :ruleForm="editForm"
      :dialogVisible="dialogVisibleAdd"
      >
    </work-flow-design-add>     
    <!-- 编辑弹窗 -->
    <work-flow-design-edit
      ref="flowDesignEdit"
      @closeDialog="closeDialog('edit')"
      @confirmDialog="confirmDialog"
      @handleClose="closeDialog('edit')"
      :dialogVisible="dialogVisibleEdit"
      >
    </work-flow-design-edit>     
  </div>
</template>
<script>
import workFlowDesignAdd from './workFlowDesignAdd'
import workFlowDesignEdit from './workFlowDesignEdit'

import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import {getClientHeight} from '@/util/tool'
import {mapState, mapGetters} from 'vuex'
export default {
  name: 'SchoolOrder',
    components: {
    cvueTable,
    cvueDialog,
    workFlowDesignAdd,
    workFlowDesignEdit
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'Name',
        isLeaf: 'leaf'
      },
      deviceData: [],
      keyword: '',
      layout: 'total, prev, pager, next, jumper',
      tableLoading: false,
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogVisibleAddSchoolArea: false,
      dialogVisibleEditSchoolArea: false,
      tablePage: 1,
      page: {
        total: 0, // 总数凉
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
          {prop: 'FlowCode', label: '流程编号', align: 'center', width: 100},
          {prop: 'FlowName', label: '流程名称', align: 'center'},
          {prop: 'FlowRemark', label: '流程备注', align: 'center'},
          {prop: 'FlowSort', label: '流程排序', align: 'center'},
          {prop: 'AuthorizeType', label: '访问权限', align: 'center', slotStatus: true},
          // 访问权限 0是公开（所有人可见）1是 部门可见（指定到部门） 2是 个人可见（指定到人）
          {prop: 'LastOpUserName', label: '最后操作人', align: 'center'},
          {prop: 'LastOpDateTime', label: '更新时间', align: 'center', slotStatus: true},
          {prop: 'FlowSort', label: '状态', align: 'center', slotStatus: true, width: 100}
        ]
      },
      tableData: [
      ],
      editForm: {},
      editId: '',
      AuthorizeTypeString: ['完全公开', '指定部门', '人员'],
      deptList: [],
      defaultChecked: [],
      clickRowInx: null,
      defaultCheckedMember: [],
      acitveSchool: ''
    }
  },
  mounted () {
    this.acitveSchool = this.$store.getters.cookiesObj.schoolId
    sessionStorage.setItem('acitveSchool', this.acitveSchool)
    this.handleList(this.acitveSchool)
    this.getTopArea('000000')
    console.log(this.$store.getters.cookiesObj)
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
      this.handleList(this.acitveSchool)
    },
    // 改变页码
    handleCurrentChange (val) {
      console.log(val)
      this.page.currentPage = val
      this.handleList(this.acitveSchool)
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
        this.handleList(this.schoolId)
      }
    },
    // 列表接口
    handleList (schoolId) {
      this.tableLoading = true
      var params = {
        schoolId: schoolId,
        pageSize: this.page.pageSize,
        pageIndex: this.page.currentPage
      }
      // console.log(params)
      this.$store.dispatch('workFlow/PageBySchoolId', params).then(res => {
        console.log(JSON.parse(res))
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          var data = dataJson.Data
          console.log(data)
          this.tableData = data.data
          this.page.total = data.total
          // this.page.currentPage = this.tablePage
          this.tableLoading = false
        } else {
          this.$message(dataJson.Msg)
          this.tableData = []
          this.tableLoading = false
        }
      }).catch(err => {
          console.log(err)
          this.tableLoading = false
      })
    },
    // 改变流程状态
    changeFlowState (row) {
      console.log(row)
      let params = {
        _id: row.Id,
        flowState: row.FlowState
      }
      this.$store.dispatch('workFlow/UpFlowState', params).then(res => {
        console.log(JSON.parse(res))
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {          
          this.$message({
            message: dataJson.Msg,
            type: 'success'
          })
        } else {
          this.$message.error(dataJson.Msg)
          row.FlowState = !row.FlowState
        }
      }).catch(err => {
        let dataJson = JSON.parse(err)
        this.$message.error(dataJson.Msg)
        row.FlowState = !row.FlowState
        // console.log(err)
      })
    },
    // 添加流程
    handleAdd () {
      this.clickRowInx = null
      this.editForm = {
        FlowCode: new Date().getTime(),
        FlowName: '',
        FlowRemark: '',
        FlowTypeId: '',
        FormId: null,
        FormTypeId: '',
        AuthorizeType: 0,
        FlowSort: 1,
        FlowState: true,  
        SchoolId: this.acitveSchool
      }
      this.dialogVisibleAdd = true
    },
    // 编辑,
    handleEdit (row) {
      console.log(row == undefined)
      
      this.clickRowInx = row.$index
      this.editForm = row.row
      this.editId = row.row.Id
      this.dialogVisibleEdit = true
    },

    // 关闭弹窗
    closeDialog (params) {
      // console.log(this.editForm)
      this.editForm = {}
      switch (params) {
        case 'edit':
          this.dialogVisibleEdit = false
           
          this.handleList(this.acitveSchool)
          break
      
        default:
          this.dialogVisibleAdd = false
          break
      }
    },
    // 新增流程，更新流程 确认
    confirmDialog (agr) {
      console.log(agr)
      switch (agr.type) {
        case 'edit':
          this.saveEditInfo(agr)          
          break
      
        default:
          this.saveFlowAdd(agr)
          break
      }
    },
    // 新增流程基本信息
    saveFlowAdd (agr) {
      let params = {
        _id: this.editForm.Id,
        flowCode: this.editForm.FlowCode,
        flowName: this.editForm.FlowName,
        flowRemark: this.editForm.FlowRemark,
        flowTypeId: this.editForm.FlowTypeId,
        formId: this.editForm.FormId,
        formTypeId: agr.fromType,
        authorizeType: this.editForm.AuthorizeType,
        flowSort: this.editForm.FlowSort,
        flowState: this.editForm.FlowState,
        schoolId: this.acitveSchool,
        createUserId: this.$store.getters.cookiesObj.teacherId,
        createUserName: decodeURI(this.$store.getters.cookiesObj.realName)
      }
      // 判断权限类型 0完全公开， 1指定部门， 2人员
      let department, memberList
      switch (this.editForm.AuthorizeType) {
        case 0:
          // params.authorzeDeptIds = ''
          // params.authorzeTeacherIds = ''          
          break
        case 1:    
          department = agr.department.join(',')
          params.authorzeDeptIds = department
          // params.authorzeTeacherIds = ''          
          break      
        default:          
          // params.authorzeDeptIds = ''
          memberList = agr.memberList.join(',')
          params.authorzeTeacherIds = memberList
          break
      }
      this.$store.dispatch('workFlow/Add', params).then(res => {
        // console.log(params)
        // console.log(JSON.parse(res))
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          this.$message({
            message: '恭喜你，更新成功',
            type: 'success'
          })
          this.page.currentPage = 1
          this.handleList(this.acitveSchool)

          this.dialogVisibleAdd = false
        } else {            
          this.$message({
            message: dataJson.Msg,
            type: 'warning'
          })
          this.$refs.flowDesignAdd.disabled = false
        }
      }).catch(err => {
          this.$refs.flowDesignAdd.disabled = false
        console.log(err)
      })
    },
    // 提交修改基本信息
    saveEditInfo (agr) {
      let params = {
        _id: agr.editForm.Id,
        flowCode: agr.editForm.FlowCode,
        flowName: agr.editForm.FlowName,
        flowRemark: agr.editForm.FlowRemark,
        flowTypeId: agr.editForm.FlowTypeId,
        formId: agr.formData.formId,
        formTypeId: agr.formData.formTypeId,
        authorizeType: agr.editForm.AuthorizeType,
        flowSort: agr.editForm.FlowSort,
        flowState: agr.editForm.FlowState,
        schoolId: this.acitveSchool,
        createUserId: this.$store.getters.cookiesObj.teacherId,
        createUserName: decodeURI(this.$store.getters.cookiesObj.realName)
      }
      
      // 判断权限类型 0完全公开， 1指定部门， 2人员
      let department, memberList
      console.log(agr)
      switch (agr.editForm.AuthorizeType) {
        case 0:
          // params.authorzeDeptIds = ''
          // params.authorzeTeacherIds = ''          
          break
        case 1:    
          department = agr.department.join(',')
          params.authorzeDeptIds = department
          // params.authorzeTeacherIds = ''          
          break      
        default:          
          // params.authorzeDeptIds = ''
          memberList = agr.memberList.join(',')
          params.authorzeTeacherIds = memberList
          break
      }
      this.$store.dispatch('workFlow/Update', params).then(res => {
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          this.$message({
            message: '恭喜你，更新成功',
            type: 'success'
          })
          
          this.handleList(this.acitveSchool)
          this.dialogVisibleEdit = false
        } else {            
          this.$message({
            message: dataJson.Msg,
            type: 'warning'
          })
        }
        this.$refs.flowDesignEdit.disabled = false
      }).catch(err => {
        console.log(err)
          this.$refs.flowDesignEdit.disabled = false
      })
    },
    // 删除
    handleDelete (row) {
      this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        var params = {
          _id: row.Id
        }
        this.$store.dispatch('workFlow/FlowDelete', params).then(res => {
          // console.log(res)
          
          let dataJson = JSON.parse(res)
          if (dataJson.Code == 200) {
            this.$message({
              message: '删除成功',
              duration: 2000,
              type: 'success'
            })
            this.page.currentPage = 1
            this.handleList(this.acitveSchool)
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      }).catch(() => {
      })
    },

    // 树节点点击
    handleNodeClick (data) {
      // console.log(data)
      if (data.Type == 2) {
        this.page.currentPage = 1
        this.acitveSchool = data.Id
        sessionStorage.setItem('acitveSchool', this.acitveSchool)
        this.handleList(data.Id)
      }
    },
    // 渲染树
    loadChild (node, resolve) {
      if (node.data.Type == 1) {
        this.getTopArea(node.data.Id, resolve)
      } else if (node.data.Type == 2) {
        resolve([])
      }
    },
    // 获取区域
    getTopArea (parentId, resolve) {
      var params = {
        parentId: parentId
      }
      this.treeLoading = false
      // console.log(parentId)
      if (!parentId) return
      if (parentId == '000000') {
        // 顶级
        this.$store.dispatch('organization/AreaList', params).then(res => {
          this.treeLoading = true
          var result = JSON.parse(res)
          if (result.Code == '200') {
            this.treeData = result.Data
          }
        })
      } else {
        // 子级
        this.$store.dispatch('organization/AreaList', params).then(res => {
          this.treeLoading = true
          var result = JSON.parse(res)
          console.log(result)
          if (result.Code == '200') {
            resolve(result.Data)
          } else {
            resolve([])
          }
        })
      }
    },
    // 获取学校
    getSchoolListByAreaId (areaId, resolve) {
      var params = {
        areaId: areaId
      }
      // 子级
      this.$store.dispatch('organization/SchoolListByAreaId', params).then(res => {
        this.treeLoading = true
        var result = JSON.parse(res)
        // console.log(result)
        if (result.Code == '200') {
          resolve(result.Data)
        } else {
          resolve([])
        }
      })
    },
    // 部门
    getDeptListBySchoolId (areaId, resolve) {
      var params = {
        schoolId: schoolId,
        parentId: parentId
      }
      // 子级
      this.$store.dispatch('organization/DeptListBySchoolId', params).then(res => {
        this.treeLoading = true
        var result = JSON.parse(res)
        console.log(result)
        if (result.Code == '200') {
          resolve(result.Data)
        } else {
          resolve([])
        }
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
