<template>
  <div class="main">
    <div class="schedule">
      <div class="schedule-top">
        <h2>日程安排</h2>
      </div>
      <div class="schedule-bd">
        <fullCalendar 
          :config="fullCalendar.config" 
          :header="fullCalendar.header" 
          :events="scheduleList"
          @day-click="dayClick(arguments)"
          @event-selected="eventSelected(arguments)"
          @view-render ="viewRender"
        >
        </fullCalendar>
      </div>

    </div>
    <!-- 添加日程安排 -->
    <add-schedule
      :dialogVisible="addSchedule"
      :addScheduleParams ="addScheduleParams"
      :title ='addScheduleTit'
      :disableAll="disableAll"
      @clearParams="clearParams"
      @closeDialog="closeDialog('addSchedule')"
      @confirmDialog="confirmDialog('addSchedule')"
      @handleClose="closeDialog('addSchedule')"
    ></add-schedule>
    
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import fullCalendar from '@/components/cvue/FullCalendar'
// import cvueDialog from "@/components/cvue-dialog";
import addSchedule from './addSchedule'

export default {
  name: 'schedule',
  components: {
    fullCalendar, 
    addSchedule
  },
  computed: {
    ...mapGetters(['cookiesObj', 'cookieStart'])
  },
  data () {
    return {
      fullCalendar: {
        header: {
          left: 'title',
          right: 'prev,next today'
          // right:  'month'
        },
        config: {
          buttonText: { today: '今天', month: '月' },
          locale: 'zh-cn'
        }
      },
      scheduleList: [],
      monthTime: {
        start: '',
        end: ''
      },
      addSchedule: false,
      addScheduleTit: '新建日程',   
      addScheduleParams: {
        Id: null,
        beginTime: ''
      },
      disableAll: false
    }
  },
  mounted () {
    // console.log(this.cookiesObj)
    // this.GetSchedule()
  },
  methods: {
    viewRender (...age) {
      // console.log(age[0].start)
      this.monthTime.start = this.getNowFormatDate(age[0].start._d)
      this.monthTime.end = this.getNowFormatDate(age[0].end._d)
      this.GetSchedule()
    },
    // 获取日程列表
    GetSchedule () {
      this.addScheduleParams.schoolId = this.cookiesObj.schoolId
      // console.log()
      // let getMonth=this.getNowFormatDate();
      var params = {
        loginUserId: this.cookiesObj.teacherId,
        schoolId: this.cookiesObj.schoolId,
        startTime: this.monthTime.start,
        endTime: this.monthTime.end
      }
      console.log(params)
      this.$store.dispatch('schedule/GetSchedule', params).then(res => {
        var result = JSON.parse(res)
        console.log(result)
        
        let arrList = result.Data.ListV2.map(function (item) {
          // console.log(item.EndTime.replace('00:', ':11'))
          return {
            start: item.BeginTime,
            end: item.EndTime.replace('00:', '23:'),
            Id: item.Id,
            title: item.TransContent,
            LevelCode: item.LevelCode,
            SchoolId: item.itemSchoolId,
            TransTypeCode: item.TransTypeCode,
            createId: item.CreateUserId,
            className: item.LevelCode
          }
        })
        this.scheduleList.splice(0, this.scheduleList.length)
        arrList.forEach(item => {
          this.scheduleList.push(item)
        })
        // this.scheduleList
        
        // this.clearParams()
      })
    },
    // 获取当前月日
    getNowFormatDate (date) {
        // var date = new Date();
        var seperator1 = '-'
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
            month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate
        
        return currentdate
    },
    // 添加日程弹窗
    dayClick (arg) {
      console.log(arg[0]._d)
      this.addScheduleTit = '新建日程'
      // var d = new Date(arg[0]._d)
      // var youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()  
      // console.log(youWant)
      this.addScheduleParams.beginTime = arg[0]._d
      this.disableAll = false 
      this.addSchedule = true
      // console.log(this.dialogVisible)
    },

    // 获取日程安排编辑信息
    GetScheduleEdit (id) {
      var params = {
        id: id
      }

      this.$store.dispatch('schedule/GetScheduleEdit', params).then(res => {
        var result = JSON.parse(res)
        console.log(result)
        if (result.Code === 200) {
          this.addScheduleParams.Id = result.Data.Id
          this.addScheduleParams.loginUserIds = result.Data.ToLoginId
          this.addScheduleParams.loginNames = result.Data.ToUserName
          this.addScheduleParams.transContent = result.Data.TransContent
          this.addScheduleParams.levelCode = result.Data.LevelCode
          this.addScheduleParams.transTypeCode = result.Data.TransTypeCode
          this.addScheduleParams.beginTime = result.Data.BeginTime
          this.addScheduleParams.endTime = result.Data.EndTime
        }
        // console.log(this.addScheduleParams)
        this.addSchedule = true
      })
    },
    
    // 编辑日程弹窗
    eventSelected (age) {
      console.log(age[0])
      if (age[0].createId == this.cookiesObj.teacherId) {       
        this.disableAll = false 
        this.addScheduleTit = '编辑日程'
        this.GetScheduleEdit(age[0].Id)
      } else {
        this.disableAll = true
        this.addScheduleTit = '查看日程'
        this.GetScheduleEdit(age[0].Id)
      }
      // { return false }
    },
    // 清空参数
    clearParams () {
      this.addScheduleParams.loginUserIds = ''
      this.addScheduleParams.loginNames = ''
      this.addScheduleParams.transContent = ''
      this.addScheduleParams.levelCode = ''
      this.addScheduleParams.transTypeCode = ''
      this.addScheduleParams.beginTime = ''
      this.addScheduleParams.endTime = ''
      this.addScheduleParams.Id = null
    },
    // 关闭弹窗
    closeDialog (params) {
      // console.log(params)
      this[params] = false
      if (params == 'addSchedule') {
        this.addScheduleTit = '新建日程'
        // this.clearParams()
      }
    },
    // 确认
    confirmDialog (params) {
      this[params] = false
      this.GetSchedule()
    }
  }
}
</script>
<style lang="scss" >
.schedule {
  border: 1px solid #e3e3e3; border-radius: 5px; background: #fff; overflow: hidden;
  .schedule-top {
    width: 100%;border-bottom: 1px solid #e3e3e3;line-height: 53px;
    h2 {font-size: 18px; padding-left: 10px; font-weight: 600;}
  }
  .schedule-bd {
    padding: 20px;
  }
}
body{
  .Impt_Urg { background: red;}
  .Impt_NotUrg { 
    background: yellow;color: #000;
    &:hover{color: #000;}
  }
  .NotImpt_Urg { background: orange;}
  .NotImp_NotUrg { background: blue;}
}

</style>
