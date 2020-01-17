<template>
  <div class="add-sub">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="创建学科"
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
            <el-form ref="form" label-width="80px" v-loading="loading">
              <el-form-item label="归属学校">
                <el-input type="input" v-model="schoolName" readonly></el-input>
                <!-- <el-select
                  v-model="schoolId"
                  placeholder="请选择归属学校"
                  size="mini"
                  @change="getSchoolId"
                >
                  <el-option
                    v-for="item in schoolList"
                    :key="item.schoolId"
                    :value="item.schoolId"
                    :label="item.schoolName"
                  ></el-option>
                </el-select>-->
              </el-form-item>
              <el-form-item label="学科名称">
                <el-select
                  v-model="subjectId"
                  placeholder="请选择学科"
                  size="mini"
                  @change="getSubjectId"
                >
                  <el-option
                    v-for="item in subjectList"
                    :key="item.subjectId"
                    :value="item.subjectId"
                    :label="item.subjectName"
                  ></el-option>
                </el-select>
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
      schoolList: [],
      subjectList: [],
      schoolId: '',
      subjectId: '',
      subjectName: '',
      schoolName: '',
      loading: true
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    // this.getSchoolList()
    this.schoolName = this.$parent.schoolName
    this.schoolId = this.$parent.schoolId
    this.getSubjectList(this.schoolId)
  },
  methods: {
    getDetail () {
      this.subjectId = ''
    },
    // 获取学科id
    getSubjectId (id) {
      this.subjectId = id
      let subjectObj = this.subjectList.find(v => v.subjectId === id)
      this.subjectName = subjectObj.subjectName
    },
    // 获取学科列表，不分页
    getSubjectList (id) {
      var params = {
        schoolId: id
      }
      this.$store.dispatch('subjectManage/SubjectListNoPage', params).then(res => {
        const { data, status } = res
        if (status === 200) {
          this.subjectList = data
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 触发事件
    handleClose () {
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmDialog () {
      let params = {
        subjectName: this.subjectName,
        schoolId: this.schoolId,
        schoolName: this.schoolName
      }
      this.$store.dispatch('subjectManage/AddSubject', params).then(res => {
        const { msg, status } = res
        if (status === 200) {
          this.$message.success(msg)
          this.$emit('confirmDialog')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang='scss'>
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
  //   图片上传
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border-radius: 100px;
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
