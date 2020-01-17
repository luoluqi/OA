<template>
    <div>
        <!-- 详情 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    title="新增考务信息"
                    :isShowFoot = true
                    dialogWidth="600px"
                    @handleOpen="getDetail"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="handleClose">
            <div class="dialog-body" slot="dialogBody">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="学年" prop="schoolyearId">
                                <el-select v-model="ruleForm.schoolyearId" placeholder="学年"  size="mini" style="width:100%" @change="changeSchoolYear" value-key="Id">
                                    <el-option
                                        size="mini"
                                        v-for="item in schoolYear"
                                        :key="item.Id"
                                        :label="item.Name"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="学期" prop="schooltermid">
                                <el-select v-model="ruleForm.schooltermid" placeholder="学期"  size="mini" style="width:100%" @change="changeTerm" value-key="Id">
                                    <el-option
                                        size="mini"
                                        v-for="item in schoolTerm"
                                        :key="item.Id"
                                        :label="item.Name"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="年级" prop="gradeId">
                                <el-select v-model="ruleForm.gradeId" placeholder="年级"  size="mini" style="width:100%" @change="changeGrades">
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
                        <el-col :span="24" v-if="ruleForm.radioType != 1">
                            <el-form-item label="班级" prop="schoolclassIdstr">
                                <el-select v-model="ruleForm.schoolclassIdstr" placeholder="班级"  size="mini" style="width:100%" @change="changeClasses">
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
                        <el-col :span="24">
                            <el-form-item label="考试名称" prop="examname">
                                <el-input v-model="ruleForm.examname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="科目" prop="subjectId">
                                <el-select v-model="ruleForm.subjectId" placeholder="科目"  size="mini" style="width:100%">
                                    <el-option
                                        size="mini"
                                        v-for="item in schoolSubject"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="考试开始时间" prop="examination.startTime">
                                <el-date-picker
                                    v-model="ruleForm.examination.startTime"
                                    type="datetime"
                                    style="width:100%"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    @change ="changeTime"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="考试结束时间" prop="examination.endTime">
                                <el-date-picker
                                    v-model="ruleForm.examination.endTime"
                                    type="datetime"
                                    style="width:100%"
                                    :picker-options="datePicker"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="主监考教师" prop="examination.masterInvigilator">
                                <el-input v-model="ruleForm.examination.masterInvigilator"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="辅监考教师" prop="examination.assistantinvigilator">
                                <el-input v-model="ruleForm.examination.assistantinvigilator"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="是否年段统考" prop="radioType">
                                <el-radio-group v-model="ruleForm.radioType">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>            
        </cvue-dialog>
    </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
export default {
    name: 'SchoolOrderDetail',
    components: {
        cvueDialog,
        cvueTable
    },
    computed: {
      ...mapGetters(['cookiesObj']),
      datePicker () {
        let self = this;
        var curDate = new Date();
        var preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
        var startTime = (new Date(this.ruleForm.examination.startTime)).getTime() - 24*60*60*1000
        return {
          disabledDate(time){
            return time.getTime() < startTime;
          }
        } 
      }
    },
    data () {
        return {
            ruleForm: {
              schoolclassIdstr: '',
              schoolyearId: '',
              schooltermid: '',
              gradeId: '',
              subjectId: '',
              examname: '',
              radioType: 0,
              schoolId: '',
              examination: {
                startTime: '',
                endTime: '',
                masterInvigilator: '',
                assistantinvigilator: ''
              }
            },
            rules: {
              schoolyearId: [
                  { required: true, message: '请选择学年', trigger: 'change' }
              ],
              schooltermid: [
                  { required: true, message: '请选择学期', trigger: 'change' }
              ],
              gradeId: [
                  { required: true, message: '请选择年级', trigger: 'change' }
              ],
              schoolclassIdstr: [
                  { required: true, message: '请选择班级', trigger: 'change' }
              ],
              examname: [
                { required: true, message: '考试名称不能为空', trigger: 'blur' },
                { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
              ],
              subjectId: [
                  { required: true, message: '请选择科目', trigger: 'change' }
              ],
              examination: {
                startTime: [
                  { required: true, message: '请选择日期', trigger: 'change' }
                ],
                endTime: [
                  { required: true, message: '请选择日期', trigger: 'change' }
                ]
              }
            },
            disabled: true,
            dialogLoading: false,
            schoolYear: '',
            schoolTerm: '',
            schoolGrades: '',
            schoolClasses: '',
            schoolSubject: '',
            year: '',
            term: '',
            grades: '',
            classes: '',
            schoolyearId: '',
            gradeId: '',
            schooltermid: '',
            classId: ''
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
            this.$refs['ruleForm'].clearValidate()
            this.$refs['ruleForm'].resetFields()
            this.$emit('handleClose')
        },
        closeDialog () {
            this.$refs['ruleForm'].clearValidate()
            this.$refs['ruleForm'].resetFields()
            this.$emit('closeDialog')
        },
        confirmDialog () {
            // console.log(this.ruleForm.radioType)
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    var endTime = (new Date(this.ruleForm.examination.endTime)).getTime()
                    var startTime = (new Date(this.ruleForm.examination.startTime)).getTime()
                    if (endTime < startTime) {
                      this.$message({
                        message: '考试开始时间不能大于考试结束时间',
                        duration: 2000,
                        type: 'error'
                      })
                      return
                    }

                    var schoolclassIds = ''
                    var schoolclassIdstr = ''
                    for (var i = 0; i < this.schoolClasses.length; i++) {
                      schoolclassIdstr += this.schoolClasses[i].Id + ','
                    }
                    var params
                    if (this.ruleForm.radioType == 1) {
                      schoolclassIds = schoolclassIdstr
                      params = {
                        action: 'add',
                        schoolclassIdstr: schoolclassIds,
                        schoolyearId: this.ruleForm.schoolyearId.Id,
                        schooltermId: this.ruleForm.schooltermid.Id,
                        gradeId: this.ruleForm.gradeId,
                        subjectId: this.ruleForm.subjectId,
                        examname: this.ruleForm.examname,
                        radioType: this.ruleForm.radioType,
                        schoolId: this.cookiesObj.schoolId,
                        examination: {
                          EndTime: this.ruleForm.examination.endTime,
                          BeginTime: this.ruleForm.examination.startTime,
                          ExamName: this.ruleForm.examname,
                          SubjectId: this.ruleForm.subjectId,
                          SchoolClassId: '',
                          GradeId: this.ruleForm.gradeId,
                          DeleteFlag: false,
                          SchoolId: this.cookiesObj.schoolId,
                          SchoolTermName: this.ruleForm.schooltermid.Name,
                          SchoolTermId: this.ruleForm.schooltermid.Id,
                          SchoolYearName: this.ruleForm.schoolyearId.Name,
                          SchoolYearId: this.ruleForm.schoolyearId.Id,
                          IsGradeUnifiedExam: this.ruleForm.radioType,
                          MasterInvigilator: this.ruleForm.examination.masterInvigilator,
                          AssistantInvigilator: this.ruleForm.examination.assistantinvigilator
                        }
                      }
                    } else {
                      schoolclassIds = this.ruleForm.schoolclassIdstr
                      params = {
                        action: 'add',
                        schoolclassIdstr: '',
                        schoolyearId: this.ruleForm.schoolyearId.Id,
                        schooltermId: this.ruleForm.schooltermid.Id,
                        gradeId: this.ruleForm.gradeId,
                        subjectId: this.ruleForm.subjectId,
                        examname: this.ruleForm.examname,
                        radioType: this.ruleForm.radioType,
                        schoolId: this.cookiesObj.schoolId,
                        examination: {
                          EndTime: this.ruleForm.examination.endTime,
                          BeginTime: this.ruleForm.examination.startTime,
                          ExamName: this.ruleForm.examname,
                          SubjectId: this.ruleForm.subjectId,
                          SchoolClassId: schoolclassIds,
                          GradeId: this.ruleForm.gradeId,
                          DeleteFlag: false,
                          SchoolId: this.cookiesObj.schoolId,
                          SchoolTermName: this.ruleForm.schooltermid.Name,
                          SchoolTermId: this.ruleForm.schooltermid.Id,
                          SchoolYearName: this.ruleForm.schoolyearId.Name,
                          SchoolYearId: this.ruleForm.schoolyearId.Id,
                          IsGradeUnifiedExam: this.ruleForm.radioType,
                          MasterInvigilator: this.ruleForm.examination.masterInvigilator,
                          AssistantInvigilator: this.ruleForm.examination.assistantinvigilator
                        }
                      }
                    }
                    // console.log(params)
                    this.dialogLoading = true
                    this.$store.dispatch('interflow/SaveSubject', params).then(res => {
                        var result = JSON.parse(res)
                        if (result.Code == 200) {
                          this.$message({
                              message: result.Msg,
                              duration: 2000,
                              type: 'success'
                          })
                          this.$refs['ruleForm'].resetFields()
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
        // 获取详情
        getDetail () {
            var params = this.$parent.rowId
            this.dialogLoading = true
            this.getYear()
            // this.getTerm()
            this.getGrades()
            this.getClasses()
            this.getSubject()
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
        // 获取学科
        getSubject () {
            var params = {
                schoolId: this.cookiesObj.schoolId
            }
            this.$store.dispatch('interflow/GetSubject', params).then(res => {
                var result = JSON.parse(res)
                //  console.log(result)
                if (result.Code == 200) {
                  this.schoolSubject = [{name: '请选择', id: ''}].concat(result.Data.data)
                  // console.log(this.schoolSubject)
                }
            })
        },
        // 学年change
        changeSchoolYear (val) {
          this.schoolyearId = val.Id
          this.getTerm()
          this.getClasses()
          this.term = ''
          this.schooltermid = ''
          this.ruleForm.schooltermid = ''
          this.grades = ''
          this.gradeId = ''
          this.ruleForm.gradeId = ''
          this.classes = ''
          this.classId = ''
          this.ruleForm.schoolclassIdstr = ''
        },
        // 年级change
        changeGrades (val) {
          this.gradeId = val
          this.getClasses()
          this.classes = ''
          this.classId = ''
          this.ruleForm.schoolclassIdstr = ''
        },
        // 学期change
        changeTerm (val) {
          this.schooltermid = val.Id
        },
        // 班级change
        changeClasses (val) {
          this.classId = val
        },
        generateUUID () {
          var d = new Date().getTime()
          if (window.performance && typeof window.performance.now === 'function') {
              d += performance.now() // use high-precision timer if available
          }
          var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
              var r = (d + Math.random() * 16) % 16 | 0
              d = Math.floor(d / 16)
              return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
          })
          return uuid
        },
        changeTime (val) {
          console.log(val)
          this.startTime = val
        }
    }
}
</script>
<style lang="sass" scoped>
</style>
