export const USER_CMD = {
  LOGIN: { cmd: "login_user" },
  SIGNUP: { cmd: "signup_user" },
  // CREATE: { cmd: "create_user" },
  // FIND_ONE: { cmd: "find_user" },
  // UPDATE: { cmd: "update_user" },
  // DELETE: { cmd: "delete_user" },
};

export const PRODUCT_CMD = {
  FIND: { cmd: "find_all_products" },
  CREATE: { cmd: "create_product" },
  FIND_ONE: { cmd: "find_product" },
  UPDATE: { cmd: "update_product" },
  DELETE: { cmd: "delete_product" },
};

export const INVENTORY_CMD = {
  FIND: { cmd: "find_all_inventories" },
  CREATE: { cmd: "create_inventory" },
  FIND_ONE: { cmd: "find_inventory" },
  UPDATE: { cmd: "update_inventory" },
  DELETE: { cmd: "delete_inventory" },
};

export const ORDER_CMD = {
  FIND: { cmd: "find_all_orders" },
  CREATE: { cmd: "create_order" },
  FIND_ONE: { cmd: "find_order" },
  UPDATE: { cmd: "update_order" },
  DELETE: { cmd: "delete_order" },
};

export const PAYMENT_CMD = {
  FIND: { cmd: "find_all_payments" },
  CREATE: { cmd: "create_payment" },
  FIND_ONE: { cmd: "find_payment" },
  UPDATE: { cmd: "update_payment" },
  DELETE: { cmd: "delete_payment" },
};
