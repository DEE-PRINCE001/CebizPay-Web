import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const erpService = {
  // Inventory
  inventory: {
    getItems: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.INVENTORY.ITEMS, { params });
    },
    getItemById: async (id) => {
      return apiClient.get(ENDPOINTS.ERP.INVENTORY.GET_ITEM(id));
    },
    createItem: async (payload) => {
      return apiClient.post(ENDPOINTS.ERP.INVENTORY.CREATE_ITEM, payload);
    },
    updateItem: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ERP.INVENTORY.UPDATE_ITEM(id), payload);
    },
    stockIn: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ERP.INVENTORY.STOCK_IN(id), payload);
    },
    stockOut: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ERP.INVENTORY.STOCK_OUT(id), payload);
    },
    adjustStock: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ERP.INVENTORY.STOCK_ADJUSTMENT(id), payload);
    },
    getMovements: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.INVENTORY.STOCK_MOVEMENTS, { params });
    },
    setValuationPolicy: async (payload) => {
      return apiClient.post(ENDPOINTS.ERP.INVENTORY.VALUATION_POLICY, payload);
    },
  },

  // Purchase Orders & Sales Orders
  orders: {
    getPurchaseOrders: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.PURCHASE_ORDERS.LIST, { params });
    },
    createPurchaseOrder: async (payload) => {
      return apiClient.post(ENDPOINTS.ERP.PURCHASE_ORDERS.CREATE, payload);
    },
    getPurchaseOrderById: async (id) => {
      return apiClient.get(ENDPOINTS.ERP.PURCHASE_ORDERS.GET_BY_ID(id));
    },
    receivePurchaseOrderItem: async (orderId, itemId, payload) => {
      return apiClient.post(ENDPOINTS.ERP.PURCHASE_ORDERS.RECEIVE_ITEM(orderId, itemId), payload);
    },
    getSalesOrders: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.SALES_ORDERS.LIST, { params });
    },
    createSalesOrder: async (payload) => {
      return apiClient.post(ENDPOINTS.ERP.SALES_ORDERS.CREATE, payload);
    },
    getSalesOrderById: async (id) => {
      return apiClient.get(ENDPOINTS.ERP.SALES_ORDERS.GET_BY_ID(id));
    },
    fulfillSalesOrderItem: async (orderId, itemId, payload) => {
      return apiClient.post(ENDPOINTS.ERP.SALES_ORDERS.FULFILL_ITEM(orderId, itemId), payload);
    },
  },

  // Invoices & Receipts
  billing: {
    getInvoices: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.INVOICES.LIST, { params });
    },
    createInvoice: async (payload) => {
      return apiClient.post(ENDPOINTS.ERP.INVOICES.CREATE, payload);
    },
    getInvoiceById: async (id) => {
      return apiClient.get(ENDPOINTS.ERP.INVOICES.GET_BY_ID(id));
    },
    recordInvoicePayment: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ERP.INVOICES.RECORD_PAYMENT(id), payload);
    },
    getReceipts: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.RECEIPTS.LIST, { params });
    },
    getReceiptById: async (id) => {
      return apiClient.get(ENDPOINTS.ERP.RECEIPTS.GET_BY_ID(id));
    },
  },

  // Expenses & Vouchers
  expenses: {
    getOperatingExpenses: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.EXPENSES.OPERATING.LIST, { params });
    },
    createOperatingExpense: async (payload) => {
      return apiClient.post(ENDPOINTS.ERP.EXPENSES.OPERATING.CREATE, payload);
    },
    getOperatingExpenseById: async (id) => {
      return apiClient.get(ENDPOINTS.ERP.EXPENSES.OPERATING.GET_BY_ID(id));
    },
    payOperatingExpense: async (id, payload, idempotencyKey = null) => {
      return apiClient.post(ENDPOINTS.ERP.EXPENSES.OPERATING.PAY(id), payload, {
        idempotent: true,
        headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      });
    },
    getCompanyVouchers: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.EXPENSES.VOUCHERS.LIST, { params });
    },
    createCompanyVoucher: async (payload) => {
      return apiClient.post(ENDPOINTS.ERP.EXPENSES.VOUCHERS.CREATE, payload);
    },
    getCompanyVoucherById: async (id) => {
      return apiClient.get(ENDPOINTS.ERP.EXPENSES.VOUCHERS.GET_BY_ID(id));
    },
    payCompanyVoucher: async (id, payload, idempotencyKey = null) => {
      return apiClient.post(ENDPOINTS.ERP.EXPENSES.VOUCHERS.PAY(id), payload, {
        idempotent: true,
        headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      });
    },
    updateVoucherMetadata: async (id, payload) => {
      return apiClient.patch(ENDPOINTS.ERP.EXPENSES.VOUCHERS.UPDATE_METADATA(id), payload);
    },
  },

  // Suppliers
  suppliers: {
    getList: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.SUPPLIERS.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ERP.SUPPLIERS.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ERP.SUPPLIERS.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ERP.SUPPLIERS.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ERP.SUPPLIERS.DELETE(id));
    },
  },

  // Customers
  customers: {
    getList: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.CUSTOMERS.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ERP.CUSTOMERS.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ERP.CUSTOMERS.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ERP.CUSTOMERS.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ERP.CUSTOMERS.DELETE(id));
    },
  },

  // Services Catalog
  services: {
    getList: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ERP.SERVICES.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ERP.SERVICES.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ERP.SERVICES.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ERP.SERVICES.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ERP.SERVICES.DELETE(id));
    },
  },

  // Reports
  reports: {
    getProfitLoss: async (params) => {
      return apiClient.get(ENDPOINTS.ERP.REPORTS.PROFIT_LOSS, { params });
    },
    getSales: async (params) => {
      return apiClient.get(ENDPOINTS.ERP.REPORTS.SALES, { params });
    },
    getPurchases: async (params) => {
      return apiClient.get(ENDPOINTS.ERP.REPORTS.PURCHASES, { params });
    },
    getSettlement: async (params) => {
      return apiClient.get(ENDPOINTS.ERP.REPORTS.SETTLEMENT, { params });
    },
  },
};
