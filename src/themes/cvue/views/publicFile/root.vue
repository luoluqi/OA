<template>
    <div>
        <el-card style="height:100%;">
                     
                    <el-form :inline="true" >
                          <el-form-item>
                            <el-button @click="openDialog('add')" icon="el-icon-plus" type="primary">创建根目录</el-button>
                        </el-form-item>
                    </el-form>
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
                         <template slot-scope="scope" slot="MaxSize">
                              {{scope.row.MaxSize}} MB
                            </template>

                            <template slot-scope="scope" slot="CurrentSize">
                              {{scope.row.CurrentSize}} MB
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
                             <!-- <el-button type="text" @click="handleLook(scope.row)" >查看</el-button> -->
                              <el-button  type="text" @click="handleEdit(scope.row)" >编辑</el-button>
                              <el-button  type="text" @click="handleDel(scope.row)" >删除</el-button>
                            </template>
                        </el-table-column>
                        </cvue-table>
                 </el-card>


                 <cvue-dialog 
                    :dialogVisible="visible"
                    :title="dialogTitle"
                    :isShowFoot="true"
                    @closeDialog="closeDialog"
                    @confirmDialog="confirmDialog"
                    @handleClose="closeDialog"
                    >
                    <div class="dialog-body" slot="dialogBody" >
                        <el-form  label-width="110px">
                            <el-form-item label="序号:" >
                                <el-input-number v-model="OrderNum" :precision='0' :min="1" :max="1000000" label="描述文字"></el-input-number>
                            </el-form-item>
                            <el-form-item label="文件夹名称:" >
                                <el-input v-model.trim="Name" maxlength="30"></el-input>
                            </el-form-item>
                            <el-form-item label="最大容量:" >
                                 <el-input-number v-model="MaxSize" :precision='0' :min="10" :max="1000000" label="描述文字">
                                    
                                 </el-input-number>
                                MB
                            </el-form-item>
                        </el-form>
                    </div>
                </cvue-dialog>
    </div>
</template>
<script>
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import {getRoot, addRoot, editRoot, delRoot} from '@/api/publicFileApi'
import {mapGetters} from 'vuex'
export default {
     name:'publicFileRoot',
    components:{
        cvueTable,cvueDialog
    },
    computed: {
        ...mapGetters(['cookiesObj'])
 
    },
    data () {
        return {
            dialogTitle: '新建根目录',
            visible: false,
            dialogType: 'add',
            MaxSize: '',
            Name: '',
            OrderNum: '',
            root: '',
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
                    { prop: 'OrderNum', label: '序号', align: 'center' },
                    { prop: 'Name', label: '文件名称', align: 'center'},
                     { prop: 'MaxSize', label: '最大容量', align: 'center',  slotStatus: true },
                     { prop: 'CurrentSize', label: '已用容量', align: 'center',  slotStatus: true }  
                    
                ]

            },
            tableData: [

            ]
        }
    },
    methods: {
        openDialog (dialogType) {
            this.visible = true
            this.dialogType =dialogType
            if (this.dialogType == 'add') {
                this.dialogTitle = '创建根目录'
                this.Name = ''
                this.MaxSize = ''
                this.OrderNum = ''
            } else if (this.dialogType == 'edit') {
                 this.dialogTitle = '编辑根目录'
            }
        },
        confirmDialog () {
            if(!this.Name){
                this.$message.error('请输入文件名称')
                return
            }
            if (this.dialogType == 'add'){
                addRoot({
                    SchoolId: this.cookiesObj.schoolId,
                    Name: this.Name,
                    OrderNum: this.OrderNum,
                    MaxSize: this.MaxSize,
                    CreatingUserId: this.cookiesObj.loginUserId,
                }).then(res => {
                    this.handleList()
                })
            } else if (this.dialogType == 'edit'){
                if(this.MaxSize < this.root.CurrentSize){
                     this.$message.error('最大容量至少'+this.root.CurrentSize+'MB')
                     return
                }
                editRoot({
                    Id: this.root.Id,
                    SchoolId: this.cookiesObj.schoolId,
                    Name: this.Name,
                    OrderNum: this.OrderNum,
                    MaxSize: this.MaxSize,
                    CreatingUserId: this.cookiesObj.loginUserId,
                }).then(res => {
                    this.handleList()
                })
            }
            this.visible = false
        },
        closeDialog () {
            this.visible = false
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
    handleList () {
        getRoot({
             schoolId: this.cookiesObj.schoolId,
        }).then(res => {
            res = JSON.parse(res)
            this.tableData = res.Data
            console.log(this.tableData)
        })
    },
      handleLook (data) {
        
      },
      handleEdit (data) {
        this.openDialog('edit')
        this.root = data
        this.Name = data.Name
        this.MaxSize = data.MaxSize
        this.OrderNum = data.OrderNum
      },
      handleDel (data) {
          this.$confirm('确定删除 “'+data.Name+'” ?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              delRoot(data.Id).then(res => {
                  res = JSON.parse(res)
                  if (res.Code == '200') {
                      this.$message.success('删除成功')
                      this.handleList()
                  } else {
                      this.$message.error(res.Msg)
                  }
              })
          })
      }
    },
    mounted () {
        this.handleList()
    }
}
</script>
<style  scoped>

</style>