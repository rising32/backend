import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';

import { AppDataSource } from 'data-source';

import User from './User';

@Entity()
export default class ManagerUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  fk_user_id!: string;

  @BeforeInsert()
  updateFK() {
    this.fk_user_id = this.user.id;
  }

  @ManyToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  static async checkAdmin(userId: string) {
    const managerUserRepository = AppDataSource.getRepository(ManagerUser);
    const managerUser = await managerUserRepository.findOneBy({
      fk_user_id: userId,
    });
    return !!managerUser;
  }
}
