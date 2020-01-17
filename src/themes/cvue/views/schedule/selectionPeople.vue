<template>
  <div class="rela">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="选择人员"
      :isShowFoot="true"
      dialogWidth="600px"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
    >
      <div class="dialog-body" slot="dialogBody" style="padding: 0;">
        <el-tabs type="border-card" class="tabs-card">
          <el-tree
            :data="treeList"
            show-checkbox
            default-expand-all
            node-key="Id"
            @check="checkTree"
            ref="tree"
            highlight-current
            :props="defaultProps"
            :default-checked-keys="teacherIds"	
          ></el-tree>
        </el-tabs>
      </div>
    </cvue-dialog>
  </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
export default {
  name: 'selectionPeople',
  components: {
    cvueDialog,
    cvueTable
  },
  data () {
    return {
      treeList: [],
      checkedArr: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      checkedList: [],
      treeIndex: 1000,
      keyArr: [],
      checkStatus: false,
      teacherIds: []
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    loginUserIds:{
      type: Array,
      default:() => []
    },
    loginNames:{
      type: Array,
      default:() => []
    }
  },
  mounted () {
  },
  methods: {

    getDetail () {
      // this.teacherIds = this.loginUserIds
      this.getTeachDept()
      this.loginUserIds.forEach(item => {
        this.teacherIds.push(item)
      })
      console.log(this.teacherIds)
    },
    // 触发事件
    handleClose () {
      
      this.teacherIds.splice(0,this.loginUserIds.length)
      this.$emit('handleClose')
    },
    closeDialog () {
      
      this.teacherIds.splice(0,this.loginUserIds.length)
      this.$emit('closeSelection')
    },
    // 去除重复json
    uniqueJson(list) {
      var temp = {}//用于id判断重复
      var result = [];
      list.map(function(item,index){
        if(!temp[item.Id]){
          result.push(item);
          temp[item.Id] = true
        }
      })
      return result;
    },
    confirmDialog () {
      // console.log(this.checkedList.checkedNodes)
      let checkedNodes = this.checkedList.checkedNodes
      
      this.loginUserIds.splice(0,this.loginUserIds.length)
      this.loginNames.splice(0,this.loginNames.length)
      let checked = []
      checkedNodes = checkedNodes.map(item =>{
        if(item.children === null) {
          checked.push(item)
        }
      })
      checked = this.uniqueJson(checked)
      // console.log(a)
      // checkedNodes.forEach(item => {
      //   this.loginUserIds.push(item.id)
      //   this.loginNames.push(item.name)
      // });
      this.$emit('confirmSelection',checked)
    },
    getTeachDept () {
      let params = {
        schoolId: this.$parent.$parent.cookiesObj.schoolId,
        // groupId: this.$parent.relevanceId
      }
      // let paramsNew = { data: JSON.stringify(params) }
      this.$store.dispatch('payroll/GetTeachDept', params).then(res => {
        let result = JSON.parse(res)
        // console.log(result)
        if (result.Code == '200') {
          this.treeList = result.Data
          console.log(result)
          // this.keyArr = []
          // this.setDeptData(this.treeList)
          
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 复选框选中状态
    checkTree (val1, val2) {
      // console.log(val2)
      this.checkedList = val2
    },
    checkChange(obj,isCheck,isChildCheck){
      console.log(obj,isCheck,isChildCheck)
      // this.checkStatus = isCheck

      if(!isCheck){
        var teachersArr = this.$parent.relevanceRow.TeachIds.split(',')
        // var newArr = []
        // teachersArr.forEach((item,index) => {
        //   if(item!=obj.Id){
        //     newArr.push(item)
        //   }
        // })
        // this.keyArr = []
        // newArr.forEach((item,index) => {
        //   this.setDeptData(this.treeList,item)
        // })
        // this.keyArr = this.keyArr.filter((item,index) => {
        //   return item!=undefined
        // })
        // console.log(this.keyArr)
        // this.$refs.tree.setCheckedKeys(this.keyArr)
      }else{
        
      }
    },
     // 递归
    setDeptData (arr) {
      arr.forEach((item,index)=>{
        if(item.children&&item.children.length>0){
          if (item.isChoice === 0) {
            item.disabled = false
          } else {
            item.disabled = true
          }
          this.setDeptData(item.children)
        }else{
          if (arr[index].isChoice === 0) {
            arr[index].disabled = false
          } else {
            arr[index].disabled = true
          }
        }
      })
    },
    // 递归
    setDeptData2 (arr,teacherId) {
      arr.forEach((item,index)=>{
        if(item.children&&item.children.length>0){
          if (item.isChoice === 0) {
            item.disabled = false
          } else {
            item.disabled = true
          }
          if (item.Id === teacherId) {
            this.keyArr.push(item.customId)
          } 
         
          // item.leaf = false
          this.setDeptData(item.children,teacherId)
        }else{
          if (arr[index].isChoice === 0) {
            arr[index].disabled = false
          } else {
            arr[index].disabled = true
          }
          if (arr[index].Id === teacherId) {
            this.keyArr.push(arr[index].customId)
          }
          arr[index].checked = true
        }
      })
    },
    unique (arr) {
      var newArr = []
      for (var i = 0; i < arr.length; i++) {
          if (newArr.indexOf(arr[i]) < 0) {
              newArr.push(arr[i])
          }
      }
      return newArr
    }
  }
}
</script>
<style lang='scss'>
.rela {
  .el-dialog__body {
    height: 600px;
    overflow: auto;
  }
  .el-dialog {
    width: 600px !important;
  }
  .tabs-card {
    border-bottom: none;
    box-shadow: none;
  }
  .information {
    margin-left: 60px;
    overflow: hidden;
    margin-top: 20px;
  }
  .personDetail {
    float: left;
    margin-left: 20px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  //  表单
  .inputWidth {
    width: 340px;
  }
}
</style>
