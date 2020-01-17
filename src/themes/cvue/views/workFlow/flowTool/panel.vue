<template>
<div>
  <div class="flowJsPlumb">
    <tool
      @mouseTool="mouseTool"
      @taskNode="taskNode"
      ></tool>
    <div id="diagramContainer" @click="clickFlow">      
      <div v-for="(item,index) in flowNodeList" :id="item.Id" @click="clickNode" :key="item.Id" :style="{'left':item.Left+'px','top':item.Top+'px'}" class="item">
        {{item.NodeName}}
        <p>
          <i class="edit" @click="dialogOpen(item,index)">编辑</i>        
          <i class="del" @click="delNode(item.Id)">删除</i>
        </p>
      </div>
    </div>
  </div>
  <work-flow-node
      @closeSecDialog="closeSecDialog"
      @confirmSecDialog="confirmSecDialog"
      @handleSecClose="closeSecDialog"
      :nodeForm="nodeForm"
      :deptList2="deptList"
      :dialogVisible="dialogVisibleNode"
      >
    </work-flow-node> 
</div>
</template>

<script>
import {jsPlumb} from 'jsplumb'
import tool from './tool'
import workFlowNode from '../flow/workFlowNode'
export default {
  name: 'easyFlow',
  data () {
    return {
      nodeType: null,
      jsPlumbObj: null,
      jsPlumbSetting: {
      },
      jsPlumbLineStyle: {
        // 连接线直线
        connector: ['Straight'],
        // 拖动创建连接
        isSource: true,
        isTarget: true,
        // 拖动连接线数 -1 无限
        maxConnections: -1,
        // 线端点的样式
        endpointStyle: { fill: 'rgba(0,0,0,0.5)', outlineWidth: 1 },
        // 绘制线
        paintStyle: { stroke: 'black', strokeWidth: 2 },
        hoverPaintStyle: { stroke: 'green' },
        // 绘制箭头
        overlays: [['Arrow', { width: 12, length: 12, location: 1 }]],
        // 动态锚点、位置自适应
        anchor: [
          'Top',
          'TopCenter',
          'TopRight',
          'TopLeft',
          'Right',
          'RightMiddle',
          'Bottom',
          'BottomCenter',
          'BottomRight',
          'BottomLeft',
          'Left',
          'LeftMiddle'
        ]
      },
      dataJson: [],
      nodeForm: {},
      dialogVisibleNode: false,
      activeNode: null
    }
  },
  props: {
    flowNodeList: {
      type: Array,
      default: () => []
    },
    deptList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    tool, workFlowNode
  },
  mounted () {
    this.jsPlumbObj = jsPlumb.getInstance()
    this.$nextTick(() => {
      // this.dataReloadA()
      this.jsPlumbInit()
      this.flowNodeList.forEach(item => {
        // console.log(item)
        this.jsPlumbDrag(this.item)
      })
        // this.jsPlumbDrag(this.flowNodeList)
    })
  },
  methods: {
    jsPlumbInit () {
      const _this = this
      jsPlumb.ready(function () {
        _this.jsPlumbObj.setContainer('diagramContainer')
        _this.jsPlumbObj.importDefaults({
          ConnectionsDetachable: false
        })
        // 连线判断
        _this.jsPlumbObj.bind('beforeDrop', function (info) {
          // var a = info.sourceId
          // var b = info.targetId
          let lineParams = {
            f: info.sourceId,
            t: info.targetId
          }
          if (lineParams.f !== lineParams.t) {
            console.log('链接会自动建立')

            _this.$emit('drawLine', lineParams)
            return false // 链接会自动建立
          } else {
            console.log('链接取消')
            return false // 链接不会建立，注意，必须是false
          }
        })
        // 删除线
        _this.jsPlumbObj.bind('click', function (conn, originalEvent) {
          console.log(conn)
          if (_this.nodeType != 'task') {
          _this.$emit('delLine', conn)
          }
        })
      })
    },
    // jsPlumbInit 拖拽和端点拖拽拉线
    jsPlumbDrag (item) {
      // console.log(item)
      if (item.ParentIds != '') {
        let parentIdsArr = item.ParentIds.split(',').filter(function (s) {
          return s && s.trim()
        })
        parentIdsArr.forEach(i => {
          this.jsPlumbConnect(i, item)
        })
      }
      this.jsPlumbObj.draggable(item.Id, {
        containment: 'diagramContainer'
      })
      // 拖拽线的样式
      let addEndPointStyle = {
        // 连接线直线
        connector: ['Straight'],
        // 拖动创建连接
        isSource: true,
        isTarget: true,
        // 拖动连接线数 -1 无限
        maxConnections: -1,
        // 线端点的样式
        endpointStyle: { fill: 'rgba(63,123,122,0.5)', outlineWidth: 1 },
        // 绘制线
        paintStyle: { stroke: 'black', strokeWidth: 1 },
        // 绘制箭头
        overlays: [['Arrow', { width: 12, length: 12, location: 1 }]]
      }
      this.jsPlumbObj.addEndpoint(item.Id, addEndPointStyle)      
    },
    // jsPlumb 连线
    jsPlumbConnect (i, item) {
      this.jsPlumbObj.connect({
          source: i,
          target: item.Id
        }, this.jsPlumbLineStyle)
    },
    // 获取工具上的鼠标工具
    mouseTool () {
      this.nodeType = 'mouse'
      console.log(this.nodeType)
      // jsPlumb.undraggable('item_left')
    },
    // 获取工具上的任务节点工具
    taskNode () {
      this.nodeType = 'task'
      console.log(this.nodeType)
      // jsPlumb.undraggable('item_left')
    },
    // 点击流程设计区域
    clickFlow (e) {
      switch (this.nodeType) {
        // case 'start':
        //   console.log(e)
        //   this.addStartNode(e)
        //   break
        // case 'end':
        //   console.log(e)
        //   this.addEndNode(e)
        //   break
        case 'task':
          console.log(e)
          this.addTaskNode(e)
          break
        default:

          break
      }
    },
    // 添加任务节点
    addTaskNode (e) {
      this.$emit('addTaskNode', e)
    },
    // 删除任务节点
    delNode (id) {
      this.$emit('delNode', id)
    },
    // 清空节点
    delAllNode () {
      console.log(this.jsPlumbObj)
      // let domC = document.getElementById('diagramContainer')
      let domEndpoint = document.querySelectorAll('.jtk-endpoint')
      // console.log(domEndpoint)
      if (domEndpoint.length != 0) {
        this.jsPlumbObj.deleteEveryEndpoint()
      }
      
      // this.flowNodeList.forEach(item => {
      //   this.jsPlumbObj.remove(item.ID)
      // })
    },
    // 节点点击
    clickNode (e) {
      e.stopPropagation()
      if (this.nodeType != 'drap') {

      }
    },
    
    // 打开弹窗
    dialogOpen (item, idx) {
      this.nodeForm = item
      console.log(item)
      
      localStorage.setItem('flowNodeId', item.Id)
      this.activeNode = idx
      this.dialogVisibleNode = true
    },
    // 关闭弹窗、
    closeSecDialog (e) {
      // this.delAllNode()
      this.dialogVisibleNode = false
    },
    // 弹窗确定
    confirmSecDialog (e) {
      // console.log(this.flowNodeList)
      
      let params = {
        _id: this.flowNodeList[this.activeNode].Id,
        nodeName: this.flowNodeList[this.activeNode].NodeName,
        nodeRemark: this.flowNodeList[this.activeNode].NodeRemark.trim(),
        nodeType: this.flowNodeList[this.activeNode].NodeType,
        opRoleIds: this.flowNodeList[this.activeNode].OpRoleIds,
        left: this.flowNodeList[this.activeNode].Left,
        top: this.flowNodeList[this.activeNode].Top
      }
      if (e.userRange) {
        params.opUserIds = '*'
        params.opDeptIds = this.flowNodeList[this.activeNode].OpDeptIds
      } else {
        let opUserIds 
        opUserIds = e.memberList
        if (e.memberList.indexOf('*') != -1) {
          opUserIds.splice(e.memberList.indexOf('*'), 1)
        } 

        console.log(opUserIds)
        // 判断部门和人员是否都为空
        if (e.department.length == 0 && opUserIds.length == 0) {
          // console
          this.$message({
            message: '指定选项，部门和人员，不能都为空!',
            type: 'warning'
          })
          return false
        }
        params.opDeptIds = e.department.join(',')
        params.opUserIds = opUserIds.join(',')       
        
        console.log(params.opUserIds)
        // return false
        // params.opUserIds = params.opUserIds.replace('*', '')
      }
      
        // console.log(params)
      var paramsNew = {
        data: JSON.stringify(params)
      }
      this.$store.dispatch('workFlow/FlowNodeUpdate', paramsNew).then(res => {
        let dataJson = JSON.parse(res)
        if (dataJson.Code == 200) {
          this.$emit('upDataList')
          this.nodeForm = {}
          this.dialogVisibleNode = false
        }
        
        console.log(dataJson)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss">
.flowJsPlumb{
  position: relative;
}
#diagramContainer {
  background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.15) 10%,
      rgba(0, 0, 0, 0) 10%
    ),
    linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
  background-size: 10px 10px;
  height: 500px;
  background-color: rgb(251, 251, 251);
  /*background-color: #42b983;*/
  position: relative;
  margin-left: 30px;
}

.item {
  position: absolute;
  width: auto;
  min-width: 80px;
  /* height: 20px; */
  color: #333;
  background-color: white;
  padding: 5px;
  opacity: 0.7;
  border: 1px solid #346789;
  /*border-radius: 10px;*/
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  p{ 
    overflow: hidden; 
    .edit {float: left;}
    .del{ float: right;}
  }
}
</style>
