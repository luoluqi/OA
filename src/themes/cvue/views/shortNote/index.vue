<template>
  <div>
     <div class="huiyi_box">
			<div class="konwledgeman">
				<h2><img src="./img/bian.png" />便签</h2>
				<span @click="creatNote" class="add_p"><img src="./img/jia_icon.png" /><span>新建便签</span></span>
			</div>
			<div class="ban_big">
				<div class="public_box" >
					<div class="box_bian">
						<ul>
							<li class="bacorlor" v-for="(item,index) in noteList" :key="index" :style="{backgroundColor:item.BgColorValue}">
								<div class="opcity"></div>
								<h2>{{item.CreatingTime | formatDateTime('yyyy-MM-dd HH:mm:ss')}}</h2>
								<img @click="DelNode(item.Id)" class="cha" src="./img/3-1.png"/> 
								<p  @click="UpdataNode(item)" class="bian_content">{{item.Content}}</p>
							</li>
						</ul>
					</div>
				</div>
				
			</div>
		</div>
    <!-- 新建 -->
    <div v-if="noteShow == true">
        <div class="black"></div>
        <div class="tan_box_2">
          <div class="yanse">
            <ul>
              <li @click="getColor(color)" v-for="(color,index) in yanseDate" :key="index" :style="{backgroundColor:color}"></li>
            </ul>
          </div>
          <div>
            <div class="bianqian">
                <span class="span_img">
                  <img class="save" src="./img/gos_bc.png" @click="SaveNode" title="保存"/>
                  <img @click="closeNote" class="del_ss" src="./img/3-1.png"  title="关闭"/>
                </span>
            </div>
              <textarea class="new_content" :style="{backgroundColor: bgColor}" v-model="content"></textarea>
          </div>
        </div>  
    </div>
		
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
export default {
  name: 'shortNote',
  data() {
    return {
      msg: '',
      noteShow: false,
      noteList:[],
      yanseDate:['#c4ffc6','#ffaeab','#fffab6','#b2ebfe','#f0c3ff','#ffd1b0'],
      bgColor:'#eee',
      content:'',
      NoteItem:{}
    }
  },
  computed: {
    ...mapGetters(['cookiesObj', 'cookieStart'])
  },
  mounted() {
    console.log(this.cookiesObj)
    this.GetNoteList()
  },
  methods: {
    // 获取便签列表
    GetNoteList () {
      var params = {
        creatingUserId:this.cookiesObj.loginUserId
       // creatingUserId:'silver'
      }
       this.$store.dispatch('note/GetNoteList', params).then(res => {
        var result = JSON.parse(res)
        this.noteList = result.Data
        console.log(result)
       })
    },
    // 创建便签 编辑
    SaveNode () {
      if(this.$store.state.note.isAdd){
          var params = {
         _creatingUserId:this.cookiesObj.loginUserId,
       // _creatingUserId:'silver',
        _Content:this.content,
        _BgColorValue:this.bgColor
      }
       this.$store.dispatch('note/AddNote', params).then(res => {
        var result = JSON.parse(res)
        if(result.Code==200){
          this.$message.success(result.Msg)
          this.noteShow = false
          this.GetNoteList()
          this.content = ''
        }
        console.log(result)
       })
      } else {
        var params = {
          _Id:this.NoteItem.Id,
          _Content:this.content,
          _BgColorValue:this.bgColor
        }
        this.$store.dispatch('note/UpdateNote', params).then(res => {
          var result = JSON.parse(res)
          if(result.Code==200){
            this.$message.success(result.Msg)
            this.noteShow = false
            this.GetNoteList()
            this.content = ''
          }
          console.log(result)
        })
      }
      
    },
    // 删除便签
    DelNode (Id) {
       var params = {
        id:Id
      }
       this.$store.dispatch('note/DelNote', params).then(res => {
        var result = JSON.parse(res)
       if(result.Code==200){
         this.$message.success(result.Msg)
         this.GetNoteList()
       }
        console.log(result)
       })
    },
    // 编辑标签
    UpdataNode (item) {
      this.$store.state.note.isAdd = false
       this.noteShow = true
       this.bgColor = item.BgColorValue
       this.content = item.Content
       this.NoteItem = item
    },
    // 新建便签弹框
    creatNote () {
       this.noteShow = true
       this.$store.state.note.isAdd = true
    },
    // 关闭便签
    closeNote () {
       this.noteShow = false
       this.content = ''
    },
    // 选择颜色
    getColor (color) {
       this.bgColor = color
    }
  },
}
</script>
<style scoped >
@import url('css/public-file.css')
</style>