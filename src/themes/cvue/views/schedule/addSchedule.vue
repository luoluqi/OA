<template>
  <div class="add">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      :title="title"
      :isShowFoot="false"
      :btnDisabled="disabled"
      :open="getDetail"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @handleClose="handleClose">

      <div class="dialog-body" slot="dialogBody" style="padding: 0;">
        <div class="addSchedule">
          <el-form :model="scheduleParams" :rules="rules" ref="scheduleParams" label-width="235px">
            <el-form-item label="事务内容" prop="transContent">
              <el-input 
                type="textarea"
                style=" width:320px"
                :rows="3" 
                :disabled="disableAll"
                v-model="scheduleParams.transContent"></el-input>
                <span class="text-num">{{scheduleParams.transContent.length}}</span>
            </el-form-item>
            
            <el-form-item label="事务类型" prop="transTypeCode">
              <el-select v-model="scheduleParams.transTypeCode" :disabled="disableAll" >
                <el-option
                  v-for="(item,index) in scheduleTransactionList"
                  :key="index"
                  :label="item.Value"
                  :value="item.Id"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="开始时间" prop="beginTime">
              <el-date-picker v-model="scheduleParams.beginTime" :disabled="disableAll" type="date" ></el-date-picker>
            </el-form-item>
            
            <el-form-item label="结束时间" prop="beginTime">
              <el-date-picker v-model="scheduleParams.endTime" :disabled="disableAll" type="date" ></el-date-picker>
            </el-form-item> -->
            <el-form-item label="日程时间" prop="dateTime">
              <el-date-picker
                v-model="scheduleParams.dateTime"
                type="daterange"
                :disabled="disableAll"
                @change="changeTime"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="参与者" prop="loginNames">
              <el-input
                type="textarea"
                autosize
                placeholder=""
                disabled
                style="width:320px;"
                v-model="scheduleParams.loginNames"
              ></el-input>
              <span v-if="!disableAll" class="btn-span" @click="openAdd" >添加</span> <span v-if="!disableAll" @click="clearLogin" class="btn-span">清空</span>
              <div v-if="title != '查看日程'" class="el-icon-warning-outline" style="color:green;width:100%"> 事务类型为个人事务时,添加参与者无效</div>
            </el-form-item>

            <el-form-item label="事务级别" prop="levelCode">
              <el-select v-model="scheduleParams.levelCode" :disabled="disableAll" >
                <el-option
                  v-for="(item,index) in scheduleEventList"
                  :key="index"
                  :label="item.Value"
                  :value="item.Id"
                ></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item  >
              <!-- <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button> -->
              
              <el-button @click="closeDialog">取消</el-button>
              <el-button v-if="!disableAll" @click="confirmDialog('scheduleParams')" :disabled="disabled" type="primary">确定</el-button>
              <el-button v-if="title == '编辑日程'" :disabled="disabled" @click="delDialog">删除</el-button>
            </el-form-item>
          </el-form>

        </div>
      </div>
    </cvue-dialog>
    
    <!-- 添加参选人 -->
    
    <selection-people
      @closeSelection="closeSelection('selectionPeople')"
      @confirmSelection="confirmSelection(arguments,'selectionPeople')"
      @handleClose="closeSelection('selectionPeople')"
      :dialogVisible="selectionPeople"
      :loginUserIds ="arrLogins.loginUserIds"
      :loginNames ="arrLogins.loginNames"
      
    ></selection-people>
  </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
// import cvueTable from '@/components/cvue-table'
import selectionPeople from './selectionPeople'

import { mapGetters } from 'vuex'
export default {
  name: 'addSchedule',
  components: {
    cvueDialog,
    selectionPeople

    // cvueTable,
  },

  data () {
    return {
      scheduleParams: {
        transContent: '',
        transTypeCode: '',
        beginTime: '',
        endTime: '',
        levelCode: '',
        loginNames: '',
        loginUserIds: '',
        dateTime: []
      },
      rules: {
        transContent: [
          { required: true, message: '请输入事务内容', trigger: 'blur' },
          { min: 6, max: 100, message: '长度在 6 到 100 个字符', trigger: 'blur' }
        ],
        transTypeCode: [
          { required: true, message: '请选择事务类型', trigger: 'change' }
        ],
        beginTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        dateTime: [
          { required: true, message: '请选择日程时间', trigger: 'change' }
        ],
        levelCode: [
          { required: true, message: '请选择事务级别', trigger: 'change' }
        ]
      },
      scheduleEventList: [],
      scheduleTransactionList: [],
      arrLogins: {
        loginUserIds: [],
        loginNames: []
      },
      selectionPeople: false,
      disabled: false,
      defaultTime: []
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新建日程'
    },
    addScheduleParams: {
      type: Object,
      default () {
        return {}
      }
    },
    disableAll: {
      type: Boolean,
      default: false
    }
  },
  mounted () {

  },
  methods: {
    // 获取事件类型列表
    GetEventList () {
      var params = {}

      this.$store.dispatch('schedule/GetEventList', params).then(res => {
        var result = JSON.parse(res)
        this.scheduleEventList = result
        // console.log(result);
      })
    },
    // 获取事务类型列表
    GetTransactionList () {
      var params = {}

      this.$store.dispatch('schedule/GetTransactionList', params).then(res => {
        var result = JSON.parse(res)
        this.scheduleTransactionList = result
        // console.log(result);
      })
    },
    
    // 日程时间选择
    changeTime (time) {
      console.log(time)
      console.log(this.dateTime)
      if (time != null) {
        this.scheduleParams.beginTime = time[0]
        this.scheduleParams.endTime = time[1]
      }
    },
    // 添加日程安排
    AddSchedule () {
      if (this.title == '查看日程') {        
        this.disabled = false
        this.$emit('confirmDialog')
        return false
      }
      // var params = {};
      let params = {
        schoolId: this.$parent.cookiesObj.schoolId,
        transContent: this.scheduleParams.transContent,
        transTypeCode: this.scheduleParams.transTypeCode,
        beginTime: this.scheduleParams.beginTime,
        endTime: this.scheduleParams.endTime,
        levelCode: this.scheduleParams.levelCode,
        CreateUserId: this.$parent.cookiesObj.teacherId,
        CreateUserName: this.$parent.cookiesObj.realName
      }
      // console.log(this.scheduleParams.endTime)
      // console.log(this.$parent.cookiesObj.realName)
      if (this.scheduleParams.transTypeCode == 'WorkTrans') {
        params.LoginNames = this.scheduleParams.loginNames
        params.loginUserIds = this.scheduleParams.loginUserIds
      }
      
      if (this.title == '编辑日程') {
        params.ScheduleId = this.scheduleParams.Id
      }
      this.$store.dispatch('schedule/AddSchedule', params).then(res => {
        var result = JSON.parse(res)
        // this.scheduleTransactionList = result;
        console.log(result)
        if (result.Code === 200) {
          // console.log(params)
          this.$message({
            message: '恭喜你，操作成功!',
            duration: 1000,
            type: 'success'
          })
          this.$emit('confirmDialog')
          this.clearSchedule()
        } else {
          this.$message.error('添加失败！')
        }
        this.disabled = false
      }).catch(res => {
        console.log(res)
        this.disabled = false
        this.$message.error('添加失败！')
        // this.$message({
        //   message:res.Msg
        // })
      })
    },
    
    // 删除日程
    delDialog () {
      this.disabled = true
      // this.$emit('delDialog')
      let params = {
        id: this.scheduleParams.Id,
        createUserId: this.$parent.cookiesObj.teacherId
      }
      this.$store.dispatch('schedule/DeleteSchedule', params).then(res => {
        var result = JSON.parse(res)
        // this.scheduleTransactionList = result;
        console.log(result)
        if (result.Code === 200) {
          // console.log(params)
          this.$message({
            message: '恭喜你，删除成功!',
            duration: 1000,
            type: 'success'
          })
          this.$emit('confirmDialog')
          this.clearSchedule()
        } else {
          this.$message.error('删除失败！')
        }
        this.disabled = false
      }).catch(res => {
        console.log(res)
        this.disabled = false
        this.$message.error('删除失败！')
      })
    },
    // 清除数据
    clearSchedule () {
      this.$refs.scheduleParams.clearValidate()

      this.scheduleParams.transContent = ''
      this.scheduleParams.transTypeCode = ''
      this.scheduleParams.beginTime = ''
      this.scheduleParams.endTime = ''
      this.scheduleParams.levelCode = ''
      this.scheduleParams.loginNames = ''
      this.scheduleParams.loginUserIds = ''
      this.arrLogins.loginUserIds.splice(0, this.arrLogins.loginUserIds.length)
      this.arrLogins.loginNames.splice(0, this.arrLogins.loginUserIds.length)
    },
    // 初始化弹窗
    getDetail () {
      this.GetEventList()
      this.GetTransactionList()
      console.log(this.addScheduleParams)    
      this.scheduleParams.dateTime = []  
      this.scheduleParams.beginTime = this.addScheduleParams.beginTime
      this.scheduleParams.endTime = this.addScheduleParams.beginTime
      this.scheduleParams.dateTime.push(this.addScheduleParams.beginTime)
      this.scheduleParams.dateTime.push(this.addScheduleParams.beginTime)

      if (this.addScheduleParams.Id !== null) {
        this.scheduleParams.Id = this.addScheduleParams.Id
        this.scheduleParams.transContent = this.addScheduleParams.transContent
        this.scheduleParams.transTypeCode = this.addScheduleParams.transTypeCode

        this.scheduleParams.beginTime = this.addScheduleParams.beginTime
        this.scheduleParams.endTime = this.addScheduleParams.endTime        
        this.scheduleParams.dateTime = []  
        this.scheduleParams.dateTime.push(this.addScheduleParams.beginTime)
        this.scheduleParams.dateTime.push(this.addScheduleParams.endTime)

        this.scheduleParams.levelCode = this.addScheduleParams.levelCode
        this.scheduleParams.loginNames = this.addScheduleParams.loginNames
        this.scheduleParams.loginUserIds = this.addScheduleParams.loginUserIds
        this.arrLogins.loginUserIds = this.addScheduleParams.loginUserIds.split(',')
        this.$emit('clearParams')
      }
      console.log(this.scheduleParams)
    },
    // 打开添加参选人
    openAdd () {
      this.selectionPeople = true
    },
    // 关闭参选人
    closeSelection (params) {
      // console.log(params)
      this[params] = false
    }, 
    // 清空参选人
    clearLogin () {
      this.scheduleParams.loginNames = ''      
      this.scheduleParams.loginUserIds = ''
      this.arrLogins.loginUserIds = []
      this.arrLogins.loginNames = []
    },
    confirmSelection (age, params) {
      // console.log(age)
      age[0].forEach(item => {
        this.arrLogins.loginUserIds.push(item.Id)
        this.arrLogins.loginNames.push(item.name)
      })
      this.scheduleParams.loginUserIds = this.arrLogins.loginUserIds.toString()
      this.scheduleParams.loginNames = this.arrLogins.loginNames.toString()
      // console.log(this.scheduleParams)
      this[params] = false
    },
    // 触发事件
    handleClose () {
      this.clearSchedule()
      this.$emit('handleClose')
    },
    closeDialog () {
      // console.log(123)
      this.clearSchedule()
      this.$emit('closeDialog')
    },
    confirmDialog (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.disabled = true
          this.AddSchedule()
          // this.$emit('confirmDialog')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
.addSchedule {
  padding: 20px;
  .el-row {
    margin-top: 20px;
    .el-col:first-child {
      text-align: right;
    }
    .red {
      color:#ff0000; 
    }
    .btn { 
      color:blue; margin-right: 10px; cursor: pointer;
    }
  }
  .text-num {
    position: absolute; left: 290px;bottom: -23px; width: 30px; text-align: right;
  }
  .btn-span{ cursor: pointer;}
}
</style>
