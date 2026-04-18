import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SalesOrder } from './sales-order.entity';

@Entity()
export class SalesOrderItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => SalesOrder, so => so.items, { onDelete: 'CASCADE' })
    salesOrder!: SalesOrder;

    @Column()                     // product ID (string for now, like purchase order)
    product!: string;

    @Column()                     // location ID where to pick/ship from
    location!: string;

    @Column({ type: 'int' })
    quantityOrdered!: number;

    @Column({ type: 'int', default: 0 })
    quantityShipped!: number;     // running total shipped

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    unitPrice?: number;           // price per unit at time of sale

    @Column({ type: 'text', nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date
}