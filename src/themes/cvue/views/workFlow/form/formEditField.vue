<template>
  <div class="form-field-edit">
    <!-- 编辑弹窗formEdit -->
    <cvue-dialog :dialogVisible="dialogVisible"
              title="编辑表单字段"
              dialogWidth="600px"
              @handleOpen="getDetail"
              @closeDialog="closeDialog"
              @confirmDialog="confirmDialog"
              @handleClose="handleClose">
      <div class="dialog-body" slot="dialogBody">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="字段ID" prop="fieldName">
                <el-input v-model.trim="ruleForm.fieldName" placeholder="字段ID" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="字段名称" prop="showTitle">
                <el-input placeholder="字段名称" v-model="ruleForm.showTitle" @change="setTrim"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="字段类型" prop="fieldType">
                 <el-select placeholder="请选择" v-model="ruleForm.fieldType" class="select-width" @change="selectFieldType">
                    <el-option v-for="item in fieldOption" :key="item.type" :label="item.label" :value="item.type"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="最大长度" prop="maxLength">
                <el-input placeholder="最大长度" v-model.trim="ruleForm.maxLength"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>            
    </cvue-dialog>
  </div>
</template>
<script>
import cvueTreeGrid from '@/components/cvue-tree-grid'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import {validNum} from '@/util/validator.js'
export default {
  name: 'FormEditField',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid
  },
  data () {
    return {
      fieldOption: [
        {type:'string' , label: '字符串'},
        // {type:'float' , label: '浮点型'},
        // {type:'int' , label: '数字'},
        // {type:'datetime' , label: '日期'}
      ],
      ruleForm: {
        fieldName: '',
        showTitle: '',
        fieldType: '',
        maxLength: ''
      },
      rules: {
        fieldName: [
          { required: true, message: '请输入字段ID', trigger: 'blur' },
        ],
        showTitle: [
          { required: true, message: '请输入字段名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        fieldType: [
          { required: true, message: '请输入字段类型', trigger: 'blur' },
        ],
        maxLength: [
          { required: true, trigger: 'blur', validator: validNum }
        ]
      },
      disabled: true,
      dialogLoading: false
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
    selectFieldType (val) {
      console.log(val)
    },
    // 触发事件
    handleClose () {
      this.$emit('handleSecClose')
    },
    closeDialog () {
      this.$emit('closeSecDialog')
    },
    confirmDialog () {
      // 扁平化树数组
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.$parent.action == 'add') {
            this.dialogLoading = true
            var params = {
              tableId: this.$parent.tableId,
              fieldName: this.ruleForm.fieldName,
              showTitle: this.ruleForm.showTitle ? this.ruleForm.showTitle.trim() : this.ruleForm.showTitle,
              fieldType: this.ruleForm.fieldType,
              maxLength: this.ruleForm.maxLength
            }
            // console.log(params)
            var paramsNew = {
              data: JSON.stringify(params)
            }
            // console.log(paramsNew)
            this.$store.dispatch('form/AddFormField', paramsNew).then(res => {
              var result = JSON.parse(res)
              // console.log(result)
              if (result.Code == '200') {
                this.$message({
                  message: result.Msg,
                  duration: 2000,
                  type: 'success'
                })
                this.$emit('confirmSecDialog')
              } else {
                this.$message({
                  message: result.Msg,
                  duration: 2000,
                  type: 'error'
                })
              }
              this.dialogLoading = false
            })
          } else {
            this.dialogLoading = true
            var params = {
              _id: this.$parent.tableFieldData[0].Id,
              tableId: this.$parent.tableId,
              fieldName: this.ruleForm.fieldName,
              showTitle: this.ruleForm.showTitle,
              fieldType: this.ruleForm.fieldType,
              maxLength: this.ruleForm.maxLength
            }
            // console.log(params)
            var paramsNew = {
              data: JSON.stringify(params)
            }
            // console.log(paramsNew)
            this.$store.dispatch('form/UpdateFormField', paramsNew).then(res => {
              var result = JSON.parse(res)
              console.log(result)
              if (result.Code == '200') {
                this.$message({
                  message: result.Msg,
                  duration: 2000,
                  type: 'success'
                })
                this.$emit('confirmSecDialog')
              } else {
                this.$message({
                  message: result.Msg,
                  duration: 2000,
                  type: 'error'
                })
              }
              this.dialogLoading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 初始化弹窗
    getDetail () {
      this.$nextTick(res => {
        this.$refs['ruleForm'].clearValidate()
        this.$refs['ruleForm'].resetFields()
        this.ruleForm.fieldName = this.generateUUID()
        if(this.$parent.action=='edit'){
          console.log()
          this.ruleForm = {
            fieldName: this.$parent.tableFieldData[0].FieldName,
            showTitle: this.$parent.tableFieldData[0].ShowTitle,
            fieldType: this.$parent.tableFieldData[0].FieldType,
            maxLength: this.$parent.tableFieldData[0].MaxLength
          }
        }
      })
    },
    setTrim () {
      this.ruleForm.showTitle = this.ruleForm.showTitle.trim()
    } 
  }
}
</script>
<style lang="scss" scoped>
.select-width{
  width: 100%;
}
.form-field-edit{
  .dialog-body{
      height: 300px;
      overflow: auto;
  }
}
</style>
