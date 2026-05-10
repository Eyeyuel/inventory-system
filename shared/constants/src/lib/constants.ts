export const USER_CMD = {
  LOGIN: { cmd: 'login_user' },
  SIGNUP: { cmd: 'signup_user' },
  REFRESH: { cmd: 'refresh_user' },
  VERIFY_EMAIL: { cmd: 'verify_email' },
  FORGOT_PASSWORD: { cmd: 'forgot_password' },
  RESET_PASSWORD: { cmd: 'reset_password' },
  RESEND_VERIFICATION: { cmd: 'resend_verification' },
  FIND_OR_CREATE_OAUTH_USER: { cmd: 'find_or_create_oauth_user' },
  GENERATE_TOKENS_OAUTH_USER: { cmd: 'generate_tokens_oauth_user' },
};

export const PROFILE_CMD = {
  UPDATE: { cmd: 'update_profile' },
  GET: { cmd: 'get_profile' },
};

export const PRODUCT_CMD = {
  FIND: { cmd: 'find_all_products' },
  CREATE: { cmd: 'create_product' },
  FIND_ONE: { cmd: 'find_product' },
  UPDATE: { cmd: 'update_product' },
  DELETE: { cmd: 'delete_product' },
};

export const CATEGORY_CMD = {
  FIND: { cmd: 'find_all_categories' },
  CREATE: { cmd: 'create_category' },
  FIND_ONE: { cmd: 'find_category' },
  UPDATE: { cmd: 'update_category' },
  DELETE: { cmd: 'delete_category' },
};

export const LOCATION_CMD = {
  FIND: { cmd: 'find_all_locations' },
  CREATE: { cmd: 'create_location' },
  FIND_ONE: { cmd: 'find_location' },
  UPDATE: { cmd: 'update_location' },
  DELETE: { cmd: 'delete_location' },
};

export const STOCK_CMD = {
  FIND: { cmd: 'find_all_stocks' },
  CREATE: { cmd: 'create_stock' },
  FIND_ONE: { cmd: 'find_stock' },
  UPDATE: { cmd: 'update_stock' },
  DELETE: { cmd: 'delete_stock' },
  RECEIVE: { cmd: 'receive_stock' },
  SHIP: { cmd: 'ship_stock' },
  TRANSFER: { cmd: 'transfer_stock' },
  ADJUST: { cmd: 'adjust_stock' },
  FIND_MOVEMENTS: { cmd: 'find_movements' },
};

export const PURCHASE_ORDER_CMD = {
  CREATE: { cmd: 'create_purchase_order' },
  FIND: { cmd: 'find_all_purchase_orders' },
  FIND_ONE: { cmd: 'find_purchase_order' },
};

export const SALES_ORDER_CMD = {
  CREATE: { cmd: 'create_sales_order' },
  FIND: { cmd: 'find_all_sales_orders' },
  FIND_ONE: { cmd: 'find_sales_order' },
};
