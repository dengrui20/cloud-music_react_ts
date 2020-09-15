const {createProxyMiddleware} = require("http-proxy-middleware");
const api = {
  bannerList: '/banner',
  recommonList: '/personalized',
  newSongList: '/personalized/newsong',
  hotSearch: '/search/hot/detail',
  singerList: '/artist/list',
  ranks: '/toplist/detail',
  singerDetail: '/artists',
  getAlbumList: '/playlist/detail',
  searchWord: '/search',
  getSongDetail: '/song/detail',
  getLyric: '/lyric'
}
module.exports = function(app) {
  Object.keys(api).forEach((apiName) => {
    app.use(createProxyMiddleware(api[apiName], {
      target: "http://localhost:3000" , //配置你要请求的服务器地址
      changeOrigin: true,
    }))
  })
};
