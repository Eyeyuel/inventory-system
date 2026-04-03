import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Stock } from "../../stock/entities/stock.entity";
import { Category } from "../../category/entities/category.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: true })
    sku?: string;

    @Column({
        nullable: false,
        length: 100,
    })
    name!: string

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: false, default: 0 })
    cost?: number;

    @Column({ nullable: false, default: 0 })
    price?: number;

    @Column({ nullable: false, default: 0 })
    reorderPoint?: number;

    @Column({ nullable: false, default: 10 })
    reorderQuantity?: number;

    @Column({ nullable: false })
    user!: string;

    // many to one: many products can be in one category
    @ManyToOne(() => Category, (category) => category.products, { nullable: true })
    category?: Category

    //   REMOVE CASCADE: TRUE 
    @OneToMany(() => Stock, (stock) => stock.product, { cascade: true })
    stocks!: Stock[]

    // ?? adding quantity for this product
    @Column({ nullable: true })
    purchaseOrderItems?: number;

    // ?? reducing (salling)
    @Column({ nullable: true })
    salesOrderItems?: number

    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;
    @DeleteDateColumn()
    deletedAt!: Date;
}


