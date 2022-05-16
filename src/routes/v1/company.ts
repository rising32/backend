import { createCompany, getCompanyInfoWidthID } from 'controllers/app';
import { Router } from 'express';

const router = Router();

router.post('/createCompany', createCompany);
router.post('/getCompanyInfo', getCompanyInfoWidthID);

export default router;
