<template>
    <div>
        <!-- 详情 -->
        <cvue-dialog :dialogVisible="dialogVisible"
                    title="编辑考务信息"
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
                                <el-select v-model="ruleForm.schoolyearId" placeholder="学年"  size="mini" style="width:100%" @change="changeSchoolYear" value-key="Id" :disabled="true">
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
                                <el-select v-model="ruleForm.schooltermid" placeholder="学期"  size="mini" style="width:100%" @change="changeTerm" value-key="Id" :disabled="true">
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
                                <el-select v-model="ruleForm.gradeId" placeholder="年级"  size="mini" style="width:100%" @change="changeGrades" :disabled="true">
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
                        <el-col :span="24">
                            <el-form-item label="班级" prop="schoolclassId" v-if="!ruleForm.examination.IsGradeUnifiedExam">
                                <el-select v-model="ruleForm.schoolclassId" placeholder="班级"  size="mini" style="width:100%" @change="changeClasses">
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
                            <el-form-item label="考试名称" prop="examination.ExamName">
                                <el-input v-model="ruleForm.examination.ExamName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="科目" prop="examination.SubjectId">
                                <el-select v-model="ruleForm.examination.SubjectId" placeholder="科目"  size="mini" style="width:100%" @change="changeSubject">
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
                            <el-form-item label="考试开始时间" prop="examination.BeginTime">
                                <el-date-picker
                                    v-model="ruleForm.examination.BeginTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm"
                                    style="width:100%"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="考试结束时间" prop="examination.EndTime">
                                <el-date-picker
                                    v-model="ruleForm.examination.EndTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm"
                                    :picker-options="datePicker"
                                    style="width:100%"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="主监考教师" prop="examination.MasterInvigilator">
                                <el-input v-model="ruleForm.examination.MasterInvigilator"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="辅监考教师" prop="examination.AssistantInvigilator">
                                <el-input v-model="ruleForm.examination.AssistantInvigilator"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="是否年段统考" prop="examination.IsGradeUnifiedExam">
                                <el-radio-group v-model="ruleForm.examination.IsGradeUnifiedExam" @change="changeValue">
                                    <el-radio :label="true" :disabled="isDisable">是</el-radio>
                                    <el-radio :label="false" :disabled="isDisable">否</el-radio>
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
              schoolyearId: '',
              schooltermid: '',
              gradeId: '',
              schoolclassId: '',
              examination: {
                ExamName: '',
                SubjectId: '',
                BeginTime: '',
                EndTime: '',
                MasterInvigilator: '',
                AssistantInvigilator: '',
                IsGradeUnifiedExam: ''
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
              schoolclassId: [
                  { required: true, message: '请选择班级', trigger: 'change' }
              ],
              examination: {
                ExamName: [
                  { required: true, message: '考试名称不能为空', trigger: 'blur' },
                  { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                SubjectId: [
                    { required: true, message: '请选择科目', trigger: 'change' }
                ],
                BeginTime: [
                    { required: true, message: '请选择日期', trigger: 'change' }
                ],
                EndTime: [
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
            classId: '',
            isDisable: false,
            isDisableNew: false,
            oldexamname: '',
            oldObj: {},
            oldSubjectId: '',
            oldSchoolClassId: ''
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
                    if (this.ruleForm.examination.IsGradeUnifiedExam) {
                      schoolclassIds = schoolclassIdstr
                      params = {
                        action: 'edit',
                        schoolclassIdstr: schoolclassIds,
                        schoolyearId: this.ruleForm.schoolyearId.Id,
                        schooltermId: this.ruleForm.schooltermid.Id,
                        gradeId: this.ruleForm.gradeId,
                        subjectId: this.ruleForm.examination.SubjectId,
                        examname: this.ruleForm.examination.ExamName,
                        radioType: this.ruleForm.examination.IsGradeUnifiedExam ? 1 : 0,
                        schoolId: this.cookiesObj.schoolId,
                        oldexamname: this.oldexamname,
                        oldSubjectId: this.oldSubjectId,
                        oldSchoolClassId: this.oldSchoolClassId,
                        examination: {
                          EndTime: this.ruleForm.examination.EndTime,
                          BeginTime: this.ruleForm.examination.BeginTime,
                          ExamName: this.ruleForm.examination.ExamName,
                          SubjectId: this.ruleForm.examination.SubjectId,
                          SchoolClassId: '',
                          GradeId: this.ruleForm.gradeId,
                          DeleteFlag: false,
                          SchoolId: this.cookiesObj.schoolId,
                          SchoolTermName: this.ruleForm.schooltermid.Name,
                          SchoolTermId: this.ruleForm.schooltermid.Id,
                          SchoolYearName: this.ruleForm.schoolyearId.Name,
                          SchoolYearId: this.ruleForm.schoolyearId.Id,
                          IsGradeUnifiedExam: this.ruleForm.examination.IsGradeUnifiedExam ? 1 : 0,
                          MasterInvigilator: this.ruleForm.examination.MasterInvigilator,
                          AssistantInvigilator: this.ruleForm.examination.AssistantInvigilator,
                          Id: this.$parent.rowId
                        }
                      }
                    } else {
                      schoolclassIds = this.ruleForm.schoolclassId

                      params = {
                        action: 'edit',
                        schoolclassIdstr: '',
                        schoolyearId: this.ruleForm.schoolyearId.Id,
                        schooltermId: this.ruleForm.schooltermid.Id,
                        gradeId: this.ruleForm.gradeId,
                        subjectId: this.ruleForm.examination.SubjectId,
                        examname: this.ruleForm.examination.ExamName,
                        radioType: this.ruleForm.examination.IsGradeUnifiedExam ? 1 : 0,
                        schoolId: this.cookiesObj.schoolId,
                        oldexamname: this.oldexamname,
                        oldSubjectId: this.oldSubjectId,
                        oldSchoolClassId: this.oldSchoolClassId,
                        examination: {
                          EndTime: this.ruleForm.examination.EndTime,
                          BeginTime: this.ruleForm.examination.BeginTime,
                          ExamName: this.ruleForm.examination.ExamName,
                          SubjectId: this.ruleForm.examination.SubjectId,
                          SchoolClassId: schoolclassIds,
                          GradeId: this.ruleForm.gradeId,
                          DeleteFlag: false,
                          SchoolId: this.cookiesObj.schoolId,
                          SchoolTermName: this.ruleForm.schooltermid.Name,
                          SchoolTermId: this.ruleForm.schooltermid.Id,
                          SchoolYearName: this.ruleForm.schoolyearId.Name,
                          SchoolYearId: this.ruleForm.schoolyearId.Id,
                          IsGradeUnifiedExam: this.ruleForm.examination.IsGradeUnifiedExam ? 1 : 0,
                          MasterInvigilator: this.ruleForm.examination.MasterInvigilator,
                          AssistantInvigilator: this.ruleForm.examination.AssistantInvigilator,
                          Id: this.$parent.rowId
                        }
                      }
                    }
                    // console.log(params)
                    this.dialogLoading = true
                    this.$store.dispatch('interflow/SaveSubject', params).then(res => {
                        // console.log(res)
                        var result = JSON.parse(res)
                        if (result.Code == 200) {
                            this.$message({
                                message: result.Msg,
                                duration: 2000,
                                type: 'success'
                            })
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
            this.dialogLoading = true
            this.getYear()
            this.getTerm(this.$parent.schoolyearId)
            this.getGrades()
            this.getClasses(this.$parent.schoolyearId, this.$parent.gradeId)
            this.getSubject()
            this.getFormDetail()
        },
        // 获取学年
        getYear () {
            this.$store.dispatch('interflow/GetYear', '').then(res => {
                var result = JSON.parse(res)
                if (result.Code == 200) {
                   this.schoolYear = result.Data
                }
            })
        },
        // 获取学期
        getTerm (schoolyearId) {
            var params = {
                schoolId: this.cookiesObj.schoolId,
                schoolyearId: schoolyearId
            }
            this.$store.dispatch('interflow/GetTerm', params).then(res => {
              var result = JSON.parse(res)
              if (result.Code == 200) {
                this.schoolTerm = result.Data
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
                  this.schoolGrades = result.Data.data
                  // console.log(this.schoolGrades)
                }
            })
        },
        // 获取班级
        getClasses (schoolyearId, gradeId) {
            var params = {
                schoolId: this.cookiesObj.schoolId,
                schoolyearId: schoolyearId,
                gradeId: gradeId
            }
            // console.log(params)
            this.$store.dispatch('interflow/GetClasses', params).then(res => {
                // console.log(res)
                var result = JSON.parse(res)
                if (result.Code == 200) {
                  this.schoolClasses = result.Data
                  // console.log(this.schoolClasses)
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
          this.getTerm(this.schoolyearId)
          this.getClasses(this.schoolyearId, '')
          this.term = ''
          this.schooltermid = ''
          this.ruleForm.schooltermid = ''
          this.grades = ''
          this.gradeId = ''
          this.ruleForm.gradeId = ''
          this.classes = ''
          this.classId = ''
          this.ruleForm.schoolclassId = ''
        },
        // 年级change
        changeGrades (val) {
          this.gradeId = val.Id
          this.schoolyearId = this.schoolyearId == '' ? this.ruleForm.schoolyearId.Id : this.schoolyearId
          this.gradeId = this.gradeId == undefined ? this.ruleForm.gradeId : this.gradeId
          this.getClasses(this.schoolyearId, this.gradeId)
          this.classes = ''
          this.classId = ''
          this.ruleForm.schoolclassId = ''
        },
        // 学期change
        changeTerm (val) {
          this.schooltermid = val
        },
        // 班级change
        changeClasses (val) {
          this.classId = val
        },
        changeSubject (val) {
          console.log(val)
        },
        getFormDetail () {
            var params = {
              id: this.$parent.rowObj.id,
              schoolId: this.cookiesObj.schoolId,
              schoolyearId: this.$parent.schoolyearId,
              gradeId: this.$parent.gradeId,
              schooltermid: this.$parent.schooltermid,
              schoolclassId: this.$parent.classId
            }
            this.dialogLoading = true
            this.$store.dispatch('interflow/EditSubject', params).then(res => {
                var result = JSON.parse(res)
                // console.log(result)
                if (result.Code == 200) {
                  this.ruleForm = result.Data
                  // this.oldObj = result.Data
                  this.ruleForm.schooltermid = {
                    Id: this.ruleForm.schooltermid,
                    Name: this.ruleForm.examination.SchoolTermName
                  }
                  this.ruleForm.schoolyearId = {
                    Id: this.ruleForm.schoolyearId,
                    Name: this.ruleForm.examination.SchoolYearName
                  }
                  this.isDisable = this.ruleForm.examination.IsGradeUnifiedExam
                  this.isDisableNew = this.ruleForm.examination.IsGradeUnifiedExam
                  this.oldexamname = this.ruleForm.examination.ExamName
                  this.oldSubjectId = this.ruleForm.examination.SubjectId
                  this.oldSchoolClassId = this.ruleForm.examination.SchoolClassId
                  // console.log(this.ruleForm)
                }
                this.dialogLoading = false
            })
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
        changeValue (val) {
          // console.log(val)
          this.isDisableNew = val
        }
    }
}
</script>
<style lang="sass" scoped>
</style>
