# inventory MS

product (name) should be uniqe ???
SKU when product is added??

///////////////////////////////////////
Tasks:

# USER MUST CREATE A LOCATION FIRST TO ADD A STOCK

# add product (opening stock): {

    first create product with or without category.

    POST /products: Create the product identity.

    POST /stocks: Create the inventory record by passing the productId and locationId, quantity

}

////////////////////// updating stock/////////////////////
delete a product: delete a product and remove every stock of the product in all locations, deleting a product just in a certain sotck or location

know how the deleting a product is going to happen is it through stock movement (know what is the purpose of stock movement)
when you add a prduct is that called a stock movement or just changing location is called a stock movement?
////////////////////////////////////////

# products contains the main list of everything we sale

# transactions keeps tracks of what comes in and goes out

# inventory gives us overview of stock on hand

# order authomatically generates orders from our suppliers

# report gives us a snapshot of our inventory

{
A user should be able to add a new product (with SKU, name, unit of measure, etc.) (✅ exept SKU)

A user should be able to edit a product's details (name, UOM, description, but SKU should be immutable) (✅ exept SKU)

A user should be able to define and manage locations (warehouse → zone → bin) (✅ exept)

A user should be able to receive stock into a specific location (against a purchase order or without one) (✅ exept without purcahse order)

A user should be able to ship stock from a location (against a sales order)

A user should be able to move stock between locations (e.g., bin to bin, warehouse to warehouse)

A user should be able to adjust stock (add or remove quantity with a reason: damage, loss, found)

A user should be able to view real-time on-hand quantity by product and location

A user should be able to see available-to-promise (ATP) = on-hand minus allocated

A user should be able to allocate stock to an order (soft reservation)

A user should be able to deallocate or release stock from an order

A user should be able to scan barcodes for receiving, picking, moving, and counting

A user should be able to perform a cycle count (compare expected vs actual, record difference)

A user should be able to view full transaction history (who did what, when, why)

A user should be able to set reorder points and receive low-stock alerts

A user should be able to generate reports (slow-moving stock, turnover, shrinkage, reorder list)

A user with admin role should be able to manage user roles and permissions (receiver ≠ picker ≠ adjuster)
}

// Allow configuration of reason codes (admin can add/disable codes).
