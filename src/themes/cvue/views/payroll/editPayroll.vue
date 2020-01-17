<template>
  <div class="edit-payroll">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="编辑工资组"
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
          { required: true, message: '工资组名称不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: ['blur', 'change'] }
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
      console.log(this.$parent.editRow)
      this.form.Name = this.$parent.editRow.Name
    },
    // 触发事件
    handleClose () {
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmDialog () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let TeachIds = this.$parent.editRow.TeachIds == null ? '' : this.$parent.editRow.TeachIds
          let TeachNames = this.$parent.editRow.TeachNames == null ? '' : this.$parent.editRow.TeachNames
          let TeachPhones = this.$parent.editRow.TeachPhones == null ? '' : this.$parent.editRow.TeachPhones
          let params = {
            Id: this.$parent.editRow.Id,
            Name: this.form.Name,
            TeachIds: TeachIds,
            TeachNames: TeachNames,
            schoolId: this.$parent.schoolId,
            RelevantNumber: this.$parent.editRow.RelevantNumber,
            TeachPhones: TeachPhones
          }
          this.$store.dispatch('payroll/EditTeachSalaryGroup', params).then(res => {
            let result = JSON.parse(res)
            console.log(result)
            if (result.Code === 200) {
              this.$message.success('修改成功')
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
.edit-payroll {
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
