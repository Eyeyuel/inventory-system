import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Stock } from '../../stock/entities/stock.entity';
import { StockMovementType } from '@inventory-system/types';

@Entity()
export class StockMovement {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'enum', enum: StockMovementType })
    // transaction_type
    type!: StockMovementType;

    @Column({ type: 'int' })
    quantityChange!: number;    // positive = IN, negative = OUT

    @Column({ type: 'int' })
    beforeQuantity!: number;    // stock quantity before the movement

    @Column({ type: 'int' })
    afterQuantity!: number;     // stock quantity after the movement

    @Column({ nullable: true })
    referenceId?: string;       // e.g., order ID, purchase order ID

    @Column({ nullable: true, type: 'text' })
    // maybe make this an enum that an admin can create
    reason?: string;           // optional explanation

    @Column({ nullable: false })
    user!: string;            // who performed the movement

    @ManyToOne(() => Stock, stock => stock.stockMovements, { onDelete: 'CASCADE' })
    stock!: Stock;              // link to the specific product+location

    @CreateDateColumn()
    createdAt!: Date;
}