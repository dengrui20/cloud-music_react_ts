export interface Singer {
  name: string
  aliasName: string
  img1v1Url: string
  id: number
}

export interface SingerInitState  {
  singerList: {
      data: Singer[];
      page: number;
  };
  singerType: number;
  singerArea: number;
  isFetching: boolean;
}