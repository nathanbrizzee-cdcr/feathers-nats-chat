import { app } from './app'
import { logger } from './logger'

const port:number = Number(app.get('port'))
const host:string = app.get('host')
process.on('unhandledRejection', (reason, p) => logger.error('Unhandled Rejection at: Promise ', p, reason))


async function main() {
  app.listen(port).then(() => {
    logger.info(`Feathers app listening on http://${host}:${port}`)
  })
}


main()
  // .then(async () => {
  //   logger.trace("function main() terminating")
  // })
  .catch(async e => {
    logger.error(e, "Uncaught exception from function main(). Terminating...")
  })
