<template>
  <div class="main email-index" style="overflow:initial;">
    <div class="e-m">
      <div class="em-left">
        <div class="em-left-t">
          <a href="javascript:void(0)" @click="getEmail"><img src="./img/e-sx.png" /></a>
          <a href="javascript:void(0)" @click="emailWrite"><img src="./img/e-xx.png" /></a>
        </div>
        <div class="em-left-c">
          <ul>
            <li v-for="(item, index) in emailNumList" :key="index" :class="{'on': index == activeIndex}" @click="activeItem(index)">
              <a href="javascript:;">{{item.inbox||item.draftbox||item.sendbox||item.delbox}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="em-body">
        <div class="em-body-t">
          <h2>收件箱<label></label></h2>
          <p>
            <!-- <a href="javascript:;" @click="delEmail">删除</a> -->
            <el-button @click="delEmail" :disabled="activeIndex==3">删除</el-button>
            <!-- <a href="javascript:;" @click="markRead">全部标为已读</a> -->
            <el-button  @click="markRead" v-if="activeIndex==0" style="width:110px;" >全部标为已读</el-button>
            <!-- <el-select v-model="readStatus" placeholder="标记为" style="width:100px;" @change="changeReadStatus" v-if="activeIndex==0">
              <el-option
                v-for="item in selectOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select> -->
          </p>
        </div>
        <div class="em-body-c">
          <cvue-table :option="tableOption" :data="tableData" ref="tbl1"
                      :isShowAdd="false" :page="page" 
                      :tablePage="tablePage" :pageSize="page.pageSize"
                      :loading="tableLoading"
                      @current-change="handleCurrentChange"
                      @size-change="handleSizeChange"
                      @rowClick="handleRowClick"
                      @checkChange="handleCheckChange"
                      :isShowPage="true">
              <template slot-scope="scope" slot="ReadStatus">
                  <img src="./img/e-xf.png" v-if="scope.row.ReadStatus==='False'&&activeIndex==0" @click="changeStatus">
                  <img src="./img/e-xk.png" v-else>
              </template>
              <template slot-scope="scope" slot="Theme">
                  <img src="./img/sd.png" v-if="scope.row.MailTypeCode == 1">&nbsp;&nbsp;<span>{{scope.row.Theme}}</span>
              </template>        
              <!-- 操作按钮 -->
              <!-- <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                  header-align="center"  width="160">
                  <template slot-scope="scope">
                      <el-button type="text" size="small" @click="handleEdit(scope.row)" v-hasPermission="permission.edit" :disabled="isTeacher">编辑</el-button>
                      <el-button type="text" size="small" @click="handleDelete(scope.row)" v-hasPermission="permission.delete" :disabled="isTeacher">删除</el-button>
                  </template>
              </el-table-column> -->
          </cvue-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import cvueTable from '@/components/cvue-table'
export default {
  name: 'email',
  components: {
    cvueTable
  },
  computed: {
    ...mapGetters(['cookiesObj'])
  },
  data () {
    return {
      readData: '',
      tableLoading: false,
      dialogVisibleAdd: false,
      dialogVisibleEdit: false,
      tablePage: 1,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 50, 100]
      },
      tableOption: {
        selected: true,
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          // {prop: 'index', label: '序号', align: 'center', width: 80},
          {prop: 'ReadStatus', label: '', align: 'center', slotStatus: true, width: 120},
          {prop: 'UserName', label: '发件人', align: 'center'},
          {prop: 'ToName', label: '收件人', align: 'center'},
          {prop: 'Theme', label: '主题', align: 'center', slotStatus: true},
          {prop: 'SendingTime', label: '时间', align: 'center'}
        ]
      },
      tableData: [
      ],
      emailType: [], // 邮件类型
      emailNumList: [], //邮件数量列表
      activeIndex: 0,
      selectData: [],
      selectOptions: [
        {id: '', label: '标记'},
        {id: true, label: '已读'},
        {id: false, label: '未读'}
      ],
      readStatus: ''
    }
  },
  mounted () {
    // this.getEmilType()
    this.getEmailStatusList()
    // console.log(this.$route.query)
    this.activeIndex = this.$route.query.index == undefined ? 0 : this.$route.query.index
    // console.log(this.activeIndex)
    this.handleList(this.activeIndex)
    // console.log(this.cookiesObj)
  },
  methods: {
    // 标记已读未读
    changeReadStatus(val){
      // console.log(val)
      if(this.selectData.length==0){
        this.$message({
            message: '请至少选中一条',
            duration: 2000,
            type: 'error'
        })
        return
      }
      if(val){
        var ids = ''
        var toUserIds = ''
        this.selectData.forEach((item, index) => {
          ids += item.mailreceivingobjId + ','
          toUserIds += item.ToUserId + ','
        })
        ids = ids.substr(0,ids.length-1)
        toUserIds = toUserIds.substr(0,ids.length-1)
        this.upEmailReadStatus(ids,true,toUserIds)
      }else{
        var ids = ''
        var toUserIds = ''
        this.selectData.forEach((item, index) => {
          ids += item.mailreceivingobjId + ','
          toUserIds += item.ToUserId + ','
        })
        ids = ids.substr(0,ids.length-1)
        toUserIds = toUserIds.substr(0,ids.length-1)
        this.upEmailReadStatus(ids,false,toUserIds)
      }
    },
    // 全部标记已读未读
    markRead () {
      // this.upEmailReadStatus('',true)
      // this.changeReadStatus(true)
      var params = {
        // ids: '',
        // readStatus: true,
        fromUserId: this.cookiesObj.loginUserId
      }
      this.$store.dispatch('email/UpIsReadEmailReadStatusList', params).then(res => {
        var result = JSON.parse(res)
        // console.log(result)
        if(result.Code == 200){
          // this.$message({
          //   message: '更新成功',
          //   duration: 2000,
          //   type: 'error'
          // })
          // console.log(123)
          this.tablePage = 1
          this.handleList(this.activeIndex)
        }
      })
    },
    // 修改状态
    changeStatus () {
      // console.log(123)
    },
    // 更新已读未读
    upEmailReadStatus (ids,bool,toUserId) {
      var params = {
        ids: ids,
        readStatus: bool,
        ToUserId: toUserId
      }
      this.$store.dispatch('email/UpEmailReadStatus', params).then(res => {
        var result = JSON.parse(res)
        // console.log(result)
        if(result.Code == 200){
          // this.$message({
          //   message: '更新成功',
          //   duration: 2000,
          //   type: 'success'
          // })
          this.tablePage = 1
          this.handleList(this.activeIndex)
        }
      })
    },
    handleCheckChange (val) {
      // console.log(val)
      this.selectData = val
    },
    // 改变pagesize
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleList(this.activeIndex)
    },
    // 改变页码
    handleCurrentChange (val) {
      this.tablePage = val
      this.handleList(this.activeIndex)
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
      this.handleList(this.activeIndex)
    },
    // 列表接口
    handleList (status) {
      //收件箱
      if(status==0){
        this.tableLoading = true
        var params = {
            status: status,
            toUserId: this.cookiesObj.loginUserId,
            page: this.tablePage,
            size: this.page.pageSize
        }
        this.$store.dispatch('email/GetMailReceivingList', params).then(res => {
            var result = JSON.parse(res)
            // console.log(result)
            if (result.Code == 200) {
              var data = JSON.parse(result.Msg)
              this.tableData = data.List
              console.log(this.tableData)
              this.page.total = data.Count
              this.page.currentPage = this.tablePage
            }else {
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
      // 删除
      }else if(status==3){
        this.tableLoading = true
        var params = {
            status: status,
            fromUserId: this.cookiesObj.loginUserId,
            page: this.tablePage,
            size: this.page.pageSize
        }
        this.$store.dispatch('email/GetEmilListV2', params).then(res => {
            var result = JSON.parse(res)
            console.log(result)
            if (result.Code == 200) {
              var data = result.Data
              this.tableData = data.List
              // console.log(this.tableData)
              this.page.total = data.Count
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
      //其他
      }else{
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
              this.page.total = data.Count
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
      }
      this.getEmailStatusList()
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
          this.handleList(this.activeIndex)
      }
      if (params == 'edit') {
          this.dialogVisibleEdit = false
          this.tablePage = 1
          this.handleList(this.activeIndex)
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
                this.handleList(this.activeIndex)
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
      if(index == 3){
        this.tableOption.selected = false
      }else{
        this.tableOption.selected = true
      }
    },
    // 收信
    getEmail () {
      this.activeIndex = 0
      this.tablePage = 1
      this.handleList(this.activeIndex)
    },
    // 收信
    emailWrite () {
      this.$router.push('/index/email-write')
    },
    delEmail () {
      if(this.selectData.length==0){
        this.$message({
            message: '请至少选中一条',
            duration: 2000,
            type: 'error'
        })
        return
      }
      this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          if(this.activeIndex == 0){
            var ids = ''
            this.selectData.forEach((item, index) => {
              ids += item.mailreceivingobjId + ','
            })
            ids = ids.substr(0,ids.length-1)
            var params = {
              DelEmailreceiving: ids
            }
            this.$store.dispatch('email/DelEmailreceiving', params).then(res => {
                var result = JSON.parse(res)
                // console.log(result)
                if (result.Code == 200) {
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  })
                  this.tablePage = 1
                  this.handleList(this.activeIndex)
                  this.getEmailStatusList()
                } else {
                  this.$message({
                    type: 'error',
                    message: '删除失败'
                  })
                }
            })
          }else{
            var ids = ''
            this.selectData.forEach((item, index) => {
              ids += item.Id + ','
            })
            ids = ids.substr(0,ids.length-1)
            var params = {
              ids: ids
            }
            // console.log(params)
            this.$store.dispatch('email/DelEmail', params).then(res => {
                var result = JSON.parse(res)
                // console.log(result)
                if (result.Code == 200) {
                  this.$message({
                    type: 'success',
                    message: result.Msg
                  })
                  this.tablePage = 1
                  this.handleList(this.activeIndex)
                  this.getEmailStatusList()
                } else {
                  this.$message({
                    type: 'error',
                    message: result.Msg
                  })
                }
            })
          }
      }).catch(() => {
      })
    },
    handleRowClick (row, event, column) {
      // console.log(this.activeIndex)
      // console.log(row)
      if(row.ReadStatus == 'False'){
        this.upEmailReadStatus(row.mailreceivingobjId,true,row.ToUserId)
      }
      // return
      // 草稿箱
      if(this.activeIndex == 1){
        this.$router.push({path:'/index/email-write',query:{type:'draft',emailId:row.Id}})
      //删除
      }else if(this.activeIndex == 3){
        this.$router.push({path:'/index/email-edit',query:{id:row.Id, type:'delete'}})
      //收件箱
      }else if(this.activeIndex == 0){
        this.$router.push({path:'/index/email-edit',query:{id:row.Id,active:'active'}})
      //已发送
      }else{
        this.$router.push({path:'/index/email-edit',query:{id:row.Id}})
      }
    }
  }
}
</script>
<style scoped>
@import url('./css/right/right.css');
</style>
