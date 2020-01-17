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
                <span>录入成绩</span>
                <div class="btn-list">
                    <!-- <el-button size="mini" >退出</el-button> -->
                </div>
            </div>
            <div class="home-body">
                <cvue-table :option="tableOption" :data="tableData" ref="tbl1"
                            :isShowAdd="false" :page="page" 
                            :tablePage="tablePage" :pageSize="page.pageSize"
                            :loading="tableLoading"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            :isShowPage="true">
                    <!-- 操作按钮 -->
                    <el-table-column fixed="right" slot="actionMenu" label="操作" align="center"
                        header-align="center"  width="160">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleRecord(scope.row)" v-hasPermission="permission.edit">成绩录入</el-button>
                        </template>
                    </el-table-column>
                </cvue-table>
            </div>
        </el-card>
        <record-score-dialog
                @closeDialog="closeDialog('record')"
                @confirmDialog="confirmDialog('record')"
                @handleClose="closeDialog('record')"
                :dialogVisible="dialogVisibleRecord">
        </record-score-dialog>
    </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import recordScoreDialog from './recordScoreDialog'
import { baseUrl } from '@/config/config.js'
export default {
    name: 'Home',
    components: {
        cvueTable,
        cvueDialog,
        recordScoreDialog
    },
    computed: {
      ...mapGetters(['cookiesObj'])
    },
    data () {
        return {
            tableLoading: false,
            dialogVisibleRecord: false,
            tablePage: 1,
            page: {
                total: 1, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10, // 每页显示多少条
                pageSizes: [10, 50, 100]
            },
            tableOption: {
                selected: false,
                stripe: true,
                width: '100%',
                border: true,
                index: false,
                cloumn: [
                    {prop: 'index', label: '序号', align: 'center', width: 80},
                    {prop: 'examname', label: '考试名称', align: 'center'},
                    {prop: 'subject', label: '科目', align: 'center'},
                    {prop: 'begintime', label: '考试开始时间', align: 'center'},
                    {prop: 'endtime', label: '考试结束时间', align: 'center'}
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
            packEndTime: ''
        }
    },
    mounted () {
        this.getYear()
        // this.getTerm()
        this.getGrades()
        this.getClasses()
        // this.handleList(this.year, this.term, this.grades, this.classes)
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
            this.$store.dispatch('interflow/GetScoreList', params).then(res => {
                var result = JSON.parse(res)
                // console.log(result)
                if (result.Code == 200) {
                  var data = result.Data
                  this.tableData = data.list
                  this.page.total = data.count
                  this.tableData.forEach((item, index) => {
                    this.tableData[index].subject = JSON.parse(item.subject).Code
                  })
                } else {
                    this.$message({
                        message: res.msg,
                        duration: 2000,
                        type: 'error'
                    })
                }
                this.tableLoading = false
                this.page.currentPage = this.tablePage
            }).catch(err => {
                console.log(err)
                this.tableLoading = false
            })
        },
        // 关闭弹窗
        closeDialog (params) {
            if (params == 'record') {
                this.dialogVisibleRecord = false
            }
        },
        // 确认
        confirmDialog (params) {
            if (params == 'record') {
                this.dialogVisibleRecord = false
            }
        },
        // 新增
        handleRecord (row) {
          this.rowObj = row
          this.packEndTime = row.endtime
          // console.log(row)
          this.dialogVisibleRecord = true
        },
        // 删除
        handleDelete (row) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.log(row.id)
                this.$store.dispatch('home/DeleteCybercafesDetail', row.id).then(res => {
                    // console.log(res)
                    if (res.code == 1) {
                        this.$message({
                            type: 'success',
                            message: res.msg
                        })
                        this.keyword = ''
                        this.status = ''
                        this.tablePage = 1
                        this.handleList(this.keyword, this.status)
                        // this.getCybercafeNum() // 获取网吧数量
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            }).catch(() => {
            })
        },
        // 获取学年
        getYear () {
            this.$store.dispatch('interflow/GetYear', '').then(res => {
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
            // tr td:nth-child(2) span{
            //     color: #409EFF;
            //     cursor: pointer;
            // }
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
