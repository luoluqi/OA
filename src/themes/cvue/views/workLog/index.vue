<template>
    <div>
       <el-card>
                     
            <el-form :inline="true" >
                <!-- <el-form-item label="">
                    <el-input  placeholder="输入要找的文件名"></el-input>
                </el-form-item> -->
                 <el-form-item label="">
                    <el-date-picker
                        v-model="dates"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @change="dateChange">
                    </el-date-picker>
                 </el-form-item>
                <el-form-item>
                    <el-button @click="query()" type="primary">查询</el-button>
                </el-form-item>
                    <el-form-item>
                    <el-button @click="toAdd" icon="el-icon-plus" type="primary">新建工作日志</el-button>
                </el-form-item>
            </el-form>
       </el-card>

       <el-tabs type="border-card" style="margin:1rem 0 0 0;">
            <el-tab-pane label="我的日志">
                <log-list :type="0"></log-list>
            </el-tab-pane>
            <el-tab-pane label="他人日志">
                <log-list :type="1"></log-list>
            </el-tab-pane>
        
        </el-tabs>
     
     
    </div>    
</template>
<script>
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import logList from './logList'
import bus from '@/util/bus'
export default {
    components:{
        cvueTable,cvueDialog,logList
    },
    data () {
        return {
            dates: [],
           
            name:"luqi"
        }
    },
    methods: {
        toAdd (e,data) {
           this.$store.commit('workLog/setType', 'add')
            this.$router.push('add')
        },
        dateChange (d) {
            if (d) {
                this.$store.state.workLog.beginTime = d[0]
                this.$store.state.workLog.endTime = d[1]
            } else {
                this.$store.state.workLog.beginTime = ''
                this.$store.state.workLog.endTime = ''
            }
           
        },
        query () {
            bus.$emit('queryWorkLog')
        }
    },
    mounted () {
       
    }
}
</script>
<style scoped>
</style>