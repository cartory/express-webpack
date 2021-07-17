import { Router } from 'express'

import zona from './controllers/zonaUV.controller'

const router = Router()

router
    //∑
    .get('/zonas', zona.all)
    .get('/zonas/count', zona.count)

export default router