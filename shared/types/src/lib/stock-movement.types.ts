export enum StockMovementType {
    RECEIVE = 'recive',
    SHIP = 'ship',
    ADJUST = 'adjust',
    TRANSFER_OUT = 'transferOut',
    TRANSFER_IN = 'transferIn',
}

export enum StockMovementReasonsTypeForReceive {
    OPENING_STOCK = 'opening_stock',
    PURCHASE_RECEIPT = 'purchase_receipt',
    RETURN = 'return',
    TRANSFER_IN = 'transfer_in',
    GIFT = 'gift',
    ADJUSTMENT_IN = 'adjustment_in',
}

export enum StockMovementReasonsTypeForAdjust {
    CYCLE_COUNT = 'cycle_count',
    DAMAGE = 'damage',
    LOSS = 'loss',
    FOUND = 'found',
    CORRECTION = 'correction'
}

export enum StockMovementReasonsTypeForShip {
    SALE = 'sale',
    TRANSFER_OUT = 'transfer_out',
    SAMPLE = 'sample',
    DAMAGE_DISPOSAL = 'damage_disposal',
    ADJUSTMENT_OUT = 'adjustment_out',
}

/*
Movement Types (Immutable transaction_type)
These are hardcoded, not configurable:

RECEIVE (inbound)

SHIP (outbound)

TRANSFER_OUT (deduct from source)

TRANSFER_IN (add to destination)

ADJUST (manual +/-)

Reason Codes (Admin-configurable)
Attached to every movement. Examples:

opening_stock (only for first RECEIVE of product+location)

purchase_receipt

return

damage, loss, correction, cycle_count

*/

// Allow configuration of reason codes (admin can add/disable codes).


// export enum StockMovementType {
//     OPENING_STOCK = 'opening_stock',
//     RECEIPT = 'receipt',
//     SHIPMENT = 'shipment',
//     ADJUSTMENT = 'adjustment',
//     TRANSFER = 'transfer',
//     RETURN = 'return'
// }