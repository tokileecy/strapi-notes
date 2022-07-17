import { openDB, IDBPDatabase, DBSchema } from 'idb'
import { useCallback, useEffect, useRef, useState } from 'react'

const DB_NAME = 'toki-notes-indexeddb-data'
const DB_VERSION = 1 // Use a long long for this value (don't use a float)

interface TokiNotesPost {
  id: string
  content: string
  'updated_at'?: string
  cacheData: {
    content: string
  }
}

interface TokiNotesEditor {
  id?: number
  'post_id': string
  'updated_at': number
  content: string
}

interface TokiNotesDBV1 extends DBSchema {
  posts: {
    key: string
    value: TokiNotesPost
  }
  editorCache: {
    key: number
    value: TokiNotesEditor
  }
}

class DB {
  dbPromise: IDBPDatabase<TokiNotesDBV1>
  constructor(dbPromise: IDBPDatabase<TokiNotesDBV1>) {
    this.dbPromise = dbPromise
  }

  async get(key: any) {
    return (await this.dbPromise).get('posts', key)
  }

  async getLatestEditorCacheCount() {
    return this.dbPromise.count('editorCache')
  }

  async setEditorCache(val: TokiNotesEditor) {
    const cacheId = await this.dbPromise.put('editorCache', val)

    return cacheId
  }

  async clearEditor() {
    await this.dbPromise.clear('editorCache')
  }

  async set(val: TokiNotesPost) {
    return (await this.dbPromise).put('posts', val)
  }

  async delete(key: any) {
    return (await this.dbPromise).delete('posts', key)
  }

  async clear() {
    return (await this.dbPromise).clear('posts')
  }

  async keys() {
    return (await this.dbPromise).getAllKeys('posts')
  }
}

export const initDB = async () => {
  const dbPromise = await openDB<TokiNotesDBV1>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore('posts', {
        keyPath: 'id',

        autoIncrement: true,
      })

      db.createObjectStore('editorCache', {
        keyPath: 'id',
        autoIncrement: true,
      })
    },
  })

  const db = new DB(dbPromise)

  return { dbPromise, db }
}

type CONNECT_STATUSE =
  | 'UNCONNECTED'
  | 'CONNECTED'
  | 'CONNECTING'
  | 'CONNECTED_FAILED'

export const useIndexeddb = () => {
  const [status, setStatus] = useState<CONNECT_STATUSE>('UNCONNECTED')
  const dbRef = useRef<DB>()

  const connect = useCallback(() => {
    const init = async () => {
      try {
        setStatus('CONNECTING')

        const { db } = await initDB()

        dbRef.current = db
        setStatus('CONNECTED')
      } catch (error) {
        setStatus('CONNECTED_FAILED')
      }
    }

    init()
  }, [])

  useEffect(() => {
    connect()
  }, [connect])

  return { status, dbRef, connect }
}

export default useIndexeddb
