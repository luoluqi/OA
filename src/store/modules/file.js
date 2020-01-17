
import {getFolder} from '@/api/publicFileApi'
const file = {
    namespaced: true,
    state: {
      downloadUrl:'http://srv.xueerqin.net/api-myspace/api/PersonCloud/Download',
      addFileVisible:false,
      publicFolderList: [],
      curRoot: '',
      remainSize: 0
    },
    getters: {
    },
    mutations: {
    },
    actions: {
      getFolder({state},param){
        state.curRoot = param
        getFolder({
          id: param.publicsubfolder.GeneralFolderId
        }).then(res => {
          res = JSON.parse(res)
          var data = res.Data
          state.remainSize = data.MaxSize - data.CurrentSize
        })
      }
    }
}
export default file
