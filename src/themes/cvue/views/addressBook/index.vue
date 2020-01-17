<template>
    <div>
       <el-row :gutter="20" style="height:100%;">
           <el-col :span="6" style="height:100%;">
               <el-card style="height:100%;overflow:scroll">
                   <el-form :inline="true" >
                        <el-form-item label="">
                            <el-input v-model.trim="keyword"  placeholder="输入员工姓名"></el-input>
                        </el-form-item>
                        
                        <el-form-item>
                            <el-button @click="query()" type="primary">查询</el-button>
                        </el-form-item>
                    
                    </el-form>
                  
                    <el-tree :data="treeData" :props="{
                        children: 'childrenSchoolDept',
                        label: 'label'
                        }" 
                        :expand-on-click-node='false'
                        @node-click="handleNodeClick"></el-tree>
               </el-card>
           </el-col>
           <el-col :span="6" style="height:100%;">
               <el-card :header="curDeptName" style="height:100%;overflow:scroll">
                  
                   <div v-for="(item,index) in teacherList" :key="index" class="user-item">
                     
                       <!-- <img class="user-img" src="@/assets/6.jpg" alt=""> -->
                       <img @click="toDetail(item)" class="user-img" :aa='item.PortraitImgUrl' :src="item.PortraitImgUrl" onerror="this.src = 'static/img/main/photo.jpg'" alt="">
                        <div  @click="toDetail(item)" class="user-name">{{item.Name}}</div>
                   </div>
                   <div v-show="teacherList.length == 0" class="no-data">无数据</div>
               </el-card>
           </el-col>
           <el-col :span="12" style="height:100%">
               <el-card style="height:100%">
                    <div v-show="teacher" class="user-detail">
                        <img class="user-detail-img" :aa='teacher.PortraitImgUrl' :src="teacher.PortraitImgUrl" onerror="this.src = 'static/img/main/photo.jpg'" alt="">
                        
                        
                        <div class="user-detail-name">{{teacher.Name}}</div>
                        <div class="user-tr">性别：
                            <span v-show="teacher.Gender">男</span>
                            <span v-show="!teacher.Gender">女</span>
                        </div>
                        <div class="user-tr">电话：{{teacher.CellPhoneNum}}</div>
                        <div class="user-tr">地址：{{teacher.FamilyAddress}}</div>
                    </div>
               </el-card>
           </el-col>
       </el-row>
    </div>
</template>
<script>
import {getDept, getTeacherList, getTeacher, getTeacherByName} from '@/api/addressBookApi'
export default {
    data (){
        return {
            treeData: [],
            noDeptData: [],
            curDeptName: '',
            teacherList: [],
            keyword: '',
            teacher: ''
        }
    },
    methods: {
        handleNodeClick (item) {
            
            this.curDeptName = item.schooldept.Name
            if(item.schooldept.Id == 'other'){
                this.teacherList = this.noDeptData
                return
            }
            getTeacherList({
                deptId: item.schooldept.Id
            }).then(res => {
                res = JSON.parse(res)
                var list = res.Data
                if (!list) {
                    list = []
                }
                for(var item of list){
                    if (!item.PortraitImgUrl) {
                        item.PortraitImgUrl = 'fsfsd'
                    }
                }
                this.teacherList = list
            })
        },
         setLabel (list) {
             for (var item of list){
                 item.label = item.schooldept.Name
                 this.setLabel(item.childrenSchoolDept)
             }
         },
         query () {
             if (!this.keyword) {
                 return
             }
             this.curDeptName = this.keyword
             getTeacherByName({
                 teachName: this.keyword,
                 schoolId: this.$store.getters.cookiesObj.schoolId
             }).then(res => {
                 
                 res = JSON.parse(res)
                 var list = res.Data
                 if (!list) {
                    list = []
                }
                 list = list.map(item => item.teacher)
                 for(var item of list){
                    if (!item.PortraitImgUrl) {
                        item.PortraitImgUrl = 'fsfsd'
                    }
                }
                 this.teacherList = list
             })
         },
         toDetail (item) {
             console.log(item)
             this.teacher = item
         }
    },
    mounted(){
        getDept({
            schoolId: this.$store.getters.cookiesObj.schoolId
        }).then(res => {
            
            res = JSON.parse(res)
            console.log(res)
            var list = res.Data
            list.push({
                schooldept:{
                    Id: "other",
                    Name: "其他部门",
                    Code: null,
                    ParentId: null,
                    SchoolId: "eeeea2b869e44b3bbd797f4d781aceaf",
                    LevelCode: 0,
                    DeleteFlag: false
                },
                childrenSchoolDept: []
            })
            this.setLabel(list)
            this.treeData = list
            this.noDeptData = res.NoDeptData
            for(var item of this.noDeptData){
                    if (!item.PortraitImgUrl) {
                        item.PortraitImgUrl = 'fsfsd'
                    }
                }
        })
       
    }
}
</script>
<style scoped>
.user-item{
    margin: 0 0 1rem 0;
}
.user-img{
    display: inline-block;
    margin: 0 1rem 0 0;
    vertical-align: middle;
    height: 2rem;
    width: 2rem;
    cursor: pointer;
}
.user-name{
     display: inline-block;
    vertical-align: middle;
     cursor: pointer;
}
.user-detail{
    font-size: 1.2rem;
}
.user-detail-img{
  display: inline-block;
    vertical-align: middle;
     height: 3rem;
    width: 3rem;
}
.user-detail-name{
  display: inline-block;
    vertical-align: middle;
}
.user-tr{
    padding: 1rem 0 0 0;
}
.no-data{text-align: center;padding: 20px 0;}
</style>