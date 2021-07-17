import { Controller } from '../config/controller'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../models/usuario'

const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIMEOUT_DURATION
})

class UsuarioController extends Controller {
    constructor() {
        super(Usuario)
    }

    autoAdmin = async () => {
        try {
            let user = await Usuario.findByPk(1)
            if (!user) {
                let hashedPassword = await bcrypt.hash('admin', 10)
                user = await Usuario.create({
                    nombre: 'admin',
                    ocupacion: 'admin',
                    correo: 'admin@admin.com',
                    contrasenia: hashedPassword,
                })
            }
            console.log('admin => ', user !== null);
        } catch (error) {
            console.log(error)
        }
    }

    store = async ({ body }, res) => {
        try {
            let hashedPassword = await bcrypt.hash(body['contrasenia'], 10)
            body['contrasenia'] = hashedPassword

            let user = await Usuario.create(body)
            let token = generateToken(user.toJSON())

            res.status(200).json(await user.update({ token }))
        } catch (error) {
            console.error(error)
            res.status(500).json({ error })
        }
    }

    signout = async ({ body }, res) => {
        try {
            let userID = body['userID']
            let user = await Usuario.findOne({ where: { id: userID } })

            res.status(200).json(await user.update({ token: null }))
        } catch (error) {
            console.error(error)
            res.status(500).json({ error })
        }
    }

    show = async ({ body }, res) => {
        try {

            let user = body['user']
            user.set('token', null)
            let token = generateToken(user.toJSON())
            res.status(200).json(await user.update({ token }))
        } catch (error) {
            console.error(error)
            res.status(500).json({ error })
        }
    }
}

export default new UsuarioController()