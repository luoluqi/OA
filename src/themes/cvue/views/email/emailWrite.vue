<template>
  <div class="main email-write" style="overflow:initial;" v-loading="loading">
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
      <div class="em-right">
        <div class="em-right-t">通讯录</div>
        <div class="em-right-c">
          <!-- <el-tree :data="treeData" 
                  :props="defaultProps" 
                  @node-click="handleNodeClick"
                  @check="handleCheckChange"
                  :expand-on-click-node="false"
                  default-expand-all 
                  ref="tree"
                  node-key="Id"
                  show-checkbox
                  :highlight-current="true">
          </el-tree> -->
          <el-tree
            :data="treeList"
            v-loading="treeLoading"
            show-checkbox
            node-key="loginUserId"
            @check="handleCheckChange"
            default-expand-all 
            ref="tree"
            highlight-current
            :props="defaultProps"
            :default-checked-keys="teacherIds"
          ></el-tree>
        </div>
      </div>
      <div class="em-body-2">
        <div class="em-body-2-centen">
          <div class="em-body-2-centen-t">
            <a href="javascript:void(0);" class="s-u" @click="sendEmail"><i></i><span>发送</span></a>
            <a href="javascript:void(0);" class="draft" @click="saveEmail">存草稿</a>
          </div>
          <div class="em-body-2-centen-l">
            <ul>
              <li>收件人：</li>
              <li>抄送：</li>
              <li>主题：</li>
              <li>类型：</li>
            </ul>
          </div>
          <div class="em-body-2-centen-r">
            <ul>
              <li class="relative"><input type="text" class="o1"  v-model="mainUser" @focus="focusMain" readonly/><i class="el-close el-icon-error" @click="clearMain"></i></li>
              <li class="relative"><input type="text" class="o1" v-model="copyUser" @focus="focusCopy" readonly/><i class="el-close el-icon-error" @click="clearCopy"></i></li>
              <li><input type="text" class="o1" v-model="title"/></li>
              <li>
                <el-select v-model="selectType" placeholder="请选择">
                  <el-option
                    v-for="item in selectOptions"
                    :key="item.Id"
                    :label="item.Name"
                    :value="item.Id">
                  </el-option>
                </el-select>
              </li>
              <li style="position:relative;">
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
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">上传文件不能超过30M,文件名称不能包含特殊字符如(,)</div>
                </el-upload>
              </li>
              <li>
                <quill-editor v-model="content"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                    ref="myQuillEditor" style="height:500px;" class="ql-editor"></quill-editor>
              </li>
            </ul>
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
        Token: this.cookieStart.Token,
        sign : Encrypt(new Date().getTime())
      }
      return token
    },
    editor() {
      return this.$refs.myQuillEditor.quill
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
      emailType: [], // 邮件类型
      emailNumList: [], //邮件数量列表
      activeIndex: 0,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // defaultProps: {
      //   children: 'children',
      //   label: 'Name',
      //   isLeaf: 'leaf'
      // },
      departList: [],
      selectOptions: [],
      selectType: 0,
      fileList: [],
      content: '',
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
              // ['image']    //上传图片、上传视频
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
      fileData:{},
      fileNameStr: '',
      fileUrlStr: '',
      actionUrl: uploadUrl,
      uuid: this.generateUUID(),
      loading: false,
      treeList: [],
      teacherIds: [],
      treeLoading: false
    }
  },
  mounted () {
    this.getTeachDept() //部门列表
    // this.getDeptList() //部门列表
    this.getEmilType() //邮件类型
    this.getEmailStatusList() //邮件数量列表
    // console.log('this is current quill instance object', this.editor)
    if(this.$route.query.type == 'answer'){
      this.getEmailDetail() // 邮件详情
      this.getFileList() //附件列表
    }
     if(this.$route.query.type == 'draft'){
      this.getEmailDetailDraft() // 邮件详情
      this.getFileList() // 附件列表
      this.activeIndex = 1
    }
    if(this.$route.query.type == 'relay'){
      this.getEmailDetail() // 邮件详情
      this.getFileList() //附件列表
    }
    // this.content = this.baseHtml(1,1,1,1,1,1)
  },
  methods: {
    clearMain () {
      this.mainUser = ''
      this.mainUserIds = ''
      this.$refs.tree.setCheckedKeys([]);
    },
    clearCopy () {
      this.copyUser = ''
      this.copyUserIds = ''
      this.$refs.tree.setCheckedKeys([]);
    },
    baseHtml (sender,time,receive,copy,theme,content) {
      var html = ''
      html = '<p>&nbsp;</p><p>&nbsp;</p>'
      html += '<p><br />----------原始邮件----------<br />发件人：' + sender
      html += ';<br />发送时间：' + time
      html += ';<br />收件人：' + receive
      html += ';<br />抄送：' + copy
      html += ';<br />主题：'  + theme
      html += ';<br />内容：<br /><br />' + content
      html += '</p>'
      return html
    },
    // 保存草稿
    saveEmail () {
      // console.log(this.fileData)
      if(this.mainUser==''){
        this.$message({message: '收件人不能为空', duration: 2000, type: 'error'})
        return
      }
      if(this.title.trim()==''){
        this.$message({message: '主题不能为空', duration: 2000, type: 'error'})
        return
      }
      if(this.title.length>50){
        this.$message({message: '字数不能超过50', duration: 2000, type: 'error'})
        return
      }
      if(this.content.trim() == ''){
        this.$message({message: '内容不能为空', duration: 2000, type: 'error'})
        return
      }

      var fileNameStr = ''
      var fileUrlStr = ''
      var fileNameOld = ''
      var fileUrlOld = ''
      if(this.fileList.length > 0 ){
        for(var i=0;i<this.fileList.length;i++){
          fileNameOld += this.fileList[i].name + ','
          fileUrlOld += this.fileList[i].url + ','
        }
        fileNameOld = fileNameOld.substr(0,fileNameOld.length-1)
        fileUrlOld = fileUrlOld.substr(0,fileUrlOld.length-1)
      }

      if(this.fileNameStr==''){
        fileNameStr = this.fileList.length > 0 ? fileNameOld:''
      }else{
        if(this.fileList.length > 0){
          fileNameStr = fileNameOld + ',' + this.fileNameStr.substr(0,this.fileNameStr.length-1)
        }else{
          fileNameStr = this.fileNameStr.substr(0,this.fileNameStr.length-1)
        }
      }
      if(this.fileUrlStr==''){
        fileUrlStr = this.fileList.length>0?fileUrlOld:''
      }else{
        if(this.fileList.length > 0){
          fileUrlStr = fileUrlOld+','+this.fileUrlStr.substr(0,this.fileUrlStr.length-1)
        }else{
          fileUrlStr = this.fileUrlStr.substr(0,this.fileUrlStr.length-1)
        }
      }

      var params = {
        mainUserIds: this.mainUserIds,
        copyUserIds: this.copyUserIds,
        title: this.title,
        mailTypeCode: this.selectType,
        fileSize: 0,
        suffix: 0,
        fileNameList: fileNameStr,
        fileValueLIst: fileUrlStr,
        content: encodeURI(this.content),
        userId: this.cookiesObj.loginUserId,
        status: 1
      }
      if(this.$route.query.type=='draft'){
        params = {
          mainUserIds: this.mainUserIds,
          copyUserIds: this.copyUserIds,
          title: this.title,
          mailTypeCode: this.selectType,
          fileSize: 0,
          suffix: 0,
          fileNameList: fileNameStr,
          fileValueLIst: fileUrlStr,
          content: encodeURI(this.content),
          userId: this.cookiesObj.loginUserId,
          status: 1,
          emailId:this.$route.query.emailId
        }
      }
      // console.log(params)
      var paramsNew = {
        data: JSON.stringify(params)
      }
      this.loading = true
      this.$store.dispatch('email/AddEmil', paramsNew).then(res => {
        this.loading = false
        var result = JSON.parse(res)
        // console.log(result)
        if(result.Code == 200){
          this.$message({message: '保存成功', duration: 2000, type: 'success'})
          this.$router.push('/index/email')
        }
      })
    },
    // 邮件详情
    getEmailDetail () {
      var params = {
        mailId: this.$route.query.emailId
      }
      this.loading = true
      this.$store.dispatch('email/EditMailDelait', params).then(res => {
        this.loading = false
        var result = JSON.parse(res)
        if (result.Code == 200) {
          var data = JSON.parse(result.Msg)
          console.log(data)
          this.emailData = data
          // this.mainUser = this.emailData.ToEmailName
          // this.mainUserIds = this.emailData.ToEmailId
          this.mainUser = this.emailData.FromUserName
          this.mainUserIds = this.emailData.FromUserId
          this.copyUser = this.emailData.CopyEmailName
          this.copyUserIds = this.emailData.CopyEmailId
          this.title = this.emailData.Theme
          this.selectType = parseInt(this.emailData.MailTypeCode)
          this.content = this.baseHtml(this.emailData.FromUserName,this.emailData.SendingTime,this.emailData.ToEmailName,this.emailData.CopyEmailName,this.emailData.Theme,this.emailData.Content)
          if(this.$route.query.type=='draft'){
            this.content = this.emailData.Content
          }
          // this.content = this.baseHtml(1,1,1,1,1)
        }
      })
    },
    // 邮件详情
    getEmailDetailDraft () {
      var params = {
        mailId: this.$route.query.emailId
      }
      this.loading = true
      this.$store.dispatch('email/EditMailDelait', params).then(res => {
        this.loading = false
        var result = JSON.parse(res)
        if (result.Code == 200) {
          var data = JSON.parse(result.Msg)
          // console.log(data)
          this.emailData = data
          this.mainUser = this.emailData.ToEmailName
          this.mainUserIds = this.emailData.ToEmailId
          // this.mainUser = this.emailData.FromUserName
          // this.mainUserIds = this.emailData.FromUserId
          this.copyUser = this.emailData.CopyEmailName
          this.copyUserIds = this.emailData.CopyEmailId
          this.title = this.emailData.Theme
          this.selectType = parseInt(this.emailData.MailTypeCode)
          this.content = this.baseHtml(this.emailData.FromUserName,this.emailData.SendingTime,this.emailData.ToEmailName,this.emailData.CopyEmailName,this.emailData.Theme,this.emailData.Content)
          if(this.$route.query.type=='draft'){
            this.content = this.emailData.Content
          }
          // this.content = this.baseHtml(1,1,1,1,1)
        }
      })
    },
    // 附件列表
    getFileList () {
      var params = {
        mailId: this.$route.query.emailId
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
            console.log(this.fileList)
          }
          // this.fileList = data.map(item=>{
          //   return {
          //     name: item.FileName,
          //     url: item.Url,
          //     id: item.Id,
          //     mailId: item.MailId
          //   }
          // })
        }
      })
    },
    focusMain () {
      this.isFocus = 1
      // this.getDeptList()
      this.getTeachDept() //部门列表
      
    },
    focusCopy () {
      this.isFocus = 0
      // this.getDeptList()
      this.getTeachDept() //部门列表
    },
    // 添加邮件
    sendEmail () {
      // console.log(this.fileData)
      if(this.mainUser==''){
        this.$message({message: '收件人不能为空', duration: 2000, type: 'error'})
        return
      }
      if(this.title.trim()==''){
        this.$message({message: '主题不能为空', duration: 2000, type: 'error'})
        return
      }
      if(this.title.length>50){
        this.$message({message: '字数不能超过50', duration: 2000, type: 'error'})
        return
      }
      if(this.content.trim() == ''){
        this.$message({message: '内容不能为空', duration: 2000, type: 'error'})
        return
      }
      // console.log(this.fileList)
      var fileNameStr = ''
      var fileUrlStr = ''
      var fileNameOld = ''
      var fileUrlOld = ''
      if(this.fileList.length > 0 ){
        for(var i=0;i<this.fileList.length;i++){
          fileNameOld += this.fileList[i].name + ','
          fileUrlOld += this.fileList[i].url + ','
        }
        fileNameOld = fileNameOld.substr(0,fileNameOld.length-1)
        fileUrlOld = fileUrlOld.substr(0,fileUrlOld.length-1)
      }

      if(this.fileNameStr==''){
        fileNameStr = this.fileList.length > 0 ? fileNameOld:''
      }else{
        // fileNameStr = this.fileNameStr.substr(0,this.fileNameStr.length-1)
        if(this.fileList.length > 0){
          fileNameStr = fileNameOld + ',' + this.fileNameStr.substr(0,this.fileNameStr.length-1)
        }else{
          fileNameStr = this.fileNameStr.substr(0,this.fileNameStr.length-1)
        }
      }
      if(this.fileUrlStr==''){
        fileUrlStr = this.fileList.length>0?fileUrlOld:''
      }else{
        // fileUrlStr = this.fileUrlStr.substr(0,this.fileUrlStr.length-1)
        if(this.fileList.length > 0){
          fileUrlStr = fileUrlOld+','+this.fileUrlStr.substr(0,this.fileUrlStr.length-1)
        }else{
          fileUrlStr = this.fileUrlStr.substr(0,this.fileUrlStr.length-1)
        }
      }
      
      // console.log(this.fileList)
      // console.log(fileUrlStr)
      // return
      var params = {
        mainUserIds: this.mainUserIds,
        copyUserIds: this.copyUserIds,
        title: this.title,
        mailTypeCode: this.selectType,
        fileSize: 0,
        suffix: 0,
        fileNameList: fileNameStr,
        fileValueLIst: fileUrlStr,
        content: encodeURI(this.content),
        userId: this.cookiesObj.loginUserId,
        status: 2
      }
      if(this.$route.query.type=='draft'){
        params = {
          mainUserIds: this.mainUserIds,
          copyUserIds: this.copyUserIds,
          title: this.title,
          mailTypeCode: this.selectType,
          fileSize: 0,
          suffix: 0,
          fileNameList: fileNameStr,
          fileValueLIst: fileUrlStr,
          content: encodeURI(this.content),
          userId: this.cookiesObj.loginUserId,
          status: 2,
          emailId:this.$route.query.emailId
        }
      }
      // console.log(params)
      var paramsNew = {
        data: JSON.stringify(params)
      }
      this.loading = true
      this.$store.dispatch('email/AddEmil', paramsNew).then(res => {
        this.loading = false
        var result = JSON.parse(res)
        // console.log(result)
        if(result.Code == 200){
          this.$message({message: '发送成功', duration: 2000, type: 'success'})
          this.$router.push('/index/email')
        }
      })
    },
    handleCheckChange (val, valCheck) {
      // console.log(valCheck.checkedNodes)
      var userName = []
      var ids = []
      valCheck.checkedNodes.forEach((item,index) => {
        var bool =  ids.indexOf(item.loginUserId) >=0
        // console.log(bool)
        if (item.type === 0 && !bool) {
          userName.push(item.name)
          ids.push(item.loginUserId)
        }
      })
      // console.log(ids)
      if(this.isFocus === 1){
        this.mainUser = userName.join(',')
        this.mainUserIds = ids.join(',')
      }else{
        this.copyUser = userName.join(',')
        this.copyUserIds = ids.join(',')
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
      this.content = html
    },
    handleFileChange (file, fileList) {
      // console.log(file)
    },
    // 上传前
    handleBeforeupload (file) {
      this.uuid = this.generateUUID()
      var m = (file.size / (1024 * 1024)).toFixed(2)
      if (m > 30) {
        this.$message({message: '最大限制30M', type: 'error'})
        return false
      }
      return true
    },
    // 成功
    handleSuccess (response, file, fileList) {
      var result = JSON.parse(response)
      if (result.Code=='200') {
        console.log(this.fileList)
        this.fileData = result.Data
        this.fileNameStr += this.fileData.fileName + ','
        this.fileUrlStr += this.fileData.fileUrl + ','
        // console.log(this.fileNameStr.substr(0,this.fileNameStr.length-1))
        // console.log(this.fileUrlStr.substr(0,this.fileUrlStr.length-1))
        this.$message({message: '上传成功', duration: 2000, type: 'success'})
      } else {
        this.$message({message: '上传失败', duration: 2000, type: 'error'})
      }
    },
    handleRemove (file, fileList) {
      var params = {
        id: file.id
      }
      this.$store.dispatch('email/DelMailReceiving',params).then(res => {
        // console.log(res)
        var result = JSON.parse(res)
        if(result.Code == '200'){
          if(result.Msg != 'no'){
            this.$message({message: '删除成功', duration: 2000, type: 'success'})
          }
        }
      })
    },
    beforeRemove(file, fileList) {
      // console.log(file)
      var m = (file.size / (1024 * 1024)).toFixed(2)
      if (m > 30) {
        return true
      } else {
        return this.$confirm(`确定移除 ${ file.name }？`);
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
    // 获取部门列表2
    getTeachDept () {
      let params = {
        schoolId: this.cookiesObj.schoolId,
        groupId: ''
      }
      this.treeLoading = true
      this.$store.dispatch('email/GetTeachDeptV2', params).then(res => {
        this.treeLoading = false
        let result = JSON.parse(res)
        // console.log(result)
        if (result.Code == '200') {
          this.treeList = result.Data
          if(this.isFocus === 1){
            this.teacherIds = this.mainUserIds.split(',')
          }else{
            this.teacherIds = this.copyUserIds.split(',')
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取部门列表
    getDeptListOld () {
      var params = {
        schoolId: this.cookiesObj.schoolId
      }
      this.$store.dispatch('email/GetDeptList', params).then(res => {
        var result = JSON.parse(res)
        if (result.Code == 200) {
          this.treeData = JSON.parse(result.Msg)
          this.setDeptData(this.treeData)
        }
      })
    },
    // 递归
    setDeptData (arr) { 
      arr.forEach((item,index)=>{
        if(item.children&&item.children.length>0){
          item.disabled = true
          // item.leaf = false
          this.setDeptData(item.children)
        }else{
          arr[index].disabled = true
          // arr[index].leaf = false
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
      // console.log(data)
      if(data.children&&data.children.length == 0){
        var params = {
          deptId: data.Id,
          schoolId: data.SchoolId
        }
        this.$store.dispatch('email/GetDeptByUserList', params).then(res => {
          var result = JSON.parse(res)
          if(result.Code == 200){
            data.children = JSON.parse(result.Msg)
            // console.log(this.mainUserIds.split(','))
            this.$refs.tree.setCheckedKeys(this.mainUserIds.split(','));
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
                message: '发送失败',
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
    generateUUID() {
      var d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
          d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    },
    handleClick (index) {
      this.$router.push({path:'/index/email', query: {index:index}})
    },
    unique (arr) {
      var newArr = []
      for (var i = 0; i < arr.length; i++) {
          if (newArr.indexOf(arr[i]) < 0) {
              newArr.push(arr[i])
          }
      }
      return newArr
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('./css/right/right.css');
.relative{
  position: relative;
}
.el-close{
  position: absolute;
  right: 10px;
  top: 9px;
  font-size: 16px;
}
input:focus{
  border: 1px solid green;
}
</style>


