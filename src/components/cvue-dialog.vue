<template>
  <div class="cvue-dialog">
    <el-dialog
      :title="title"
      :width="dialogWidth"
      :before-close="handleClose"
      :close-on-click-modal="false"
      @open="handleOpen"
      lock-scroll
      :top="top"
      class="body-dialog"
      :fullscreen="isFullscreen"
      :visible.sync="dialogVisible"
      :append-to-body="appendToBody"
    >
      <div class="dialog-body dialog-height">
        <slot name="dialogBody"></slot>
      </div>
      <div slot="footer" class="dialog-footer" v-if="isShowFoot">
        <el-button @click="closeDialog">取消</el-button>
        <el-button @click="preview" type="success" v-if="isShowPreview">预览</el-button>
        <el-button @click="confirmDialog" type="primary" :disabled="btnDisabled">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'cvueDialog',
  data () {
    return {
      msg: 'hello'
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '提示'
    },
    isShowFoot: {
      type: Boolean,
      default: true
    },
    isShowPreview: {
      type: Boolean,
      default: false
    },
    isFullscreen: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '10vh'
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    btnDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose () {
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmDialog () {
      this.$emit('confirmDialog')
    },
    handleOpen () {
      this.$emit('handleOpen')
    },
    preview () {
      this.$emit('preview')
    }
  }
}
</script>
<style lang="scss">
.cvue-dialog {
  .el-dialog__header {
    background: #f0f0f1;
    padding: 15px 20px;
  }
  .el-dialog__footer {
    position: relative;
    z-index: 100;
  }
  .el-dialog__title {
    font-size: 15px;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__headerbtn {
    top: 17px;
  }
  .dialog-footer {
    text-align: center;
  }
  .dialog-body .dialog-body {
    padding: 20px 20px 30px;
  }
  .dialog-height {
    // height: 600px;
    overflow: auto;
  }
}
.body-dialog{
  .el-dialog__header {
    background: #f0f0f1;
    padding: 15px 20px;
  }
  .el-dialog__footer {
    position: relative;
    z-index: 100;
  }
  .el-dialog__title {
    font-size: 15px;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__headerbtn {
    top: 17px;
  }
  .dialog-footer {
    text-align: center;
  }
  .dialog-body .dialog-body {
    padding: 20px 20px 30px;
  }
  .dialog-height {
    // height: 600px;
    overflow: auto;
  }
}
</style>
