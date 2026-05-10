import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";
import { Location } from "./location.entity";
import { StockMovement } from "./stock-movement.entity";

@Entity()
export class Stock {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    quantity!: number

    @Column({ nullable: false })
    user!: string;

    // many to one : many stocks can belong to one product, Because one product can exist in multiple physical locations.
    @ManyToOne(() => Product, (product) => product.stocks)
    product!: Product

    //many to one : many stocks can belong to one location
    @ManyToOne(() => Location, (location) => location.stocks)
    location!: Location

    @OneToMany(() => StockMovement, (stockMovement) => stockMovement.stock)
    stockMovements?: StockMovement[]

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date

    @DeleteDateColumn()
    deletedAt?: Date

}

