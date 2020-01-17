<template>
    <div luqi="1">
        <el-row :gutter="20" style="height:100%;">
             <el-col :span="6"  style="height:100%;">
                 <el-card  style="height:100%;overflow:scroll;">
                     <el-tree 
                     :data="folder" 
                     :props="{
                          children: 'childrenPublicfolder',
                          label: 'label'
                     }"
                     :expand-on-click-node='false'
                     :default-expand-all='true'
                     :highlight-current='true'
                     @node-click="handleNodeClick"
                     :render-content="renderContent">
                     </el-tree>
                 </el-card>
             </el-col>
             <el-col :span="18" style="height:100%;">
                 <el-card style="height:100%;overflow:scroll;">
                     
                    <el-form :inline="true" >
                        <el-form-item label="">
                            <el-input v-model.trim="keyword"  placeholder="输入要找的文件名"></el-input>
                        </el-form-item>
                    
                        <el-form-item>
                            <el-button @click="handleList('')" type="primary">查询</el-button>
                        </el-form-item>
                          <el-form-item>
                            <el-button @click="toAddFile" icon="el-icon-plus" type="primary">新建文件</el-button>
                        </el-form-item>
                    </el-form>
                    <div >剩余容量：{{remainSize}}MB</div>
                    <div style="padding:20px 0;">当前目录：{{curFolder.Name}}</div>
                    <cvue-table
                        :option="tableOption"
                        :data="tableData"
                        :page="page"
                        :tablePage="tablePage"
                        :pageSize="page.pageSize"
                        :loading="tableLoading"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        :isShowPage="false"
                        >
                          <template slot-scope="scope" slot="CreatingTime">
                           {{scope.row.CreatingTime | formatDateTime('yyyy-MM-dd HH:mm:ss')}}
                        </template>
                        
                        <template slot-scope="scope" slot="attach">
                          <div v-for="(item,index) in scope.row.attach" :key="index">
                             <a :download="item.AttachmentFileName"  
                             :href="item.AttachmentFileUrl | imgUrl"
                             target="_blank">{{item.AttachmentFileName}}</a>
                          </div>
                          
                           
                        </template>
                        <!-- 操作按钮 -->
                        <el-table-column
                            fixed="right"
                            slot="actionMenu"
                            label="操作"
                            align="center"
                            header-align="center"
                            width="160"
                        >
                       
                            <template slot-scope="scope">
                             <el-button type="text" @click="handleLook(scope.row)" >查看</el-button>
                              <el-button  type="text" @click="handleEdit(scope.row)" >编辑</el-button>
                               <el-button  type="text" @click="handleDel(scope.row)" >删除</el-button>
                           
                            </template>
                        </el-table-column>
                        </cvue-table>
                 </el-card>
                 
              </el-col>
        </el-row>

        <el-dialog v-if="addVisible"
            title="新建文件夹"
            :visible.sync="addVisible"
            width="30%"
            >
            <el-form label-width="150px">
                <el-form-item label="排序号">
                    <el-input-number v-model="orderNum" :precision='0' :min="1" :max="10000000" label="描述文字"></el-input-number>
                </el-form-item>
                 <el-form-item label="文件夹名称">
                    <el-input v-model.trim="folderName"  maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addFolder">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog v-if="editVisible"
            title="修改文件夹"
            :visible.sync="editVisible"
            width="30%"
            >
            <el-form label-width="150px">
                <el-form-item label="排序号">
                    <el-input-number v-model="orderNum" :precision='0' :min="1" :max="10000000" label="描述文字"></el-input-number>
                </el-form-item>
                 <el-form-item label="文件夹名称">
                    <el-input v-model.trim="folderName" maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editFolder">确 定</el-button>
            </span>
        </el-dialog>

        
        
         <add-file
          @closeDialog="closeDialog('add')"
          @confirmDialog="confirmDialog('add')"
          @handleClose="closeDialog('add')"
          :dialogVisible="addFileVisible"
        ></add-file>
         <add-file
          @closeDialog="confirmDialog('edit')"
          @confirmDialog="confirmDialog('edit')"
          @handleClose="confirmDialog('edit')"
          :dialogVisible="editFileVisible"
          type="edit"
        ></add-file>
        <look-file 
         @closeDialog="closeDialog('look')"
          @confirmDialog="confirmDialog('look')"
          @handleClose="closeDialog('look')"
          :dialogVisible="lookFileVisible"
        ></look-file>
    </div>
</template>
<script>
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import addFile from './addFile' 
import lookFile from './lookFile'
import {mapGetters} from 'vuex'
import {getFolderList, addFolder, editFolder, delFolder, getFileList, delFile} from '@/api/publicFileApi'

 export default {
   name:'publicFileList',
    components:{
        cvueTable,addFile,lookFile
    },
    computed:{
        ...mapGetters(['cookiesObj']),
        remainSize(){
          return this.$store.state.file.remainSize
        }
    },
    data() {
      return {
        folder: [],
        parentFolder:null,
        addVisible:false,
        editVisible: false,
       addFileVisible:false,
       editFileVisible:false,
       lookFileVisible:false,
        orderNum:"",
        folderName:"",
        folderId: '',
        keyword:'',
        curFolder:'',
         tableLoading: false,
         tablePage: 1,
        page: {
            total: 1, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示多少条
            pageSizes: [10, 50, 100]
        },
        tableOption: {
            selected: false,
            stripe: true,
            width: '100%',
            border: true,
            index: false,
            cloumn: [
            { prop: 'Name', label: '文件名称', align: 'center'},
            { prop: 'attach', label: '附件', align: 'center', slotStatus: true },
            { prop: 'CreatingTime', label: '更新时间', align: 'center', slotStatus: true },
            { prop: 'OrderNum', label: '序号', align: 'center' }
            ]

        },
        tableData: [
        ],
       
      };
    },
    methods: {
     downloadUrl(item){
        var url = item.AttachmentFileUrl
        var name = item.AttachmentFileName
      
        url = url.replace(/\\/g, '/')
        if (/^http/.test(url)) {
          
        } else {
            url = 'http://' + url
        }
        return this.$store.state.file.downloadUrl+'?url='+url+'&fileName='+name
      },
      renderContent(h, { node, data, store }) {
        var a = null

        if(data.publicsubfolder.LevelCode > 0){
          a = (
          <span class="custom-tree-node" style="width:100%;position:relative;">
          <i class="el-icon-folder" style='vertical-align:middle;'></i>
            <span style="display:inline-block;margin:0 0 0 10px;width:200px;vertical-align:middle; overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;">{node.label}</span>
            <span style="position:absolute;right:0;top:0;width:65px;">
              <el-button icon="el-icon-plus" size="mini" type="text" on-click={ (e) => this.toAdd(e,data) }></el-button>
              <el-button icon="el-icon-edit-outline" size="mini" type="text" on-click={ (e) => this.toEdit(e,data) }></el-button>
              <el-button  icon="el-icon-delete" size="mini" type="text" on-click={ (e) => this.toRemove(e,data) }></el-button>
             
            </span>
          </span>);
        }else {
          a = (
          <span class="custom-tree-node" style="width:100%;position:relative;">
           <i class="el-icon-folder" style='vertical-align:middle;'></i>
            <span style="display:inline-block;margin:0 0 0 10px;width:200px;vertical-align:middle;overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;">{node.label}</span>
            <span style="position:absolute;right:0;top:0;width:65px;">
              <el-button icon="el-icon-plus" size="mini" type="text" on-click={ (e) => this.toAdd(e,data) }></el-button>
            
            </span>
          </span>)
        }
        return a
      },
      toAdd (e,data) {
         console.log(data)
          e.stopPropagation()
          this.orderNum = ''
          this.folderName = ''

          this.parentFolder = data
          this.addVisible = true
          
      },
      addFolder () {
          if(!this.folderName){
            this.$message.error('请输入文件夹名称')
            return
          }
          addFolder({
                CreatingUserId: this.cookiesObj.loginUserId,
                Name:  this.folderName,
                ParentId: this.parentFolder.publicsubfolder.Id,
                LevelCode: this.parentFolder.publicsubfolder.LevelCode + 1,
                OrderNum:  this.orderNum,
                GeneralFolderId: this.parentFolder.publicsubfolder.GeneralFolderId
            }).then(d => {
                d = JSON.parse(d)
                if(d.Code == "200"){
                  this.newFolderId = d.Data.Id
                  this.getFolderData().then(() => {
                     this.$message.success('添加成功')
                   })
                 
                  
                }else{
                    this.$message.error(d.Msg)
                }
            })
          this.addVisible = false
      },
     
      toEdit (e,data) {
        e.stopPropagation()
        this.folderId = data.publicsubfolder.Id
        this.folderName = data.publicsubfolder.Name
        this.orderNum = data.publicsubfolder.OrderNum
         this.editVisible = true
      },
      editFolder () {
        if(!this.folderName){
            this.$message.error('请输入文件夹名称')
            return
          }
         editFolder({
               CreatingUserId: this.cookiesObj.loginUserId,
                Name:  this.folderName,
                Id: this.folderId,
                OrderNum:  this.orderNum
            }).then(d => {
               
                d = JSON.parse(d)
                if(d.Code == "200"){
                   this.getFolderData().then(() => {
                     this.$message.success('修改成功')
                   })
                 
                }else{
                    this.$message.error(d.Msg)
                }
            })
            
          this.editVisible = false
      },
     
      toRemove (e,data){
         e.stopPropagation()
        // if(data.publicsubfolder.LevelCode == 0){
        //   return
        // }
       
         this.$confirm('确定删除 “ '+data.publicsubfolder.Name+' ” ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delFolder(data.publicsubfolder.Id).then(d => {
             d = JSON.parse(d)
                if(d.Code == "200"){
                  if(this.curFolder.Id == data.publicsubfolder.Id){
                    this.handleList()
                    this.curFolder.Name = ''
                  }
                  
                  this.isParentDeleted(data.childrenPublicfolder)

                  this.removeAfter(this.folder,data.publicsubfolder.Id)
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    })
                    this.$store.dispatch('file/getFolder', this.$store.state.file.curRoot)
                }else{
                    this.$message.error(d.Msg)
                }
          })
        }).catch(() => {

        })
      },
      removeAfter (arr,id) {
        for(var i = 0;i<arr.length;i++){
          if(arr[i].publicsubfolder.Id == id){
            arr.splice(i,1)
          }else{
            this.removeAfter(arr[i].childrenPublicfolder,id)
          }
        }
      },
      isParentDeleted(folderList){
        for(var i = 0;i<folderList.length;i++){
          if(folderList[i].publicsubfolder.Id == this.curFolder.Id){
            this.tableData = []
            this.curFolder = ''
          }else{
            this.isParentDeleted(folderList[i].childrenPublicfolder)
          }
        }

      },
      toAddFile(){
        this.addFileVisible = true
      },
       // 关闭弹窗
    closeDialog (params) {
      
      if (params == 'add') {
        this.addFileVisible = false
      }else if(params == 'edit'){
        this.editFileVisible = false
      }else if(params == 'look'){
        this.lookFileVisible = false
      }
     
    },
    // 确认
    confirmDialog (params) {
      if (params == 'add') {
        this.addFileVisible = false
        this.handleList(this.$store.state.file.folderId)
      }
       if (params == 'edit') {
        this.editFileVisible = false
        this.handleList(this.$store.state.file.folderId)
      }
     
     
    },
     handleNodeClick(data) {
          console.log(data)
          this.handleList(data.publicsubfolder.Id)
          this.curFolder = data.publicsubfolder
          this.$store.dispatch('file/getFolder', data)
      },
      // 改变pagesize
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleList()
    },
    // 改变页码
    handleCurrentChange (val) {
      this.tablePage = val
      this.handleList()
    },
    // 列表接口
    handleList (id) {
      
      if(id){
         this.$store.state.file.folderId = id
      }else{
        id = this.$store.state.file.folderId
      }
     
      this.tableLoading = true
      var params = {
        schoolId: this.cookiesObj.schoolId
      }
      if(this.keyword){
        params.name = this.keyword
      }else {
        params.folderId = id
      }
      getFileList(params).then(res => {
        
        var result = JSON.parse(res)
        // console.log(result)
        if (result.Code == 200) {
          var list = result.Data
          if(!list){
            list = []
          }
          this.tableData = []
          for(var item of list){
            item.publicfile.attach = item.publicfileattachmentList
            this.tableData.push(item.publicfile)
          }
         
         
        } else {
          this.$message({
            message: res.msg,
            duration: 2000,
            type: 'error'
          })
        }
        this.tableLoading = false
       
      })
    },
      handleLook (data) {
          this.$store.state.file.curFile = data
        this.lookFileVisible = true
      },
      handleEdit (data) {
        
        this.$store.state.file.curFile = data
        this.editFileVisible = true
      },
      handleDel (data){
        this.$confirm('确定删除 “ '+data.Name+' ” ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delFile({
            data:JSON.stringify({ids:data.Id})
          }).then(d => {
             d = JSON.parse(d)
                if(d.Code == "200"){
                    for(var i =0;i<this.tableData.length;i++){
                      if(this.tableData[i].Id == data.Id){
                        this.tableData.splice(i,1)
                      }
                    }
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    })
                     this.$store.dispatch('file/getFolder', this.$store.state.file.curRoot)
                }else{
                    this.$message.error(d.Msg)
                }
          })
        }).catch(() => {

        })
      },
    
      getFolderData () {
        return new Promise((resolve,reject) => {
            getFolderList({
              schoolId: this.cookiesObj.schoolId,
            }).then(d => {
                
                d = JSON.parse(d)
                if(d.Code == "200"){
                    if(d.Data.length == 0){
                       
                    }else{
                        var list = d.Data
                        this.createLabel(list)
                        this.folder = list
                        this.$store.state.file.publicFolderList = list
                        console.log(this.folder)
                    }
                }else{
                    this.$message.error(d.Msg)
                }
                resolve()
            })
        })
      },
      createLabel(list){
            for(var item of list){
                item.label = item.publicsubfolder.Name
                this.createLabel(item.childrenPublicfolder)
            }
      }
    },
    mounted () {
        console.log(this.cookiesObj)
       this.getFolderData().then(() => {
          this.handleList(this.folder[0].publicsubfolder.Id)
            this.curFolder = this.folder[0].publicsubfolder
            this.$store.dispatch('file/getFolder', this.folder[0])
       })
    }
  }
</script>
<style scoped>

</style>