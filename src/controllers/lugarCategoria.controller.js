import { Controller } from "../config/controller";
import { LugarCategoria } from "../models/lugar";

class LugarCategoriaController extends Controller{
    
    constructor() {
		super(LugarCategoria);
	}

}

export default new LugarCategoriaController()