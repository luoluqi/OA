<template>
  <div class="read-notice">
    <!-- 详情 -->
    <cvue-dialog
      title="阅读情况"
      :dialogVisible="dialogVisible"
      :isShowFoot="false"
      dialogWidth="600px"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
    >
      <div
        class="dialog-body"
        ref="scroolBody"
        slot="dialogBody"
        style="padding: 0;"
        id="dialogBody"
      >
        <cvue-table
          :option="tableOption"
          :data="tableData"
          ref="tbl1"
          :isShowAdd="false"
          :loading="tableLoading"
        ></cvue-table>
        <cvue-table
          style="margin-top: 20px;"
          :option="noReadTableOption"
          :data="noReadTableData"
          ref="tbl1"
          :isShowAdd="false"
          :loading="tableLoading"
        ></cvue-table>
      </div>
    </cvue-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
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
      tableLoading: false,
      tableOption: {
        selected: false,
        stripe: true,
        width: '100%',
        border: true,
        index: true,
        cloumn: [
          { prop: 'Name', label: '已读通告教师', align: 'center' }
          // { prop: 'IsRead', label: '状态', align: 'center', slotStatus: true, width: '50px' },
          // { prop: 'AnnouncerName', label: '发布人', align: 'center' },
          // { prop: 'AnnounceTime', label: '发布时间', align: 'center' }
        ]
      },
      tableData: [],
      noReadTableOption: {
        selected: false,
        stripe: true,
        width: '100%',
        border: true,
        index: true,
        cloumn: [
          { prop: 'Name', label: '未读通告教师', align: 'center' }
          // { prop: 'IsRead', label: '状态', align: 'center', slotStatus: true, width: '50px' },
          // { prop: 'AnnouncerName', label: '发布人', align: 'center' },
          // { prop: 'AnnounceTime', label: '发布时间', align: 'center' }
        ]
      },
      noReadTableData: []
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['cookiesObj'])
  },
  mounted () {
  },
  methods: {
    getDetail () {
      this.$nextTick(() => {
        let box = this.$refs.scroolBody
        box.scrollTop = 0
      })
      let params = {
        schoolId: this.cookiesObj.schoolId,
        noticeId: this.$parent.readRow.Id
      }
      this.$store.dispatch('notice/GetReadTeacherList', params).then(res => {
        let result = JSON.parse(res)
        // console.log(result)
        if (result.Code == 200) {
          this.tableData = result.Data.HasReadList
          this.noReadTableData = result.Data.NoReadList
        }
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
      // this.$emit('confirmDialog')
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang='scss'>
.read-notice {
  #dialogBody {
    height: 600px;
    overflow-y: auto;
  }
  .el-dialog__body {
    height: 600px;
    overflow: auto;
    padding: 0 10px;
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
  .cvue-dialog .el-dialog__header {
    height: 20px;
    text-align: center;
    background-color: #5175ef;
  }
  .el-dialog__title {
    color: #fff;
    font-weight: 700;
    font-size: 20px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .el-button--primary:hover,
  .el-button--primary:focus,
  .el-button--primary {
    background-color: #5175ef;
  }
  .el-button--primary {
    background-color: #5175ef;
  }
  .cvue-dialog .dialog-height {
    height: 100%;
    overflow: auto;
  }
}
</style>
