<template>
  <div class="rela">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="关联人员"
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
  name: 'SchoolOrderDetail',
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
    }
  },
  mounted () {
  },
  methods: {
    getDetail () {
      this.getTeachDept()
    },
    // 触发事件
    handleClose () {
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmDialog () {
      let ids = this.checkedList.checkedKeys.join()
      let names = []
      let phones = []
      let teachIds = []
      for(var i=0;i<this.checkedList.checkedNodes.length;i++){
        var bool =  teachIds.indexOf(this.checkedList.checkedNodes[i].Id) >=0
        if(this.checkedList.checkedNodes[i].type === 0 && !bool){
          teachIds.push(this.checkedList.checkedNodes[i].Id)
          names.push(this.checkedList.checkedNodes[i].name)
          phones.push(this.checkedList.checkedNodes[i].cellPhone)
        }
      }
      teachIds = this.unique(teachIds)
      // names = this.unique(names)
      // phones = this.unique(phones)
      // console.log(teachIds)
      let params = {
        Id: this.$parent.relevanceRow.Id,
        Name: this.$parent.relevanceRow.Name,
        TeachIds: teachIds.join(','),
        TeachNames: names.join(','),
        schoolId: this.$parent.schoolId,
        RelevantNumber: teachIds.length,
        TeachPhones: phones.join(',')
      }
      this.$store.dispatch('payroll/EditTeachSalaryGroup', params).then(res => {
        let result = JSON.parse(res)
        // console.log(result)
        if (result.Code === 200) {
          this.$message.success('关联成功')
          this.$emit('confirmDialog')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getTeachDept () {
      let params = {
        schoolId: this.$parent.schoolId,
        groupId: this.$parent.relevanceId
      }
      // let paramsNew = { data: JSON.stringify(params) }
      this.$store.dispatch('payroll/GetTeachDept', params).then(res => {
        let result = JSON.parse(res)
        // console.log(result)
        if (result.Code == '200') {
          this.treeList = result.Data
          // this.keyArr = []
          this.setDeptData(this.treeList)
          if(this.$parent.relevanceRow.TeachIds){
            var teachersArr = this.$parent.relevanceRow.TeachIds.split(',')
            // teachersArr.forEach((item,index) => {
            //   this.setDeptData(this.treeList,item)
            // })
            // this.keyArr = this.keyArr.filter((item,index) => {
            //   return item!=undefined
            // })
            // console.log(teachersArr)
            this.teacherIds = teachersArr
            // this.$refs.tree.setCheckedKeys(teachersArr)
          }else{
            this.teacherIds = []
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 复选框选中状态
    checkTree (val1, val2) {
      // console.log(val1, val2)
      this.checkedList = val2
    },
    checkChange(obj,isCheck,isChildCheck){
      // console.log(obj,isCheck,isChildCheck)
      // this.checkStatus = isCheck
      if(!isCheck){
        var teachersArr = this.$parent.relevanceRow.TeachIds.split(',')
        var newArr = []
        teachersArr.forEach((item,index) => {
          if(item!=obj.Id){
            newArr.push(item)
          }
        })
        this.keyArr = []
        newArr.forEach((item,index) => {
          this.setDeptData(this.treeList,item)
        })
        this.keyArr = this.keyArr.filter((item,index) => {
          return item!=undefined
        })
        // console.log(this.keyArr)
        this.$refs.tree.setCheckedKeys(this.keyArr)
      }else{
        // console.log(obj.Id)
        // var teachersArr = this.$parent.relevanceRow.TeachIds.split(',')
        // console.log(teachersArr.indexOf(obj.Id))
        // // if(teachersArr.indexOf(obj.Id)<0){
        //   teachersArr.push(obj.Id)
        // }
        // this.keyArr = []
        // teachersArr.forEach((item,index) => {
        //   this.setDeptData(this.treeList,item)
        // })
        // this.keyArr = this.keyArr.filter((item,index) => {
        //   return item!=undefined
        // })
        // console.log(this.keyArr)
        // this.$refs.tree.setCheckedKeys(this.keyArr)
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
