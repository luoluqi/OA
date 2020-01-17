<template>
  <div class="form-design-edit">
    <!-- 左侧树编辑弹窗 -->
    <cvue-dialog :dialogVisible="dialogVisible"
              :title="title"
              dialogWidth="600px"
              @handleOpen="getDetail"
              @closeDialog="closeDialog"
              @confirmDialog="confirmDialog"
              :btnDisabled="btnDisabled"
              @handleClose="handleClose">
      <div class="dialog-body" slot="dialogBody">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="类型名称" prop="name">
                <el-input v-model.trim="ruleForm.name" placeholder="类型名称" ref="name"></el-input>
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
import {validPhone, validIp} from '@/util/validator.js'
export default {
  name: 'FormDesignEdit',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid
  },
  data () {
    return {
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      disabled: true,
      dialogLoading: false,
      title: '添加',
      btnDisabled: false
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.getDetail()
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
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.btnDisabled = true
          this.dialogLoading = true
          var params = {
            _id: this.$parent.dialogStatus == 'edit' ? this.$parent.treeNodeData.id : '',
            name: this.ruleForm.name ? this.ruleForm.name.trim() : this.ruleForm.name,
            schoolId: this.$parent.cookiesObj.schoolId,
            parentId: this.$parent.dialogStatus == 'top' ? '' : this.$parent.treeNodeData.id,
            levelCode: 0,
            orderNum: 0
          }
          var paramsNew = {
            data: JSON.stringify(params)
          }
          this.$store.dispatch('form/SaveItemFormType', paramsNew).then(res => {
            var result = JSON.parse(res)
            console.log(result)
            if (result.Code == '200') {
              this.$message({
                message: result.Msg,
                duration: 2000,
                type: 'success'
              })
              this.$parent.treeEditData = {
                label: this.ruleForm.name,
                children: [],
                id: result.Data
              }
              this.$emit('confirmDialog')
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
        this.btnDisabled = false
        if (this.$parent.dialogStatus == 'edit') {
          this.title = '编辑'
          this.$set(this.ruleForm, 'name', this.$parent.treeNodeData.label)
        } else {
          this.$set(this.ruleForm, 'name', '')
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.select-width{
  width: 100%;
}
.form-design-edit{
  .dialog-body{
    height: 200px;
    overflow: auto;
  }
  .btn-list{
    float: right;
  }
}
</style>
