<template>
  <div class="edit">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="编辑通知公告"
      :isShowFoot="true"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
    >
      <div class="dialog-body" slot="dialogBody" style="padding: 0;">
        <el-tabs type="border-card" class="tabs-card">
          <div class="information">
            <el-form :label-position="labelPosition" label-width="110px" :model="ruleForm">
              <el-form-item label="公告标题:" prop="title">
                <el-input v-model.trim="ruleForm.title"></el-input>
              </el-form-item>
              <el-form-item label="通知公告内容:" class="postContent" prop="postContent">
                <el-upload
                  class="upload-demo"
                  :action="actionUrl"
                  :on-success="handleSuccess"
                  :on-change="handleFileChange"
                  :before-upload="handleBeforeupload"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :headers="token"
                  :data="fileParams"
                  :file-list="fileList"
                >
                  <el-button size="small" type="primary">上传附件</el-button>
                  <div slot="tip" class="el-upload__tip">
                    <i class="el-icon-warning-outline"></i>上传文件不能超过30M,文件名称不能包含特殊字符如( , )
                  </div>
                  <div slot="tip" class="el-upload__tip">
                    <i class="el-icon-warning-outline"></i>上传文件只支持png、jpg、jpeg、mp3、mp4、doc、docx、xls、xlsx、ppt、pptx、pdf、txt、rar、zip格式
                  </div>
                </el-upload>
                <quill-editor
                  class="ql-editor"
                  v-model="ruleForm.postContent"
                  :options="editorOption"
                  ref="myQuillEditor"
                  style="padding:0"
                ></quill-editor>
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
import { quillEditor } from 'vue-quill-editor'
import { mapState, mapGetters } from 'vuex'
import { uploadUrl } from '@/config/config'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { Encrypt } from '@/util/crypto'
export default {
  name: 'SchoolOrderDetail',
  components: {
    cvueDialog,
    cvueTable,
    quillEditor
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    ...mapGetters(['cookiesObj', 'cookieStart']),
    token () {
      var token = {
        loginName: this.cookieStart.loginName,
        roleCode: this.cookieStart.roleCode,
        Token: this.cookieStart.Token,
        sign: Encrypt(new Date().getTime())
      }
      return token
    },
    fileParams () {
      return {
        fileName: '',
        dir: '',
        id: this.uuid
      }
    }
  },
  data () {
    return {
      labelPosition: 'left',
      fileList: [],
      actionUrl: uploadUrl,
      // noticefiles: '',
      // noticeFileNames: '',
      fileData: [],
      ruleForm: {
        title: '',
        postContent: ''
      },
      // rules: {
      //   title: [
      //     { required: true, message: '公告标题不能为空', trigger: 'blur' }
      //   ],
      //   postContent: [
      //     { required: true, message: '公告内容不能为空', trigger: 'blur' }
      //   ]
      // },
      editorOption: {
        // some quill options
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'], // 引用，代码块

            [{ 'header': 1 }, { 'header': 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
            [{ 'script': 'sub' }, { 'script': 'super' }], // 上下标
            [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
            [{ 'direction': 'rtl' }], // 文本方向

            [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 几级标题

            [{ 'color': [] }, { 'background': [] }], // 字体颜色，字体背景颜色
            [{ 'font': [] }], // 字体
            [{ 'align': [] }], // 对齐方式

            ['clean'] // 清除字体样式
            // ['image'] // 上传图片、上传视频
          ]
        }
      },
      fileListNew: []
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
    // 编辑器方法
    // onEditorBlur (quill) {
    //   console.log('editor blur!', quill)
    // },
    // onEditorFocus (quill) {
    //   console.log('editor focus!', quill)
    // },
    // onEditorReady (quill) {
    //   console.log('editor ready!', quill)
    // },
    getDetail () {
      let params = {
        id: this.$parent.editId,
        type: 'edit'
      }
      let paramsNew = {
        data: JSON.stringify(params)
      }
      this.$store.dispatch('notice/EditNotice', paramsNew).then(res => {
        let result = JSON.parse(res)
        if (result.Code === 200) {
          let msg = JSON.parse(result.Msg)
          this.ruleForm.title = msg.Title
          this.ruleForm.postContent = msg.Content
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
            this.fileListNew = arr
          } else {
            this.fileList = []
          }
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
    handleFileChange (file, fileList) {
      // console.log(file)
    },
    // 上传前
    handleBeforeupload (file) {
      this.uuid = this.generateUUID()
      var pattern = /(\.jpg)|(\.png)|(\.jpeg)|(\.mp3)|(\.mp4)|(\.doc)|(\.docx)|(\.xls)|(\.xlsx)|(\.ppt)|(\.pptx)|(\.pdf)|(\.txt)|(\.rar)|(\.zip)/ig
      if (!pattern.test(file.name)) {
        this.$message({ message: '上传文件只支持png、jpg、jpeg、mp3、mp4、doc、docx、xls、xlsx、ppt、pptx、pdf、txt、rar、zip格式', type: 'error' })
        return false
      }
      var m = (file.size / (1024 * 1024)).toFixed(2)
      if (m > 30) {
        this.$message({ message: '最大限制30M', type: 'error' })
        return false
      }
      return true
    },
    // 成功
    handleSuccess (response, file, fileList) {
      var result = JSON.parse(response)
      if (result.Code == '200') {
        this.fileListNew = fileList
        this.$message({ message: '上传成功', duration: 2000, type: 'success' })
      } else {
        this.$message({ message: '上传失败', duration: 2000, type: 'error' })
      }
    },
    handleRemove (file, fileList) {
      this.fileListNew = fileList
      // var params = {
      //   id: file.id
      // }
      // this.$store.dispatch('email/DelMailReceiving', params).then(res => {
      //   var result = JSON.parse(res)
      //   if (result.Code == '200') {
      //     if (result.Msg != 'no') {
      //       this.$message({ message: '删除成功', duration: 2000, type: 'success' })
      //     }
      //   }
      // })
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
    confirmDialog () {
      if (this.ruleForm.title == '') {
        this.$message.error('请输入公告标题')
        return false
      }
      if (!this.ruleForm.postContent.length) {
        this.$message.error('请输入公告内容')
        return false
      }
      let noticefiles = ''
      let noticeFileNames = ''
      for (let i = 0; i < this.fileListNew.length; i++) {
        if (this.fileListNew[i].response) {
          noticefiles += 'http://' + JSON.parse(this.fileListNew[i].response).Data.fileUrl + ','
          noticeFileNames += JSON.parse(this.fileListNew[i].response).Data.fileName + ','
        } else {
          noticefiles += this.fileListNew[i].url + ','
          noticeFileNames += this.fileListNew[i].name + ','
        }
      }
      noticefiles = noticefiles.substr(0, noticefiles.length - 1)
      noticeFileNames = noticeFileNames.substr(0, noticeFileNames.length - 1)
      let params = {
        id: this.$parent.editId,
        type: 'save',
        title: this.ruleForm.title,
        content: encodeURI(this.ruleForm.postContent),
        noticefiles: noticefiles,
        noticeFileNames: noticeFileNames
      }
      let paramsNew = {
        data: JSON.stringify(params)
      }
      this.$store.dispatch('notice/EditNotice', paramsNew).then(res => {
        let result = JSON.parse(res)
        if (result.Code === 200) {
          let msg = JSON.parse(result.Msg)
          // console.log(msg)
          this.$message.success('修改成功')
          this.$emit('confirmDialog')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang='scss' scope>
.edit {
  .el-dialog__body {
    height: 550px;
    // overflow: auto;
  }
  .el-dialog {
    width: 900px !important;
    // height: 1200px;
  }
  // .upload-demo {
  //   width: 698px;
  // }
  .el-tabs--border-card > .el-tabs__content {
    padding: 10px 15px 0;
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
  // .inputWidth {
  //   width: 340px;
  // }
  // .el-tabs__content {
  //   overflow: auto;
  // }
  .cvue-dialog .dialog-height {
    // height: 1200px;
  }
  .postContent {
    height: 460px;
    overflow: auto;
  }
  .el-upload__tip {
    margin-top: 0;
    i {
      color: #409eff;
    }
  }
  .ql-toolbar.ql-snow + .ql-container.ql-snow {
    border-top: 0px;
    height: 250px;
  }
}
</style>
