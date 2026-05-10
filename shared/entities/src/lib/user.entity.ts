import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email!: string;

  @Column({
    nullable: false,
  })
  first_name!: string;

  @Column({
    nullable: true,
  })
  last_name?: string;

  @Column({
    nullable: true,
  })
  password?: string;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: ['insert'] })
  profile?: Profile;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  // Fields for OAuth
  @Column({ nullable: true, unique: true })
  googleId?: string; // Store the Google unique sub/ID.

  // @Column()
  // role!:string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
