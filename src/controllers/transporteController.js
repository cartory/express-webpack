import Transporte from '../models/transporte'
import Ruta from '../models/ruta'
import { Controller } from '../config/controller'

class TransporteController extends Controller {
    constructor() {
        super(Transporte)
    }


    getwrutas = async (req, res) => {

        // attributes: { exclude: ["geom"] }, required: false
        
        try {
            
            var data = await Transporte.findAll({
                include: [{
                    model: Ruta
                }]
            });

            for(var i=0;i < data.length;++i){
                var r = data[i].ruta;
                for(var j=0;j<r.length;++j){
                    data[i].ruta[j].geom = r[j].geom.coordinates;
                }
            }


            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error })
        }




    }
}

export default new TransporteController()