export enum StockMovementType {
    OPENING_STOCK = 'opening_stock',
    RECEIPT = 'receipt',
    SHIPMENT = 'shipment',
    ADJUSTMENT = 'adjustment',
    TRANSFER = 'transfer',
    RETURN = 'return'
}

export enum StockMovementReasonsType {
    OPENING_STOCK = 'opening_stock',
    RECEIPT = 'receipt',
    SHIPMENT = 'shipment',
    ADJUSTMENT = 'adjustment',
    TRANSFER = 'transfer',
    RETURN = 'return'
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