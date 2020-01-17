<template>
  <div class="main email-edit" style="overflow:initial;" v-loading="loading">
    <div class="e-m">
      <div class="em-left">
        <div class="em-left-t">
          <a href="javascript:void(0)" @click="getEmail"><img src="./img/e-sx.png" /></a>
          <a href="javascript:void(0)" @click="emailWrite"><img src="./img/e-xx.png" /></a>
        </div>
        <div class="em-left-c">
          <ul>
            <li v-for="(item, index) in emailNumList" :key="index" @click="handleClick(index)" :class="{'on': index == activeIndex}">
              <a href="javascript:void(0)">{{item.inbox||item.draftbox||item.sendbox||item.delbox}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="em-body">
        <div class="em-body-c">
          <div class="em-body-c-t" v-if="!isDelete">
            <!-- <a href="javascript:void(0)" class="draft" @click="delEmail">删除</a> -->
            <a href="javascript:void(0)" class="draft" @click="answerEmail" v-if="$route.query.active=='active'">回复</a>
            <a href="javascript:void(0)" class="draft" @click="relayEmail" v-if="$route.query.active=='active'">转发</a>
            <span>{{emailData.MailTypeCode=='0'?'一般':'紧急'}}</span>
          </div>
          <div class="em-body-c-c">
            <h2>{{emailData.Theme}}</h2>
            <ul>
              <li><span>发件人：</span><label>{{emailData.FromUserName}}</label></li>
              <li><span>收件人：</span><label>{{emailData.ToEmailName}}</label></li>
              <li><span>抄送：</span><label>{{emailData.CopyEmailName}}</label></li>
              <li><span>时&nbsp;&nbsp;间：</span><label>{{emailData.SendingTime}}</label></li>
              <li><span>附&nbsp;&nbsp;件：</span><label>{{fileList.length}}个</label></li>
            </ul>
            <div class="em-ec">
              <p class="ql-editor" v-html="decodeURI(content)"></p>
            </div>
            <div class="em-body-c-b">
              <el-upload
                  class="upload-demo"
                  :disabled="true"
                  :action="actionUrl"
                  :headers="headers"
                  :on-preview="handlePreview"
                  :before-remove="beforeRemove"
                  :file-list="fileList">
                  <el-button size="small" type="primary" :disabled="true">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">上传文件不能超过20M</div>
                </el-upload>
              <!-- <h2>附件<label>（2个）</label></h2>
              <p><img src="./img/exe.png" /><span>本学期总体数学工作安排（33.5KB）</span><a href="javascript:;">下载</a></p>
              <p><img src="./img/word-1.png" /><span>本学期总体数学工作安排（33.5KB）</span><a href="javascript:;">下载</a></p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import cvueTable from '@/components/cvue-table'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { uploadUrl } from '@/config/config'
import {Encrypt} from '@/util/crypto'
import {getCookie} from '@/util/tool'
export default {
  name: 'email',
  components: {
    cvueTable,
    quillEditor
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
    },
    editor() {
      return this.$refs.myQuillEditor.quill
    },
     headers () {
            var obj = {}
            obj.sign = Encrypt(new Date().getTime())
            obj.Token = getCookie('Token')
            return obj
        }
  },
  data () {
    return {
      emailType: [], // 邮件类型
      emailNumList: [], //邮件数量列表
      activeIndex: 0,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'Name',
        isLeaf: 'leaf'
      },
      departList: [],
      selectOptions: [],
      selectType: '',
      fileList: [],
      fileParams: {},
      content: '<h2></h2>',
      editorOption: {
        // some quill options
        placeholder: '请输入文本...',
        modules: {
          toolbar: [
              ['bold',  'underline', 'strike'],    //加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'],     //引用，代码块
  
  
              [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
              [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
              [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
              [{ 'direction': 'rtl' }],             // 文本方向
  
  
              [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
  
  
              [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
              [{ 'font': [] }],     //字体
              [{ 'align': [] }],    //对齐方式
  
              ['clean'],    //清除字体样式
              ['image']    //上传图片、上传视频
          ]
        }
      },
      mainUser: '',
      mainUserIds: '',
      copyUser: '',
      copyUserIds: '',
      title: '',
      isFocus: 1,
      emailData: {},
      fileList: [],
      actionUrl: uploadUrl,
      isDelete: false,
      loading: false
    }
  },
  mounted () {
    // this.getDeptList() 
    // this.getEmilType()
    this.getEmailStatusList() // 邮件数量列表
    // console.log('this is current quill instance object', this.editor)
    this.getEmailDetail() //邮件详情
    this.getFileList() //附件列表
    if(this.$route.query.type=='delete'){
      this.isDelete = true
      this.activeIndex = 3
    }else{
      this.isDelete = false
      if (this.$route.query.active == 'active') {
        this.activeIndex = 0
      } else {
        this.activeIndex = 2
      }
    }
  },
  methods: {
    handleClick (index) {
      this.$router.push({path:'/index/email', query: {index:index}})
    },
    beforeRemove(){
      return false
    },
    handlePreview(file){
      // console.log(file)
      window.open('http://'+file.url)
    },
    // 附件列表
    getFileList () {
      var params = {
        mailId: this.$route.query.id
      }
      this.$store.dispatch('email/Download',params).then(res => {
        var result = JSON.parse(res)
        // console.log(result)
        if (result.Code == '200') {
          var data = JSON.parse(result.Msg)
          // console.log(data)
          if(data[0]&&data[0].Url){
            var urlArr = data[0].Url.split(',')
            var nameArr = data[0].FileName.split(',')
            var fileArr = []
            for(var i=0;i<urlArr.length;i++){
              fileArr.push({
                name: nameArr[i],
                url: urlArr[i],
                id: data[0].Id,
                mailId: data[0].MailId
              })
            }
            this.fileList = fileArr
          }
        }
      })
    },
    answerEmail () {
      // console.log(this.emailData)
      this.$router.push({
        path:'/index/email-write',
        query:{type:'answer',emailId:this.$route.query.id}
      })
    },
    relayEmail () {
      // console.log(this.emailData)
      this.$router.push({
        path:'/index/email-write',
        query:{type:'relay',emailId:this.$route.query.id}
      })
    },
    getEmailDetail () {
      var params = {
        mailId: this.$route.query.id
      }
      this.loading = false
      this.$store.dispatch('email/EditMailDelait', params).then(res => {
        this.loading = false
        var result = JSON.parse(res)
        if (result.Code == 200) {
          var data = JSON.parse(result.Msg)
          // console.log(data)
          this.emailData = data
          this.content = data.Content
        }
      })
    },
    focusMain () {
      this.isFocus = 1
      this.getDeptList()
    },
    focusCopy () {
      this.isFocus = 0
      this.getDeptList()
    },
    // 添加邮件
    sendEmail () {
      var params = {
        mainUserIds: this.mainUserIds,
        copyUserIds: this.copyUserIds,
        title: this.title,
        mailTypeCode: this.selectType,
        fileSize: 0,
        suffix: 0,
        fileNameList: '1111',
        fileValueLIst: '1111.text',
        content: this.content,
        userId: this.cookiesObj.loginUserId,
        status: 2
      }
      var paramsNew = {
        data: JSON.stringify(params)
      }
      this.$store.dispatch('email/AddEmil', params).then(res => {
        var result = JSON.parse(res)
        // console.log(result)
        if(result.Code == 200){
          this.$message({message: '发送成功', duration: 2000, type: 'success'})
        }
      })
    },
    handleCheckChange (val, valCheck) {
      // console.log(checkedKeys,checkedNodes,halfCheckedKeys,halfCheckedNodes)  
      // console.log(val)
      var userName = ''
      valCheck.checkedNodes.forEach((item,index) => {
        userName += item.Name + ','
      })
      if(this.isFocus === 1){
        this.mainUser = userName.substr(0,userName.length-1)
        this.mainUserIds = valCheck.checkedKeys.join(',')
      }else{
        this.copyUser = userName.substr(0,userName.length-1)
        this.copyUserIds = valCheck.checkedKeys.join(',')
      }
      // console.log(valCheck.checkedKeys)
    },
    // 编辑器方法
    onEditorBlur(quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      // console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      // this.content = html
    },
    // 上传前
    handleBeforeupload (file) {
        var m = (file.size / (1024 * 1024)).toFixed(2)
        if (m > 30) {
          this.$message({message: '最大限制30M', type: 'error'})
          return false
        }
        return true
    },
    // 成功
    handleSuccess (response, file, fileList) {
      if (response.success) {
        this.$message({message: response.message, duration: 2000, type: 'success'})
      } else {
        this.$message({message: response.message, duration: 2000, type: 'error'})
      }
    },
     // 邮件类型
    getEmilType () {
      this.$store.dispatch('email/GetEmilType', {}).then(res => {
        var result = JSON.parse(res)
        if (result.Code == 200) {
          this.selectOptions = JSON.parse(result.Msg)
          // console.log(this.selectOptions)
        } else {
          this.$message({
            type: 'error',
            message: '服务器异常'
          })
        }
      })
    },
    // 获取部门列表
    getDeptList () {
      var params = {
        schoolId: this.cookiesObj.schoolId
      }
      this.$store.dispatch('email/GetDeptList', params).then(res => {
        var result = JSON.parse(res)
        if (result.Code == 200) {
          this.treeData = JSON.parse(result.Msg)
          // console.log(this.treeData)
        }
      })
    },
    // 根据部门id获取用户列表
    getDeptByUserList (deptId) {
      var params = {
        deptId: deptId,
        schoolId: this.cookiesObj.schoolId
      }
      this.$store.dispatch('email/GetDeptByUserList', params).then(res => {
        var result = JSON.parse(res)
        if (result.Code == 200) {
          // console.log(result)
        }
      })
    },
    handleNodeClick (data) {
      // console.log(data.children.length)
      if(data.children.length == 0){
        var params = {
          deptId: data.Id,
          schoolId: data.SchoolId
        }
        this.$store.dispatch('email/GetDeptByUserList', params).then(res => {
          // console.log(res)
          var result = JSON.parse(res)
          if(result.Code == 200){
            data.children = JSON.parse(result.Msg)
          }
        })
      }
    },
    // 改变pagesize
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleList(this.classId, this.schoolyearId, this.schooltermid)
    },
    // 改变页码
    handleCurrentChange (val) {
      this.tablePage = val
      this.handleList(this.classId, this.schoolyearId, this.schooltermid)
    },
    // 搜索
    handleSearch () {
      this.tablePage = 1
      this.status = ''
      if(this.year == ''){
        this.$message({
            message: '请选择学年',
            duration: 2000,
            type: 'error'
        })
        return
      }
      if(this.term == ''){
        this.$message({
            message: '请选择学期',
            duration: 2000,
            type: 'error'
        })
        return
      }
      if(this.grades == ''){
        this.$message({
            message: '请选择年级',
            duration: 2000,
            type: 'error'
        })
        return
      }
      if(this.classes == ''){
        this.$message({
            message: '请选择班级',
            duration: 2000,
            type: 'error'
        })
        return
      }
      this.tablePage = 1
      this.handleList(this.classId, this.schoolyearId, this.schooltermid)
    },
    // 列表接口
    handleList (status) {
      this.tableLoading = true
      var params = {
          status: status,
          fromUserId: this.cookiesObj.loginUserId,
          page: this.tablePage,
          size: this.page.pageSize
      }
      this.$store.dispatch('email/GetEmilList', params).then(res => {
          var result = JSON.parse(res)
          // console.log(result)
          if (result.Code == 200) {
            var data = JSON.parse(result.Msg)
            this.tableData = data.List
            // console.log(this.tableData)
            this.page.total = data.count
            this.page.currentPage = this.tablePage
          } else {
            this.$message({
                message: result.Msg,
                duration: 2000,
                type: 'error'
            })
          }
          this.tableLoading = false
      }).catch(err => {
          console.log(err)
          this.tableLoading = false
      })
    },
    // 关闭弹窗
    closeDialog (params) {
      if (params == 'add') {
          this.dialogVisibleAdd = false
      }
      if (params == 'edit') {
          this.dialogVisibleEdit = false
      }
    },
    // 确认
    confirmDialog (params) {
      if (params == 'add') {
          this.dialogVisibleAdd = false
          this.tablePage = 1
          this.handleList(this.classId, this.schoolyearId, this.schooltermid)
      }
      if (params == 'edit') {
          this.dialogVisibleEdit = false
          this.tablePage = 1
          this.handleList(this.classId, this.schoolyearId, this.schooltermid)
      }
    },
    // 编辑
    handleEdit (row) {
      // console.log(row)
      this.rowId = row.id
      this.rowTitle = row.name
      this.rowObj = row
      this.dialogVisibleEdit = true
    },
    // 新增
    handleAdd () {
      this.dialogVisibleAdd = true
    },
    // 删除
    handleDelete (row) {
      // console.log(row)
      this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          var params = {
            examIds: row.id
          }
          this.$store.dispatch('interflow/DelSubject', params).then(res => {
              var result = JSON.parse(res)
              if (result.Code == 200) {
                this.$message({
                  type: 'success',
                  message: result.Msg
                })
                this.tablePage = 1
                this.handleList(this.classId, this.schoolyearId, this.schooltermid)
              } else {
                this.$message({
                  type: 'error',
                  message: result.Msg
                })
              }
          })
      }).catch(() => {
      })
    },
    // 获取邮件数量列表
    getEmailStatusList () {
      var params = {
        fromUserId: this.cookiesObj.loginUserId
      }
      this.$store.dispatch('email/GetEmailStatusList', params).then(res => {
        var result = JSON.parse(res)
        if (result.Code == 200) {
          // console.log(result)
          this.emailNumList = this.objToArr(JSON.parse(result.Msg))
          // console.log(this.emailNumList)
        } else {
          this.$message({
            type: 'error',
            message: '服务器异常'
          })
        }
      })
    },
    // 对象转数组
    objToArr (obj) {
      var arr = []
      for(let x in obj){
        var item = {}
        item[x] = obj[x]
        arr.push(item)
      }
      // console.log(arr)
      return arr
    },
    activeItem (index) {
      this.activeIndex = index
      this.tablePage = 1
      this.handleList(index)
    },
    // 收信
    getEmail () {
      this.$router.push('/index/email')
    },
    // 收信
    emailWrite () {
      this.$router.push('/index/email-write')
    },
    delEmail () {
      this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          var params = {
            ids: this.$route.query.id
          }
          this.$store.dispatch('email/DelEmail', params).then(res => {
              var result = JSON.parse(res)
              // console.log(result)
              if (result.Code == 200) {
                this.$message({
                  type: 'success',
                  message: result.Msg
                })
                this.$router.push({path:'/index/email'})
              } else {
                this.$message({
                  type: 'error',
                  message: result.Msg
                })
              }
          })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('./css/right/right.css');
</style>