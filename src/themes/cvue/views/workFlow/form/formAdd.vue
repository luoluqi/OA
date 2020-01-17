<template>
  <div>
    <div class="form-add">
      <!-- 新增弹窗 -->
      <cvue-dialog
        :dialogVisible="dialogVisible"
        title="新增"
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
                      <el-input v-model.trim="ruleForm.tableName" placeholder="表单名称"></el-input>
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
                                  @tableCurrentChange="handleCheckChange"
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
                    <div ref="editorPC" class="editor"></div>
                  </div>
                  <div class="edit-wrap" v-show="radioItem === 2">
                    <div ref="editorMobile" class="editor"></div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </cvue-dialog>
    </div>
    <!-- 新增弹窗 -->
    <form-add-field
      @closeSecDialog="closeSecDialog('formFieldAdd')"
      @confirmSecDialog="confirmSecDialog('formFieldAdd')"
      @handleSecClose="closeSecDialog('formFieldAdd')"
      :dialogVisible="dialogVisibleFormFieldAdd">
    </form-add-field>
  </div>
</template>
<script>
import E from 'wangeditor'
import cvueTreeGrid from '@/components/cvue-tree-grid'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import formAddField from './formAddField'
import {validNum} from '@/util/validator.js'
var editorPC
var editorMobile
export default {
  name: 'IndexAdd',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid,
    formAddField
  },
  data () {
    return {
      activeName: 'first',
      radioItem: 1,
      dialogVisibleFormFieldAdd: false,
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
        stripe: true,
        width: '100%',
        border: true,
        index: false,
        cloumn: [
          {prop: 'ShowTitle', label: '字段名称', align: 'center'}
        ]
      },
      tableData: [
      ],
      formFieldData: {},
      editContentPC: '',
      editContentMobile: '',
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
      if (params == 'formFieldAdd') {
        this.dialogVisibleFormFieldAdd = false
      }
    },
    // 确认
    confirmSecDialog (params) {
      if (params == 'formFieldAdd') {
        this.dialogVisibleFormFieldAdd = false
        this.tableData.push(this.formFieldData)
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
        editorPC = null
        editorMobile = null
        if(!editorPC){
          editorPC = new E(this.$refs.editorPC)
          // editorPC.customConfig.onchange = (html) => {
          //   this.editorContent = html
          // }
          editorPC.customConfig.onfocus = function () {
              console.log("onfocus")
              console.log(document.getSelection())
          }
          this.tableData = []
          // editorPC.txt.html('')
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
          editorMobile = new E(this.$refs.editorMobile)
          editorMobile.customConfig.onchange = (html) => {
            this.editorContent = html
          }
          editorMobile.customConfig.pasteTextHandle = function (content) {
            // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
            return content + '<p>在粘贴内容后面追加一行</p>'
          }
          this.tableData = []
          // editorMobile.txt.html('')
          editorMobile.customConfig.menus = [
            'head',
            'bold',
            'justify',
            'italic',
            'underline',
            'table',
            'undo',
            'redo' 
          ]
          editorMobile.create()
        }
        this.ruleForm.tableName = ''
        this.ruleForm.tableSort = ''
        this.tableData = []
        editorPC.txt.html('')
        editorMobile.txt.html('')
        this.activeName = 'first'
        this.radioItem = 1
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
            tableName: this.ruleForm.tableName,
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
          this.$store.dispatch('form/Add', paramsNew).then(res => {
            var result = JSON.parse(res)
            console.log(result)
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
          this.$message({
            message: '请校验表单输入信息是否正确!',
            duration: 2000,
            type: 'error'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    tabClick () {
    },
    addFormField () {
      this.dialogVisibleFormFieldAdd = true
    },
    handleRowClick (row, event, column) {
      if (this.radioItem === 1) {
        if(editorPC.txt.html().indexOf(this.tableFieldData.FieldName)>=0){
          this.$message.error('同一个字段不能重复插入!')
          return
        }
        var html = '<span>'+this.tableFieldData.ShowTitle+'</span><input type="text" id="'+this.tableFieldData.FieldName +'" name="'+this.tableFieldData.FieldName +'" fieldType="'+this.tableFieldData.FieldType+'"  maxLength="'+this.tableFieldData.MaxLength + '" style="border:1px solid #ccc;width:200px;height:30px;line-height:30px;margin-left:10px;">'
        editorPC.cmd.do('insertHtml', html)
        this.editContentPC = editorPC.txt.html()
      } else {
        if(editorMobile.txt.html().indexOf(this.tableFieldData.FieldName)>=0){
          this.$message.error('同一个字段不能重复插入!')
          return
        }
        var html = '<span>'+this.tableFieldData.ShowTitle+'</span><input type="text" id="'+this.tableFieldData.FieldName +'" name="'+this.tableFieldData.FieldName +'" fieldType="'+this.tableFieldData.FieldType+'"  maxLength="'+this.tableFieldData.MaxLength + '" style="border:1px solid #ccc;width:200px;height:30px;line-height:30px;margin-left:10px;">'
        editorMobile.cmd.do('insertHtml', html)
        this.editContentMobile = editorMobile.txt.html()
      }
    },
    handleCheckChange (val) {
      this.tableFieldData = val
    },
    radioChange (val) {
      // console.log(val)
      this.radioItem = val
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
  .editor{
    text-align: left;
  }
  .w-e-text-container{
    height: 370px!important;
  }
}
</style>
