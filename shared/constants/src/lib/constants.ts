export const USER_CMD = {
  LOGIN: { cmd: "login_user" },
  SIGNUP: { cmd: "signup_user" },
  // CREATE: { cmd: "create_user" },
  // FIND_ONE: { cmd: "find_user" },
  // UPDATE: { cmd: "update_user" },
  // DELETE: { cmd: "delete_user" },
};
export const PROFILE_CMD = {
  UPDATE: { cmd: "update_profile" },
  GET: { cmd: "get_profile" },
};

export const PRODUCT_CMD = {
  FIND: { cmd: "find_all_products" },
  CREATE: { cmd: "create_product" },
  FIND_ONE: { cmd: "find_product" },
  UPDATE: { cmd: "update_product" },
  DELETE: { cmd: "delete_product" },
};

export const CATEGORY_CMD = {
  FIND: { cmd: "find_all_categories" },
  CREATE: { cmd: "create_category" },
  FIND_ONE: { cmd: "find_category" },
  UPDATE: { cmd: "update_category" },
  DELETE: { cmd: "delete_category" },
};

export const LOCATION_CMD = {
  FIND: { cmd: "find_all_locations" },
  CREATE: { cmd: "create_location" },
  FIND_ONE: { cmd: "find_location" },
  UPDATE: { cmd: "update_location" },
  DELETE: { cmd: "delete_location" },
};

export const STOCK_CMD = {
  FIND: { cmd: "find_all_stocks" },
  CREATE: { cmd: "create_stock" },
  FIND_ONE: { cmd: "find_stock" },
  UPDATE: { cmd: "update_stock" },
  DELETE: { cmd: "delete_stock" },
  RECEIVE: { cmd: "receive_stock" },
  SHIP: { cmd: "ship_stock" },
  TRANSFER: { cmd: "transfer_stock" },
  ADJUST: { cmd: "adjust_stock" },
  FIND_MOVEMENTS: { cmd: "find_movements" }
};

export const INVENTORY_CMD = {
  FIND: { cmd: "find_all_inventories" },
  CREATE: { cmd: "create_inventory" },
  FIND_ONE: { cmd: "find_inventory" },
  UPDATE: { cmd: "update_inventory" },
  DELETE: { cmd: "delete_inventory" },
};
