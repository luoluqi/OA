<template>
  <div class="">
    <!-- 详情 -->
    <cvue-dialog 
      :dialogVisible="dialogVisible"
      title="编辑文件"
      :isShowFoot="true"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
    >
      <div class="dialog-body" slot="dialogBody" style="padding: 0;">
        <el-tabs type="border-card" class="tabs-card">
          <div class="information">
            <el-form :label-position="labelPosition" label-width="110px">
              <el-form-item label="文件名称:" prop="title">
                <el-input v-model="fileName"  maxlength="30"></el-input>
              </el-form-item>
              <el-form-item label="序号:" prop="title">
                <el-input-number v-model="orderNum" :precision='0' :min="1" :max="10000000" label="描述文字"></el-input-number>
              </el-form-item>
              <el-form-item label="附件:" prop="title">
                <upload :fileList='attachListCopy'
                myRef='publicUpload'
                :isPublicFile="true"
                  @success='handleSuccess'
                  @remove='handleRemove'></upload>
               
              </el-form-item>

              <el-form-item label="内容:" class="postContent" prop="postContent">
                <div style="padding-bottom:60px;">
                     <quill-editor
                    v-model="content"
                    :options="editorOption"
                    ref="myQuillEditor"
                    style="height:300px;"
                    ></quill-editor>
                </div>
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {addFile, editFile, uploadFile, uploadAttachment, delAttachment} from '@/api/publicFileApi'
import {mapGetters} from 'vuex'
import upload from '@/components/upload'
export default {
  name: 'SchoolOrderDetail',
  components: {
    cvueDialog,
    cvueTable,
    quillEditor,
    upload
  },

  computed: {
        ...mapGetters(['cookiesObj']),
    editor () {
      return this.$refs.myQuillEditor.quill
    },
     remainSize(){
          return this.$store.state.file.remainSize
        }
  },
  data () {
    return {
      labelPosition: 'left',
      fileId:'',
      fileName:'',
      orderNum:'',
      content:'',
      attachList: [],
      attachListCopy:[],
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
      }
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type:{
        type:String,
         default: 'add'
    }
  },
  mounted () {
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
         this.attachList = []
        if(this.type == "add"){
             this.fileName = ''
             this.orderNum = ''
            this.content = ''
            this.attachListCopy = []
        }else if(this.type == 'edit'){
            
            var curFile = this.$store.state.file.curFile
             this.fileName = curFile.Name
             this.orderNum = curFile.OrderNum
            this.content = curFile.Content
            this.fileId = curFile.Id
            
          
            for(var item of curFile.attach){
              this.attachList.push({
                fileName:item.AttachmentFileName,
                name:item.AttachmentFileName,
                size:item.AttachmentFileSize,
                url:item.AttachmentFileUrl,
                fileUrl:item.AttachmentFileUrl,
                id:item.Id
              })
            }
            this.attachListCopy = [].concat(this.attachList)
           
        }
    },
    // 触发事件
    handleClose () {
      this.$emit('handleClose')
      this.$store.dispatch('file/getFolder', this.$store.state.file.curRoot)
        this.$store.state.file.publicUpload.abort()
    },
    closeDialog () {
      this.$emit('closeDialog')
      this.$store.dispatch('file/getFolder', this.$store.state.file.curRoot)
        this.$store.state.file.publicUpload.abort()
    },
    confirmDialog () {
      
      if (!this.fileName) {
        this.$message.error('请输入文件名称')
        return 
      }
      if (!this.orderNum) {
        this.$message.error('请输入序号')
        return 
      }
      if (!this.content) {
        this.$message.error('请输入内容')
        return 
      }
      
     this.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
          this.$store.state.file.publicUpload.abort()
     if(this.type == "add"){
         addFile({
           SchoolId:this.cookiesObj.schoolId,
          CreatingUserId:this.cookiesObj.loginUserId,
          FolderId:this.$store.state.file.folderId,
          FolderType: 1,
          Name:this.fileName,
          Content:this.content,
          OrderNum:this.orderNum
        }).then(res => {
            
            res = JSON.parse(res)
            if(res.Code == 200){
                
                var id = res.Data.Id
                this.uploadAttach(id)
               
                this.$message.success('添加成功')
               
            }else{
                this.$message.error(res.Msg)
            }
            
        })
     }else if(this.type == 'edit'){
           editFile({
               Id:this.fileId,
                FolderId:this.$store.state.file.folderId,
                FolderType: 1,
               Name:this.fileName,
               Content:this.content,
               OrderNum:this.orderNum
           }).then(res => {
                res = JSON.parse(res)
                if(res.Code == 200){
                  var id = this.$store.state.file.curFile.Id
                    this.editAttach(id)

                    this.$message.success('修改成功')
                }else{
                    this.$message.error(res.Msg)
                }
           })
     }
     
    },
    editAttach (id) {
      
      var ids = this.attachListCopy.map(item => item.id)
       delAttachment({
              data:JSON.stringify({ids:ids.join()})
            }).then(d => {
              this.uploadAttach(id)
            })
      
    },
    handleSuccess(file){
      console.log(file)
     this.attachList.push(file)
    },
    handleRemove(file){
      for(var i = 0;i<this.attachList.length;i++){
        if(this.attachList[i].url == file.url){
          this.attachList.splice(i,1)
        }
      }
     
    },
    uploadAttach(id){

        var aList = []
        for(var item of this.attachList){
          aList.push({
            PublicFileId:id,
            AttachmentFileName:item.fileName,
            AttachmentFileUrl:item.fileUrl,
            AttachmentFileSize:item.size
          })
        }
        if(aList.length == 0){
            this.$emit('confirmDialog')
            this.loading.close()
             this.$store.dispatch('file/getFolder', this.$store.state.file.curRoot)
        }else{
            console.log(aList)
            uploadAttachment(aList).then(d => {
              this.$emit('confirmDialog')
              this.loading.close()

              this.$store.dispatch('file/getFolder', this.$store.state.file.curRoot)
             
            })
        }
    }
  }
}
</script>
<style  scope>


</style>
