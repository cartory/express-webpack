import { Lugar, ImagenLugar, LugarCategoria } from "../config/relationships";
import { Controller } from "../config/controller";

class LugarController extends Controller {
	constructor() {
		super(Lugar);
	}
	allCrucialInfo = async (_, res) => {
		try {
            const places=await Lugar.findAll({
                attributes: ["id", "nombre", "direccion"],
            });
			return res
				.status(200)
				.json(
					places
				);
		} catch (error) {
            res.status(200).json(error);
        }
	};
	getWithImages=async(req,res)=>{
		try {
			return res
			.status(200)
			.json(await Lugar.findOne({where:{id:req.params.id},include:[ImagenLugar,LugarCategoria]}));
	
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error });
		}
	}
	storeWithImages=async(req,res)=>{
		try {
			console.log(req);
			res.status(200).json('ok')
		} catch (error) {
			
		}
	}
	allWithImages = async (_, res) => {
		try {
			return res
				.status(200)
				.json(await Lugar.findAll({ include: ImagenLugar }));
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error });
		}
	};
}

export default new LugarController();
