
import { Product, Vendor, UserRole, Profile, Dispute, SafeSpot, Review } from './types';

export const CATEGORIES = ['Textbooks', 'Electronics', 'Dorm Decor', 'Fashion', 'Services', 'Other'];

export const SAFE_SPOTS: SafeSpot[] = [
  { id: 'ss1', name: 'Main Library Square', description: 'Under the clock tower. Highly visible.', coordinates: { lat: 0, lng: 0 } },
  { id: 'ss2', name: 'Student Union Hub', description: 'Near the campus bookstore entrance.', coordinates: { lat: 0, lng: 0 } },
  { id: 'ss3', name: 'Central Security Post', description: 'Recommended for high-value electronics.', coordinates: { lat: 0, lng: 0 } }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userId: 'u3',
    userName: 'Samuel Amartey',
    rating: 5,
    comment: 'The book was in perfect condition as described. Transaction was smooth!',
    createdAt: '2024-05-10T10:00:00Z'
  },
  {
    id: 'r2',
    productId: 'p1',
    userId: 'u4',
    userName: 'Jane Doe',
    rating: 4,
    comment: 'Good price, helpful for my class.',
    createdAt: '2024-05-11T14:30:00Z'
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'u1',
    vendorId: 'v1',
    email: 'alex@varsity.edu',
    role: UserRole.VENDOR,
    fullName: 'Alex Johnson',
    storeName: 'The Textbook Hub',
    description: 'Specializing in Engineering and STEM textbooks at half price.',
    logoUrl: 'https://images.unsplash.com/photo-1544716123-394322133140?w=100&h=100&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=300&fit=crop',
    isVerified: true,
    badges: ['Verified', 'Top Seller'],
    rating: 4.9,
    totalSales: 154,
    wallet: {
      pendingBalance: 450.00,
      availableBalance: 1200.50,
      totalWithdrawn: 200.00,
      transactions: [
        { id: 't1', date: '2024-05-10', amount: 45.00, type: 'Sale', status: 'Completed' },
        { id: 't2', date: '2024-05-12', amount: 200.00, type: 'Withdrawal', status: 'Completed' }
      ]
    }
  },
  {
    id: 'u2',
    vendorId: 'v2',
    email: 'sarah@campus.edu',
    role: UserRole.VENDOR,
    fullName: 'Sarah Chen',
    storeName: 'Sarah\'s Tech & Gear',
    description: 'Certified student reseller for monitors and dorm electronics.',
    logoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=300&fit=crop',
    isVerified: false,
    badges: ['Fast Responder'],
    rating: 4.2,
    totalSales: 12,
    wallet: {
      pendingBalance: 120.00,
      availableBalance: 0.00,
      totalWithdrawn: 0.00,
      transactions: []
    }
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    vendorId: 'v1',
    name: 'Advanced Calculus (11th Ed)',
    description: 'Slightly used, no highlighting. Essential for MAT201.',
    price: 45.00,
    category: 'Textbooks',
    imageUrl: 'https://images.unsplash.com/photo-1543004471-2401c3e18a9a?w=600&h=600&fit=crop',
    stock: 2,
    rating: 5.0,
    condition: 'Used'
  },
  {
    id: 'p2',
    vendorId: 'v2',
    name: '27" Curved Gaming Monitor',
    description: 'Moving out sale! 144Hz, pristine condition.',
    price: 180.00,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
    stock: 1,
    rating: 4.5,
    condition: 'Like New'
  },
  {
    id: 'p3',
    vendorId: 'v1',
    name: 'Organic Chemistry Model Kit',
    description: 'Perfect for visualization. All pieces included.',
    price: 25.00,
    category: 'Other',
    imageUrl: 'https://images.unsplash.com/photo-1532187875605-2fe3587b1598?w=600&h=600&fit=crop',
    stock: 5,
    rating: 4.8,
    condition: 'New'
  },
  {
    id: 'p4',
    vendorId: 'v1',
    name: 'Physics I Peer Tutoring',
    description: '1-on-1 sessions for mid-term prep. A+ grade guaranteed.',
    price: 15.00,
    category: 'Services',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=600&fit=crop',
    stock: 1,
    rating: 5.0,
    condition: 'New',
    isService: true
  }
];

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'd1',
    orderId: 'ord-9921',
    customerId: 'cust-1',
    vendorId: 'v2',
    reason: 'Product received was damaged during shipping.',
    status: 'Open',
    createdAt: '2024-05-15'
  }
];

export const MOCK_ADMIN: Profile = {
  id: 'u0',
  email: 'admin@unimall.edu.gh',
  role: UserRole.ADMIN,
  fullName: 'Systems Administrator',
  avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=09090b&color=fff',
  status: 'Active'
};
