import { environment } from '../../environments/environment';

export class ApiEndpoints {
  private static readonly BASE_URL = environment.apiUrl;

  // Auth endpoints
  static readonly AUTH = {
    LOGIN: `${this.BASE_URL}/auth/login`,
    LOGOUT: `${this.BASE_URL}/auth/logout`,
    REFRESH: `${this.BASE_URL}/auth/refresh`,
    REGISTER: `${this.BASE_URL}/auth/register`,
    PROFILE: `${this.BASE_URL}/auth/profile`,
    CHANGE_PASSWORD: `${this.BASE_URL}/auth/change-password`,
    SELECT_CLINIC: `${this.BASE_URL}/auth/select-clinic`,
    USERS: `${this.BASE_URL}/auth/users`,
    USER_BY_ID: (id: string) => `${this.BASE_URL}/auth/users/${id}`,
    BLACKLIST_STATUS: `${this.BASE_URL}/auth/blacklist-status`,
    LOGOUT_ALL_DEVICES: `${this.BASE_URL}/auth/logout-all-devices`
  };

  // Clinics endpoints
  static readonly CLINICS = {
    LIST: `${this.BASE_URL}/clinics`,
    CREATE: `${this.BASE_URL}/clinics`,
    BY_ID: (id: string) => `${this.BASE_URL}/clinics/${id}`,
    UPDATE: (id: string) => `${this.BASE_URL}/clinics/${id}`,
    DELETE: (id: string) => `${this.BASE_URL}/clinics/${id}`,
    BY_USER: `${this.BASE_URL}/clinics/user`,
    SELECT: `${this.BASE_URL}/clinics/select`,
    SEARCH: `${this.BASE_URL}/clinics/search`
  };

  // Pet endpoints
  static readonly PETS = {
    LIST: `${this.BASE_URL}/pets`,
    CREATE: `${this.BASE_URL}/pets`,
    BY_ID: (id: string) => `${this.BASE_URL}/pets/${id}`,
    UPDATE: (id: string) => `${this.BASE_URL}/pets/${id}`,
    DELETE: (id: string) => `${this.BASE_URL}/pets/${id}`,
    BY_OWNER: (ownerId: string) => `${this.BASE_URL}/pets/owner/${ownerId}`,
    SEARCH: `${this.BASE_URL}/pets/search`
  };

  // Medical Records endpoints
  static readonly MEDICAL_RECORDS = {
    LIST: `${this.BASE_URL}/medical-records`,
    CREATE: `${this.BASE_URL}/medical-records`,
    BY_ID: (id: string) => `${this.BASE_URL}/medical-records/${id}`,
    UPDATE: (id: string) => `${this.BASE_URL}/medical-records/${id}`,
    DELETE: (id: string) => `${this.BASE_URL}/medical-records/${id}`,
    BY_PET: (petId: string) => `${this.BASE_URL}/medical-records/pet/${petId}`,
    BY_CLINIC: (clinicId: string) => `${this.BASE_URL}/medical-records/clinic/${clinicId}`
  };

  // Form Templates endpoints
  static readonly FORM_TEMPLATES = {
    LIST: `${this.BASE_URL}/form-templates`,
    CREATE: `${this.BASE_URL}/form-templates`,
    BY_ID: (id: string) => `${this.BASE_URL}/form-templates/${id}`,
    UPDATE: (id: string) => `${this.BASE_URL}/form-templates/${id}`,
    DELETE: (id: string) => `${this.BASE_URL}/form-templates/${id}`,
    BY_CATEGORY: (category: string) => `${this.BASE_URL}/form-templates/category/${category}`,
    BY_CLINIC: (clinicId: string) => `${this.BASE_URL}/form-templates/clinic/${clinicId}`
  };

  // Appointments endpoints
  static readonly APPOINTMENTS = {
    LIST: `${this.BASE_URL}/appointments`,
    CREATE: `${this.BASE_URL}/appointments`,
    BY_ID: (id: string) => `${this.BASE_URL}/appointments/${id}`,
    UPDATE: (id: string) => `${this.BASE_URL}/appointments/${id}`,
    DELETE: (id: string) => `${this.BASE_URL}/appointments/${id}`,
    BY_PET: (petId: string) => `${this.BASE_URL}/appointments/pet/${petId}`,
    BY_VET: (vetId: string) => `${this.BASE_URL}/appointments/vet/${vetId}`,
    BY_CLINIC: (clinicId: string) => `${this.BASE_URL}/appointments/clinic/${clinicId}`,
    BY_DATE: (date: string) => `${this.BASE_URL}/appointments/date/${date}`,
    AVAILABLE_SLOTS: `${this.BASE_URL}/appointments/available-slots`
  };

  // Products endpoints
  static readonly PRODUCTS = {
    LIST: `${this.BASE_URL}/products`,
    CREATE: `${this.BASE_URL}/products`,
    BY_ID: (id: string) => `${this.BASE_URL}/products/${id}`,
    UPDATE: (id: string) => `${this.BASE_URL}/products/${id}`,
    DELETE: (id: string) => `${this.BASE_URL}/products/${id}`,
    BY_CATEGORY: (category: string) => `${this.BASE_URL}/products/category/${category}`,
    SEARCH: `${this.BASE_URL}/products/search`,
    INVENTORY: `${this.BASE_URL}/products/inventory`,
    UPDATE_STOCK: (id: string) => `${this.BASE_URL}/products/${id}/stock`
  };

  // Services endpoints
  static readonly SERVICES = {
    LIST: `${this.BASE_URL}/services`,
    CREATE: `${this.BASE_URL}/services`,
    BY_ID: (id: string) => `${this.BASE_URL}/services/${id}`,
    UPDATE: (id: string) => `${this.BASE_URL}/services/${id}`,
    DELETE: (id: string) => `${this.BASE_URL}/services/${id}`,
    BY_CATEGORY: (category: string) => `${this.BASE_URL}/services/category/${category}`,
    BY_CLINIC: (clinicId: string) => `${this.BASE_URL}/services/clinic/${clinicId}`
  };

  // Orders endpoints
  static readonly ORDERS = {
    LIST: `${this.BASE_URL}/orders`,
    CREATE: `${this.BASE_URL}/orders`,
    BY_ID: (id: string) => `${this.BASE_URL}/orders/${id}`,
    UPDATE: (id: string) => `${this.BASE_URL}/orders/${id}`,
    DELETE: (id: string) => `${this.BASE_URL}/orders/${id}`,
    BY_CLIENT: (clientId: string) => `${this.BASE_URL}/orders/client/${clientId}`,
    BY_CLINIC: (clinicId: string) => `${this.BASE_URL}/orders/clinic/${clinicId}`,
    BY_STATUS: (status: string) => `${this.BASE_URL}/orders/status/${status}`,
    UPDATE_STATUS: (id: string) => `${this.BASE_URL}/orders/${id}/status`
  };

  // Vet Settings endpoints
  static readonly VET_SETTINGS = {
    GET: `${this.BASE_URL}/vet-settings`,
    UPDATE: `${this.BASE_URL}/vet-settings`,
    BY_CLINIC: (clinicId: string) => `${this.BASE_URL}/vet-settings/clinic/${clinicId}`,
    WORKING_HOURS: `${this.BASE_URL}/vet-settings/working-hours`,
    SPECIALTIES: `${this.BASE_URL}/vet-settings/specialties`,
    AVAILABILITY: `${this.BASE_URL}/vet-settings/availability`
  };

  // Reports endpoints
  static readonly REPORTS = {
    SALES: `${this.BASE_URL}/reports/sales`,
    APPOINTMENTS: `${this.BASE_URL}/reports/appointments`,
    INVENTORY: `${this.BASE_URL}/reports/inventory`,
    FINANCIAL: `${this.BASE_URL}/reports/financial`,
    PETS: `${this.BASE_URL}/reports/pets`,
    BY_PERIOD: (startDate: string, endDate: string) => 
      `${this.BASE_URL}/reports/period/${startDate}/${endDate}`,
    EXPORT: (type: string) => `${this.BASE_URL}/reports/export/${type}`
  };

  // Dashboard endpoints
  static readonly DASHBOARD = {
    OVERVIEW: `${this.BASE_URL}/dashboard/overview`,
    STATS: `${this.BASE_URL}/dashboard/stats`,
    RECENT_ACTIVITIES: `${this.BASE_URL}/dashboard/recent-activities`,
    UPCOMING_APPOINTMENTS: `${this.BASE_URL}/dashboard/upcoming-appointments`,
    LOW_STOCK_ALERTS: `${this.BASE_URL}/dashboard/low-stock-alerts`
  };

  // Notifications endpoints
  static readonly NOTIFICATIONS = {
    LIST: `${this.BASE_URL}/notifications`,
    MARK_READ: (id: string) => `${this.BASE_URL}/notifications/${id}/read`,
    MARK_ALL_READ: `${this.BASE_URL}/notifications/mark-all-read`,
    SETTINGS: `${this.BASE_URL}/notifications/settings`,
    SEND: `${this.BASE_URL}/notifications/send`
  };

  // File upload endpoints
  static readonly FILES = {
    UPLOAD: `${this.BASE_URL}/files/upload`,
    DOWNLOAD: (id: string) => `${this.BASE_URL}/files/download/${id}`,
    DELETE: (id: string) => `${this.BASE_URL}/files/${id}`,
    BY_ENTITY: (entityType: string, entityId: string) => 
      `${this.BASE_URL}/files/${entityType}/${entityId}`
  };

  // Utility method to get base URL
  static getBaseUrl(): string {
    return this.BASE_URL;
  }

  // Utility method to build custom endpoints
  static buildUrl(path: string): string {
    return `${this.BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  }
}
