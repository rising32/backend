import { Router } from 'express';
import { createCompany, getCompanyInfoWidthID } from '../../controllers/app';
import { createClient, getClientInfoWidthID } from '../../controllers/app/client';

const router = Router();

router.post('/createCompany', createCompany);
router.post('/getCompanyInfo', getCompanyInfoWidthID);
router.post('/createClient', createClient);
router.post('/getClientInfo', getClientInfoWidthID);

export default router;
