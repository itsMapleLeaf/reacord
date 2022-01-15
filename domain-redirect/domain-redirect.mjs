import { Server } from "node:http"

const port = Number(process.env.PORT) || 3000
const server = new Server((request, response) => {
  const url = new URL(request.url, `http://reacord.mapleleaf.dev`)
  response.statusCode = 303
  response.setHeader("Location", url.href)
  response.end()
})
server.listen(port, () => {
  console.info(`Listening on port ${port}`)
})
