import { fromJS } from 'immutable'


const data = {
  filterSingerData: {
    type: [
      {
        id: -1,
        text: ''
      },
      {
        id: 1,
        text: '男歌手'
      },
      {
        id: 2,
        text: '女歌手'
      },
      {
        id: 3,
        text: '乐队'
      }
    ],
    area: [
      {
        id: -1,
        text: ''
      },
      {
        id: 7,
        text: '华语'
      },
      {
        id: 96,
        text: '欧美'
      },
      {
        id: 8,
        text: '日本'
      },
      {
        id: 16,
        text: '韩国'
      },
      {
        id: 0,
        text: '其他'
      }
    ]
  },
  recommenPagePlateData: [
    {
      imgUrl: require('../img/person.png'),
      text: '歌手',
      path: '/singer'
    },
    {
      imgUrl: require('../img/rank.png'),
      text: '排行榜',
      path: '/rank'
    }
  ]
}
const staticData = (state = fromJS(data)) => {
  return state
}

export default staticData
