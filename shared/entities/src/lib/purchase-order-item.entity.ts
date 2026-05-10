import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';


@Entity()
export class PurchaseOrderItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => PurchaseOrder, po => po.items, { onDelete: 'CASCADE' })
    purchaseOrder!: PurchaseOrder;

    // @ManyToOne(() => Product)
    // product!: Product;
    @Column()
    product!: string;

    // @ManyToOne(() => Location)
    // location!: Location;  // where to receive this item
    @Column()
    location!: string;

    @Column({ type: 'int' })
    quantityOrdered!: number;

    @Column({ type: 'int', default: 0 })
    quantityReceived!: number;

    @Column({ type: 'int' })
    unitCost!: number;

    // Optional: add notes if needed
    @Column({ type: 'text', nullable: true })
    description?: string;
}
