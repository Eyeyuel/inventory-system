import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        nullable: false,
        length: 100,
    })
    name!: string;

    @Column({
        nullable: true,
    })
    description?: string;
    // i think we need a store here because a category can be used in multiple stores

    @Column({
        nullable: false,
    })
    user!: string;

    @OneToMany(() => Product, (product) => product.category)
    products!: Product[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}