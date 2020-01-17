<template>
    <div>
        <!-- 详情 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    title="成绩录入"
                    :isShowFoot = true
                    dialogWidth="700px"
                    @handleOpen="getDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <cvue-table :option="tableOption" :data="tableData" ref="tbl" 
                    :isShowAdd="false" :layout="layout"
                    :tablePage="tablePage" :pageSize="page.pageSize"
                    :loading="dialogLoading"
                    :isShowPage="false">
                    <template slot-scope="scope" slot="examstatuscode">
                        <el-select v-model="scope.row.examstatuscode" placeholder="考试状态"  size="mini">
                            <el-option
                                size="mini"
                                v-for="item in options"
                                :key="item.ValCode"
                                :label="item.ValName"
                                :value="item.ValCode">
                            </el-option>
                        </el-select>
                    </template>
                    <template slot-scope="scope" slot="score">
                        <el-input v-model.trim="scope.row.score" placeholder="请输入分数" @input="changeInput(scope.row.score, scope.row)" type="Number"></el-input>
                    </template>
                </cvue-table>
            </div>            
        </cvue-dialog>
    </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import {getCookie} from '@/util/tool'
export default {
    name: 'SchoolOrderDetail',
    components: {
        cvueDialog,
        cvueTable
    },
    data () {
        return {
            examStatus: '',
            dialogLoading: false,
            options: [
                {
                    label: '正常',
                    value: 1
                },
                {
                    label: '缺考',
                    value: 2
                },
                {
                    label: '缓考',
                    value: 3
                },
                {
                    label: '禁考',
                    value: 4
                }
            ],
            tablePage: 1,
            layout: 'total,sizes,prev,pager,next,jumper',
            page: {
                total: 1, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 7, // 每页显示多少条
                pageSizes: [7, 10, 50, 100]
            },
            tableOption: {
                stripe: true,
                width: '100%',
                border: true,
                index: false,
                cloumn: [
                    // {prop: 'no', label: '学号', align: 'center'},
                    {prop: 'name', label: '姓名', align: 'center'},
                    {prop: 'examstatuscode', label: '考试状态', align: 'center', slotStatus: true},
                    {prop: 'score', label: '成绩', align: 'center', slotStatus: true}
                ]
            },
            tableData: [
                {no: '20180901010129', name: '吴夏楠', status: '1', score: 88}
            ]
        }
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 触发事件
        handleClose () {
            this.$emit('handleClose')
        },
        closeDialog () {
            this.$emit('closeDialog')
        },
        confirmDialog () {
          var endTime = this.$parent.packEndTime.replace('年','-').replace('月','-').replace('日','-')
          var now = (new Date()).getTime()
          var packEndTime = (new Date(endTime)).getTime()
          if (now < packEndTime) {
            this.$message({
              message: '考试还没有结束',
              duration: 2000,
              type: 'error'
            })
            return
          }

          for (var i = 0; i < this.tableData.length; i++) {
            // console.log(this.tableData[i].score)
            // console.log(this.tableData[i].score === '')
            if(this.tableData[i].score === ''){
              this.$message({
                  message: '分数不能为空',
                  duration: 2000,
                  type: 'error'
              })
              return
            }
          }
          var studentscore = this.tableData.map((item) => {
            return {
              Id: item.Id,
              ExamId: item.examid,
              SchoolClassId: item.SchoolClassId,
              StudentId: item.studentid,
              StudentName: item.name,
              Score: item.score,
              ExamStatusCode: item.examstatuscode
            }
          })
          var params = {
            schoolclassId: this.$parent.classId,
            examid: this.$parent.rowObj.id,
            studentscore: studentscore
          }
          var newParams = {
            data: JSON.stringify(params)
          }
          this.dialogLoading = true
          this.$store.dispatch('interflow/SaveStuScore', newParams).then(res => {
              // console.log(res)
              var result = JSON.parse(res)
              if (result.Code == '操作成功') {
                  this.$message({
                      message: result.Code,
                      duration: 2000,
                      type: 'success'
                  })
                  this.$emit('confirmDialog')
                  this.getPoints(1004)
              } else {
                  this.$message({
                      message: result.Code,
                      duration: 2000,
                      type: 'error'
                  })
              }
              this.dialogLoading = false
          })
        },
        // 获取详情
        getDetail () {
          this.inputStuScoreEdit()
        },
        inputStuScoreEdit () {
          var params = {
            schoolclassId: this.$parent.classId,
            examid: this.$parent.rowObj.id,
            schoolyearId: this.$parent.schoolyearId,
            schooltermid: this.$parent.schooltermid,
            gradeId: this.$parent.gradeId
          }
          this.dialogLoading = true
          this.$store.dispatch('interflow/InputStuScoreEdit', params).then(res => {
            var result = JSON.parse(res)
            if (result.Code == 200) {
              this.tableData = result.Data
              // console.log(this.tableData)
              this.options = this.tableData[0].dicList
            }
            this.dialogLoading = false
          })
        },
        changeInput (val, row) {
          console.log(val)
          console.log(row)
          // if (val == '') {
          //   this.$set(row, 'score', 0)
          //   row.score = 0
          // }
        },
        //添加积分
        getPoints (typt) {
          var pointParams = {
            loginUresId: getCookie('loginUserId'),
            roleCode: getCookie('roleCode'),
            realName: getCookie('realName'),
            type: typt
          }
          this.$store.dispatch('interflow/AddPoint',pointParams).then((res)=>{
            console.log(res)
          })
        }
    }
}
</script>
<style lang="sass" scoped>
</style>
