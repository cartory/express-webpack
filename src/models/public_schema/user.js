import DataTypes, { Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class User extends Model { }

User.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    user_name: DataTypes.TEXT,
    user_occupation: DataTypes.TEXT,
    user_date_of_birth: DataTypes.DATE,
    user_email: {
        unique: true,
        type: DataTypes.STRING,
    },
    user_password: DataTypes.STRING,
    token: DataTypes.TEXT
}, {
    sequelize
})

export default User