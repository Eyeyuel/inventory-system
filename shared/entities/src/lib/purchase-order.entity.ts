import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseOrderStatusType } from '@inventory-system/types';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Entity()
export class PurchaseOrder {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    orderNumber!: string;

    @Column({ type: 'enum', enum: PurchaseOrderStatusType, default: 'draft' })
    status!: string;

    @Column({ type: 'date', nullable: true })
    expectedDeliveryDate?: Date | null;  // ? = optional

    @Column({ type: 'date', nullable: true })
    receivedDate?: Date | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalCost!: number;

    @Column({ type: 'uuid' })
    user!: string;

    // @ManyToOne(() => Supplier)
    // supplier!: Supplier;
    @Column({ type: 'string' })
    supplier!: string;

    @OneToMany(() => PurchaseOrderItem, item => item.purchaseOrder, { cascade: true })
    items!: PurchaseOrderItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
