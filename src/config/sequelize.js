import { Sequelize } from 'sequelize'
import { config } from 'dotenv'

config()

export default new Sequelize({
    logging: false,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIAL,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    define: {
        paranoid: true,
        defaultScope: {
            attributes: {
                exclude: [
                    'createdAt', 'updatedAt', 'deletedAt'
                ],
            },
        },
    },
})