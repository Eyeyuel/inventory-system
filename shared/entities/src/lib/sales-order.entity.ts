import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SalesOrderStatusType } from '@inventory-system/types';
import { SalesOrderItem } from './sales-order-item.entity';


@Entity()
export class SalesOrder {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    orderNumber!: string;

    @Column({ type: 'enum', enum: SalesOrderStatusType, default: SalesOrderStatusType.DRAFT })
    status!: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    orderDate?: Date | null;       // when order was placed

    @Column({ type: 'date', nullable: true })
    requestedDeliveryDate?: Date | null;  // customer requested date

    // generate this when the order is full shipped in the service shipped
    @Column({ type: 'date', nullable: true })
    shippedDate?: Date | null;     // when order was fully shipped

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount!: number;          // sum of (quantityOrdered * unitPrice)

    @Column({ type: 'uuid' })
    user!: string;               // who created/owns this order

    @Column()                      // customer ID (string for now, similar to supplier)
    customer!: string;

    @OneToMany(() => SalesOrderItem, item => item.salesOrder, { cascade: true })
    items!: SalesOrderItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}