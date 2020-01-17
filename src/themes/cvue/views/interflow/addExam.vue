<template>
    <div class="home">
        <!-- 表单 -->
        <el-card class="box-card mt-15">
            <div class="home-form">
                <el-form ref="ruleForm" label-width="60px" @submit.native.prevent>
                    <el-row :gutter="10">
                        <el-col :span="4">
                            <el-form-item label="学年" prop="year">
                                <el-select v-model="year" placeholder="学年"  size="mini" @change="changeSchoolYear">
                                    <el-option
                                        size="mini"
                                        v-for="item in schoolYear"
                                        :key="item.Id"
                                        :label="item.Name"
                                        :value="item.Id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="学期" prop="term">
                                <el-select v-model="term" placeholder="学期"  size="mini" @change="changeTerm">
                                    <el-option
                                        size="mini"
                                        v-for="item in schoolTerm"
                                        :key="item.Id"
                                        :label="item.Name"
                                        :value="item.Id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="年级" prop="grades">
                                <el-select v-model="grades" placeholder="年级"  size="mini" @change="changeGrades">
                                    <el-option
                                        size="mini"
                                        v-for="item in schoolGrades"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="班级" prop="classes">
                                <el-select v-model="classes" placeholder="班级"  size="mini" @change="changeClasses">
                                    <el-option
                                        size="mini"
                                        v-for="item in schoolClasses"
                                        :key="item.Id"
                                        :label="item.Name"
                                        :value="item.Id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch" class="search-btn">查询</el-button>
                        </el-col>
                        <el-col :span="4" style="text-align:right">
                            <!-- <el-button size="mini" v-hasPermission="permission.add">退出</el-button> -->
                        </el-col>
                    </el-row>      
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix fix-lh">
                <span>添加考试</span>
                <div class="btn-list">
                    <el-button size="mini" @click="handleAdd">新增</el-button>
                    <el-button size="mini" @click="handleAllDelete" :disabled="isTeacher">删除</el-button>
                </div>
            </div>
            <div class="home-body">
                <cvue-table :option="tableOption" :data="tableData" ref="tbl1"
                            :isShowAdd="false" :page="page" 
                            :tablePage="tablePage" :pageSize="page.pageSize"
                            :loading="tableLoading"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            @checkChange="handleCheckChange"
                            :isShowPage="true">
                    <!-- 操作按钮 -->
                    <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                        header-align="center"  width="160">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleEdit(scope.row)" v-hasPermission="permission.edit" :disabled="isTeacher">编辑</el-button>
                            <!-- <el-button type="text" size="small" @click="handleFaultAnalysis(scope.row)">故障分析</el-button> -->
                            <el-button type="text" size="small" @click="handleDelete(scope.row)" v-hasPermission="permission.delete" :disabled="isTeacher">删除</el-button>
                        </template>
                    </el-table-column>
                </cvue-table>
            </div>
        </el-card>
        <!-- 详情 -->
        <add-exam-dialog
                @closeDialog="closeDialog('add')"
                @confirmDialog="confirmDialog('add')"
                @handleClose="closeDialog('add')"
                :dialogVisible="dialogVisibleAdd">
        </add-exam-dialog>
        <edit-exam-dialog
                @closeDialog="closeDialog('edit')"
                @confirmDialog="confirmDialog('edit')"
                @handleClose="closeDialog('edit')"
                :dialogVisible="dialogVisibleEdit">
        </edit-exam-dialog>
    </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import addExamDialog from './addExamDialog'
import editExamDialog from './editExamDialog'
import { baseUrl } from '@/config/config.js'
export default {
    name: 'Home',
    components: {
        cvueTable,
        cvueDialog,
        addExamDialog,
        editExamDialog
    },
    computed: {
      ...mapGetters(['cookiesObj'])
    },
    data () {
        return {
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
                    {prop: 'index', label: '序号', align: 'center', width: 80},
                    {prop: 'schoolclassname', label: '班级', align: 'center', solt: true, width: 120},
                    {prop: 'examname', label: '考试名称', align: 'center', width: 300},
                    {prop: 'subject', label: '科目', align: 'center', width: 120},
                    {prop: 'begintime', label: '考试开始时间', align: 'center'},
                    {prop: 'endtime', label: '考试结束时间', align: 'center'},
                    {prop: 'masterInvigilator', label: '主监考老师', align: 'center'},
                    {prop: 'assistantinvigilator', label: '辅监考老师', align: 'center'}
                ]
            },
            tableData: [
            ],
            schoolYear: '',
            schoolTerm: '',
            schoolGrades: '',
            schoolClasses: '',
            year: '',
            term: '',
            grades: '',
            classes: '',
            schoolyearId: '',
            gradeId: '',
            schooltermid: '',
            classId: '',
            rowObj: {},
            checkData: [],
            isTeacher: false
        }
    },
    mounted () {
        // console.log(this.cookiesObj)
        this.getYear()
        // this.getTerm()
        this.getGrades()
        this.getClasses()
        // this.handleList(this.classId, this.schoolyearId, this.schooltermid)
        if (this.cookiesObj.roleCode == 'Teacher') {
          this.isTeacher = true
          this.tableOption.selected = false
        }
    },
    methods: {
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
        handleList (classId, schoolyearId, schooltermid) {
            this.tableLoading = true
            var params = {
                classId: classId,
                schoolyearId: schoolyearId,
                schooltermid: schooltermid,
                index: this.tablePage,
                size: this.page.pageSize
            }
            this.$store.dispatch('interflow/GetList', params).then(res => {
                var result = JSON.parse(res)
                console.log(result)
                if (result.Code == 200) {
                  var data = result.Data
                  this.tableData = data.list
                  this.tableData.forEach((item, index) => {
                    this.tableData[index].schoolclassname = JSON.parse(item.schoolclassname).Code
                    this.tableData[index].subject = JSON.parse(item.subject).Code
                  })
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
            console.log(row)
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
            console.log(row)
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
        // 获取学年
        getYear () {
            this.$store.dispatch('interflow/GetYear', '').then(res => {
                // console.log(res)
                var result = JSON.parse(res)
                if (result.Code == 200) {
                   this.schoolYear = [{Name: '请选择', Id: ''}].concat(result.Data)
                }
            })
        },
        // 获取学期
        getTerm () {
            var params = {
                schoolId: this.cookiesObj.schoolId,
                schoolyearId: this.schoolyearId
            }
            this.$store.dispatch('interflow/GetTerm', params).then(res => {
              var result = JSON.parse(res)
              if (result.Code == 200) {
                this.schoolTerm = [{Name: '请选择', Id: ''}].concat(result.Data)
                // console.log(this.schoolTerm)
              }
            })
        },
        // 获取年级
        getGrades () {
            var params = {
                schoolId: this.cookiesObj.schoolId
            }
            this.$store.dispatch('interflow/GetGrades', params).then(res => {
                var result = JSON.parse(res)
                if (result.Code == 200) {
                  this.schoolGrades = [{name: '请选择', id: ''}].concat(result.Data.data)
                  // console.log(this.schoolGrades)
                }
            })
        },
        // 获取班级
        getClasses () {
            var params = {
                schoolId: this.cookiesObj.schoolId,
                schoolyearId: this.schoolyearId,
                gradeId: this.gradeId
            }
            this.$store.dispatch('interflow/GetClasses', params).then(res => {
                // console.log(res)
                var result = JSON.parse(res)
                if (result.Code == 200) {
                  this.schoolClasses = [{Name: '请选择', Id: ''}].concat(result.Data)
                }
            })
        },
        // 学年change
        changeSchoolYear (val) {
          this.schoolyearId = val
          this.getTerm()
          this.getClasses()
          this.term = ''
          this.schooltermid = ''
          this.grades = ''
          this.gradeId = ''
          this.classes = ''
          this.classId = ''
        },
        // 年级change
        changeGrades (val) {
          this.gradeId = val
          this.getClasses()
          this.classes = ''
          this.classId = ''
        },
        // 学期change
        changeTerm (val) {
          this.schooltermid = val
        },
        // 班级change
        changeClasses (val) {
          this.classId = val
        },
        handleCheckChange (val) {
          this.checkData = val
        },
        handleAllDelete (val) {
          if(this.checkData.length == 0){
            this.$message({
              type: 'error',
              message: '请先选择考试'
            })
            return
          }
          this.$confirm('确定要删除吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              var ids = ''
              for (var i = 0; i < this.checkData.length; i++) {
                ids += this.checkData[i].id + '|'
              }
              var params = {
                examIds: ids.substring(0, ids.length-1)
              }
              this.$store.dispatch('interflow/DeleteLists', params).then(res => {
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
        }
    }
}
</script>
<style lang="scss">
    .home{
        padding: 0px!important;
        height: auto!important;
        .btn-list{
            float: right;
        }
        .el-card__header{
            border-bottom: none;
        }
        .fix-lh{
            line-height: 32px;
        }
        .text-right{
            text-align: right;
        }
        .home-form{
            // margin-bottom: 7px;
            // margin-top: -17px;
        }
        .el-card__header,.el-card__body{
            padding: 15px;
        }
        .el-input.is-disabled .el-input__inner{
            color: #606266;
        }
        .el-table__body{
            tr td:nth-child(2) span{
                // color: #409EFF;
                cursor: pointer;
            }
            tr td:nth-child(5) span{
                cursor: pointer;
            }
            tr td:nth-child(6) span,tr td:nth-child(7) span,tr td:nth-child(8) span{
                // color: #409EFF;
                cursor: pointer;
            }
            tr td:nth-child(9) span,tr td:nth-child(10) span,tr td:nth-child(11) span,tr td:nth-child(12) span,tr td:nth-child(13) span{
                // color: #409EFF;
                cursor: pointer;
            }
        }
        .table-body{
            margin-top: 20px;
        }
        .fault-wrap{
            margin-top: 20px;
        }
        .fault-body{
            width: 100%;
            height: 100%;
            min-height: 300px;
            background: #000000;
            color: #fff;
            font-size: 16px;
            border-radius: 4px;
            padding: 10px;
            box-sizing: border-box;
        }
    }
    .batch-import {
      display: flex;
      align-items: center;
      .upload {

      }
      .downliad {
        width: 100%;
        flex: 1;
        text-align: center;
      }
    }

</style>
