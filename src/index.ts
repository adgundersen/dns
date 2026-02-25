import Fastify from "fastify"
import { registerRoutes } from "./routes"

const app = Fastify({ logger: true })

registerRoutes(app)

app.listen({ port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
