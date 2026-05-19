/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} phone
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [role]
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} access
 * @property {string} refresh
 * @property {User} user
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {number} product_count
 * @property {string} created_at
 */

/**
 * @typedef {'dona' | 'kg' | 'litr' | 'metr'} UnitEnum
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {number} [category]
 * @property {string} category_name
 * @property {string} cost_price
 * @property {string} sale_price
 * @property {number} quantity
 * @property {UnitEnum} unit
 * @property {number} low_stock_threshold
 * @property {string} status
 * @property {string} [image]
 * @property {string} [barcode]
 * @property {string} [description]
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ProductList
 * @property {number} id
 * @property {string} name
 * @property {string} category_name
 * @property {string} cost_price
 * @property {string} sale_price
 * @property {number} quantity
 * @property {UnitEnum} unit
 * @property {string} status
 */

/**
 * @typedef {'active' | 'vip' | 'debtor' | 'inactive'} CustomerStatusEnum
 */

/**
 * @typedef {Object} Customer
 * @property {number} id
 * @property {string} name
 * @property {string} [phone]
 * @property {string} [address]
 * @property {string} debt
 * @property {string} total_spent
 * @property {CustomerStatusEnum} status
 * @property {string} status_display
 * @property {string} [telegram_chat_id]
 * @property {string} [note]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {'cash' | 'card' | 'debt' | 'transfer'} PaymentMethodEnum
 */

/**
 * @typedef {Object} SaleItem
 * @property {number} id
 * @property {number} product
 * @property {string} product_name
 * @property {number} quantity
 * @property {string} price
 * @property {string} cost_price
 * @property {string} subtotal
 */

/**
 * @typedef {Object} Sale
 * @property {number} id
 * @property {number} [customer]
 * @property {string} customer_name
 * @property {SaleItem[]} items
 * @property {string} total
 * @property {string} discount
 * @property {string} profit
 * @property {PaymentMethodEnum} payment_method
 * @property {string} payment_method_display
 * @property {string} [note]
 * @property {string} created_at
 */

/**
 * @typedef {Object} PurchaseItem
 * @property {number} id
 * @property {number} product
 * @property {string} product_name
 * @property {number} quantity
 * @property {string} cost_price
 * @property {string} subtotal
 */

/**
 * @typedef {Object} Purchase
 * @property {number} id
 * @property {number} [supplier]
 * @property {string} supplier_name
 * @property {PurchaseItem[]} items
 * @property {string} total
 * @property {PaymentMethodEnum} payment_method
 * @property {string} payment_method_display
 * @property {string} [note]
 * @property {string} created_at
 */

/**
 * @typedef {Object} Supplier
 * @property {number} id
 * @property {string} name
 * @property {string} [phone]
 * @property {string} [address]
 * @property {string} [note]
 * @property {string} created_at
 */

/**
 * @typedef {Object} DashboardStats
 * @property {string} total_revenue
 * @property {string} total_profit
 * @property {number} total_sales_count
 * @property {string} total_debt
 * @property {Object[]} daily_chart
 * @property {Object[]} top_products
 * @property {Object[]} top_customers
 */

/**
 * @typedef {Object} TelegramBotUser
 * @property {string} chat_id
 * @property {string} [username]
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} created_at
 */

/**
 * @typedef {Object} TelegramBotUserAllowedResponse
 * @property {boolean} is_allowed
 * @property {TelegramBotUser} [user]
 */

/**
 * @typedef {Object} PaymentRequest
 * @property {number} amount
 */

/**
 * @typedef {Object} WarehouseReport
 * @property {number} total_products
 * @property {number} total_quantity
 * @property {string} total_cost_value
 * @property {string} total_sale_value
 * @property {Product[]} low_stock_products
 */

/**
 * @typedef {Object} ProfitReport
 * @property {string} total_revenue
 * @property {string} total_cost
 * @property {string} total_profit
 * @property {Object[]} daily_data
 */

/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {number} count
 * @property {string | null} next
 * @property {string | null} previous
 * @property {T[]} results
 */
export {};
