
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Profile } from "../../profile/entities/profile.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

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

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: ["insert"] })
  profile?: Profile;

  // @Column()
  // role!:string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
