import Tarifa from '../models/tarifa'
import { Controller } from '../config/controller'

class TarifaController extends Controller {
    constructor() {
        super(Tarifa)
    }
}

export default new TarifaController()