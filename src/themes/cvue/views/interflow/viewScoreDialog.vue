<template>
    <div>
        <!-- 详情 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    title="成绩查询"
                    :isShowFoot = false
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
                </cvue-table>
            </div>            
        </cvue-dialog>
    </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
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
                    {prop: 'examstatuscode', label: '考试状态', align: 'center'},
                    {prop: 'score', label: '成绩', align: 'center'}
                ]
            },
            tableData: [
                // {no: '20180901010129', name: '吴夏楠', status: '1', score: 88}
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
         var params = {
            schoolclassId: this.$parent.classId,
            examid: this.$parent.rowObj.id,
            studentscore: []
          }
          console.log(params)
          this.dialogLoading = true
          this.$store.dispatch('interflow/SaveStuScore', params).then(res => {
              console.log(res)
              var result = JSON.parse(res)
              if (result.code == 200) {
                  this.$message({
                      message: res.msg,
                      duration: 2000,
                      type: 'success'
                  })
                  this.$emit('confirmDialog')
              } else {
                  this.$message({
                      message: res.msg,
                      duration: 2000,
                      type: 'error'
                  })
              }
              this.dialogLoading = false
          })
        },
        // 获取详情
        getDetail () {
          var params = {
            classId: this.$parent.classId,
            examid: this.$parent.rowObj.id
          }
          this.dialogLoading = true
          this.$store.dispatch('interflow/GetQueryScoreView', params).then(res => {
              var result = JSON.parse(res)
              if (result.Code == 200) {
                  var data = result.Data
                  this.tableData = data
              } else {
                  this.$message({
                      type: 'error',
                      message: res.message
                  })
              }
              this.dialogLoading = false
          })
        }
    }
}
</script>
<style lang="sass" scoped>
</style>
