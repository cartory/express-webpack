import { ZonaUV } from '../config/relationships'
import { Controller, defaultErrorMessage } from '../config/controller'

class ZonaUVController extends Controller {
    constructor() {
        super(ZonaUV)
    }

    count = async (_, res) => {
        try {
            return res
                .status(200)
                .json(await ZonaUV.count())
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json(defaultErrorMessage)
        }
    }
}

export default new ZonaUVController()