<template>
  <div class="add-sub">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="添加工资组"
      :isShowFoot="true"
      dialogWidth="600px"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
    >
      <div class="dialog-body" slot="dialogBody" style="padding: 0;">
        <el-tabs type="border-card" class="tabs-card">
          <div class="information">
            <el-form ref="form" label-width="80px" :model="form" :rules="rules">
              <el-form-item label="工资组" prop="Name">
                <el-input type="input" v-model.trim="form.Name" placeholder="请输入工资组名称"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tabs>
      </div>
    </cvue-dialog>
  </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
export default {
  name: 'SchoolOrderDetail',
  components: {
    cvueDialog,
    cvueTable
  },
  data () {
    return {
      form: {
        Name: ''
      },
      rules: {
        Name: [
          { required: true, message: '工资组名称不能为空', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
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
    getDetail () {
      this.form.Name = ''
    },
    // 触发事件
    handleClose () {
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      this.$emit('closeDialog')
    },
    confirmDialog () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            Name: this.form.Name,
            schoolId: this.$parent.schoolId,
            RelevantNumber: 0
          }
          this.$store.dispatch('payroll/AddTeachSalaryGroup', params).then(res => {
            let result = JSON.parse(res)
            if (result.Code === 200) {
              this.$message.success('添加成功')
              this.$emit('confirmDialog')
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.add-sub {
  .el-dialog__body {
    height: 300px;
    overflow: auto;
  }
  .el-dialog {
    width: 600px !important;
  }
  .tabs-card {
    border-bottom: none;
    box-shadow: none;
  }
  .information {
    margin-left: 60px;
    overflow: hidden;
    margin-top: 20px;
  }
  .upPhoto {
    float: left;
    width: 100px;
    text-align: center;
  }
  .upPhoto h2 {
    font-size: 16px;
    margin-top: 8px;
  }
  .personDetail {
    float: left;
    margin-left: 20px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  //  表单
  .inputWidth {
    width: 340px;
  }
}
</style>
