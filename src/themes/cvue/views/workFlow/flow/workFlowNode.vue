<template>
  <div class="node-add">
    <!-- 新增弹窗 -->
    <cvue-dialog  :dialogVisible="dialogVisible"
              title="节点设置"
              dialogWidth="600px"
              :open="getDetail"
              @handleOpen="getDetail"
              @closeDialog="closeDialog"
              @confirmDialog="confirmDialog"
              @handleClose="handleClose"
              :appendToBody = "true"
      >
      <div class="dialog-body" slot="dialogBody">
        <el-tabs type="border-card" class="tabs-card" v-model="nodeTabs"  @tab-click="tabClick">
          <el-tab-pane label="节点编辑信息" name="节点编辑信息" >
            <el-form :model="nodeForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="节点名称" prop="NodeName">
                    <el-input v-model.trim="nodeForm.NodeName" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="节点备注" prop="NodeRemark">
                    <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model.trim="nodeForm.NodeRemark">
                    </el-input>
                  </el-form-item>
                </el-col>
                
                <el-col :span="24">
                  <el-form-item label="节点类型" prop="NodeType">
                    <el-select placeholder="请选择" v-model="nodeForm.NodeType" class="select-width">
                      <el-option v-for="item in nodeTypeTypeSle" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="操作用户" >
                    <el-switch v-model="userRange"  active-text="全部" inactive-text="指定" ></el-switch>
                    
                  </el-form-item>
                </el-col>

                <!-- 权限类型 为1 指定部门 -->
                <div v-show="userRange == false">
                  <el-col  :span="24">
                    <el-form-item label="部门选择" >
                      <el-tree
                        ref="department"
                        :data="deptList2"
                        show-checkbox
                        :check-strictly="true"
                        node-key="id"
                        :default-checked-keys="defaultChecked"
                        :props="defaultProps">
                      </el-tree>
                    </el-form-item>
                  </el-col>
                  <!-- 权限类型 为2 人员 -->
                  <el-col :span="24">
                    <el-form-item label="人员选择" >
                      <el-tree  style="float:left;width:200px; height:150px; overflow:scroll"
                        :data="deptList2"
                        node-key="id"
                        :highlight-current="true"
                        @node-click = "clickDept"
                        :props="defaultProps">
                      </el-tree>
                      
                      <el-tree style="float:right;width:200px; height:150px; overflow:scroll"
                        :data="memberArr"
                        show-checkbox
                        node-key="Id"
                        @check-change="checkChange"
                        :default-checked-keys="defaultCheckedMember"
                        :props="memberProps">
                      </el-tree>
                    </el-form-item>
                  </el-col>

                </div>

                <!-- <el-col :span="24">
                  <el-form-item label="left值" prop="FlowName">
                    <el-input placeholder="请输入left值" v-model.trim="nodeForm.FlowName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="top值" prop="FlowSort">
                    <el-input v-model.trim="nodeForm.FlowSort" placeholder="请输入top"></el-input>
                  </el-form-item>
                </el-col> -->
                
              </el-row>
            </el-form>            
          </el-tab-pane>
          <el-tab-pane label="节点条件列表" name="节点条件列表" >            
            <el-button @click="openNodeConditions" type="primary" style="margin-bottom:10px" >新增</el-button>

            <cvue-table :option="tableOption" 
                          :data="tableData" ref="tbl1"                          
                          :isShowAdd="false" 
                          :isShowPage="false">
                <!-- 操作按钮 -->
                <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                    header-align="center"  width="130">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope)" v-hasPermission="permission.edit">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDelete(scope)" v-hasPermission="permission.edit">删除</el-button>
                        <!-- <el-button type="text" size="small"  v-hasPermission="permission.edit">预览</el-button> -->
                    </template>
                </el-table-column>
              </cvue-table>
          </el-tab-pane>
        </el-tabs>
      </div>            
    </cvue-dialog>
    
    <work-flow-node-condition
      ref="nodeCondition"
      :editJson="editJson"
      @closeConDialog="closeConDialog"
      @confirmConDialog="confirmConDialog"
      @handleConClose="closeConDialog"
      :dialogVisible="dialogVisibleNodeCondition"
      >
    </work-flow-node-condition> 
  </div>
</template>
<script>
import cvueTreeGrid from '@/components/cvue-tree-grid'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import workFlowNodeCondition from './workFlowNodeCondition'
import {validPhone, validIp} from '@/util/validator.js'

// import {mapState, mapGetters} from 'vuex'
export default {
  name: 'indexAdd',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid,
    workFlowNodeCondition
  },
  data () {
    var validatePass = (rule, value, callback) => {
      var reg = /^[0-9A-Za-z]+$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === undefined) {
        callback(new Error('请输入密码'))
      } else if (value.length < 8 || value.length > 16) {
        callback(new Error('长度在 8 到 16 个字符'))
      } else if (!reg.test(value)) {
        callback(new Error('只允许输入数字和字母'))
      } else {
        // if (this.nodeForm.checkPassword !== '') {
        //     this.$refs.ruleForm.validateField('checkPassword')
        // }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value === undefined) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (value === undefined) {
        callback(new Error('请输入用户名'))
      } else if (value.length < 5 || value.length > 16) {
        callback(new Error('长度在 5 到 16 个字符'))
      } else {
        this.$store.dispatch('system/CheckSysuser', {userName: value}).then((res) => {
          if (!res.data) {
            callback(new Error('用户名已经存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      // ruleForm: {
      //   FlowCode: '',
      //   FlowName: '',
      //   FlowSort: '',
      //   FlowState: '',
      //   FlowRemark: ''
      // },
      rules: {
        NodeName: [
          { required: true, trigger: 'blur', message: '请输入节点备注' },
          // { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        NodeRemark: [
          { message: '请输入节点备注', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      },
      nodeTypeTypeSle: [
        {
          value: 1,
          label: '审核'
        },
        {
          value: 2,
          label: '抄送'
        }
      ],
      dialogLoading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      memberArr: [],
      memberProps: {
        label: 'Name'
      },
      defaultChecked: [],
      defaultCheckedMember: [],
      fromList: [],
      userRange: true,
      roleType: [
      ],
      dialogVisibleNodeCondition: false,
      nodeTabs: '节点编辑信息',
      tableOption: {
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          {prop: 'ShowFieldName', label: '字段名', align: 'center', width: 100},
          {prop: 'ConditionOperation', label: '条件', align: 'center'},
          {prop: 'ConditionValue', label: '具体值', align: 'center'}
        ]
      },
      tableData: [
      ],
      editJson: {}
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    nodeForm: {
      type: Object,
      default: () => {}
    },
    deptList2: {
      type: Array,
      default: () => []
    }    
  },
  mounted () {
  },
  methods: {
    
    // 触发事件
    handleClose () {
      // this.$refs['ruleForm'].clearValidate()
      // this.$refs['ruleForm'].resetFields()
      this.$emit('handleSecClose')
    },
    closeDialog () {
      // this.$refs['ruleForm'].clearValidate()
      // this.$refs['ruleForm'].resetFields()
      this.$emit('closeSecDialog')
    },
    confirmDialog () {
      // console.log(this.$refs.department.getCheckedKeys(true))
      
      this.disabled = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let agrJson = {}
          if (!this.userRange) {
            agrJson.memberList = this.defaultCheckedMember
            agrJson.department = this.$refs.department.getCheckedKeys() 
            // console.log(agrJson.memberList)
            // console.log(agrJson.department)
          }
          agrJson.userRange = this.userRange
          
          this.$emit('confirmSecDialog', agrJson)    
        } else {
          console.log('error submit!!')
          
          this.disabled = false
          return false
        }
      }) 
      
      // this.fromList.forEach(item => {
      //   if (this.ruleForm.FormId == item.Id) {
      //     agrJson.fromType = item.TypeId
      //   }
      // })
      // return false  
    },
    // 点击部门展示人员列表
    clickDept (obj) {
      // console.log(obj)
      this.TeacherListByDeptId(obj.id)
    },
    // 人员列表选中变化
    checkChange (o, i, c) {
      if (i) {
        this.defaultCheckedMember.push(o.Id)
      } else {
        this.defaultCheckedMember = this.defaultCheckedMember.filter(item => {
          return item != o.Id
        })
      }
      // console.log(o)
      // console.log(i)
      // console.log(this.defaultCheckedMember)
    },
  
    // 获取人员列表
    TeacherListByDeptId (id) {
      let params = {deptId: id}
      this.$store.dispatch('organization/TeacherListByDeptId', params).then(res => {
        // console.log(JSON.parse(res))
        let dataJson = JSON.parse(res)
        this.memberArr = []
        if (dataJson.Code == 200) {
          this.memberArr = dataJson.Data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 打开添加节点条件弹窗
    openNodeConditions () {
      this.dialogVisibleNodeCondition = true
    },
    // 编辑节点条件
    handleEdit (row) {
      console.log(row)
      this.editJson = row.row
      this.dialogVisibleNodeCondition = true
    },
    // 删除节点条件
    handleDelete (row) {
      this.$confirm('此操作将永久删除该条件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(123)
        this.FlowNodeConditionDelete(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })          
      })
      // console.log(row)
    },
    // 删除节点条件请求
    FlowNodeConditionDelete (row) {
      this.$store.dispatch('workFlow/FlowNodeConditionDelete', {_id: row.row.Id}).then(res => {
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {      
          console.log(row)    
          this.tableData.splice(row.$index, 1)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message({
            type: 'info',
            message: '删除失败'
          })
          // this.$message.error(dataJson.msg)
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '删除失败'
        })
      })
    },
    // 关闭节点条件弹窗
    closeConDialog () {
      this.editJson = {}
      this.dialogVisibleNodeCondition = false
    },
    // 确定节点条件弹窗
    confirmConDialog (e) {
      e.nodeId = this.nodeForm.Id
      var paramsNew = {
        data: JSON.stringify(e)
      }
      if (e.paramsType == 'edit') {
        this.FlowNodeConditionUpdate(paramsNew)
      } else {
        this.FlowNodeConditionAdd(paramsNew)
      }
    },
    // 新增节点条件
    FlowNodeConditionAdd (paramsNew) {
      this.$store.dispatch('workFlow/FlowNodeConditionAdd', paramsNew).then(res => {
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {          
          this.$message({
            message: '恭喜你，添加成功',
            type: 'success'
          })
          this.ConditionListByNodeId()
          this.editJson = {}
          this.dialogVisibleNodeCondition = false
        } else {
          this.$message.error(dataJson.msg)
        }
        this.$refs.nodeCondition.disabled = false
        // console.log(dataJson)
      })
    },
    // 更新节点条件
    FlowNodeConditionUpdate (paramsNew) {
      this.$store.dispatch('workFlow/FlowNodeConditionUpdate', paramsNew).then(res => {
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {          
          this.$message({
            message: '恭喜你，更新成功',
            type: 'success'
          })
          this.ConditionListByNodeId()
          this.editJson = {}
          this.dialogVisibleNodeCondition = false
        } else {
          this.$message.error(dataJson.msg)
        }
        this.$refs.nodeCondition.disabled = false
        // console.log(dataJson)
      })
    },
    // 获取节点下的条件
    ConditionListByNodeId () {
      this.$store.dispatch('workFlow/ConditionListByNodeId', {nodeId: this.nodeForm.Id}).then(res => {
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          this.tableData = dataJson.Data
        } else {
          this.tableData = []
        }
      })
    },
    // 初始化弹窗
    getDetail () {
      this.memberArr = []
      this.deptList = []
      this.defaultChecked = []
      this.defaultCheckedMember = []
      // 分割指定部门为数组
      // console.log(this.nodeForm)
      this.defaultChecked = this.nodeForm.OpDeptIds.split(',').filter(function (s) {
        return s && s.trim()
      }) 
      this.nodeTabs = '节点编辑信息'
      this.$nextTick(() => {
        // console.log(this.$refs.department.setCheckedNodes)
        this.ConditionListByNodeId()
        this.$refs.department.setCheckedKeys(this.defaultChecked)
      })
      // 分割指定人员为数组
      this.defaultCheckedMember = this.nodeForm.OpUserIds.split(',').filter(function (s) {
        return s && s.trim()
      })
      // console.log(this.nodeForm)
      if (this.defaultCheckedMember[0] == '*') {
        this.userRange = true
      } else {
        this.userRange = false
      }
    },
    tabClick (e) {
      console.log(e)
      if (e.name == '节点条件列表') {
        this.ConditionListByNodeId()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.select-width{
  width: 100%;
}
.el-dialog{
  .dialog-body{
    max-height: 400px;
    overflow: auto;
    padding: 0 !important;
  }
}
</style>
