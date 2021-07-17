import { Controller } from '../config/controller'

import sequelize from '../config/sequelize'
import { QueryTypes } from "sequelize"
import { User } from '../config/relationships'
class UserController extends Controller {
    constructor() {
        super(User)
    }

    user_create = async (req, res) => {
        try {
            console.log(req.body.name);
            await User.create({
                user_name: req.body.name,
                user_occupation: req.body.occupation,
                user_date_of_birth:null,
                user_email: req.body.email,
                user_password: req.body.pass,
                token: 'token',
                CityId: (req.body.city_id)?req.body.city_id:null
            },
            {
                fields: ['user_name', 'user_occupation',
                    'user_date_of_birth', 'user_email', 'user_password',
                    'token', 'CityId']
            });
            res.status(200).json({ status: 200, message: `User Created!`, username: req.body.name });
        } catch (error) {
            res.status(400).json({ status: 400, message: `Error creating user!`, username: req.body.name });
        }
    }

    
}

export default new UserController();