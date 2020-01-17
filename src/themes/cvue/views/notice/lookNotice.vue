<template>
  <div class="look-sub">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      :title="title"
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
        <el-tabs type="border-card" class="tabs-card">
          <div class="information ql-editor" v-html="content">{{ content }}</div>
          <div style="margin-top: 10px;" v-show="this.fileList.length">附件：</div>
          <el-upload
            class="upload-demo"
            :disabled="true"
            :action="actionUrl"
             :headers="token"
            :on-preview="handlePreview"
            :before-remove="beforeRemove"
            :file-list="fileList"
          >
            <!-- <el-button size="small" type="primary" :disabled="true">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传文件不能超过20M</div>-->
          </el-upload>
        </el-tabs>
      </div>
    </cvue-dialog>
  </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import { uploadUrl } from '@/config/config'
import { mapState, mapGetters } from 'vuex'
import {Encrypt} from '@/util/crypto'
import {getCookie} from '@/util/tool'
export default {
  name: 'SchoolOrderDetail',
  components: {
    cvueDialog,
    cvueTable
  },
  data () {
    return {
      title: '',
      content: '',
      actionUrl: uploadUrl,
      fileList: []
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
    token () {
      var token = {
        loginName: this.cookieStart.loginName,
        roleCode: this.cookieStart.roleCode,
        Token: this.cookieStart.Token
      }
      return token
    }
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
        id: this.$parent.editId,
        type: 'edit'
      }
      let paramsNew = {
        data: JSON.stringify(params)
      }
      this.$store.dispatch('notice/EditNotice', paramsNew).then(res => {
        let result = JSON.parse(res)
        // console.log(result)
        if (result.Code === 200) {
          let msg = JSON.parse(result.Msg)
          // console.log(JSON.parse(result.Msg))
          this.title = msg.Title
          this.content = msg.Content
          let NoticeFileNames = msg.NoticeFileNames.split(',')
          let NoticeFiles = msg.NoticeFiles.split(',')
          if (msg.NoticeFileNames && msg.NoticeFiles) {
            let arr = []
            for (var i = 0; i < NoticeFileNames.length; i++) {
              let obj = {}
              obj.name = NoticeFileNames[i]
              obj.url = NoticeFiles[i]
              arr.push(obj)
            }
            this.fileList = arr
          } else {
            this.fileList = []
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    beforeRemove () {
      return false
    },
    handlePreview (file) {
      // console.log(file)
      window.open(file.url)
      // console.log(file)
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
.look-sub {
  #dialogBody {
    height: 500px;
    overflow-y: auto;
  }
  .el-dialog__body {
    height: 500px;
    overflow: auto;
  }
  .el-dialog {
    width: 800px !important;
  }
  .tabs-card {
    border-bottom: none;
    box-shadow: none;
  }
  .el-dialog__title {
    width: 600px;
    display: inline-block;
    margin: auto;
    word-wrap: break-word;
  }
  .information {
    overflow: hidden;
    padding-top: 0px;
    p {
      text-indent: 2em;
    }
    img {
      width: 100%;
    }
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
