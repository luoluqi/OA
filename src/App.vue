<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      radio: '1'
    }
  },
  watch: {
    '$route' (to, from) {
      // this.handleLoading(2000)
    }
  },
  created () {
  }
}
</script>

<style lang="scss">
@import url('./style/reset.css');
html,body{
  width: 100%;
  height: 100%;
}
#app{
  width: 100%;
  height: 100%;
}
body .el-table th.gutter {
  display: table-cell !important;
}
.home-form{
    .el-form-item{
        margin-bottom: 0px !important;
    }
    .search-btn{
        margin-top: 3px;
    }
}
.mt-15{
    margin-bottom: 10px;
}
.el-tooltip__popper.is-dark{
  background-color: rgba(50, 50, 50, 0.7) !important;
}
.el-tooltip__popper[x-placement^="top"] .popper__arrow{
  border-top-color: rgba(50, 50, 50, 0.7) !important;
}
.el-tooltip__popper[x-placement^="top"] .popper__arrow::after{
  border-top-color: rgba(50, 50, 50, 0.7) !important;
  opacity: 0 !important;
}
.el-card__body .home-body {
    margin-top: -15px;
}
.el-select-dropdown__item{
  padding: 0 20px!important;
}
.input-select{
    border: 1px solid #ccc;
}
.email-index  .cell{
  cursor: pointer;
}
</style>
