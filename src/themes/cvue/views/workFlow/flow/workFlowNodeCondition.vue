<template>
  <div class="node-con">
    <!-- 新增弹窗 -->
    <cvue-dialog  :dialogVisible="dialogVisible"
              title="节点条件"
              dialogWidth="600px"
              :btnDisabled="disabled"
              :open="getDetail"
              @handleOpen="getDetail"
              @closeDialog="closeDialog"
              @confirmDialog="confirmDialog"
              @handleClose="handleClose"
              
              :appendToBody = "true"
      >
      <div class="dialog-body" slot="dialogBody">
        <div style="padding:20px">
          <el-form :model="editJson" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="选择字段" prop="ConditionFieldName">
                  <el-select placeholder="请选择" v-model="editJson.ConditionFieldName" class="select-width">
                    <el-option v-for="(item,index) in formField" :key="index" :label="item.ShowTitle" :value="item.FieldName"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="条件" prop="ConditionOperation">
                  <el-select placeholder="请选择" v-model="editJson.ConditionOperation" class="select-width">
                    <el-option v-for="(item,index) in stringConditionType" :key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="值" prop="ConditionValue">
                  <el-input v-model.trim="editJson.ConditionValue" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>  

        </div></div>            
    </cvue-dialog>
  </div>
</template>
<script>
import cvueTreeGrid from '@/components/cvue-tree-grid'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import {validPhone, validIp} from '@/util/validator.js'

// import {mapState, mapGetters} from 'vuex'
export default {
  name: 'indexAdd',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid
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
        ConditionFieldName: [
          { required: true, message: '请选择字段', trigger: 'blur' }
          // { required: true, message: '请输入用户名', trigger: 'blur' },
          // { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ],
        ConditionOperation: [
          { required: true, message: '请选择节点条件选项', trigger: 'blur' }
        ],
        ConditionValue: [
          { required: true, message: '请输入值', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ]
      },
      nodeCondition: {
        conditionFieldName: '',
        conditionOperation: '包含',
        conditionValue: ''
      },
      stringConditionType: [
        '包含',
        '不包含',
        '等于'
      ],
      formField: [],
      // fromList: [],
      disabled: false
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // nodeForm: {
    //   type: Object,
    //   default: () => {}
    // },
    editJson: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
  },
  methods: {
    // 触发事件
    handleClose () {
      // this.$refs['ruleForm'].clearValidate()
      // this.$refs['ruleForm'].resetFields()
      this.$emit('handleConClose')
    },
    closeDialog () {
      // this.$refs['ruleForm'].clearValidate()
      // this.$refs['ruleForm'].resetFields()
      this.$emit('closeConDialog')
    },
    confirmDialog () {
      this.disabled = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let paramsJ = {
            conditionFieldName: this.editJson.ConditionFieldName,
            conditionOperation: this.editJson.ConditionOperation,
            conditionValue: this.editJson.ConditionValue,
            tableId: localStorage.getItem('nodeFormId')
          }
          this.formField.forEach(item => {
            if (item.FieldName == paramsJ.conditionFieldName) {
              paramsJ.conditionFieldType = item.FieldType
              paramsJ.showFieldName = item.ShowTitle
            }
          })
          if (this.editJson.Id) {
            paramsJ._id = this.editJson.Id
            paramsJ.paramsType = 'edit'
          }
          // console.log(paramsJ)
          // return false
          this.$emit('confirmConDialog', paramsJ)
        } else {
          console.log('error submit!!')
          
          this.disabled = false
          return false
        }
      }) 
    },
    
    // 获取表单字段
    ListByTableIdFormField (id) {
      this.$store.dispatch('form/ListByTableIdFormField', {tableId: id}).then(res => {
        console.log(JSON.parse(res))
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          this.formField = dataJson.Data
        }
      })
    },
    // 初始化弹窗
    getDetail () {
      this.$refs.ruleForm.clearValidate()
      this.ListByTableIdFormField(localStorage.getItem('nodeFormId'))
    },
    tabClick () {}
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
