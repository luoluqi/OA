<template>
  <div class="flow-edit">
    <!-- 新增弹窗 -->
    <cvue-dialog :dialogVisible="dialogVisible"
              title="编辑"
              dialogWidth="600px"
              :open="getDetail"
              :btnDisabled="disabled"
              @handleOpen="getDetail"
              @closeDialog="closeDialog"
              @confirmDialog="confirmDialog"
              @handleClose="handleClose">
      <div class="dialog-body" slot="dialogBody">
        <el-tabs type="border-card" class="tabs-card" v-model="tabsCard"  @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="基本信息">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="流程编号" prop="FlowCode">
                    <el-input v-model.trim="ruleForm.FlowCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="流程名称" prop="FlowName">
                    <el-input placeholder="请输入流程名称" v-model.trim="ruleForm.FlowName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="排序" prop="FlowSort">
                    <el-input v-model.trim="ruleForm.FlowSort" placeholder="请输入排序码"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="状态" prop="FlowState">
                    <el-switch v-model="ruleForm.FlowState" active-text="启用" inactive-text="禁用" ></el-switch>
                    <!-- <el-radio-group v-model="ruleForm.state">
                      <el-radio :label="1">启用</el-radio>
                      <el-radio :label="0">禁用</el-radio>
                    </el-radio-group> -->
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="流程备注" prop="FlowRemark">
                    <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model.trim="ruleForm.FlowRemark">
                    </el-input>
                  </el-form-item>
                </el-col>
                
                <el-col :span="20">
                  <el-form-item label="选择表单" >
                    <el-select placeholder="请选择"  v-model="ruleForm.FormId"  class="select-width">
                      <el-option v-for="item in fromList"  :key="item.Id" :label="item.TableName"  :value="item.Id"></el-option>
                    </el-select>
                    
                    <el-alert style="padding:0"
                      title="切换表单需应用才会保存，并且会清空节点条件"
                      type="info"
                      :closable="false"
                      show-icon>
                    </el-alert>
                  </el-form-item>
                </el-col>
                <el-col :span="4">                  
                   <el-button  type="primary" @click="formToFlow" >应用</el-button>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="权限类型" prop="AuthorizeType">
                    <el-select placeholder="请选择" v-model="ruleForm.AuthorizeType" class="select-width">
                      <el-option v-for="item in AuthorizeTypeSle" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 权限类型 为1 指定部门 -->
                <el-col v-if="ruleForm.AuthorizeType==1" :span="24">
                  <el-form-item label="部门选择" >
                    <el-tree
                      ref="department"
                      :data="deptList"
                      show-checkbox
                      node-key="id"
                      :check-strictly="true"
                      :default-checked-keys="defaultChecked"
                      :props="defaultProps">
                    </el-tree>
                  </el-form-item>
                </el-col>
                <!-- 权限类型 为2 人员 -->
                <el-col v-show="ruleForm.AuthorizeType==2" :span="24">
                  <el-form-item label="人员选择" >
                    <el-tree  style="float:left;width:200px; height:150px; overflow:scroll"
                      :data="deptList"
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
                      :default-checked-keys="defaultCheckedFlowMember"
                      :props="memberProps">
                    </el-tree>
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="流程设计">
            <panel 
              ref="flowSet"
              :deptList="deptList"
              :flowNodeList="flowNodeList"             
              @addTaskNode="addTaskNode"
              @delNode="delNode"
              @drawLine="drawLine"
              @delLine="delLine"
              @upDataList ="getFlowNode"
            ></panel>
          </el-tab-pane>
        </el-tabs>
      </div>            
    </cvue-dialog>
  </div>
</template>
<script>
import cvueTreeGrid from '@/components/cvue-tree-grid'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import {validPhone, validIp} from '@/util/validator.js'

import panel from '../flowTool/panel'

// import {mapState, mapGetters} from 'vuex'
export default {
  name: 'indexAdd',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid,
    panel
  },
  data () {
    var validateSort = (rule, value, callback) => {
      let reg = '^[0-9]*$'
      console.log(typeof value)
      console.log(typeof value)
      if (!new RegExp(reg).test(value)) {
        callback(new Error('请填入数字'))
      } else if (value < 1) {
        callback(new Error('不能小于1'))
      } else if (value > 1000) {
        callback(new Error('不能大于1000'))
      } else {
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
        FlowCode: [
          { required: true, trigger: 'blur' }
          // { required: true, message: '请输入用户名', trigger: 'blur' },
          // { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ],
        FlowName: [
          { required: true, message: '请输入流程名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        FlowSort: [
          { required: true, trigger: 'blur', validator: validateSort }
        ],
        FlowState: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        FlowRemark: [          
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      },
      dialogLoading: false,
      AuthorizeTypeSle: [
        {
          value: 0,
          label: '完全公开'
        },
        {
          value: 1,
          label: '指定部门'
        },
        {
          value: 2,
          label: '人员'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      memberArr: [],
      memberProps: {
        label: 'Name'
      },
      defaultChecked: [],
      defaultCheckedFlowMember: [],
      deptList: [],
      fromList: [],
      flowNodeList: [],
      disabled: false,
      tabsCard: '基本信息',
      activeFrom: {
        formId: '',
        formTypeId: ''
      },
      
      ruleForm: {},
      
      provinces: '',
      citys: [],
      tableOption: {
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          {prop: 'describe', label: '模块', align: 'center'},
          {prop: 'edit', label: '编辑权限', align: 'center', slotStatus: true},
          {prop: 'view', label: '查看权限', align: 'center', slotStatus: true}
        ]
      },
      tableData: [
        // {
        //   code: '运营报表', edit: false, view: true
        // }
      ],
      roleType: [
      ],
      option: {
        expandAll: true,
        columns: [
          {
            text: '模块',
            value: 'describe',
            width: 200
          },
          {
            text: '编辑权限',
            value: 'edit',
            slotStatus: true,
            align: 'center'
          },
          {
            text: '查看权限',
            value: 'view',
            slotStatus: true,
            align: 'center'
          }
        ],
        data: [
        ]
      }
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    
  },
  methods: {
    // 触发事件
    handleClose () {
      this.resetForm('ruleForm')
      this.$emit('handleClose')
    },
    closeDialog () {
      this.resetForm('ruleForm')
      this.$emit('closeDialog')
    },
    confirmDialog () {
      // console.log(this.$refs.department.getCheckedKeys(true))
      let agrJson = {
        type: 'edit'
      }
      this.disabled = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // alert('submit!')
          if (this.ruleForm.AuthorizeType == 1) {
            agrJson.department = this.$refs.department.getCheckedKeys()
               
            if (agrJson.department.length === 0) {
              this.$message({
                message: '指定部门不能为空!',
                type: 'warning'
              })
              this.disabled = false
              return false
            }
          } else if (this.ruleForm.AuthorizeType == 2) {
            agrJson.memberList = this.defaultCheckedFlowMember
            // console.log(agrJson.memberList.length)
            if (agrJson.memberList.length === 0) {
              this.$message({
                message: '指定人员不能为空!',
                type: 'warning'
              })
              this.disabled = false
              return false
            }
            
            this.defaultCheckedFlowMember = []
          }

          agrJson.formData = this.activeFrom
          console.log(this.ruleForm.FlowRemark)
          this.ruleForm.FlowRemark = this.ruleForm.FlowRemark
          agrJson.editForm = this.ruleForm
          console.log(agrJson)
          // this.fromList.forEach(item => {
          //   if (this.ruleForm.FormId == item.Id) {
          //     agrJson.fromType = item.TypeId
          //   }
          // })
          console.log(agrJson)
          this.$emit('confirmDialog', agrJson)  
        } else {
          console.log('error submit!!')
          
          this.disabled = false
          return false
        }
      })
    },
    // 点击部门展示人员列表
    clickDept (obj) {
      // console.log(obj)      
      this.TeacherListByDeptId(obj.id)
    },
    // 人员列表选中变化
    checkChange (o, i, c) {
      console.log(o)
      console.log(this.defaultCheckedFlowMember)
      if (i) {
        this.defaultCheckedFlowMember.push(o.Id)
      } else {
        this.defaultCheckedFlowMember = this.defaultCheckedFlowMember.filter(item => {
          return item != o.Id
        })
      }
      // console.log(o)
      // console.log(i)
      // console.log(this.defaultCheckedFlowMember)
    },
    // 获取表单列表
    ListBySchoolId (SchoolId) {
      this.$store.dispatch('form/ListBySchoolId', {'schoolId': SchoolId}).then(res => {
          console.log(JSON.parse(res))
          let dataJson = JSON.parse(res)
            // console.log(SchoolId)
          if (dataJson.Code == 200) {
            this.fromList = dataJson.Data
          } else {
            this.fromList = []
          }
          let arrHas = true
          this.fromList.forEach(item => {
            if (item.Id == this.ruleForm.FormId) {
              arrHas = false
            }
          })
          if (arrHas) {
            this.fromList.push({Id: this.ruleForm.FormId, TableName: '禁用表单'})
          }
        }).catch(err => {
            console.log(err)
            this.tableLoading = false
        })
    },
    // 获取部门信息
    DeptListBySchoolId (SchoolId) {
      this.$store.dispatch('organization/DeptListBySchoolId', {'schoolId': SchoolId}).then(res => {
          // console.log(JSON.parse(res))
          let dataJson = JSON.parse(res)
          if (dataJson.Code == 200) {
            this.deptList = dataJson.Data
          }
        }).catch(err => {
            console.log(err)
            this.tableLoading = false
        })
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
    // 根据flowId 获取流程节点信息
    getFlowNode () {
      this.$refs.flowSet.delAllNode()
      this.$store.dispatch('workFlow/ListByFlowId', {flowId: this.ruleForm.Id}).then(res => {
        console.log(JSON.parse(res))
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          if (dataJson.Data == '') {
            this.flowNodeList = []
          } else {
            this.flowNodeList = dataJson.Data
          }
          
          // console.log(this.flowNodeList)
          setTimeout(() => {
            this.flowNodeList.forEach(item => {
              // console.log(item)
              this.$refs.flowSet.jsPlumbDrag(item)
            })
          }, 50)
          // 
          // console.log(this.$refs.flowSet.jsPlumbDrag(this.flowNodeList))
        } else {
            this.flowNodeList = []
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加节点
    addTaskNode (e) {
      let params = {
        nodeName: '新增节点',
        nodeRemark: '新增节点',
        nodeType: 1,
        left: e.offsetX,
        top: e.offsetY,
        parentIds: '',
        opUserIds: '*',
        opDeptIds: '',
        opRoleIds: '',
        flowId: this.ruleForm.Id
      }
      var paramsNew = {
        data: JSON.stringify(params)
      }
      this.$store.dispatch('workFlow/FlowNodeAppend', paramsNew).then(res => {
        // console.log(params)
        // console.log(JSON.parse(res))
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          this.flowNodeList.push(dataJson.Data)
          setTimeout(() => {
            this.$refs.flowSet.jsPlumbDrag(dataJson.Data)
          }, 50)
          // this.getFlowNode()
        }
      }).catch(err => {
        console.log(err)
      })
      // let startNode = {
      //   Id: this.dataJson.length,
      //   type: 'task',
      //   left: e.layerX,
      //   top: e.layerY
      // }
      // console.log(e)
      // this.dataJson.push(startNode)
      // setTimeout(() => {
      //   this.jsPlumbObj.draggable('item_' + startNode.id, {
      //     containment: 'diagramContainer'
      //   })
      //   this.jsPlumbObj.addEndpoint('item_' + startNode.id, this.jsPlumbLineStyle)
      // }, 50)
    },
    // 删除节点
    delNode (id) {
      this.$confirm('确定删除节点?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('workFlow/FlowNodeDelete', {'_id': id}).then(res => {
            console.log(JSON.parse(res))
            let dataJson = JSON.parse(res)
            if (dataJson.Code == 200) {
              this.flowNodeList = this.flowNodeList.filter(item => {
                return item.Id != id 
              })
              // this.$refs.flowSet.jsPlumbObj.remove(id)
              this.getFlowNode()
              
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })          
        })
    },
    // 删除线
    delLine (conn) {
      let params = {'_id': conn.targetId}
      let sourceArr
      this.flowNodeList.forEach(item => {
        if (item.Id == conn.targetId) {
          console.log(item)
          sourceArr = item.ParentIds
        }
      })
      console.log(sourceArr)
      params.parentids = sourceArr.replace(conn.sourceId, '')
      console.log(params)
      this.$confirm('确定删除线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var paramsNew = {
          data: JSON.stringify(params)
        }
        this.$store.dispatch('workFlow/UpdateParentIds', paramsNew).then(res => {
          console.log(JSON.parse(res))
          let dataJson = JSON.parse(res)
          if (dataJson.Code == 200) {
            this.getFlowNode()

            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })          
      })
    },
    // 划线
    drawLine (objArgin) {
      let from = {}
      let to = {}
      let params = {'_id': objArgin.t}
      this.flowNodeList.forEach((item, key) => {
        if (item.Id == objArgin.f) {
          from.obj = item
          from.key = key
        } else if (item.Id == objArgin.t) {
          to.obj = item
          to.key = key
        }
      })
      // console.log(objArgin)
      // console.log(from)
      // console.log(to)
      // return false
      if (to.obj.ParentIds != '') {
        params.parentids = to.obj.ParentIds + ',' + objArgin.f
      } else {
        params.parentids = objArgin.f
      }
      var paramsNew = {
        data: JSON.stringify(params)
      }
      this.$store.dispatch('workFlow/UpdateParentIds', paramsNew).then(res => {
        console.log(JSON.parse(res))
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          this.getFlowNode()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    
    // 清空校验
    resetForm (formName) {
      // console.log(this.$refs[formName])
      this.$refs[formName].clearValidate()
    },
    
    // 应用表单到流程
    formToFlow () {
      // let formItem = {}
      this.fromList.forEach(item => {
        if (this.ruleForm.FormId == item.Id) {
          this.$store.dispatch('workFlow/UpFlowFormId', {_id: this.ruleForm.Id, formId: item.Id}).then(res => {
            // console.log(JSON.parse(res))
            let dataJson = JSON.parse(res)
            if (dataJson.Code == 200) {              
              this.activeFrom.formId = item.Id
              this.activeFrom.formTypeId = item.TypeId
              
              localStorage.setItem('nodeFormId', item.Id)
              this.ListBySchoolId(this.ruleForm.SchoolId)
              this.DeleteByFlowId(this.ruleForm.Id)
            } else {
              this.$message.error('未应用成功！')
            }
          })
        }
      })
      console.log(this.activeFrom)
    },
    // 清空流程条件
    DeleteByFlowId (id) {
      this.$store.dispatch('workFlow/DeleteByFlowId', {flowId: id}).then(res => {        
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          this.$message({
            message: '恭喜你，应用成功',
            type: 'success'
          })
        }
      })
    },
    
    // 获取信息
    Item (id) {
      // console.log(id)
      // console.log(this.ruleForm)
      this.$store.dispatch('workFlow/Item', {_id: id}).then(res => {
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          console.log(dataJson)
          this.ruleForm = dataJson.Data
          this.ruleForm.FlowSort = parseInt(this.ruleForm.FlowSort)
          // 分割指定部门为数组
          this.defaultChecked = this.ruleForm.AuthorzeDeptIds.split(',').filter(function (s) {
            return s && s.trim()
          }) 
          // 分割指定人员为数组        
          this.defaultCheckedFlowMember = this.ruleForm.AuthorzeTeacherIds.split(',').filter(function (s) {
            return s && s.trim()
          })
          
          this.activeFrom.formId = this.ruleForm.FormId
          this.activeFrom.formTypeId = this.ruleForm.FormTypeId
          this.DeptListBySchoolId(this.ruleForm.SchoolId)
          this.ListBySchoolId(this.ruleForm.SchoolId)
          localStorage.setItem('nodeFormId', this.ruleForm.FormId)
        }
      }).catch(() => {
        
      })
    },
    // 初始化弹窗
    getDetail () {
      // console.log(this.ruleForm)
      
      this.ruleForm = {}
      this.$nextTick(() => {
        this.tabsCard = '基本信息'
        this.defaultCheckedFlowMember = []
        this.memberArr = []
        this.deptList = []
        this.dispatch = false
        // console.log(this.activeFrom)
        // this.setFromIdToLoch()
        this.Item(this.$parent.editId)
        
        this.getFlowNode()
      })

      // if (this.editForm.AuthorizeType == 1) {
      // } 
      
      // console.log(this.defaultCheckedFlowMember)
    },
    tabClick (e) {
      // console.log(e)
      if (e.index == 1) {
        this.getFlowNode()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.select-width{
  width: 100%;
}
.flow-edit{
  .dialog-body{
    height: 400px;
    overflow: auto;
    padding: 0!important;
  }
}
</style>
