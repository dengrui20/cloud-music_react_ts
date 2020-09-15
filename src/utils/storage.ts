function isJSON (str: any): any {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      return obj
    } catch (e) {
      return str
    }
  }
}
function isString (str:any):any {
  if (typeof str === 'string') {
    return str
  } else {
    return JSON.stringify(str)
  }
}

export type TstorageSet = (key:string, value:any) => void
export type TstorageGet = (key:string) => any
export type TstorageRemove = (key:string) => void

export const sessionSet:TstorageSet = (key, value) => {
  sessionStorage.setItem(key, isString(value))
}

export const sessionGet:TstorageGet = (key) => {
  return isJSON(sessionStorage.getItem(key))
}

export const localSet:TstorageSet = (key, value) => {
  localStorage.setItem(key, isString(value))
}

export const localGet:TstorageGet = (key) => {
  return isJSON(localStorage.getItem(key))
}

export const localRemove:TstorageRemove = (key) => {
  return localStorage.removeItem(key)
}

export const sessionRemove:TstorageRemove = (key) => {
  return sessionStorage.removeItem(key)
}

/* storage */
export function storageSetSearchHistoryList (value = [], expiress = 60 * 60 * 1000 * 2) {
  return localSet('seatchHistoryList', { saveDate: Date.now(), expiress: Date.now() + expiress,  value })
}

export function storageGetSearchHistoryList () {
  const storageInfo = localGet('seatchHistoryList')
  if (!storageInfo || storageInfo.expiress < Date.now()) {
    return []
  }
  return storageInfo.value
}

export function storageRemoveSearchHistoryList () {
  return localRemove('seatchHistoryList')
}
