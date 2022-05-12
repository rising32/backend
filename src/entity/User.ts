import bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';

import { Role } from './types';
import UserProfile from './UserProfile';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  username!: string;

  @Column({ unique: true, length: 255, type: 'varchar' })
  email!: string;

  @Column({
    unique: true,
  })
  phone!: string;

  @Column()
  password!: string;

  @Column({
    default: 'USER' as Role,
    length: 30,
  })
  role: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne((type) => UserProfile, (profile) => profile.user)
  profile!: UserProfile;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
