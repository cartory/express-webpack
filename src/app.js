import cors from 'cors'
import express from 'express'

import routes from './routes'
import database from './config/sequelize'

const app = express()

// DB CONNECTION
database
    .authenticate()
    .then(async () => console.log(`\x1b[32mDB Connected Sucessfully!\x1b[0m`))
    .catch(err => console.error(err))

// SETUP
app
    .use(cors())
    .use(express.urlencoded({ extended: true }))
    .use(express.json({ limit: process.env.BODY_SIZE }))
    // ROUTES
    .use('/api', routes)
    .get('/', (_, res) => res.send('<h1>Welcome to API 👋 </h1>'))

export default app