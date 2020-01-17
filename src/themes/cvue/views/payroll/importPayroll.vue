<template>
  <div class="import-payroll">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="导入工资"
      :isShowFoot="true"
      dialogWidth="600px"
      :isShowPreview="true"
      @preview="handlePreview"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
    >
      <div class="dialog-body" slot="dialogBody" style="padding: 0;">
        <el-tabs type="border-card" class="tabs-card">
          <div class="information">
            <el-form ref="form" label-width="120px" :model="form" :rules="rules">
              <el-form-item label="选择工资月份" prop="value">
                <el-date-picker
                  v-model="form.value"
                  type="month"
                  placeholder="请选择年月"
                  value-format="yyyy-MM"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="选择模板">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  :action="actionUrl"
                  :before-upload="handleBeforeupload"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :on-change="handleChange"
                  :limit="1"
                  :headers="token"
                  :file-list="fileList"
                  name="MS_HttpContext"
                  :http-request="uploadSectionFile"
                  :auto-upload="false"
                  accept=".xls, .xlsx"
                >
                  <el-button type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">上传文件不能超过30M</div>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
        </el-tabs>
      </div>
    </cvue-dialog>
    <preview-payroll
      @closeDialog="closeDialogPre('preview')"
      @confirmDialog="confirmDialogPre('preview')"
      @handleClose="closeDialogPre('preview')"
      :dialogVisible="dialogVisiblePreview"
    ></preview-payroll>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import previewPayroll from './previewPayroll'
import axios from '@/api/axios'
import {Encrypt} from '@/util/crypto'
export default {
  name: 'SchoolOrderDetail',
  components: {
    cvueDialog,
    cvueTable,
    previewPayroll
  },
  data () {
    return {
      form: {
        value: ''
      },
      dialogVisiblePreview: false,
      fileList: [],
      actionUrl: 'http://srv.xueerqin.net/api-oa-salary/api/TeachSalary/AddTeachSalaryFile',
      excelData: [],
      buttonType: '',
      rules: {
        value: [
          { required: true, message: '请选择工资月份', trigger: 'blur' }
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
  computed: {
    ...mapGetters(['cookiesObj', 'cookieStart']),
    fileParams () {
      var params =
      {
        groupId: this.$parent.importId,
        monthTime: this.form.value
      }
      return {
        data: JSON.stringify(params)
      }
    },
    token () {
      var token = {
        loginName: this.cookieStart.loginName,
        roleCode: this.cookieStart.roleCode,
        Token: this.cookieStart.Token,
        sign : Encrypt(new Date().getTime())
      }
      return token
    }
  },
  mounted () {
  },
  methods: {
    getDetail () {
      this.form.value = ''
      this.fileList = []
    },
    // 触发事件
    handleClose () {
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmDialog () {
      if (this.form.value == '') {
        this.$message({ message: '请选择工资月份', type: 'error' })
        return
      }
      // console.log(this.fileList)
      if (this.fileList.length == 0) {
        this.$message({ message: '请上传文件', type: 'error' })
        return
      }
      this.buttonType = 'confirm'
      this.$refs.upload.submit()
    },
    handlePreview () {
      // console.log(this.fileList)
      if (this.fileList.length == 0) {
        this.$message({ message: '请上传文件', type: 'error' })
        return
      }
      this.buttonType = 'preview'
      this.$refs.upload.submit()
    },
    // 关闭弹窗
    closeDialogPre (params) {
      if (params == 'preview') {
        this.dialogVisiblePreview = false
      }
    },
    // 确认
    confirmDialogPre (params) {
      if (params == 'preview') {
        this.dialogVisiblePreview = false
      }
    },
    handleFileChange (file, fileList) {
      // console.log(file)
    },
    handleChange (file, fileList) {
      // console.log(file,fileList)
      this.fileList = fileList
    },
    // 上传前
    handleBeforeupload (file) {
      // console.log(file)
      var m = (file.size / (1024 * 1024)).toFixed(2)
      if (m > 30) {
        this.$message({ message: '最大限制30M', type: 'error' })
        return false
      }
      // console.log(file.name.indexOf('.xlsx') < 0)
      if (file.name.indexOf('.xls') < 0 && file.name.indexOf('.xlsx') < 0) {
        this.$message({ message: '上传文件格式错误', type: 'error' })
        return false
      }
      return true
    },
    // 成功
    handleSuccess (response, file, fileList) {
      // console.log(response)
      // this.excelData = .
      var result = JSON.parse(response)
      this.excelData = result.Data
      this.dialogVisiblePreview = true
      console.log(this.excelData)
      if (result.Code == '200') {
        this.fileData = result.Data
        // console.log(this.fileData)
        this.$message({ message: '上传成功', duration: 2000, type: 'success' })
      } else {
        this.$message({ message: '上传失败', duration: 2000, type: 'error' })
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    beforeRemove (file, fileList) {
      // console.log(file)
      var m = (file.size / (1024 * 1024)).toFixed(2)
      if (m > 30) {
        return true
      } else {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    uploadSectionFile: function (param) { // 自定义文件上传
      var fileObj = param.file
      // formDataCheck 对象
      var formDataCheck = new FormData()
      formDataCheck.append('MS_HttpContext', fileObj)
      let data = {
        groupId: this.$parent.importId,
        monthTime: this.form.value
      }
      formDataCheck.append('data', JSON.stringify(data))
      // FormData 对象
      var formData = new FormData()
      formData.append('MS_HttpContext', fileObj)
      var params =
      {
        groupId: this.$parent.importId,
        monthTime: this.form.value
      }
      formData.append('data', JSON.stringify(params))
      // console.log(formData)
      if (this.buttonType == 'confirm') {
        // 获取是否存在历史数据
        let paramsObj = {
          groupId: this.$parent.importId,
          monthTime: this.form.value
        }
        this.$store.dispatch('payroll/GetMonthHistory', paramsObj).then(res => {
          let result = JSON.parse(res)
          if (result.Code == '200' && result.Data) {
            this.$confirm('该月已有数据，是否覆盖?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 校验Excel上传人数
              this.$store.dispatch('payroll/CheckExcel', formDataCheck).then(resData => {
                var resultData = JSON.parse(resData)
                // console.log(resultData)
                if (resultData.Code == '200') {
                  // 附件上传
                  this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                    var resultDataChild = JSON.parse(resDataChild)
                    if (resultDataChild.Code == '200') {
                      this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                      this.$emit('confirmDialog')
                    } else {
                      this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                    }
                  }).catch(error => {
                    console.log(error)
                    this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                  })
                } else if (resultData.Code == '202') {
                  this.$confirm('表格中部分人员数据不在关联人员中,是否继续导入?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                      var resultDataChild = JSON.parse(resDataChild)
                      if (resultDataChild.Code == '200') {
                        this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                        this.$emit('confirmDialog')
                      } else {
                        this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                      }
                    }).catch(error => {
                      console.log(error)
                      this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消导入'
                    })
                  })
                } else if (resultData.Code == '203') {
                  this.$confirm('工资组部分关联人员没有数据，确认导入么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                      var resultDataChild = JSON.parse(resDataChild)
                      if (resultDataChild.Code == '200') {
                        this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                        this.$emit('confirmDialog')
                      } else {
                        this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                      }
                    }).catch(error => {
                      console.log(error)
                      this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消导入'
                    })
                  })
                } else {
                  this.$message({ message: resultData.Msg, duration: 2000, type: 'error' })
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消覆盖'
              })
            })
          } else {
            // 校验Excel上传人数
            this.$store.dispatch('payroll/CheckExcel', formDataCheck).then(resData => {
              var resultData = JSON.parse(resData)
              // console.log(resultData)
              if (resultData.Code == '200') {
                // 附件上传
                this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                  var resultDataChild = JSON.parse(resDataChild)
                  if (resultDataChild.Code == '200') {
                    this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                    this.$emit('confirmDialog')
                  } else {
                    this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                  }
                }).catch(error => {
                  // console.log(error)
                  this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                })
              } else if (resultData.Code == '202') {
                this.$confirm('表格中部分人员数据不在关联人员中,是否继续导入?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                    var resultDataChild = JSON.parse(resDataChild)
                    if (resultDataChild.Code == '200') {
                      this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                      this.$emit('confirmDialog')
                    } else {
                      this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                    }
                  }).catch(error => {
                    console.log(error)
                    this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消导入'
                  })
                })
              } else if (resultData.Code == '203') {
                this.$confirm('工资组部分关联人员没有数据，确认导入么?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$store.dispatch('payroll/AddTeachSalaryFile', formData).then(resDataChild => {
                    var resultDataChild = JSON.parse(resDataChild)
                    if (resultDataChild.Code == '200') {
                      this.$message({ message: '上传成功', duration: 2000, type: 'success' })
                      this.$emit('confirmDialog')
                    } else {
                      this.$message({ message: resultDataChild.Msg, duration: 2000, type: 'error' })
                    }
                  }).catch(error => {
                    console.log(error)
                    this.$message({ message: '服务器错误', duration: 2000, type: 'error' })
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消导入'
                  })
                })
              } else {
                this.$message({ message: resultData.Msg, duration: 2000, type: 'error' })
              }
            })
          }
        })
      } else {
        this.$store.dispatch('payroll/ExcelFilePreview', formData).then(res => {
          var result = JSON.parse(res)
          if (result.Code == '200') {
            this.excelData = result.Data
            this.dialogVisiblePreview = true
          }
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.import-payroll {
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
  .file {
    padding-left: 20px;
    font-size: 15px;
    color: #409eff;
  }
}
</style>
