
<template>
  <div class="main">
    <div class="notice">
      <div class="notice-top">
        <h2>通知公告</h2>
      </div>
      <div class="notice-centen">
        <el-form ref="ruleForm">
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="4">
              <div class="grid-content time">
                <el-form-item label="标题">
                  <el-input v-model="title" placeholder="请输入标题" style="width:70%"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="grid-content">
                <el-form-item label="发布时间：">
                  <el-col :span="5">
                    <el-form-item>
                      <el-date-picker
                        v-model="startTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1" style="text-align: center;">至</el-col>
                  <el-col :span="5">
                    <el-form-item>
                      <el-date-picker
                        v-model="endTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" class="searchButton">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                  </el-col>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content">
                <el-button
                  type="primary"
                  @click="annouce"
                  v-show="cookiesObj.roleCode == 'SchoolAdmin'"
                >新增公告</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <el-checkbox
          v-model="myChecked"
          @change="changeVal"
          v-show="cookiesObj.roleCode == 'SchoolAdmin'"
        >我的通知公告</el-checkbox>
      </div>
      <div class="notice-bottom">
        <cvue-table
          v-if="!myChecked"
          :option="tableOption"
          :data="tableData"
          ref="tbl1"
          :isShowAdd="false"
          :page="page"
          :tablePage="tablePage"
          :pageSize="page.pageSize"
          :loading="tableLoading"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :isShowPage="showPage"
        >
          <template slot-scope="scope" slot="IsRead">
            <el-tag type="danger" v-if="!scope.row.IsRead">未读</el-tag>
            <el-tag type="success" v-else>已读</el-tag>
          </template>
          <!-- 操作按钮 -->
          <el-table-column
            fixed="right"
            slot="actionMenu"
            label="操作"
            align="center"
            header-align="center"
            width="260"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.AnnounceFlag">
                <el-button @click="handleLook(scope.row)" title="查看" style="cursor: pointer;">查看</el-button>
                <el-button
                  @click="handleLookDetail(scope.row)"
                  title="阅读情况"
                  style="cursor: pointer;"
                  v-show="realName == scope.row.AnnouncerName"
                >阅读情况</el-button>
              </div>
              <div v-else>
                <el-button
                  type="primary"
                  @click="handleEdit(scope.row)"
                  title="编辑"
                  :disabled="cookiesObj.roleCode != 'SchoolAdmin'"
                >编辑</el-button>
                <el-button
                  type="primary"
                  @click="handleDel(scope.row)"
                  title="删除"
                  :disabled="cookiesObj.roleCode != 'SchoolAdmin'"
                >删除</el-button>
                <el-button
                  type="primary"
                  @click="handleNotice(scope.row)"
                  title="发布"
                  :disabled="cookiesObj.roleCode != 'SchoolAdmin'"
                >发布</el-button>
              </div>
            </template>
          </el-table-column>
        </cvue-table>
        <!-- 我的通告 -->
        <cvue-table
          v-else
          :option="tableOption1"
          :data="tableData1"
          ref="tbl1"
          :isShowAdd="false"
          :page="page1"
          :tablePage="tablePage1"
          :pageSize="page1.pageSize"
          :loading="tableLoading"
          @current-change="handleCurrentChanges"
          @size-change="handleSizeChanges"
          :isShowPage="showPage"
        >
          <template slot-scope="scope" slot="IsRead">
            <el-tag type="danger" v-if="!scope.row.IsRead">未读</el-tag>
            <el-tag type="success" v-else>已读</el-tag>
          </template>
          <!-- 操作按钮 -->
          <el-table-column
            fixed="right"
            slot="actionMenu"
            label="操作"
            align="center"
            header-align="center"
            width="260"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.AnnounceFlag">
                <el-button @click="handleLook(scope.row)" title="查看" style="cursor: pointer;">查看</el-button>
                <el-button
                  @click="handleLookDetail(scope.row)"
                  title="阅读情况"
                  style="cursor: pointer;"
                  v-show="realName == scope.row.AnnouncerName"
                >阅读情况</el-button>
              </div>
              <div v-else>
                <el-button
                  type="primary"
                  @click="handleEdit(scope.row)"
                  title="编辑"
                  :disabled="cookiesObj.roleCode != 'SchoolAdmin'"
                >编辑</el-button>
                <el-button
                  type="primary"
                  @click="handleDel(scope.row)"
                  title="删除"
                  :disabled="cookiesObj.roleCode != 'SchoolAdmin'"
                >删除</el-button>
                <el-button
                  type="primary"
                  @click="handleNotice(scope.row)"
                  title="发布"
                  :disabled="cookiesObj.roleCode != 'SchoolAdmin'"
                >发布</el-button>
              </div>
            </template>
          </el-table-column>
        </cvue-table>
      </div>
    </div>
    <!-- 发布公告 -->
    <release-notice
      @closeDialog="closeDialog('release')"
      @confirmDialog="confirmDialog('release')"
      @handleClose="closeDialog('release')"
      :dialogVisible="dialogVisibleRelease"
    ></release-notice>
    <!-- 查看公告 -->
    <look-notice
      @closeDialog="closeDialog('look')"
      @confirmDialog="confirmDialog('look')"
      @handleClose="closeDialog('look')"
      :dialogVisible="dialogVisibleLook"
    ></look-notice>
    <!-- 编辑公告 -->
    <edit-notice
      v-if="dialogVisibleEdit"
      @closeDialog="closeDialog('edit')"
      @confirmDialog="confirmDialog('edit')"
      @handleClose="closeDialog('edit')"
      :dialogVisible="dialogVisibleEdit"
    ></edit-notice>
    <!-- 阅读情况 -->
    <read-notice
      @closeDialog="closeDialog('read')"
      @confirmDialog="confirmDialog('read')"
      @handleClose="closeDialog('read')"
      :dialogVisible="dialogVisibleRead"
    ></read-notice>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import lookNotice from './lookNotice'
import editNotice from './editNotice'
import releaseNotice from './releaseNotice'
import readNotice from './readNotice'
export default {
  name: 'notice',
  components: {
    cvueTable,
    cvueDialog,
    lookNotice,
    editNotice,
    releaseNotice,
    readNotice
  },
  computed: {
    ...mapGetters(['cookiesObj'])
  },
  data () {
    return {
      title: '',
      startTime: '',
      endTime: '',
      myChecked: false,
      editId: '',
      showCrud: true,
      showPage: false,

      tableLoading: false,
      tablePage: 1,
      dialogVisibleRelease: false,
      dialogVisibleEdit: false,
      dialogVisibleLook: false,
      dialogVisibleRead: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 30]
      },
      tableOption: {
        selected: false,
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          { prop: 'Title', label: '通知公告标题', align: 'center' },
          { prop: 'IsRead', label: '状态', align: 'center', slotStatus: true, width: '50px' },
          { prop: 'AnnouncerName', label: '发布人', align: 'center' },
          { prop: 'AnnounceTime', label: '发布时间', align: 'center' }
        ]
      },
      tableData: [],

      tableOption1: {
        selected: false,
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          { prop: 'Title', label: '通知公告标题', align: 'center' },
          { prop: 'IsRead', label: '状态', align: 'center', slotStatus: true, width: '50px' },
          { prop: 'AnnouncerName', label: '发布人', align: 'center' },
          { prop: 'AnnounceTime', label: '发布时间', align: 'center' }
        ]
      },
      tablePage1: 1,
      page1: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 30]
      },
      tableData1: [],
      realName: '',
      readRow: {}
    }
  },
  mounted () {
    this.realName = decodeURI(this.cookiesObj.realName)
    // console.log(this.cookiesObj)
    this.handleList()
  },
  methods: {
    // 改变pagesize
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleList()
    },
    // 改变页码
    handleCurrentChange (val) {
      this.tablePage = val
      this.handleList()
    },
    // 改变pagesize
    handleSizeChanges (val) {
      this.page1.pageSize = val
      this.getMyNoticeList(true)
    },
    // 改变页码
    handleCurrentChanges (val) {
      this.tablePage1 = val
      this.getMyNoticeList(true)
    },
    handleSearch () {
      this.tablePage = 1
      this.handleList()
      // if (this.myChecked) {
      //   this.myChecked = true
      //   this.tablePage1 = 1
      //   this.getMyNoticeList(true)
      // }
    },
    // 根据标题，时间等获取列表
    handleList () {
      this.tableLoading = true
      let params = {
        title: this.title,
        schoolId: this.cookiesObj.schoolId,
        startTime: this.startTime,
        endTime: this.endTime,
        type: 0,
        userId: this.cookiesObj.loginUserId,
        page: this.tablePage,
        size: this.page.pageSize
      }
      this.$store.dispatch('notice/GetNoticeList', params).then(res => {
        let result = JSON.parse(res)
        if (result.Code === 200) {
          let msg = JSON.parse(result.Msg)
          this.tableData = msg.List
          if (this.tableData.length) {
            this.showPage = true
          }
          this.page.total = msg.Count
          this.page.currentPage = this.tablePage
          this.myChecked = false
        }
        this.tableLoading = false
        // this.page.currentPage = this.tablePage
      }).catch(err => {
        console.log(err)
        this.tableLoading = false
      })
    },
    changeVal (val) {
      this.title = ''
      this.startTime = ''
      this.endTime = ''

      this.tablePage1 = 1
      this.getMyNoticeList(val)
    },
    // 获取我的通知公告
    getMyNoticeList (val) {
      this.myChecked = val
      if (val) {
        this.tableLoading = true
        let params = {
          userId: this.cookiesObj.loginUserId,
          type: 0,
          page: this.tablePage1,
          size: this.page1.pageSize
        }
        this.$store.dispatch('notice/GetMyNoticeList', params).then(res => {
          let result = JSON.parse(res)
          if (result.Code === 200) {
            let msg = JSON.parse(result.Msg)
            this.tableData1 = msg.List
            if (this.tableData1.length) {
              this.showPage = true
            }
            this.page1.total = msg.Count
            this.page1.currentPage = this.tablePage1
          }
          this.tableLoading = false
          // this.page.currentPage = this.tablePage
        }).catch(err => {
          console.log(err)
          this.tableLoading = false
        })
      }
    },
    // 查看阅读情况
    handleLookDetail (row) {
      this.dialogVisibleRead = true
      // console.log(row)
      this.readRow = row
    },
    // 关闭弹窗
    closeDialog (params) {
      if (params == 'release') {
        this.dialogVisibleRelease = false
      }
      if (params == 'look') {
        this.dialogVisibleLook = false
      }
      if (params == 'edit') {
        this.dialogVisibleEdit = false
      }
      if (params == 'read') {
        this.dialogVisibleRead = false
      }
    },
    // 确认
    confirmDialog (params) {
      if (params == 'release') {
        this.dialogVisibleRelease = false
        if (this.myChecked) {
          this.tablePage1 = 1
          this.getMyNoticeList(true)
        } else {
          this.tablePage = 1
          this.handleList()
        }
      }
      if (params == 'look') {
        this.dialogVisibleLook = false
        if (this.myChecked) {
          this.tablePage1 = 1
          this.getMyNoticeList(true)
        } else {
          this.tablePage = 1
          this.handleList()
        }
      }
      if (params == 'edit') {
        this.dialogVisibleEdit = false
        if (this.myChecked) {
          this.tablePage1 = 1
          this.getMyNoticeList(true)
        } else {
          this.tablePage = 1
          this.handleList()
        }
      }
      if (params == 'read') {
        this.dialogVisibleRead = false
        if (this.myChecked) {
          this.tablePage1 = 1
          this.getMyNoticeList(true)
        } else {
          this.tablePage = 1
          this.handleList()
        }
      }
    },
    // 查看
    handleLook (row) {
      this.dialogVisibleLook = true
      this.editId = row.Id
      if (!row.IsRead) {
        let params = {
          NoticeId: row.Id,
          UserId: this.cookiesObj.loginUserId
        }
        this.$store.dispatch('notice/AddNoticeReadRecord', params).then(res => {
          let result = JSON.parse(res)
          if (result.Code === 200) {
            row.IsRead = true
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 修改
    handleEdit (row) {
      this.editId = row.Id
      this.dialogVisibleEdit = true
    },
    // 发布公告（新增公告）
    annouce () {
      this.dialogVisibleRelease = true
    },
    // 发布
    handleNotice (row) {
      let params = {
        id: row.Id
      }
      this.$store.dispatch('notice/SendNotice', params).then(res => {
        let result = JSON.parse(res)
        console.log(result)
        if (result.Code === 200) {
          this.$message.success('发布成功')
          // this.tablePage1 = 1
          this.getMyNoticeList(true)
          this.handleList()
        }
      }).catch(err => console.log(err))
    },
    // 删除
    handleDel (row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.Id
        }
        this.$store.dispatch('notice/DelNotice', params).then(res => {
          let result = JSON.parse(res)
          console.log(result)
          if (result.Code === 200) {
            this.$message.success('删除成功')
            if (this.myChecked) {
              this.tablePage1 = 1
              this.getMyNoticeList(true)
            } else {
              this.tablePage = 1
              this.handleList()
            }
          }
        }).catch(err => console.log(err))
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
@import url("./css/right/right.css");
.main {
  .notice {
    .searchButton {
      padding-left: 20px;
      padding-top: 1px;
    }
    .el-button {
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
    }
    .el-button[disabled] {
      color: #fff;
      background-color: #a0cfff;
      border-color: #a0cfff;
    }
    .row-bg {
      padding: 10px 0;
      height: 50px;
    }
    .grid-content {
      border-radius: 4px;
      min-height: 36px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      margin-left: 5px;
    }
  }
}
</style>
