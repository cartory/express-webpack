import { zonaUV } from '../config/relationships'
import { Controller } from '../config/controller'

class zonaUVController extends Controller {
    constructor() {
        super(zonaUV)
    }

    count = async (_, res) => {
        try {
            return res.status(200).json(await zonaUV.count())
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Ups!, somethign goes wrong !!'
            })
        }
    }
}

export default new zonaUVController()