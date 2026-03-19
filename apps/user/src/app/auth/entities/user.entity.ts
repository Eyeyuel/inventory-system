/* eslint-disable*/
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
    nullable: false,
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
    nullable: false,
  })
  password!: string;

  // @Column()
  // role!:string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
