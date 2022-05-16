import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Client from './Client';

@Entity()
export default class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  name!: string;

  @Column({ length: 255, nullable: true, type: 'varchar' })
  thumbnail!: string | null;

  @ManyToMany(() => Client, (client) => client.companies)
  clients: Client[];

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}
