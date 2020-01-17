<template>
  <div class="tool">
    <i class="el-icon-mouse" :class="{actived:actived==1}" @click="mouseTool" ></i>
    <!-- <i @click="startNode" >开始</i>
    <i @click="endNode">结束</i> -->
    <i class="el-icon-s-tools" :class="{actived:actived==2}" title="任务节点" @click="taskNode"></i>
  </div>
</template>

<script>

export default {
  name: 'tool',
  data () {
    return {
      actived: 1
    }
  },
  components: {
  },
  mounted () {

  },
  methods: {
    // 鼠标工具
    mouseTool () {
      this.actived = 1
      this.$emit('mouseTool')
    },
    // 开始节点
    startNode () {
      this.$emit('startNode')
    },
    // 结束节点
    endNode () {
      this.$emit('endNode')
    },
    // 任务节点
    taskNode () {
      this.actived = 2
      this.$emit('taskNode')
    }

  }
}
</script>

<style lang="scss">
.tool{
  position: absolute; left: 0; top: 0; width: 30px; height: 100%;
  i { 
    font-size: 24px; line-height: 30px; cursor: pointer;color: #999;
    &.actived {color: #333;}
  }
}
</style>
