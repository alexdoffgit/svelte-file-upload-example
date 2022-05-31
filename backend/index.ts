import fastify from "fastify"
import fastifyCors from "@fastify/cors"
import fastifyStatic from "@fastify/static"
import JSONDB from "./db"
import fastifyMultipart from "@fastify/multipart"
import { fileWriter } from "./file";
import env from "./env";

type ImageRequest = {
    id: string
}

const server = fastify()

server.register(fastifyCors)
server.register(fastifyStatic, {
    root: env.FILESTOREPATH
})
server.register(fastifyMultipart)

server.get("/", async function (req, res) {
    return {"hello": "world"}
})

server.get("/image/:id", function(req, res) {
    try {
        const db = new JSONDB()
        const id = (req.params as ImageRequest).id
        const path = db.getFile(id)
        if(path) {
            res.sendFile(path)
        } else {
            throw new Error("not found");
        }
    } catch (error) {
        res.status(404)
        console.log(error)
        res.send((error as any).message)
    }
})

server.post("/image", async function(req, res) {
    try {
        const db = new JSONDB()
        const data = await req.file()
        await fileWriter(data.file, data.filename)
        db.storeFilePath(data.filename)

        res.send('ok')
    } catch (error) {
        console.error(error)
        res.status(500)
        res.send('internal server')
    }
})

server.listen(3000, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})