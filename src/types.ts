
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN'
}

export enum View {
  HOME = 'HOME',
  MARKETPLACE = 'MARKETPLACE',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  VENDOR_STORE = 'VENDOR_STORE',
  CART = 'CART',
  DASHBOARD = 'DASHBOARD',
  ADMIN_PANEL = 'ADMIN_PANEL',
  WALLET = 'WALLET',
  DISPUTES = 'DISPUTES',
  AUDIT_LOG = 'AUDIT_LOG',
  CHAT = 'CHAT',
  AUTH = 'AUTH',
  CHECKOUT = 'CHECKOUT',
  VENDOR_ONBOARDING = 'VENDOR_ONBOARDING'
}

export type TrustBadge = 'Verified' | 'Top Seller' | 'Campus Trusted' | 'Fast Responder' | 'Elite Seller';

export interface AppNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'alert';
  message: string;
  timestamp: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface VendorApplication {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  storeName: string;
  appliedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  documentUrl?: string;
  idNumber?: string;
}

export interface P2PMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
}

export interface ChatThread {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  messages: P2PMessage[];
}

export interface SafeSpot {
  id: string;
  name: string;
  description: string;
  coordinates: { lat: number, lng: number };
}

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
  university?: string;
  campusId?: string;
  status?: 'Active' | 'Suspended';
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'Sale' | 'Withdrawal' | 'Refund';
  status: 'Pending' | 'Completed' | 'Rejected';
  method?: string;
}

export interface VendorWallet {
  pendingBalance: number;
  availableBalance: number;
  totalWithdrawn: number;
  transactions: Transaction[];
}

export interface Vendor extends Profile {
  vendorId: string;
  storeName: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  isVerified: boolean;
  badges: TrustBadge[];
  rating: number;
  totalSales: number;
  wallet: VendorWallet;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: 'Textbooks' | 'Electronics' | 'Dorm Decor' | 'Fashion' | 'Services' | 'Other';
  imageUrl: string;
  stock: number;
  rating: number;
  condition: 'New' | 'Like New' | 'Used';
  isService?: boolean;
  status?: 'Active' | 'Flagged' | 'Sold Out';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}


// Added missing Dispute interface for transaction resolution
export interface Dispute {
  id: string;
  orderId: string;
  customerId: string;
  vendorId: string;
  reason: string;
  status: 'Open' | 'Resolved' | 'Closed' | string;
  createdAt: string;
}

// Added missing CartItem interface for bag state management
export interface CartItem extends Product {
  quantity: number;
}

// Added missing AuditEntry interface for platform logging
export interface AuditEntry {
  id: string;
  timestamp: string;
  adminId: string;
  action: string;
  details: string;
  severity: 'Low' | 'Medium' | 'High';
}
