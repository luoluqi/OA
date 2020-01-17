<template>
    <div class="home">
        <!-- 表单 -->
        <el-card class="box-card mt-15">
            <div class="home-form">
                <el-form ref="ruleForm" label-width="60px" @submit.native.prevent>
                    <el-row :gutter="10">
                        <el-col :span="4">
                            <el-form-item label="年级" prop="keyword">
                                <el-select v-model="value" placeholder="订单类型"  size="mini">
                                    <el-option
                                        size="mini"
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="班级" prop="keyword">
                                <el-select v-model="value" placeholder="订单类型"  size="mini">
                                    <el-option
                                        size="mini"
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch" class="search-btn">查询</el-button>
                            <!-- <el-button type="primary" icon="el-icon-menu" @click="getAll">全部：{{cybercafeCount.sum}}</el-button>
                            <el-button type="info" icon="el-icon-tickets" @click="getOffLine">离线：{{cybercafeCount.offline}}</el-button> -->
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix fix-lh">
                <span>班级课程</span>
                <div class="btn-list">
                    <el-button size="mini" @click="handleAdd" v-hasPermission="permission.add">保存</el-button>
                </div>
            </div>
            <div class="home-body">
                <cvue-table :option="tableOption" :data="tableData" ref="tbl1"
                            :isShowAdd="false" :page="page" 
                            :tablePage="tablePage" :pageSize="page.pageSize"
                            :loading="tableLoading"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            @cellClick = "handleCellClick"
                            :isShowPage="false">
                    <template slot-scope="scope" slot="monday">
                        <el-select v-model="value" placeholder="订单类型"  size="mini" :data = "scope.row">
                            <el-option
                                size="mini"
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                    <template slot-scope="scope" slot="tuesday">
                        <el-select v-model="value" placeholder="订单类型"  size="mini" :data = "scope.row">
                            <el-option
                                size="mini"
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                    <template slot-scope="scope" slot="wednesday">
                        <el-select v-model="value" placeholder="订单类型"  size="mini" :data = "scope.row">
                            <el-option
                                size="mini"
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                    <template slot-scope="scope" slot="thursday">
                        <el-select v-model="value" placeholder="订单类型"  size="mini" :data = "scope.row">
                            <el-option
                                size="mini"
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                    <template slot-scope="scope" slot="friday">
                        <el-select v-model="value" placeholder="订单类型"  size="mini" :data = "scope.row">
                            <el-option
                                size="mini"
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </cvue-table>
            </div>
        </el-card>
        
    </div>
</template>
<script>
import cvueTable from '@/components/cvue-table'
import cvueDialog from '@/components/cvue-dialog'
import { baseUrl } from '@/config/config.js'
export default {
    name: 'Home',
    components: {
        cvueTable,
        cvueDialog
    },
    data () {
        return {
            options: [{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }, {
                value: '选项4',
                label: '龙须面'
                }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            uploadLoading: false,
            uploadHeader: {
              'Authorization': this.$store.getters.token
            },
            uploadData: {
              // 'importFile': 'file'
            },
            uploadUrl: '',
            downloadUrl: '',
            batchImportVisable: false,
            cybercafeCount: {
                offline: 0,
                online: 0,
                sum: 0
            },
            rowId: '',
            rowTitle: '',
            keyword: '',
            status: '',
            lineStatus: 0,
            tableLoading: false,
            dialogVisible: false,
            dialogVisibleEdit: false,
            dialogVisibleAdd: false,
            dialogVisibleNet: false,
            dialogVisibleExit: false,
            dialogVisibleCondition: false,
            dialogVisibleFault: false,
            tablePage: 1,
            page: {
                total: 1, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10, // 每页显示多少条
                pageSizes: [10, 50, 100]
            },
            tableOption: {
                stripe: true,
                width: '100%',
                border: true,
                index: false,
                cloumn: [
                    {prop: 'today', label: '星期', align: 'center'},
                    {prop: 'week', label: '节数', align: 'center'},
                    {prop: 'monday', label: '一', align: 'center', slotStatus: true},
                    {prop: 'tuesday', label: '二', align: 'center', slotStatus: true},
                    {prop: 'wednesday', label: '三', align: 'center', slotStatus: true},
                    {prop: 'thursday', label: '四', align: 'center', slotStatus: true},
                    {prop: 'friday', label: '五', align: 'center', slotStatus: true}
                ]
            },
            tableData: [
                {
                  week: '1', monday: '网吧1', tuesday: '在线', wednesday: '5555', thursday: '5555', friday: ''
                },
                {
                  week: '2', monday: '网吧1', tuesday: '在线', wednesday: '5555', thursday: '5555', friday: ''
                },
                {
                  week: '3', monday: '网吧1', tuesday: '在线', wednesday: '5555', thursday: '5555', friday: ''
                },
                {
                  week: '4', monday: '网吧1', tuesday: '在线', wednesday: '5555', thursday: '5555', friday: ''
                },
                {
                  week: '5', monday: '网吧1', tuesday: '在线', wednesday: '5555', thursday: '5555', friday: ''
                },
                {
                  week: '6', monday: '网吧1', tuesday: '在线', wednesday: '5555', thursday: '5555', friday: ''
                },
                {
                  week: '7', monday: '网吧1', tuesday: '在线', wednesday: '5555', thursday: '5555', friday: ''
                },
                {
                  week: '8', monday: '网吧1', tuesday: '在线', wednesday: '5555', thursday: '5555', friday: ''
                }
            ],
            value: ''
        }
    },
    mounted () {
        this.uploadUrl = baseUrl + 'api/file/bars/upload'
        this.downloadUrl = baseUrl + 'api/file/templatefile/download'
        // this.handleList(this.keyword, this.status) // 获取列表详情
        // this.getCybercafeNum() // 获取网吧数量
    },
    methods: {
        handleRefresh () {
            this.tablePage = 1
            this.handleList('', '') // 刷新列表
        },
        handleClick (row) {
            console.log(row)
        },
        // 改变pagesize
        handleSizeChange (val) {
            this.page.pageSize = val
            this.handleList(this.keyword, this.status)
            // this.getCybercafeNum() // 获取网吧数量
        },
        // 改变页码
        handleCurrentChange (val) {
            this.tablePage = val
            this.handleList(this.keyword, this.status)
            // this.getCybercafeNum() // 获取网吧数量
        },
        // 网吧搜索
        handleSearch () {
            this.tablePage = 1
            this.status = ''
            this.handleList(this.keyword, this.status)
        },
        // 获取离线网吧列表
        getOffLine () {
            this.tablePage = 1
            this.keyword = ''
            this.status = 0
            this.handleList(this.keyword, this.status)
        },
        // 获取全部网吧列表
        getAll () {
            this.tablePage = 1
            this.keyword = ''
            this.status = ''
            this.handleList(this.keyword, this.status)
        },
        // 列表接口
        handleList (keyword, status) {
            this.tableLoading = true
            var params = {
                pageIndex: this.tablePage,
                pageSize: this.page.pageSize,
                keyword: keyword,
                status: status
            }
            this.$store.dispatch('demo/GetDemoList', params).then(res => {
                // console.log(res)
                if (res.success) {
                    // var data = res.data[0]
                    var data = res.data
                    this.tableData = data
                    // console.log(this.tableData)
                    this.page.total = data.total
                    this.page.currentPage = this.tablePage
                    // this.getCybercafeNum() // 获取网吧数量
                } else {
                    this.$message({
                        message: res.msg,
                        duration: 2000,
                        type: 'error'
                    })
                }
                this.tableLoading = false
            }).catch(err => {
                console.log(err)
                this.tableLoading = false
            })
        },
        // 单元格单击
        handleCellClick (row, index, prop) {
            this.rowId = row.id
            this.rowTitle = row.name
            // console.log(prop)
            // if (prop == 'id') {
            //     this.dialogVisible = true
            // }
            // if (prop == 'DNS' || prop == 'packetLossRate' || prop == 'shake' || prop == 'delayed') {
            //     this.dialogVisibleNet = true
            // }
            // if (prop == 'thirdDNS' || prop == 'thirdPacketLossRate' || prop == 'thirdShake' || prop == 'thirdDelayed') {
            //     this.dialogVisibleExit = true
            // }
            // if (prop == 'status') {
            //     this.dialogVisibleCondition = true
            // }
        },
        // 关闭弹窗
        closeDialog (params) {
            if (params == 'id') {
                this.dialogVisible = false
            }
            if (params == 'condition') {
                this.dialogVisibleCondition = false
            }
            if (params == 'net') {
                this.dialogVisibleNet = false
            }
            if (params == 'exit') {
                this.dialogVisibleExit = false
            }
            if (params == 'edit') {
                this.dialogVisibleEdit = false
            }
            if (params == 'add') {
                this.dialogVisibleAdd = false
            }
            if (params == 'fault') {
                this.dialogVisibleFault = false
            }
        },
        // 确认
        confirmDialog (params) {
            if (params == 'id') {
                this.dialogVisible = false
            }
            if (params == 'condition') {
                this.dialogVisibleCondition = false
            }
            if (params == 'net') {
                this.dialogVisibleNet = false
            }
            if (params == 'exit') {
                this.dialogVisibleExit = false
            }
            if (params == 'edit') {
                this.dialogVisibleEdit = false
                this.keyword = ''
                this.status = ''
                this.tablePage = 1
                this.handleList(this.keyword, this.status)
            }
             if (params == 'add') {
                this.dialogVisibleAdd = false
                this.keyword = ''
                this.status = ''
                this.tablePage = 1
                this.handleList(this.keyword, this.status)
                // this.getCybercafeNum() // 获取网吧数量
            }
            if (params == 'fault') {
                this.dialogVisibleFault = false
            }
        },
        // 编辑
        handleEdit (row) {
            this.rowId = row.id
            this.rowTitle = row.name
            this.dialogVisibleEdit = true
        },
        // 新增
        handleAdd () {
            this.dialogVisibleAdd = true
        },
        // 删除
        handleDelete (row) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.log(row.id)
                this.$store.dispatch('home/DeleteCybercafesDetail', row.id).then(res => {
                    // console.log(res)
                    if (res.code == 1) {
                        this.$message({
                            type: 'success',
                            message: res.msg
                        })
                        this.keyword = ''
                        this.status = ''
                        this.tablePage = 1
                        this.handleList(this.keyword, this.status)
                        // this.getCybercafeNum() // 获取网吧数量
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            }).catch(() => {
            })
        },
        // 故障分析
        handleFaultAnalysis (row) {
            this.rowTitle = row.name
            this.lineStatus = row.status
            this.rowId = row.id
            this.dialogVisibleFault = true
        },
        // 获取网吧数量
        getCybercafeNum () {
            this.$store.dispatch('home/CountCybercafe').then(res => {
                // console.log(res)
                if (res.code == 1) {
                    this.cybercafeCount = res.data
                }
            })
        },
        // 批量导入新增网吧
        batchImportSHow () {
          this.batchImportVisable = true
          console.log('批量导入')
        },
        //
        importHandleClose (done) {
          if (this.uploadLoading) {
             this.$confirm('正在上传，确认关闭？')
            .then(_ => {
              this.uploadLoading = false
              done()
            })
            .catch(_ => {})
          } else {
              done()
          }
        },
        // 模板下载
        templateDownload () {
          // this.$store.dispatch('home/TemplateFileDownload').then(res => {
          //   this.download(res)
          // })
        },
        // 上传前拦截
        handleBefore (file) {
          console.log(file)
          this.uploadLoading = true
        },
        // 上传成功
        handleSuccess (res, file) {
        //   console.log(res, file)
          this.uploadLoading = false

          if (res.code == 1) {
            this.batchImportVisable = false
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            this.tablePage = 1
            this.handleList(this.keyword, this.status)
          } else {
            this.$message.error(res.msg)
          }
        },
        handleError (err, file) {
          this.uploadLoading = false
          this.$message.error(err)
        },
        download (data) {
          if (!data) {
              return
          }
          var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
          var url = window.URL.createObjectURL(blob)
          var aLink = document.createElement('a')
          aLink.style.display = 'none'
          aLink.href = url
          aLink.setAttribute('download', 'template.xlsx')
          document.body.appendChild(aLink)
          aLink.click()
          document.body.removeChild(aLink) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
      }

    }
}
</script>
<style lang="scss">
    .home{
        padding: 0px!important;
        height: auto!important;
        .btn-list{
            float: right;
        }
        .el-card__header{
            border-bottom: none;
        }
        .fix-lh{
            line-height: 32px;
        }
        .text-right{
            text-align: right;
        }
        .home-form{
            // margin-bottom: 7px;
            // margin-top: -17px;
        }
        .el-card__header,.el-card__body{
            padding: 15px;
        }
        .el-input.is-disabled .el-input__inner{
            color: #606266;
        }
        .el-table__body{
            tr td:nth-child(2) span{
                // color: #409EFF;
                cursor: pointer;
            }
            tr td:nth-child(5) span{
                cursor: pointer;
            }
            tr td:nth-child(6) span,tr td:nth-child(7) span,tr td:nth-child(8) span{
                // color: #409EFF;
                cursor: pointer;
            }
            tr td:nth-child(9) span,tr td:nth-child(10) span,tr td:nth-child(11) span,tr td:nth-child(12) span,tr td:nth-child(13) span{
                // color: #409EFF;
                cursor: pointer;
            }
        }
        .table-body{
            margin-top: 20px;
        }
        .fault-wrap{
            margin-top: 20px;
        }
        .fault-body{
            width: 100%;
            height: 100%;
            min-height: 300px;
            background: #000000;
            color: #fff;
            font-size: 16px;
            border-radius: 4px;
            padding: 10px;
            box-sizing: border-box;
        }
    }
    .batch-import {
      display: flex;
      align-items: center;
      .upload {

      }
      .downliad {
        width: 100%;
        flex: 1;
        text-align: center;
      }
    }

</style>
