import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
    length: 100,
  })
  name!: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column({
    nullable: false,
  })
  unitOfMeasurment!: string;

  @Column({
    nullable: false,
  })
  costPrice!: number;

  @Column({
    nullable: false,
  })
  sellingPrice!: number;

  @Column({
    nullable: false,
  })
  quantity!: number;

  @Column({
    nullable: false,
  })
  categoryId!: number;

  @Column({
    nullable: false,
  })
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deltedAt!: Date;
}
