<template>
  <div class="index-add">
    <!-- 新增弹窗 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="添加"
      dialogWidth="800px"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
      :btnDisabled="showDisabled"
    >
      <div class="dialog-body" slot="dialogBody">
        <el-tabs type="border-card" class="tabs-card" @tab-click="tabClick" v-model="activeName">
          <el-tab-pane label="基本信息" name="first">
            <el-form label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules">
              <el-form-item label="流程编号">
                <el-input v-model="ruleForm.instanceNumber" disabled></el-input>
              </el-form-item>
              <el-form-item label="流程标题" prop="titleName">
                <el-input v-model.trim="ruleForm.titleName" placeholder="自定义标题"></el-input>
              </el-form-item>
              <el-form-item label="流程备注" prop="remark">
                <el-input type="textarea" v-model.trim="ruleForm.remark" placeholder="请输入"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="选择流程模板" name="second">
            <el-tabs tab-position="left" @tab-click="tabChange" v-model="changeNum">
              <el-tab-pane
                v-for="(item, index) in flowList"
                :key="index"
                :label="item.FlowName"
                :name="'tab' + index"
              >
                <div class="application-content" :id="'formWrap' + index">
                  <p class="title-content">申请内容</p>
                  <div v-html="titleHtml" class="table-p"></div>
                </div>
                <div class="flow-chart">
                  <p class="title-content">流程预览</p>
                  <cvue-tree-grid :option="option"></cvue-tree-grid>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
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
import { createPublicKey } from 'crypto'
export default {
  name: 'indexAdd',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid
  },
  data () {
    return {
      showDisabled: false,
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
      ruleForm: {
        instanceNumber: new Date().getTime(),
        titleName: '',
        remark: ''
      },
      flowList: [],
      leaveReason: '',
      leaveNum: '',
      applicantName: '',
      titleHtml: '',
      tableLoading: false,
      tableOption: {
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          { prop: 'index', label: '序号', align: 'center' },
          { prop: 'NodeName', label: '流程节点', align: 'center' }
        ]
      },
      tableData: [],
      changeNum: 'tab0',
      rules: {
        titleName: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度不能超过 50 个字符',
            trigger: 'blur'
          }
        ],
        remark: [
          {
            min: 0,
            max: 500,
            message: '长度不能超过 500 个字符',
            trigger: 'blur'
          }
        ]
      },
      tableName: '',
      tableId: '',
      tabIndex: 0,
      tableTypeId: '',
      processId: '',
      deptId: []
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
      this.deptListByTeacherId()
      this.showDisabled = false
      this.activeName = 'first'
      this.ruleForm.titleName = ''
      this.ruleForm.remark = ''
      var inputs = $('#formWrap' + this.tabIndex + ' input')
      for (var i = 0; i < inputs.length; i++) {
        inputs.eq(i).val('')
      }
    },
    // 新的申请
    confirmDialog () {
      this.showDisabled = true
      var recordFieldsArr = []
      var inputs = $('#formWrap' + this.tabIndex + ' input')
      for (var i = 0; i < inputs.length; i++) {
        var obj = {}
        obj.FieldName = inputs.eq(i).attr('id')
        obj.FieldValue = inputs.eq(i).val() ? inputs.eq(i).val().trim() : inputs.eq(i).val()
        obj.RecordType = inputs.eq(i).attr('fieldType')
          ? inputs.eq(i).attr('fieldType')
          : 'string'
        recordFieldsArr.push(obj)
      }
      let params = {
        applyTitle: this.tableName,
        applyUserId: this.cookiesObj.teacherId,
        applyUserName: decodeURI(this.cookiesObj.realName),
        tableId: this.tableId,
        recordFields: JSON.stringify(recordFieldsArr)
      }
      // console.log(params)
      var paramsNew = {
        data: JSON.stringify(params)
      }
      this.$store
        .dispatch('form/ApplyFormRecord', paramsNew)
        .then(res => {
          let result = JSON.parse(res)
          // console.log(result)
          // if (result.Code == 200) {
          this.$refs.ruleForm.validate(valid => {
            if (!this.ruleForm.titleName) {
              this.$message.error('请输入流程标题')
              this.activeName = 'first'
              this.showDisabled = false
              return
            }
            if (!result.Data) {
              this.$message.error('请选择流程模板！')
              this.showDisabled = false
              return
            }
            if (!valid) return
            let paramsApply = {
              flowId: this.flowList[this.tabIndex].Id,
              formId: this.flowList[this.tabIndex].FormId,
              formRecordId: result.Data,
              tableTypeId: this.tableTypeId,
              recordCode: this.ruleForm.instanceNumber,
              recordTitle: this.ruleForm.titleName,
              recordRemark: this.ruleForm.remark,
              createUserId: this.cookiesObj.teacherId,
              createUserName: decodeURI(this.cookiesObj.realName),
              schoolId: this.cookiesObj.schoolId,
              recordFields: JSON.stringify(recordFieldsArr)
            }
            let paramsApplyNew = {
              data: JSON.stringify(paramsApply)
            }
            // console.log(paramsApplyNew)
            this.$store
              .dispatch('processCenter/Apply', paramsApplyNew)
              .then(res => {
                let result = JSON.parse(res)
                // console.log(result)
                if (result.Code == '200') {
                  this.showDisabled = true
                  this.processId = result.Data
                  this.$message.success(result.Msg)
                  this.$emit('confirmDialog')
                } else {
                  this.showDisabled = false
                  this.$message.error(result.Msg)
                }
              })
              .catch(err => {
                console.log(err)
              })
          })
          // }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据老师获取部门
    deptListByTeacherId () {
      let params = {
        teacherId: this.cookiesObj.teacherId
      }
      this.$store
        .dispatch('organization/DeptListByTeacherId', params)
        .then(res => {
          let result = JSON.parse(res)
          console.log(result)
          if (result.Code == 200) {
            this.deptId = result.Data.map(v => {
              return v.Id
            })
          } else {
            // this.$message.error(result.Msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取当前用户能够申请的所有流程
    listBySchoolId () {
      let params = {
        userId: this.cookiesObj.teacherId,
        deptId: this.deptId.join(),
        schoolId: this.cookiesObj.schoolId
      }
      this.$store
        .dispatch('processCenter/MyPowerApplyFlow', params)
        .then(res => {
          let result = JSON.parse(res)
          console.log(result)
          if (result.Code == 200) {
            this.flowList = result.Data
            this.itemById(this.flowList[0].FormId)
            this.listByFlowId(this.flowList[0].Id)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    tabClick (tab, event) {
      if (tab.index == 1) {
        console.log()
        this.changeNum = 'tab0'
        this.listBySchoolId()
      }
    },
    tabChange (tab, event) {
      console.log(tab.index)
      this.tabIndex = tab.index
      let FormId = this.flowList[tab.index].FormId
      this.itemById(FormId)
      let id = this.flowList[tab.index].Id
      this.listByFlowId(id)
    },
    // 根据id获取流程模板中的申请内容表单
    itemById (FormId) {
      let params = {
        _id: FormId
      }
      this.$store
        .dispatch('form/ItemById', params)
        .then(res => {
          let result = JSON.parse(res)
          console.log(result)
          if (result.Code == 200) {
            // this.titleHtml = result.Data.formTable.TableRemarkPC
            this.titleHtml = decodeURI(result.Data.formTable.TableRemarkPC)
            this.tableName = result.Data.formTable.TableName
            this.tableTypeId = result.Data.formTable.TypeId
            this.tableId = result.Data.formTable.Id
          } else {
            // this.$message.error(result.Msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据流程id获取节点
    listByFlowId (id) {
      let params = {
        flowId: id
      }
      this.$store
        .dispatch('processCenter/ListByFlowId', params)
        .then(res => {
          let result = JSON.parse(res)
          console.log(result)
          if (result.Code == 200) {
            // this.tableData = result.Data
            var treeData = result.Data
            for (var i = 0; i < treeData.length; i++) {
              treeData[i].children = []
              for (var j = 0; j < treeData.length; j++) {
                if (treeData[i].Id == treeData[j].ParentIds) {
                  treeData[i].children.push(treeData[j])
                }
              }
            }
            for (i = 0; i < treeData.length; i++) {
              if (treeData[i].ParentIds == '') {
                var arr = []
                arr.push(treeData[i])
                this.option.data = arr
              }
            }
          } else {
            this.option.data = []
            // this.$message.error(result.Msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleChange (value) {
      console.log(value)
    }
  }
}
</script>
<style lang="scss">
.select-width {
  width: 100%;
}
.leave-main table,
.application-content table {
  width: auto !important;
}
.table-p {
  overflow: auto;
}
.index-add {
  .dialog-body {
    max-height: 600px;
    overflow: auto;
    padding: 0 !important;
    .tabs-card {
      // height: 100%;
      box-sizing: border-box;
    }
    .el-table {
      margin-top: 30px;
    }
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
        width: 200px;
      }
      .leave-content {
        margin-top: 10px;
      }
      .leave-name {
        text-align: right;
        margin-top: 20px;
      }
    }
    // 流程图
    .flow-chart {
      margin-top: 30px;
      position: relative;
      height: 400px;
      border: 1px solid #ccc;
      .title-content {
        color: #606266;
        font-size: 18px;
        position: absolute;
        left: 40px;
        top: -12px;
        background-color: #fff;
      }
    }
  }
}
</style>
