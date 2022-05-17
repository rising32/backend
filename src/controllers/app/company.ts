import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../data-source';
import Company from '../../entity/Company';
import { CustomError } from '../../lib/utils/response/custom-error/CustomError';

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  const companyRepository = AppDataSource.getRepository(Company);
  try {
    const company = await companyRepository.findOneBy({ name });

    if (company) {
      const customError = new CustomError(400, 'General', 'Company already exists', [
        `Company '${company.name}' already exists`,
      ]);
      return next(customError);
    }

    try {
      const newCompany = new Company();
      newCompany.name = name;
      await AppDataSource.manager.save(newCompany);

      res.status(200).json(newCompany);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `Company '${name}' can't be created`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};

export const getCompanyInfoWidthID = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;

  try {
    const company = await AppDataSource.getRepository(Company)
      .createQueryBuilder('company')
      .where('company.id = :id', { id })
      .leftJoinAndSelect('company.clients', 'client')
      .getOne();

    if (!company) {
      const customError = new CustomError(400, 'General', 'Company already exists', [`Company '${id}' already exists`]);
      return next(customError);
    }

    res.status(200).json(company);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
