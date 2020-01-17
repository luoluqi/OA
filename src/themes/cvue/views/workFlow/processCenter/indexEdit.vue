<template>
  <div class="index-edit">
    <!-- 新增弹窗 -->
    <cvue-dialog
      :dialogVisible="dialogVisible"
      title="编辑"
      dialogWidth="600px"
      @handleOpen="getDetail"
      @closeDialog="closeDialog"
      @confirmDialog="confirmDialog"
      @handleClose="handleClose"
      :isShowFoot="true"
    >
      <div class="dialog-body" slot="dialogBody">
        <div class="leave-main" v-html="this.TableRemark"></div>
      </div>
    </cvue-dialog>
  </div>
</template>
<script>
import $ from 'jquery'
import { mapState, mapGetters } from 'vuex'
import cvueTreeGrid from '@/components/cvue-tree-grid'
import cvueDialog from '@/components/cvue-dialog'
import cvueTable from '@/components/cvue-table'
import { parse } from 'path'
export default {
  name: 'indexDetail',
  components: {
    cvueDialog,
    cvueTable,
    cvueTreeGrid
  },
  data () {
    return {
      TableRemark: '',
      deptId: []
    }
  },
  computed: {
    ...mapGetters(['cookiesObj'])
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    // 触发事件
    handleClose () {
      this.$emit('handleClose')
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    // 初始化弹窗
    getDetail () {
      console.log(this.$parent.editRow)
      this.itemByRecordIdFormRecord()
      this.deptListByTeacherId()
    },
    // 根据老师获取部门
    deptListByTeacherId () {
      let params = {
        teacherId: this.cookiesObj.teacherId
      }
      this.$store
        .dispatch('organization/DeptListByTeacherId', params)
        .then(res => {
          let result = JSON.parse(res)
          // console.log(result)
          if (result.Code == 200) {
            this.deptId = result.Data.map(v => {
              return v.Id
            })
          } else {
            // this.$message.error(result.Msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    confirmDialog () {
      let recordFieldsArr = []
      let inputs = $('.leave-main input')
      // console.log(inputs)
      for (let i = 0; i < inputs.length; i++) {
        let obj = {}
        obj.FieldName = inputs.eq(i).attr('id')
        obj.FieldValue = inputs.eq(i).val() ? inputs.eq(i).val().trim() : inputs.eq(i).val()
        obj.RecordType = inputs.eq(i).attr('fieldType')
          ? inputs.eq(i).attr('fieldType')
          : 'string'
        obj.RecordId = this.$parent.editRow.FormRecordId
        recordFieldsArr.push(obj)
      }
      let params = {
        recordFields: JSON.stringify(recordFieldsArr)
      }
      let paramsNew = {
        data: JSON.stringify(params)
      }
      this.$store.dispatch('form/UpdateRecordValueFormRecord', paramsNew).then(res => {
        let result = JSON.parse(res)
        if (result.Code == 200) {
          let params = {
            userId: this.cookiesObj.teacherId,
            userName: decodeURI(this.cookiesObj.realName),
            deptId: this.deptId.join(),
            recordNodeId: this.$parent.editRow.CurrentNodeId,
            opRemark: '修改信息,重新提交 ',
            opState: 10
          }
          let newParams = {
            data: JSON.stringify(params)
          }
          this.$store.dispatch('processCenter/DealNode', newParams).then(res => {
            let result = JSON.parse(res)
            console.log(result)
            if (result.Code == 200) {
              // this.$message.success(result.Msg)
              this.$emit('confirmDialog')
            } else {
              this.$message.error(result.Msg)
            }
          }).catch(err => {
            console.log(err)
          })
          this.$message.success(result.Msg)
          // this.$emit('confirmDialog')
        } else {
          this.$message.error(result.Msg)
        }
        console.log(result)
      }).catch(err => {
        console.log(err)
      })
    },

    itemByRecordIdFormRecord () {
      let params = {
        recordId: this.$parent.editRow.FormRecordId
      }
      this.$store
        .dispatch('form/ItemByRecordIdFormRecord', params)
        .then(res => {
          let result = JSON.parse(res)
          console.log(result)
          if (result.Code == 200) {
            this.TableRemark = decodeURI(result.Data.formRecord.TableRemarkPC)
            this.$nextTick(() => {
              result.Data.recordFieldList.forEach((item, index) => {
                // document.getElementById(item.FieldName).value = item.FieldValue
                $('#' + item.FieldName).val(item.FieldValue)
              })
            })
            this.tableId = result.Data.formRecord.TableId
          } else {
            this.$message.error(result.Msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss" >
.select-width {
  width: 100%;
}
.leave-main table {
  width: auto !important;
}
.index-edit {
  .dialog-body {
    max-height: 400px;
    overflow: auto;
    padding: 0 !important;
    .tabs-card {
      // height: 100%;
      box-sizing: border-box;
    }
    .leave-main {
      overflow: auto;
      padding: 0 20px;

      input {
        margin-bottom: 5px;
      }
      // h3 {
      //   text-align: center;
      //   font-size: 30px;
      //   margin-top: 10px;
      //   margin-bottom: 30px;
      // }
      // .content {
      //   padding: 0 80px;
      //   text-indent: 2em;
      //   p:nth-child(2) {
      //     text-align: right;
      //   }
      // }
      // .applicant {
      //   text-align: right;
      //   margin-top: 20px;
      // }
    }
  }
}
</style>
