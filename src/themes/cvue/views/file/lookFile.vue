<template>
  <div class="">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="查看"
      :isShowFoot="false"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
    >
      <div class="dialog-body" slot="dialogBody" style="padding: 0;">
        <el-tabs type="border-card" class="tabs-card">
          <div class="information">
            <el-form  label-width="110px">
              <el-form-item label="文件名称:" >
                {{curFile.Name}}
              </el-form-item>
              <el-form-item label="序号:" >
                  {{curFile.OrderNum}}
               
              </el-form-item>
              <el-form-item label="内容:" class="postContent" prop="postContent">
               
                   <div v-html="curFile.Content" class=" ql-editor"></div>
                
              </el-form-item>
            </el-form>
          </div>
        </el-tabs>
      </div>
    </cvue-dialog>
  </div>
</template>
<script>
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'

import {mapGetters} from 'vuex'
export default {
  name: 'SchoolOrderDetail',
  components: {
    cvueDialog,
    cvueTable,
    
  },

 
  data () {
    return {
    curFile:{}
     
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
      getDetail(){
          this.curFile = this.$store.state.file.curFile
      },
    // 触发事件
    handleClose () {
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmDialog () {
     this.$emit('closeDialog')
    }
  }
}
</script>
<style  scope>

</style>
