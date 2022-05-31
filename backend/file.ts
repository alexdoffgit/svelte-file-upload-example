import { createWriteStream } from 'fs'
import { pipeline, Readable } from 'stream'
import util from 'util'
import env from './env'

export async function fileWriter(fileBlob: Readable, fileName: string) {
    try {
        const pump = util.promisify(pipeline)
        if(env.FILESTOREPATH) {
            await pump(fileBlob, createWriteStream(`${env.FILESTOREPATH}/${fileName}`))
        } else {
            throw new Error('fill storePath')
        }
    } catch (e) {
        throw e
    }
}