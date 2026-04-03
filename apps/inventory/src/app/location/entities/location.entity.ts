import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Stock } from "../../stock/entities/stock.entity";
@Entity()
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: false })
    user!: string;

    @OneToMany(() => Stock, (stock) => stock.location, { cascade: true })
    stocks?: Stock[]  // stock[] [ not null, note: 'array of stocks because in one location we can have different stock records' ]

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date

    @DeleteDateColumn()
    deletedAt?: Date
}
