<template>
    <div>
        <el-card>
            <el-button @click="toBack" icon="el-icon-arrow-left" type="text">返回</el-button>
        </el-card>
    
        <el-card style="margin:1rem 0 0 0;">
            <div class="log-title">{{workLogDetail.worklog.Title}}</div>
            <div class="log-date">{{workLogDetail.worklog.CreatorUserName}}，{{workLogDetail.worklog.LogDate | formatDateTime('yyyy-MM-dd w')}}</div>
            <div class="log-content ql-editor" v-html="workLogDetail.worklog.Content"></div>
        </el-card>
         <el-card header="附件" style="margin:1rem 0 0 0;">
            
            <div v-for="(item,index) in workLogDetail.worklogattachments"  :key="index">
                 <a  :href="item.Url | imgUrl"
            target="_blank"
            :download="item.FileName">{{item.FileName}}</a>
            </div>
           
        </el-card>
        
         <el-card header="评论" style="margin:1rem 0 0 0;">
 
             <el-input
                type="textarea"
                placeholder="说点什么吧..."
                v-model="content"
                maxlength="200"
                :show-word-limit='true'
            ></el-input>
            
            <div class="fb-p">
                 <el-button @click="publish" type="primary" >发表评论</el-button>
            </div>
            <div class="comment-list">
                <div v-for="(item,index) in commentList" :key="index" class="comment-item">
                    <div class="comment-content">{{item.Content}}</div>
                    <div class="comment-date">{{item.CommentUserName}}，{{item.CommentTime | formatDateTime('yyyy-MM-dd w')}}</div>

                    <div v-if="item.CommentUserId == cookiesObj.loginUserId">
                        <el-button @click="delComment(item)" type="text">删除</el-button>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import {addComment, delComment, getCommentList} from '@/api/workLogApi'
import {mapGetters} from 'vuex'
export default {
    name:'workLogDetail',
    data () {
        return {
            content: '',
            commentList: []
        }
    },
   
    computed: {
         ...mapGetters(['cookiesObj']),
        workLogDetail () {
            return this.$store.state.workLog.workLogDetail
        }
    },
    methods: {
         downloadUrl(item){
             
            var url = item.Url
            var name = item.FileName
        
            url = url.replace(/\\/g, '/')
            if (/^http/.test(url)) {
            
            } else {
                url = 'http://' + url
            }
            return this.$store.state.file.downloadUrl+'?url='+url+'&fileName='+name
        },
        toBack () {
            this.$router.go(-1)
        },
        publish () {
            if(!this.content.replace(/\s/g,'')){
                 this.$message.error('请输入内容')
                return
            }
            addComment({
                WorkLogId: this.workLogDetail.worklog.Id,
                CommentUserId: this.cookiesObj.loginUserId,
                CommentUserName: decodeURI(this.cookiesObj.realName),
                Content: this.content,
            }).then(res => {
               
                res = JSON.parse(res)
                if (res.Code == '200') {
                  
                    var comment = { 
                        Id: res.Data.id, 
                        WorkLogId: this.workLogDetail.worklog.Id, 
                        CommentUserId: this.cookiesObj.loginUserId, 
                        CommentUserName: decodeURI(this.cookiesObj.realName), 
                        Content: this.content, 
                        CommentTime: res.Data.time
                    }
                    this.commentList.splice(0,0,comment)
                     this.$message.success('发表成功')
                } else {
                     this.$message.success(res.Msg)
                }
                 this.content = ''
            })
        },
        delComment (item) {
            this.$confirm('确定删除 ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { 
                delComment(item.Id).then(res => {
                    res = JSON.parse(res)
                    if (res.Code == '200'){
                            for (var i = 0; i< this.commentList.length;i++){
                                if(this.commentList[i].Id == item.Id){
                                    this.commentList.splice(i,1)
                                }
                            }
                            this.$message.success('删除成功')
                        }
                    })
            }).catch(() => {

            })

            
        }
    },
    mounted () {
        
        getCommentList({
            workLogId: this.workLogDetail.worklog.Id
        }).then(res => {
            
            res = JSON.parse(res)
            this.commentList = res.Data
        })
    }
}
</script>
<style scoped>
.log-date{
    color: #9e9c9c;
    text-align: center;
    padding: 0 0 1rem 0;
}
.log-title{
    text-align: center;
    font-size: 1.2rem;
    padding: 0 0 1rem 0;
}
.fb-p{padding: 1rem 0;}
.comment-list{

}
.comment-item{
    padding: 1rem 0;
    border-bottom: 1px solid #ececec;
}
.comment-content{

}
.comment-date{
    color: #9e9c9c;
    
    padding: 0.5rem 0 0rem 0;
}
</style>