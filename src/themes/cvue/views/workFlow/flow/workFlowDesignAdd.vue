<template>
  <div class="flow-add">
    <!-- 新增弹窗 -->
    <cvue-dialog :dialogVisible="dialogVisible"
              title="新增"
              dialogWidth="600px"
              :open="getDetail"
              :btnDisabled="disabled"
              @handleOpen="getDetail"
              @closeDialog="closeDialog"
              @confirmDialog="confirmDialog"
              @handleClose="handleClose">
      <div class="dialog-body" slot="dialogBody">
        <el-tabs type="border-card" class="tabs-card"  @tab-click="tabClick">
          <el-tab-pane label="基本信息">
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
                  <el-form-item label="流程备注"  prop="FlowRemark">
                    <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model.trim="ruleForm.FlowRemark">
                    </el-input>
                  </el-form-item>
                </el-col>
                
                <el-col :span="24">
                  <el-form-item label="选择表单" prop="FormId">
                    <el-select placeholder="请选择" v-model="ruleForm.FormId" class="select-width">
                      <el-option v-for="item in fromList" :key="item.Id" :label="item.TableName" :value="item.Id"></el-option>
                    </el-select>
                  </el-form-item>
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
                      :default-checked-keys="defaultCheckedMember"
                      :props="memberProps">
                    </el-tree>
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
          </el-tab-pane>
          <!-- <el-tab-pane label="流程设计">
            <panel></panel>
          </el-tab-pane> -->
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
// import panel from '../flowTool/panel'

// import {mapState, mapGetters} from 'vuex'
export default {
  name: 'indexAdd',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid
    // panel
  },
  data () {
    // 排序码校验
    var validateSort = (rule, value, callback) => {
      let reg = '^[0-9]*$'
      // console.log(typeof value)
      // console.log(typeof value)
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
        FormId: [
          { required: true, trigger: 'change', message: '请选择表单' }
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
      defaultCheckedMember: [],
      deptList: [],
      fromList: [],
      disabled: false,

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
    },
    ruleForm: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
  },
  methods: {
    // 触发事件
    handleClose () {
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmDialog () {
      // console.log(this.$refs.department.getCheckedKeys(true))
      let agrJson = {
        type: 'add'
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
            console.log(this.defaultCheckedMember)
            agrJson.memberList = this.defaultCheckedMember
            // console.log(agrJson.memberList.length)
            if (agrJson.memberList.length === 0) {
              this.$message({
                message: '指定人员不能为空!',
                type: 'warning'
              })
              this.disabled = false
              return false
            }
          }

          this.fromList.forEach(item => {
            if (this.ruleForm.FormId == item.Id) {
              agrJson.fromType = item.TypeId
            }
          })
          
          this.$emit('confirmDialog', agrJson)      
        } else {
          this.disabled = false
          console.log('error submit!!')
          return false
        }
      })
      
      // return false
    },
    // 清空校验
    resetForm (formName) {
      this.$refs[formName].clearValidate()
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
    // 获取表单列表
    ListBySchoolId (SchoolId) {
      this.$store.dispatch('form/ListBySchoolId', {'schoolId': SchoolId}).then(res => {
          console.log(JSON.parse(res))
          let dataJson = JSON.parse(res)
            // console.log(SchoolId)
          if (dataJson.Code == 200) {
            this.fromList = dataJson.Data
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
        if (dataJson.Code == 200) {
          this.memberArr = dataJson.Data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 初始化弹窗
    getDetail () {
      this.$nextTick(() => {
        this.defaultCheckedMember = []
        this.memberArr = []
        this.deptList = []        
        this.disabled = false

        this.resetForm('ruleForm')
        this.DeptListBySchoolId(this.ruleForm.SchoolId)
        this.ListBySchoolId(this.ruleForm.SchoolId)
      })
      // if (this.editForm.AuthorizeType == 1) {
      // } 
    },
    tabClick () {}
  }
}
</script>
<style lang="scss" scoped>
.select-width{
  width: 100%;
}
.flow-add{
  .dialog-body{
    height: 400px;
    overflow: auto;
    padding: 0!important;
  }
}
</style>
