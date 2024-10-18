import { CommonTag } from "../utils/music"
import { fetch } from '@tauri-apps/plugin-http';

const search = async(s:string):Promise<CommonTag[]>=>{
    const resp=await fetch(`https://music.163.com/api/search/pc?offset=0&limit=10&type=1&s=${encodeURIComponent(s)}`, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "priority": "u=0, i",
        "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
    // const resp = await fetch(`https://music.163.com/api/search/pc?offset=0&limit=10&type=1&s=${encodeURIComponent(s)}`)
    const json:Resp = await resp.json()
    console.log("search json:",json)
    return json.result.songs.map(song=>{
        return {
            title:song.name,
            artist:song.artists[0].name,
            album:song.album.name,
            cover:song.album.picUrl,
            lyric:'',
            genre:''
        }
    })
}

export const createNeteaseSource = ()=>{
    const findList  =async(params:CommonTag)=>{
        const {title,artist} = params
        const results = await search([title,artist].join(" "))
        return results
        
    }
    const findSong = ()=>{}

    return {
        findList,
        findSong
    }
}

export interface Resp {
    result: Result
    code: number
  }
  
  export interface Result {
    songs: Song[]
    songCount: number
  }
  
  export interface Song {
    name: string
    id: number
    position: number
    alias: any[]
    status: number
    fee: number
    copyrightId: number
    disc: string
    no: number
    artists: Artist[]
    album: Album
    starred: boolean
    popularity: number
    score: number
    starredNum: number
    duration: number
    playedNum: number
    dayPlays: number
    hearTime: number
    ringtone?: string
    crbt: any
    audition: any
    copyFrom: string
    commentThreadId: string
    rtUrl: any
    ftype: number
    rtUrls: any[]
    copyright: number
    hMusic: HMusic
    mMusic: MMusic
    lMusic: LMusic
    mvid: number
    rtype: number
    rurl: any
    bMusic: BMusic
    mp3Url: string
    transNames?: string[]
  }
  
  export interface Artist {
    name: string
    id: number
    picId: number
    img1v1Id: number
    briefDesc: string
    picUrl: string
    img1v1Url: string
    albumSize: number
    alias: any[]
    trans: string
    musicSize: number
    topicPerson: number
  }
  
  export interface Album {
    name: string
    id: number
    idStr: string
    type: string
    size: number
    picId: number
    blurPicUrl: string
    companyId: number
    pic: number
    picUrl: string
    publishTime: number
    description: string
    tags: string
    company?: string
    briefDesc: string
    artist: Artist2
    songs: any[]
    alias: any[]
    status: number
    copyrightId: number
    commentThreadId: string
    artists: Artist3[]
    onSale: boolean
    picId_str?: string
    transNames?: string[]
  }
  
  export interface Artist2 {
    name: string
    id: number
    picId: number
    img1v1Id: number
    briefDesc: string
    picUrl: string
    img1v1Url: string
    albumSize: number
    alias: any[]
    trans: string
    musicSize: number
    topicPerson: number
  }
  
  export interface Artist3 {
    name: string
    id: number
    picId: number
    img1v1Id: number
    briefDesc: string
    picUrl: string
    img1v1Url: string
    albumSize: number
    alias: any[]
    trans: string
    musicSize: number
    topicPerson: number
  }
  
  export interface HMusic {
    name: any
    id: number
    size: number
    extension: string
    sr: number
    dfsId: number
    bitrate: number
    playTime: number
    volumeDelta: number
  }
  
  export interface MMusic {
    name: any
    id: number
    size: number
    extension: string
    sr: number
    dfsId: number
    bitrate: number
    playTime: number
    volumeDelta: number
  }
  
  export interface LMusic {
    name: any
    id: number
    size: number
    extension: string
    sr: number
    dfsId: number
    bitrate: number
    playTime: number
    volumeDelta: number
  }
  
  export interface BMusic {
    name: any
    id: number
    size: number
    extension: string
    sr: number
    dfsId: number
    bitrate: number
    playTime: number
    volumeDelta: number
  }
  