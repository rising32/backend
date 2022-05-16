import { AppDataSource } from 'data-source';
import Client from 'entity/Client';
import Company from 'entity/Company';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  const { compnay_id, name } = req.body;

  try {
    const company = await AppDataSource.getRepository(Company)
      .createQueryBuilder('company')
      .where('company.id = :id', { id: compnay_id })
      .leftJoinAndSelect('company.clients', 'client')
      .getOne();

    if (!company) {
      const customError = new CustomError(400, 'General', 'Company is not exists', [
        `Company '${compnay_id}' is not exists`,
      ]);
      return next(customError);
    }

    try {
      const newClient = new Client();
      newClient.name = name;
      newClient.companies = [company];
      await AppDataSource.manager.save(newClient);

      res.status(200).json(newClient);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `Client '${name}' can't be created`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};

export const getClientInfoWidthID = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;

  try {
    const client = await AppDataSource.getRepository(Client)
      .createQueryBuilder('client')
      .where('client.id = :id', { id })
      .getOne();

    if (!client) {
      const customError = new CustomError(400, 'General', 'Client is not exists', [`Client '${id}' is not exists`]);
      return next(customError);
    }

    res.status(200).json(client);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
