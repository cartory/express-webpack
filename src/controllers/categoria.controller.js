import { Controller } from '../config/controller'
import { Categoria } from '../config/relationships'

import { uploadBase64, destroyIMG } from '../services/cloudinary'

class CategoriaController extends Controller {
    constructor() {
        super(Categoria)
    }

    store = async ({ body }, res) => {
        try {
            let apiRes = await uploadBase64(body.foto)

            body.foto = apiRes.url
            body.public_id = apiRes.public_id

            return res.status(200).json(await Categoria.create(body))
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error })
        }
    }

    update = async ({ body, params }, res) => {
        try {
            if (body.foto?.includes('data:image/') && body.public_id) {
                let apiRes = uploadBase64(body.foto, body.public_id)
                body.foto = apiRes.secure_url
            }

            return res
                .status(200)
                .json(await Categoria.update(body, { where: { id: params.id } }))
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error })
        }
    }

    destroy = async ({ headers, params }, res) => {
        try {
            await destroyIMG(headers.public_id)

            return res
                .status(200)
                .json(await Categoria.destroy({ where: { id: params.id } }))
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error })
        }
    }
}

export default new CategoriaController()