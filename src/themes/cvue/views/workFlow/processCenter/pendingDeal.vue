<template>
  <div class="index-deal">
    <!-- 新增弹窗 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="处理流程"
      dialogWidth="800px"
      :btnDisabled="disabled"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
    >
      <div class="dialog-body" slot="dialogBody">
        <el-tabs type="border-card" class="tabs-card" @tab-click="tabClick" v-model="activeName">
          <el-tab-pane label="流程信息" name="first">
            <cvue-tree-grid :option="option"></cvue-tree-grid>
          </el-tab-pane>
          <el-tab-pane label="表单信息" name="second">
            <div class="leave-main" v-html="this.TableRemark"></div>
          </el-tab-pane>
        </el-tabs>
        <div class="audit-results">
          <el-form :model="ruleForm" ref="ruleForm" label-width="120px" :rules="rules">
            <el-form-item label="审核结果" prop="results">
              <el-radio-group v-model="ruleForm.results">
                <el-radio :label="10">同意</el-radio>
                <el-radio :label="20">不同意</el-radio>
                <el-radio :label="2">驳回</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核意见" prop="suggestion">
              <el-input class="textarea" type="textarea" v-model.trim="ruleForm.suggestion"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </cvue-dialog>
  </div>
</template>
<script>
import $ from 'jquery'
import { mapState, mapGetters } from 'vuex'
import cvueTreeGrid from '@/components/cvue-tree-grid'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
export default {
  name: 'indexAdd',
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
      flowList: [],
      leaveReason: '',
      leaveNum: '',
      applicantName: '',
      ruleForm: {
        results: 10,
        suggestion: ''
      },
      rules: {
        suggestion: [
          { min: 0, max: 50, message: '长度超过 50 个字符', trigger: 'blur' }
        ]
      },
      TableRemark: '',
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
      bottomTableData: [],
      deptId: [],
      nodeId: '',
      disabled: false
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['cookiesObj'])
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    // 根据老师获取部门
    deptListByTeacherId () {
      let params = {
        teacherId: this.cookiesObj.teacherId
        // teacherId: '0d225865afa745aa8cbdcadb3feee129'
      }
      this.$store
        .dispatch('organization/DeptListByTeacherId', params)
        .then(res => {
          let result = JSON.parse(res)
          // console.log(result)
          if (result.Code == 200) {
            this.deptId = result.Data.map(v => {
              return v.Id
            })
            // console.log(this.deptId)
          } else {
            // this.$message.error(result.Msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 触发事件
    handleClose () {
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    // 初始化弹窗
    getDetail () {
      // console.log(this.cookiesObj)
      // console.log(this.$parent.dealRow)
      this.activeName = 'first'
      this.recordNodeByFlowRecordId()
      this.deptListByTeacherId()
    },
    confirmDialog () {
      this.disabled = true
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        let params = {
          userId: this.cookiesObj.teacherId,
          userName: decodeURI(this.cookiesObj.realName),
          deptId: this.deptId.join(),
          recordNodeId: this.nodeId,
          opRemark: this.ruleForm.suggestion,
          opState: this.ruleForm.results
        }
        let newParams = {
          data: JSON.stringify(params)
        }
        this.$store.dispatch('processCenter/DealNode', newParams).then(res => {
          let result = JSON.parse(res)
          // console.log(result)
          if (result.Code == 200) {
            this.$message.success(result.Msg)
            this.$emit('confirmDialog')
            window.location.reload()
          } else {
            this.$message.error(result.Msg)
          }
          this.disabled = false
        }).catch(err => {
          this.disabled = false
          console.log(err)
        })
      })
    },
    tabClick (tab, event) {
      if (tab.index == 1) {
        this.itemByRecordIdFormRecord()
      }
    },
    // 流程信息
    recordNodeByFlowRecordId () {
      let params = {
        flowRecordId: this.$parent.dealRow.Id
      }
      this.$store.dispatch('processCenter/RecordNodeByFlowRecordId', params).then(res => {
        let result = JSON.parse(res)
        console.log(result)
        if (result.Code == 200) {
          // this.bottomTableData = result.Data
          result.Data.forEach(v => {
            if (v.DealState === 1) {
              this.nodeId = v.Id
            }
          })
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
          this.$message.error(result.Msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    itemByRecordIdFormRecord () {
      let params = {
        recordId: this.$parent.dealRow.FormRecordId
      }
      this.$store.dispatch('form/ItemByRecordIdFormRecord', params).then(res => {
        let result = JSON.parse(res)
        // console.log(result)
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
.index-deal {
  .leave-main table {
    width: auto !important;
  }
  .leave-main {
    overflow: auto;
    input {
      margin-bottom: 5px;
    }
  }
  .dialog-body {
    max-height: 600px;
    overflow-x: hidden;
    padding: 0 !important;
    .tabs-card {
      overflow-y: auto;
      float: left;
      width: 500px;
      height: 600px;
      box-sizing: border-box;
    }
    // .el-tabs--border-card {
    //   border: none;
    //   // border-right: 1px solid #dcdfe6;
    //   box-shadow: none;
    // }
    // 请假条
    .application-content {
      margin-top: 10px;
      border: 1px solid #ccc;
      padding: 15px 20px;
      position: relative;

      .title-content {
        color: #606266;
        font-size: 18px;
        position: absolute;
        left: 40px;
        top: -12px;
        background-color: #fff;
      }
      h3 {
        margin-top: 10px;
        text-align: center;
        font-size: 20px;
      }
      .text-input {
        width: 150px;
      }
      .leave-content {
        margin-top: 10px;
      }
      .leave-name {
        text-align: right;
        margin-top: 20px;
      }
    }
    .flow-chart {
      height: 400px;
      border: 1px solid #ccc;
    }
    // 审核结果
    .audit-results {
      margin-left: 500px;
      background-color: gainsboro;
      border-bottom: 1px solid #dcdfe6;
      box-sizing: border-box;
      height: 600px;

      .el-form {
        float: left;

        .el-form-item {
          margin-right: 10px;
        }
        .el-radio-group {
          margin-top: 10px;
        }
        .el-radio {
          display: block;
          margin-bottom: 10px;
        }
        .textarea {
          max-height: 300px;
          overflow: auto;
        }
      }
    }
  }
}
</style>
