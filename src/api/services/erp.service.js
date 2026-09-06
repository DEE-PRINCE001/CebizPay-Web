import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const erpService = {
  // Inventory
  inventory: {
    getItems: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.INVENTORY.ITEMS, { params });
    },
    getItemById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.INVENTORY.GET_BY_ID(id));
    },
    createItem: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.INVENTORY.CREATE, payload);
    },
    updateItem: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORG_ERP.INVENTORY.UPDATE(id), payload);
    },
    stockIn: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.INVENTORY.STOCK_IN(id), payload);
    },
    stockOut: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.INVENTORY.STOCK_OUT(id), payload);
    },
    adjustStock: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.INVENTORY.ADJUST(id), payload);
    },
    getMovements: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.INVENTORY.MOVEMENTS, { params });
    },
    setValuationPolicy: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.INVENTORY.VALUATION_POLICY, payload);
    },
  },

  // Purchase Orders & Sales Orders
  orders: {
    getPurchaseOrders: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.PURCHASE_ORDERS.LIST, { params });
    },
    createPurchaseOrder: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.PURCHASE_ORDERS.CREATE, payload);
    },
    getPurchaseOrderById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.PURCHASE_ORDERS.GET_BY_ID(id));
    },
    receivePurchaseOrderItem: async (orderId, itemId, payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.PURCHASE_ORDERS.RECEIVE_ITEM(orderId, itemId), payload);
    },
    getSalesOrders: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.SALES_ORDERS.LIST, { params });
    },
    createSalesOrder: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.SALES_ORDERS.CREATE, payload);
    },
    getSalesOrderById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.SALES_ORDERS.GET_BY_ID(id));
    },
    fulfillSalesOrderItem: async (orderId, itemId, payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.SALES_ORDERS.FULFILL_ITEM(orderId, itemId), payload);
    },
  },

  // Invoices & Receipts
  billing: {
    getInvoices: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.INVOICES.LIST, { params });
    },
    createInvoice: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.INVOICES.CREATE, payload);
    },
    getInvoiceById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.INVOICES.GET_BY_ID(id));
    },
    recordInvoicePayment: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.INVOICES.RECORD_PAYMENT(id), payload);
    },
    getReceipts: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.RECEIPTS.LIST, { params });
    },
    getReceiptById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.RECEIPTS.GET_BY_ID(id));
    },
  },

  // Expenses & Vouchers
  expenses: {
    getOperatingExpenses: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.EXPENSES.OPERATING.LIST, { params });
    },
    createOperatingExpense: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.EXPENSES.OPERATING.CREATE, payload);
    },
    getOperatingExpenseById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.EXPENSES.OPERATING.GET_BY_ID(id));
    },
    payOperatingExpense: async (id, payload, idempotencyKey = null) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.EXPENSES.OPERATING.PAY(id), payload, {
        idempotent: true,
        headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      });
    },
    getCompanyVouchers: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.EXPENSES.VOUCHERS.LIST, { params });
    },
    createCompanyVoucher: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.EXPENSES.VOUCHERS.CREATE, payload);
    },
    getCompanyVoucherById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.EXPENSES.VOUCHERS.GET_BY_ID(id));
    },
    payCompanyVoucher: async (id, payload, idempotencyKey = null) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.EXPENSES.VOUCHERS.PAY(id), payload, {
        idempotent: true,
        headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      });
    },
    updateVoucherMetadata: async (id, payload) => {
      return apiClient.patch(ENDPOINTS.ORG_ERP.EXPENSES.VOUCHERS.UPDATE_METADATA(id), payload);
    },
  },

  // Suppliers & Customers
  suppliers: {
    list: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.SUPPLIERS.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.SUPPLIERS.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.SUPPLIERS.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORG_ERP.SUPPLIERS.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ORG_ERP.SUPPLIERS.DELETE(id));
    },
  },

  customers: {
    list: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.CUSTOMERS.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.CUSTOMERS.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.CUSTOMERS.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORG_ERP.CUSTOMERS.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ORG_ERP.CUSTOMERS.DELETE(id));
    },
  },

  // Services Catalog
  services: {
    list: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.SERVICES.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.SERVICES.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.SERVICES.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORG_ERP.SERVICES.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ORG_ERP.SERVICES.DELETE(id));
    },
  },

  // Reports
  reports: {
    getProfitLoss: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.REPORTS.PROFIT_LOSS, { params });
    },
    getSales: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.REPORTS.SALES, { params });
    },
    getPurchases: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.REPORTS.PURCHASES, { params });
    },
    getSettlement: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.REPORTS.SETTLEMENT, { params });
    },
  },

  // Org Savings, Thrift, Loans
  savings: {
    getPlans: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.SAVINGS.PLANS, { params });
    },
    getAccounts: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.SAVINGS.ACCOUNTS, { params });
    },
  },

  thrift: {
    getGroups: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.THRIFT.GROUPS, { params });
    },
  },

  loans: {
    getPlans: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.LOANS.PLANS, { params });
    },
    getPlanById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.LOANS.PLAN_BY_ID(id));
    },
    createPlan: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.LOANS.PLANS, payload);
    },
    getApplications: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.LOANS.APPLICATIONS, { params });
    },
    getApplicationById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_ERP.LOANS.APPLICATION_BY_ID(id));
    },
    approveApplication: async (id) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.LOANS.APPROVE_APPLICATION(id));
    },
    declineApplication: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ORG_ERP.LOANS.DECLINE_APPLICATION(id), payload);
    },
  },
};
