<template>
  <div class="pending-detail">
    <!-- 新增弹窗 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="进度详情"
      dialogWidth="800px"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
      :isShowFoot="false"
    >
      <div class="dialog-body" slot="dialogBody">
        <el-tabs type="border-card" class="tabs-card" @tab-click="tabClick" v-model="activeName">
          <el-tab-pane label="流程信息" name="first">
            <div class="top-table">
              <cvue-table
                :option="tableOption"
                :data="tableData"
                ref="tbl1"
                :isShowAdd="false"
                :loading="tableLoading"
              >
                <template slot-scope="scope" slot="OpState">
                  <el-tag v-if="scope.row.OpState == 0">待处理</el-tag>
                  <el-tag v-if="scope.row.OpState == 1">处理中</el-tag>
                  <el-tag v-else-if="scope.row.OpState == 10" type="success">审批通过</el-tag>
                  <el-tag v-else-if="scope.row.OpState == 20" type="danger">不通过</el-tag>
                  <el-tag v-else-if="scope.row.OpState == 3" type="info">已取消</el-tag>
                  <el-tag v-else-if="scope.row.OpState == 30" type="success">抄送成功</el-tag>
                  <el-tag v-else type="warning">驳回</el-tag>
                </template>
                <template slot-scope="scope" slot="OpDateTime">
                  <span>{{ scope.row.OpDateTime | getTime }}</span>
                </template>
              </cvue-table>
            </div>
            <div class="bottom-table">
              <h3 style="margin: 10px 0">流程图</h3>
              <!-- <cvue-table
                :option="bottomTableOption"
                :data="bottomTableData"
                ref="tbl1"
                :isShowAdd="false"
                :loading="bottomTableLoading"
              ></cvue-table>-->
              <cvue-tree-grid :option="option"></cvue-tree-grid>
            </div>
          </el-tab-pane>
          <el-tab-pane label="表单信息" name="second">
            <div class="leave-main" v-html="this.TableRemark"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </cvue-dialog>
  </div>
</template>
<script>
import $ from 'jquery'
import cvueTreeGrid from '@/components/cvue-tree-grid'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
export default {
  name: 'pendingDetail',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid
  },
  data () {
    return {
      option: {
        index: true,
        expandAll: true,
        columns: [
          {
            text: '流程节点',
            value: 'NodeName',
            align: 'center'
          }
        ],
        data: []
      },
      activeName: 'first',
      tableLoading: false,
      tableOption: {
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          {
            prop: 'OpState',
            label: '流转状态',
            align: 'center',
            slotStatus: true
          },
          { prop: 'NodeName', label: '流程节点', align: 'center' },
          { prop: 'OpRemark', label: '审核意见', align: 'center' },
          { prop: 'OpUserName', label: '操作人', align: 'center' },
          { prop: 'OpDateTime', label: '更新时间', align: 'center', slotStatus: true }
        ]
      },
      tableData: [],
      TableRemark: '',
      // 流程表
      bottomTableLoading: false,
      bottomTableOption: {
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          { prop: 'index', label: '序号', align: 'center' },
          { prop: 'NodeName', label: '流程节点', align: 'center' }
        ]
      },
      bottomTableData: []
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    getTime (date) {
      let arr = date.split('T')
      let d = arr[0]
      let t = arr[1]
      return d + ' ' + t
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    // 触发事件
    handleClose () {
      // this.$refs['ruleForm'].clearValidate()
      // this.$refs['ruleForm'].resetFields()
      this.$emit('handleClose')
    },
    closeDialog () {
      // this.$refs['ruleForm'].clearValidate()
      // this.$refs['ruleForm'].resetFields()
      this.$emit('closeDialog')
    },
    // 初始化弹窗
    getDetail () {
      this.activeName = 'first'
      this.recordOperateLogByFlowRecordId()
      this.recordNodeByFlowRecordId()
    },
    // 流程记录表格
    recordOperateLogByFlowRecordId () {
      let params = {
        flowRecordId: this.$parent.lookRow.Id
      }
      this.$store.dispatch('processCenter/RecordOperateLogByFlowRecordId', params).then(res => {
        let result = JSON.parse(res)
        console.log(result)
        if (result.Code == 200) {
          this.tableData = result.Data
        } else {
          // this.$message.error(result.Msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 流程图
    recordNodeByFlowRecordId () {
      let params = {
        flowRecordId: this.$parent.lookRow.Id
      }
      this.$store.dispatch('processCenter/RecordNodeByFlowRecordId', params).then(res => {
        let result = JSON.parse(res)
        console.log(result)
        if (result.Code == 200) {
          // this.bottomTableData = result.Data
          var treeData = result.Data
          for (var i = 0; i < treeData.length; i++) {
            treeData[i].children = []
            for (var j = 0; j < treeData.length; j++) {
              if (treeData[i].Id == treeData[j].RecordNodeParentId) {
                treeData[i].children.push(treeData[j])
              }
            }
          }
          for (i = 0; i < treeData.length; i++) {
            if (treeData[i].RecordNodeParentId == '') {
              var arr = []
              arr.push(treeData[i])
              this.option.data = arr
            }
          }
          this.$nextTick(res => {
            $('.active-row').closest('tr').css('background', '#fdf5e6')
          })
        } else {
          // this.$message.error(result.Msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    confirmDialog () {

    },
    // 切换
    tabClick (tab, event) {
      console.log(tab.index)
      if (tab.index == 1) {
        this.itemByRecordIdFormRecord()
      }
    },
    itemByRecordIdFormRecord () {
      let params = {
        recordId: this.$parent.lookRow.FormRecordId
      }
      this.$store.dispatch('form/ItemByRecordIdFormRecord', params).then(res => {
        let result = JSON.parse(res)
        console.log(result)
        if (result.Code == 200) {
          this.TableRemark = decodeURI(result.Data.formRecord.TableRemarkPC)
          this.$nextTick(() => {
            result.Data.recordFieldList.forEach((item, index) => {
              // document.getElementById(item.FieldName).value = item.FieldValue
              $('#' + item.FieldName).val(item.FieldValue)
              $('#' + item.FieldName).attr('disabled', true)
            })
          })
        } else {
          this.$message.error(result.Msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss">
.select-width {
  width: 100%;
}
.pending-detail {
  .dialog-body {
    max-height: 500px;
    overflow: auto;
    padding: 0 !important;
    .tabs-card {
      height: 100%;
      box-sizing: border-box;
    }
    .leave-main table {
      width: auto !important;
    }
    .leave-main {
      overflow: auto;
      input {
        margin-bottom: 5px;
      }
      h3 {
        text-align: center;
        font-size: 30px;
        margin-top: 10px;
        margin-bottom: 30px;
      }
      .content {
        padding: 0 80px;
        text-indent: 2em;
        p:nth-child(2) {
          text-align: right;
        }
      }
      .applicant {
        text-align: right;
        margin-top: 20px;
      }
    }
  }
}
</style>
