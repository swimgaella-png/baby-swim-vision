import { authService } from './authService';

export interface AdminUserRecord {
  id: string;
  email: string;
  name?: string;
  role: 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN';
  subscriptionStatus?: string;
  lifetimeAccess?: boolean;
  status?: 'active' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
  lastActivityAt?: string;
}

export interface AdminPaymentRecord {
  orderId: string;
  userEmail: string;
  userId?: string;
  amountPaid: number;
  currency: string;
  status: 'completed' | 'failed' | 'pending';
  lifetimeAccessGranted: boolean;
  receiptNumber?: string;
  verifiedAt: string;
  paymentMethod?: string;
  stripeSessionId?: string;
  promoCode?: string;
  product?: {
    name: string;
    priceEur: number;
    type: string;
    isSubscription: boolean;
  };
}

export interface AdminNotificationRecord {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'advice' | 'alert' | 'update';
  targetAudience: 'all' | 'free' | 'premium';
  status: 'draft' | 'sent';
  sentAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  readCount?: number;
}

export interface AdminKnowledgeItem {
  id: string;
  situationKey: string;
  title: string;
  category: string;
  description: string;
  keyPoints: string[];
  safetyRules: string[];
  updatedAt?: string;
}

class AdminManagementService {
  /**
   * Fetch all users from server
   */
  public async fetchUsers(): Promise<AdminUserRecord[]> {
    try {
      const res = await fetch('/api/admin/users', {
        headers: authService.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Impossible de charger les utilisateurs');
      const data = await res.json();
      return data.users || [];
    } catch (err) {
      console.error('Error fetching admin users:', err);
      return [];
    }
  }

  /**
   * Update user status (active / suspended) and lifetime access
   */
  public async updateUserStatus(
    email: string,
    params: {
      status?: 'active' | 'suspended';
      role?: 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN';
      lifetimeAccess?: boolean;
    }
  ): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/users/status', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ email, ...params }),
      });
      return res.ok;
    } catch (err) {
      console.error('Error updating user status:', err);
      return false;
    }
  }

  /**
   * Update user role (e.g. grant Premium)
   */
  public async updateUserRole(email: string, role: 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN', lifetimeAccess: boolean): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ email, role, lifetimeAccess }),
      });
      return res.ok;
    } catch (err) {
      console.error('Error updating user role:', err);
      return false;
    }
  }

  /**
   * Fetch all payments and orders
   */
  public async fetchPayments(): Promise<AdminPaymentRecord[]> {
    try {
      const res = await fetch('/api/admin/payments', {
        headers: authService.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Impossible de charger les paiements');
      const data = await res.json();
      return data.orders || [];
    } catch (err) {
      console.error('Error fetching admin payments:', err);
      return [];
    }
  }

  /**
   * Fetch all notifications
   */
  public async fetchNotifications(): Promise<AdminNotificationRecord[]> {
    try {
      const res = await fetch('/api/admin/notifications', {
        headers: authService.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Impossible de charger les notifications');
      const data = await res.json();
      return data.notifications || [];
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  }

  /**
   * Create notification
   */
  public async createNotification(data: {
    title: string;
    message: string;
    type?: 'info' | 'advice' | 'alert' | 'update';
    targetAudience?: 'all' | 'free' | 'premium';
    sendNow?: boolean;
  }): Promise<AdminNotificationRecord | null> {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur lors de la création de la notification');
      const result = await res.json();
      return result.notification || null;
    } catch (err) {
      console.error('Error creating notification:', err);
      return null;
    }
  }

  /**
   * Update notification
   */
  public async updateNotification(id: string, updates: Partial<AdminNotificationRecord>): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      return res.ok;
    } catch (err) {
      console.error('Error updating notification:', err);
      return false;
    }
  }

  /**
   * Send notification now
   */
  public async sendNotification(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/notifications/${id}/send`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.error('Error sending notification:', err);
      return false;
    }
  }

  /**
   * Delete notification
   */
  public async deleteNotification(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.error('Error deleting notification:', err);
      return false;
    }
  }

  /**
   * Fetch Knowledge Base items
   */
  public async fetchKnowledgeBase(): Promise<AdminKnowledgeItem[]> {
    try {
      const res = await fetch('/api/admin/knowledge-base', {
        headers: authService.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Impossible de charger la base de connaissances');
      const data = await res.json();
      return data.knowledge || [];
    } catch (err) {
      console.error('Error fetching knowledge base:', err);
      return [];
    }
  }

  /**
   * Save Knowledge Base item
   */
  public async saveKnowledgeItem(item: Partial<AdminKnowledgeItem>): Promise<AdminKnowledgeItem | null> {
    try {
      const res = await fetch('/api/admin/knowledge-base', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Erreur lors de l’enregistrement');
      const data = await res.json();
      return data.item || null;
    } catch (err) {
      console.error('Error saving knowledge item:', err);
      return null;
    }
  }

  /**
   * Delete Knowledge Base item
   */
  public async deleteKnowledgeItem(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/knowledge-base/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.error('Error deleting knowledge item:', err);
      return false;
    }
  }
}

export const adminManagementService = new AdminManagementService();
