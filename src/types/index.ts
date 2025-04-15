
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, we would never store plain text passwords
  role: UserRole;
}

export type TableLocation = 'Garden' | 'AC Room' | 'Balcony' | 'Pond' | 'Terrace' | 'Parcel';
export type TableStatus = 'Free' | 'Occupied';

export interface Table {
  id: string;
  number: number;
  location: TableLocation;
  status: TableStatus;
}

export interface Juice {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export type OrderStatus = 'Pending' | 'Ready' | 'Served' | 'Cancelled';

export interface OrderItem {
  juiceId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
