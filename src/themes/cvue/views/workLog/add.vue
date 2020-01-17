<template>
  <div class="">
       <el-card style="margin:0 0 1rem 0;">
            <el-button @click="toBack" icon="el-icon-arrow-left" type="text">返回</el-button>
        </el-card>
    <!-- 详情 -->
        <el-card>
          <div class="information">
            <el-form :label-position="labelPosition" label-width="110px">
              <el-form-item label="标题:" prop="title">
                <el-input v-model="Title" maxlength="80"></el-input>
              </el-form-item>
              <el-form-item label="类型:" prop="title">
                <el-select v-model="TypeCode"  placeholder="请选择">
                    <el-option label="个人日志" value="0"> </el-option>
                    <el-option label="工作日志" value="1"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="附件:" prop="title">
                <div class="tree-p">
                  <upload :fileList='attachListCopy'
                  myRef='workLogUpload'
                  @success='handleSuccess'
                  @remove='handleRemove'></upload>
                </div>
              </el-form-item>
              <el-form-item v-show="TypeCode == '0'" label="共享:" prop="title">
                  <div class="tree-p">
                    <el-tag v-for="tag in selected" :key="tag.name" style="margin:0 1rem 0 0;" >
                      {{tag.name}}
                    </el-tag>
                    <div>
                      <el-button @click="selectMan" type="primary">添加共享人</el-button>
                    </div>
                  </div>
                  
              </el-form-item>
              <el-form-item label="内容:" class="postContent" prop="postContent">
                  <div style="padding-bottom:60px;">
                      <quill-editor
                    v-model="Content"
                    :options="editorOption"
                    ref="myQuillEditor"
                    style="height:300px;"
                    ></quill-editor>
                  </div>    
                     
               
              </el-form-item>
            </el-form>
          </div>
          <div class="btn-p">
              <el-button @click="confirm"  type="primary">确定</el-button>
            <el-button  @click="toBack" >取消</el-button>
          </div>
           
        </el-card>

<cvue-dialog v-if="treeVisible"
      :dialogVisible="treeVisible"
      title="选择共享人员"
      :isShowFoot="true"
      @closeDialog="closeSelectMan"
      @confirmDialog="confirmSelectMan"
      @handleClose="closeSelectMan"
    >
    <div class="dialog-body" slot="dialogBody" >
      <el-tree :data="treeData" 
                      :props="{
                          children: 'children',
                          label: 'name'
                        }" 
                        node-key="name"
                        :default-checked-keys="checkedKeys"
                        show-checkbox
                        :render-after-expand="false"
                        @check-change="handleCheckChange"
                    ></el-tree>
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
import {getTree} from '@/api/commonApi'
import {mapGetters} from 'vuex'
import {addWorkLog, editWorkLog, addAttach, delAttach, addShared, delShared} from '@/api/workLogApi'
import bus from '@/util/bus'
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
    }
  },
  data () {
    return {
      type: '',
      treeData: [], 
      selected: [],
      selectedPre: [],
      checkedKeys: [],
      TypeCode: '0',
      Title: '',
      Content: '',
      labelPosition: 'left',
      treeVisible: false,
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
   confirmSelectMan () {
     this.selected = [].concat(this.selectedPre)
   
      this.treeVisible = false
   },
   selectMan () {
     
     this.checkedKeys = []
     for (var item of this.selected) {
        this.checkedKeys.push(item.name)
     }
   this.treeVisible = true
   },
   closeSelectMan () {
     this.treeVisible = false
   },
    confirm () {

      if (!this.Title) {
        this.$message.error('请输入标题')
        return 
      }
       if (!this.TypeCode) {
        this.$message.error('请选择类型')
        return 
      }
     
      if (!this.Content) {
        this.$message.error('请输入内容')
        return 
      }
       this.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      if (this.type == 'add') {
         this.addWorkLog()
      } else if (this.type == 'edit') {
        this.editWorkLog()
      }
    },
    addWorkLog () {
       addWorkLog({
          CreatorUserId: this.cookiesObj.teacherId,
          CreatorUserName: decodeURI(this.cookiesObj.realName),
          Title: this.Title,
          TypeCode: this.TypeCode,
          Content: this.Content
        }).then(res => {
            res = JSON.parse(res)
            if(res.Code == 200){
                
                var id = res.Data.id
                this.addAttach(id).then(res => {
                  this.$message.success('添加成功')
                  this.toBack()
                })
                this.addShared(id)
            }else{
                this.$message.error(res.Msg)
            }  
            this.loading.close()
        })
    },
    editWorkLog () {
      var id = this.$store.state.workLog.workLogDetail.worklog.Id
      editWorkLog({
         Id: id,
          CreatorUserId: this.cookiesObj.teacherId,
          CreatorUserName: decodeURI(this.cookiesObj.realName),
          Title: this.Title,
          TypeCode: this.TypeCode,
          Content: this.Content
        }).then(res => {
            res = JSON.parse(res)
            if(res.Code == 200){
               
                this.updateAttach(id).then(() => {
                   this.toBack()
                    this.$message.success('修改成功')
                })
                this.updateShared(id)
               
            }else{
                this.$message.error(res.Msg)
            }  
            this.loading.close()
        })
    },
    updateAttach (id) {
        return new Promise((rs,reject) => {
           var proArr = []
          for (var item of this.attachListCopy) {
            var promise = new Promise((resolve, reject) => {
                delAttach(item.id).then(res => {
                    resolve()
                })
            }) 
            proArr.push(promise)
          }
          Promise.all(proArr).then(res => {
            this.addAttach(id).then(res => {
              rs()
            })
            
          })
        })
    },
    updateShared (id) {
      var proArr = []
        for (var item of this.selectedCopy) {
          var promise = new Promise((resolve, reject) => {
              delShared({
                data: JSON.stringify({
                  worklogId: id,
                  userId: item.Id
                })
              }).then(res => {
                  resolve()
              })
          }) 
        }
        Promise.all(proArr).then(res => {
          this.addShared(id)
        })
    },
   
   
    handleSuccess(file){
      
     this.attachList.push(file)
    },
    handleRemove(file){
      for(var i = 0;i<this.attachList.length;i++){
        if(this.attachList[i].url == file.url){
          this.attachList.splice(i,1)
        }
      }
     
    },
   
    addAttach(id){
      return new Promise((resovle,reject) => {
          var aList = []
          for(var item of this.attachList){
            aList.push({
              WorkLogId:id,
              FileName:item.fileName,
              Url:item.url,
              FileSize:item.size
            })
          }
          if(aList.length == 0){
              resovle()
          }else{
              addAttach(aList).then(d => {
                resovle()
              })
          }
      })
        
    },

   
    handleCheckChange (data, checked, indeterminate) {
     
      if (data.type === 0) {
        if (checked) {
          var isHave = false
          for(var item of this.selectedPre){
            if(item.Id == data.Id){
              isHave= true
            }
          }
          if(!isHave){
            this.selectedPre.push(data)
          }
          
        } else {
          for (var i = 0; i < this.selectedPre.length; i++) {
            if (this.selectedPre[i].Id == data.Id ) {
              this.selectedPre.splice(i, 1)
              break
            }
          }
        } 
        
      }
    },
    addShared (id) {
      var aList = []
        for(var item of this.selected){
          aList.push({
             WorkLogId: id,
            ShareToUserId: item.Id,
            ShareToUserName: item.name
          })
        }
        if(aList.length == 0){
            
        }else{
            addShared(aList).then(res => {

            })
        }
    },
    initData () {
      var detail = this.$store.state.workLog.workLogDetail
      this.Title = detail.worklog.Title
      this.Content = detail.worklog.Content
      this.TypeCode = detail.worklog.TypeCode
      for(var item of detail.worklogattachments){
        this.attachList.push({
            id: item.Id,
            fileName:item.FileName,
            name:item.FileName,
            url:item.Url,
            fileUrl:item.Url,
            size:item.FileSize
        })
      }
      this.attachListCopy = [].concat(this.attachList)  
      for(var item of detail.sharedworklogList){
        this.selected.push({
            Id: item.ShareToUserId,
            name: item.ShareToUserName
        })
        
        this.checkedKeys.push(item.ShareToUserName)
      }
      this.selectedCopy = [].concat(this.selected)
    },
    toBack () {
        bus.$emit('workLogReload')
        this.$router.go(-1)
        this.$store.state.file.workLogUpload.abort()
    }
  },
  mounted () {
        
        this.$store.dispatch('workLog/getTree').then(res => {
          res = JSON.parse(res)
          console.log(res)
          this.treeData = res.Data


          this.type = this.$store.state.workLog.workLogType
          if ( this.type == 'edit'){
            this.initData()
          } else {
            
          }
        })
    }
}
</script>
<style  scope>
.btn-p{
    text-align: center;
}
.tree-p{
  padding: 1rem;
  border: 1px solid #DCDFE6;
}
</style>
