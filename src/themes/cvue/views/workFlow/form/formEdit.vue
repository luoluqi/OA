<template>
  <div>
    <div class="form-add">
      <!-- 新增弹窗 -->
      <cvue-dialog
        :dialogVisible="dialogVisible"
        title="编辑"
        dialogWidth="1000px"
        @handleOpen="getDetail"
        @closeDialog="closeDialog"
        @confirmDialog="confirmDialog"
        @handleClose="handleClose"
      >
        <div class="dialog-body" slot="dialogBody">
          <el-tabs type="border-card" class="tabs-card" @tab-click="tabClick" v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="表单名称" prop="tableName">
                      <el-input v-model="ruleForm.tableName" placeholder="表单名称" @change="setTrim"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="排序码" prop="tableSort">
                      <el-input v-model="ruleForm.tableSort" placeholder="排序码"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="是否启用" prop="tableState">
                      <el-radio-group v-model="ruleForm.tableState">
                        <el-radio :label="true">启用</el-radio>
                        <el-radio :label="false">禁用</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="表单模板" name="second">
              <el-row :gutter="20">
                <el-col :span="6">
                  <div class="table-form-wrap">
                    <div class="btn-list">
                      <span @click="addFormField">新增</span>
                      <span @click="editFormField">编辑</span>
                      <span @click="deleteFormField">删除</span>
                    </div>
                    <div class="form-add-table">
                      <cvue-table :option="tableOption" 
                                  :data="tableData" 
                                  ref="tbl1"
                                  :isShowAdd="false" 
                                  :page="page"
                                  :tablePage="tablePage" 
                                  :pageSize="page.pageSize"
                                  :loading="tableLoading"
                                  :layout = "layout"
                                  @rowClick= "handleRowClick"
                                  @current-change="handleCurrentChange"
                                  @size-change="handleSizeChange"
                                  @checkChange="handleCheckChange"
                                  :isShowPage="false">
                      </cvue-table>
                    </div>
                  </div>
                </el-col>
                <el-col :span="18">
                  <el-radio-group v-model="radioItem" @change="radioChange">
                    <el-radio :label="1">PC端</el-radio>
                    <el-radio :label="2">移动端</el-radio>
                  </el-radio-group>
                  <div class="edit-wrap" v-show="radioItem === 1">
                    <div ref="editorPCEdit" class="editor"></div>
                  </div>
                  <div class="edit-wrap" v-show="radioItem === 2">
                    <div ref="editorMobileEdit" class="editor"></div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </cvue-dialog>
    </div>
    <!-- 新增弹窗 -->
    <form-edit-field
      @closeSecDialog="closeSecDialog('formFieldEdit')"
      @confirmSecDialog="confirmSecDialog('formFieldEdit')"
      @handleSecClose="closeSecDialog('formFieldEdit')"
      :dialogVisible="dialogVisibleFormFieldEdit">
    </form-edit-field>
  </div>
</template>
<script>
import E from 'wangeditor'
import cvueTreeGrid from '@/components/cvue-tree-grid'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import formEditField from './formEditField'
import {validNum} from '@/util/validator.js'
var editorPC
var editorMobile
export default {
  name: 'FormEdit',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid,
    formEditField
  },
  data () {
    return {
      activeName: 'first',
      radioItem: 1,
      dialogVisibleFormFieldEdit: false,
      tableLoading: false,
      layout: 'total, prev, pager, next, jumper',
      typeId: '',
      ruleForm: {
        tableName: '',
        tableSort: '',
        tableState: true
      },
      rules: {
        tableName: [
          { required: true, message: '表单名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        tableSort: [
          { required: true, trigger: 'blur', validator: validNum }
        ]
      },
      tablePage: 1,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 50, 100]
      },
      tableOption: {
        stripe: false,
        width: '100%',
        border: true,
        index: false,
        selected: true,
        cloumn: [
          {prop: 'ShowTitle', label: '字段名称', align: 'center'}
        ]
      },
      tableData: [
      ],
      formFieldData: {},
      action: '',
      tableId: '',
      tableFieldData: [],
      editContentPC: '',
      editContentMobile: ''
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
  },
  methods: {
    // 关闭弹窗
    closeSecDialog (params) {
      if (params == 'formFieldEdit') {
        this.dialogVisibleFormFieldEdit = false
      }
    },
    // 确认
    confirmSecDialog (params) {
      if (params == 'formFieldEdit') {
        this.dialogVisibleFormFieldEdit = false
        this.getFormField()
      }
    },
    // 改变pagesize
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleList(this.typeId)
    },
    // 改变页码
    handleCurrentChange (val) {
      this.tablePage = val
      this.handleList(this.typeId)
    },
    // 搜索
    handleSearch () {
      if (this.schoolId == '') {
        this.$message({
          message: '请先选择左侧学校',
          duration: 2000,
          type: 'error'
        })
      } else {
        this.tablePage = 1
        this.deviceName = this.name
        this.deviceType = this.type
        this.handleList(this.typeId)
      }
    },
    // 列表接口
    handleList (typeId) {
      this.tableLoading = true
      var params = {
        pageSize: this.tablePage,
        pageIndex: this.page.pageSize,
        schoolId: this.cookiesObj.schoolId,
        typeId: typeId
      }
      // console.log(params)
      this.$store.dispatch('form/PageBySchoolId', params).then(res => {
        var result = JSON.parse(res)
        // console.log(result)
        if (result.Code == '200') {
          var data = result.Data
          this.tableData = data.data
          this.page.total = data.total
          this.page.currentPage = this.tablePage
          this.tableLoading = false
        } else {
          this.tableData = []
          this.page.total = 0
          this.page.currentPage = this.tablePage
          this.tableLoading = false
        }
      }).catch(err => {
          console.log(err)
          this.tableLoading = false
      })
    },
    // 触发事件
    handleClose () {
      this.$refs['ruleForm'].clearValidate()
      this.$refs['ruleForm'].resetFields()
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$refs['ruleForm'].clearValidate()
      this.$refs['ruleForm'].resetFields()
      this.$emit('closeDialog')
    },
    // 初始化弹窗
    getDetail () {
      this.$nextTick(res => {
        // console.log(this.$parent.rowData)
        editorPC = null
        editorMobile = null
        if(!editorPC){
          editorPC = new E(this.$refs.editorPCEdit)
          editorPC.customConfig.menus = [
            'head',
            'bold',
            'justify',
            'italic',
            'underline',
            'table',
            'undo',
            'redo' 
          ]
          editorPC.create()
        }
        if(!editorMobile){
          editorMobile = new E(this.$refs.editorMobileEdit)
          editorMobile.customConfig.menus = [
            'head',
            'bold',
            'italic',
            'justify',
            'underline',
            'table',
            'undo',
            'redo' 
          ]
          editorMobile.create()
        }
        this.activeName = 'first'
        this.radioItem = 1
        this.ruleForm.tableName = this.$parent.rowData.TableName
        this.ruleForm.tableSort = this.$parent.rowData.TableSort
        this.ruleForm.tableState = this.$parent.rowData.TableState
        this.editContentPC = decodeURI(this.$parent.rowData.TableRemarkPC)
        this.editContentMobile = decodeURI(this.$parent.rowData.TableRemarkH5)
        editorPC.txt.html(this.editContentPC)
        editorMobile.txt.html(this.editContentMobile)
        this.tableId = this.$parent.rowData.Id
        this.getFormField() //获取表格字段
      })
    },
    confirmDialog () {
      this.editContentMobile = editorMobile.txt.html()
      this.editContentPC = editorPC.txt.html()
      if(this.editContentPC.indexOf('input')===-1){
        this.$message({
          message: 'PC端模板字段不能为空!',
          duration: 2000,
          type: 'error'
        })
        return
      }
      if(this.editContentMobile.indexOf('input') ===-1){
        this.$message({
          message: '移动端模板字段不能为空!',
          duration: 2000,
          type: 'error'
        })
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogLoading = true
          var params = {
            _id: this.$parent.rowData.Id,
            tableName: this.ruleForm.tableName ? this.ruleForm.tableName.trim() : this.ruleForm.tableName,
            tableRemarkPC: encodeURI(this.editContentPC),
            tableRemarkH5: encodeURI(this.editContentMobile),
            tableSort: this.ruleForm.tableSort,
            tableState: this.ruleForm.tableState,
            schoolId: this.$parent.cookiesObj.schoolId,
            lastOpUserId: this.$parent.cookiesObj.loginUserId,
            lastOpUserName: decodeURI(this.$parent.cookiesObj.realName),
            typeId: this.$parent.typeId,
            fieldListJson: JSON.stringify(this.tableData)
          }
          // console.log(params)
          var paramsNew = {
            data: JSON.stringify(params)
          }
          // console.log(paramsNew)
          this.$store.dispatch('form/Update', paramsNew).then(res => {
            var result = JSON.parse(res)
            // console.log(result)
            if (result.Code == '200') {
              this.$message({
                message: result.Msg,
                duration: 2000,
                type: 'success'
              })
              this.$parent.treeEditData = {
                label: this.ruleForm.name,
                children: [],
                id: result.Data
              }
              this.$emit('confirmDialog')
            } else {
              this.$message({
                message: result.Msg,
                duration: 2000,
                type: 'error'
              })
            }
            this.dialogLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    tabClick () {
    },
    addFormField () {
      this.action = 'add'
      this.dialogVisibleFormFieldEdit = true
    },
    editFormField () {
      // console.log(this.tableFieldData)
      if(this.tableFieldData.length>1){
        this.$message.error('只能选择一条！')
        return
      }
      if(this.tableFieldData.length==0){
        this.$message.error('请选择一条！')
        return
      }
      this.action = 'edit'
      this.dialogVisibleFormFieldEdit = true
    },
    deleteFormField () {
      if(this.tableFieldData.length>1){
        this.$message.error('只能选择一条！')
        return
      }
      if(this.tableFieldData.length==0){
        this.$message.error('请选择一条！')
        return
      }
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          _id: this.tableFieldData[0].Id
        }
        // console.log(params)
        this.$store.dispatch('form/DeleteByIdFormField', params).then(res => {
          var result = JSON.parse(res)
          // console.log(result)
          if (result.Code == '200') {
            this.$message({
              message: result.Msg,
              duration: 2000,
              type: 'success'
            })
            this.tablePage = 1
            this.getFormField()
          } else {
            this.$message({
              message: result.Msg,
              duration: 2000,
              type: 'success'
            })
          }
        })
      }).catch(() => {
      })
      
    },
    handleRowClick (row, event, column) {
      // console.log(this.tableFieldData)
      if(this.tableFieldData.length>1){
        this.$message.error('只能选择一条！')
        return
      }
      if(this.tableFieldData.length==0){
        this.$message.error('请选择一条！')
        return
      }
      if (this.radioItem === 1) {
        if(editorPC.txt.html().indexOf(this.tableFieldData[0].FieldName)>=0){
          this.$message.error('同一个字段不能重复插入!')
          return
        }
        var html = '<span>'+this.tableFieldData[0].ShowTitle+'</span><input type="text" id="'+this.tableFieldData[0].FieldName +'" name="'+this.tableFieldData[0].FieldName +'" fieldType="'+this.tableFieldData[0].FieldType+'"  maxLength="'+this.tableFieldData[0].MaxLength + '" style="border:1px solid #ccc;width:200px;height:30px;line-height:30px;margin-left:10px;">'
        editorPC.cmd.do('insertHtml', html)
        this.editContentPC = editorPC.txt.html()
      } else {
        if(editorMobile.txt.html().indexOf(this.tableFieldData[0].FieldName)>=0){
          this.$message.error('同一个字段不能重复插入!')
          return
        }
        var html = '<span>'+this.tableFieldData[0].ShowTitle+'</span><input type="text" id="'+this.tableFieldData[0].FieldName +'" name="'+this.tableFieldData[0].FieldName +'" fieldType="'+this.tableFieldData[0].FieldType+'"  maxLength="'+this.tableFieldData[0].MaxLength + '" style="border:1px solid #ccc;width:200px;height:30px;line-height:30px;margin-left:10px;">'
        editorMobile.cmd.do('insertHtml', html)
        this.editContentMobile = editorMobile.txt.html()
      }
    },
    getFormField () {
      var params = {
        tableId: this.$parent.rowData.Id
      }
      this.$store.dispatch('form/ListByTableIdFormField', params).then(res => {
        var result = JSON.parse(res)
        // console.log(result)
        if (result.Code == '200') {
          this.tableData = result.Data
        } else {
          this.tableData = []
        }
      })
    },
    handleCheckChange (val) {
      // console.log(val)
      this.tableFieldData = val
    },
    radioChange (val) {
      // console.log(val)
      this.radioItem = val
    },
    setTrim () {
      this.ruleForm.tableName = this.ruleForm.tableName.trim()
    } 
  }
}
</script>
<style lang="scss">
.select-width {
  width: 100%;
}
.form-add {
  .table-form-wrap{
    margin-top: 9px;
  }
  .dialog-body {
    height: 500px;
    overflow: auto;
    padding: 0 !important;
    .tabs-card {
      height: 100%;
      box-sizing: border-box;
    }
  }
  .edit-wrap {
    margin-top: 10px;
  }
  .edit-wrap .ql-container{
    height: 340px;
  }
  .ql-editor{
    padding: 0px;
  }
  .list-item li{
    border: 1px solid #ccc;
    text-align: center;
    height: 30px;
    line-height: 30px;
    margin: 10px 0px;
    cursor: pointer;
  }
  .btn-list{
    float: right;
    margin-right: 10px;
    font-size: 12px;
    color: #409EFF;
    cursor: pointer;
    margin-bottom: 5px;
  }
  .btn-list span{
    margin: 0 5px;
  }
  .w-e-text-container{
    height: 370px!important;
  }
}
</style>
