import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Usuario } from '../config/relationships'
import { defaultErrorMessage } from '../config/controller'

export const verifyLogin = async (req, res, next) => {
    const { correo, contrasenia } = req.body
    try {
        let user = await Usuario.findOne({ where: { correo } })
        if (!user) {
            return res
                .status(401)
                .json({ status: 401, error: '🔍  User not found 🔍' })
        }

        let hashedPassword = user.getDataValue('contrasenia')
        let validPassword = await bcrypt.compare(contrasenia, hashedPassword)

        if (!validPassword) {
            return res
                .status(401)
                .json({ status: 401, error: '❌  wrong pwd!! ❌' })
        }

        req.body['user'] = user
        next()
    } catch (error) {
        console.error(error)
        return res
            .status(500)
            .json(defaultErrorMessage)
    }
}

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers[process.env.AUTH_HEADER]

        if (!token) {
            return res.status(401).json({ status: 401, error: '📛 Not authorized 📛' })
        }

        let userDecoded = jwt.verify(token, process.env.JWT_SECRET)
        req.body['userID'] = userDecoded['id']

        next()
    } catch (error) {
        console.error(error)
        return res
            .status(500)
            .json(defaultErrorMessage)
    }
}