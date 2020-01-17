<template>
    <div v-loading="isLoading">
        <div class="log-list">
            <div v-for="(item,index) in list" :key="index" class="log-item">
                <div @click="toDetail(item)" class="log-title">{{item.worklog.Title}}</div>
                <div class="log-author">
                    <div class="author-name">{{item.worklog.CreatorUserName}}</div>
                    <div v-if="item.worklog.TypeCode == '0'" class="log-type">个人日志</div>
                    <div v-if="item.worklog.TypeCode == '1'" class="log-type">工作日志</div>
                </div>
                <div class="log-date">{{item.worklog.LogDate | formatDateTime('yyyy-MM-dd w')}}</div>
                <div v-if="type == 0">
                    <!-- <el-button type="text">共享</el-button> -->
                    <el-button @click="toEdit(item)" type="text">编辑</el-button>
                    <el-button @click="toDel(item)" type="text">删除</el-button>
                </div>
                <!-- <div class="log-content">
                    这是内容这是内容这是内容这是内容这是内容这是内容
                </div> -->
            </div>
        
        </div>
        <div  v-show="Count > 0" class="page-num">
            <el-pagination
                background
                layout="prev, pager, next, total"
                :current-page="pageIndex"
                :total="Count"
                :page-size='pageSize'
                @current-change="getList">
            </el-pagination>
        </div>
        <div v-show="Count == 0">无数据</div>
    </div>
</template>
<script>
import {getWorkLogList, delWorkLog} from '@/api/workLogApi'
import {mapGetters} from 'vuex'
import bus from '@/util/bus'
export default {
    data () {
        return {
             pageSize: 10,
             pageIndex: 1,
             list: [],
             Count:10,
             isLoading: false
        }
    },
    props: ['type'],
     computed: {
        ...mapGetters(['cookiesObj'])
  },
    methods: {
        toDetail (item) {
          this.$store.commit('workLog/setWorkLog',item)
          this.$router.push('detail')
        },
        toEdit (item) {
            this.$store.commit('workLog/setWorkLog',item)
            this.$store.commit('workLog/setType', 'edit')
            this.$router.push('add')
        },
        toDel (item) {
            this.$confirm('确定删除 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { 
                delWorkLog(item.worklog.Id).then(res => {
                    res = JSON.parse(res)
                    if (res.Code == '200'){
                        this.getList(this.pageIndex)
                        this.$message.success('删除成功')
                    } else {
                        this.$message.error(res.Msg)
                    }
                })
            }).catch(() => {

            })
        },
        getList (num) {
            if(num < 1){
                return
            }
            this.pageIndex = num
           
            var param = {
                 userId: this.cookiesObj.teacherId,
                isMy: this.type,
                 pageIndex: num,
                pageSize: this.pageSize
            }
            if ( this.$store.state.workLog.beginTime) {
                param.beginTime = this.$store.state.workLog.beginTime
            }
            if (this.$store.state.workLog.endTime) {
               
                param.endTime = this.nextDate(this.$store.state.workLog.endTime)
            }
            this.isLoading = true
            getWorkLogList(param).then(res => {
                res = JSON.parse(res)
                this.isLoading = false
                if (res.Code == '200') {
                    this.Count = res.Data.Count
                    if (res.Data.List) {
                        this.list = res.Data.List
                    } else {
                        this.list = []
                        this.getList(this.pageIndex - 1)
                    }
                    
                } else {
                    this.$message.error(res.Msg);
                    
                }
            })
        },
        nextDate(str){
             var date = new Date(str + ' 00:00:00')
             date = new Date(date.getTime() + 1000 * 3600 * 24)
             var year = date.getFullYear()
             var month = date.getMonth() + 1
             var d = date.getDate()
            if(month < 10){
                month = '0'+month
            }
            if(d < 10){
                d = '0'+d
            }
            return year+'-'+month+'-'+d
        }
    },
    mounted () {
        this.getList(1)
        bus.$on('queryWorkLog', () => {
            this.getList(1)
        })
         bus.$on('workLogReload', () => {
             this.getList(this.pageIndex)
         })
    }
}
</script>
<style scoped>

.log-list{
    padding: 1.5rem 0 0 0;
}
.log-item:first-child{
    border-top: 1px solid #ececec;
}
.log-item{
    padding: 1rem 0;
    border-bottom: 1px solid #ececec;
    
}
.log-author{
    padding:0 0 0.5rem 0;
}
.author-name{
  
    display: inline-block;

}
.log-type{
    display: inline-block;
    color: #afafaf;
    margin: 0 0 0 1rem;
}
.log-date{
  
}
.log-title{
   cursor: pointer;
    font-size: 1.2rem;
    padding:0 0 1rem 0;
}
.log-content{

}
.page-num{
    padding: 1rem 0;
}
</style>