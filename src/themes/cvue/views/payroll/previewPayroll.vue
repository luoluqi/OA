<template>
  <div class="preview">
    <!-- 详情 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="预览"
      :isShowFoot="true"
      dialogWidth="600px"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
    >
      <div class="dialog-body" slot="dialogBody" style="padding: 0;">
        <el-tabs type="border-card" class="tabs-card">
          <div class="information">
            <p v-for="(item, index) in excelData" :key="index">{{item}}</p>
          </div>
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
      excelData: []
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
      this.excelData = this.$parent.excelData
    },
    // 触发事件
    handleClose () {
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmDialog () {
      this.$emit('confirmDialog')
    }
  }
}
</script>
<style lang='scss' scoped>
.preview {
  .el-dialog__body {
    height: 520px;
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
  .upPhoto {
    float: left;
    width: 100px;
    text-align: center;
  }
  .upPhoto h2 {
    font-size: 16px;
    margin-top: 8px;
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
  .file {
    padding-left: 20px;
    font-size: 15px;
    color: #409eff;
  }
  .information {
    p {
      padding: 10px 0;
      font-size: 15px;
    }
  }
}
</style>
