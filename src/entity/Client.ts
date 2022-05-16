import { AppDataSource } from 'data-source';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Company from './Company';

@Entity()
export default class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, nullable: true, type: 'varchar' })
  thumbnail!: string | null;

  @ManyToMany((type) => Company, (company) => company.clients)
  @JoinTable({ name: 'client_companies' })
  companies!: Company[];

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  static findByName(id: string) {
    return AppDataSource.getRepository(Client).createQueryBuilder('client').where('client.id = :id', { id }).getOne();
  }
}
