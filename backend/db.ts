import { JsonDB as JSONFile } from 'node-json-db';
import env from './env'

type FileDB = {
    id: string
    filename: string
}

type Files = {
    files: FileDB[]
}

const db = new JSONFile(env.DBPATH, false, true)

export default class JSONDB {
    getFile(id: string) {
        const r = db.getData("/") as Files
        if(r.files.length > 0) {
            let obj = r.files.find(el => el.id === id)
            return obj?.filename
        }

        return undefined
    }

    storeFilePath(filename: string) {
        try {
            const file: FileDB = db.getData("/files[-1]")
            let id = Number(file.id)
            id += 1
            let newId = String(id)
            db.push("/files[]", {
                id: newId,
                filename
            })
            db.save()
        } catch(e) {
            throw e
        }
        
    }
}