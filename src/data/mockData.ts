
import { Juice, Table, User } from '@/types';

// Mock users data
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // Never store plain passwords in a real app
    role: 'admin'
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    role: 'user'
  }
];

// Mock juices data
export const juices: Juice[] = [
  {
    id: '1',
    name: 'Orange Juice',
    price: 80,
    image: '/juice-orange.png'
  },
  {
    id: '2',
    name: 'Apple Juice',
    price: 90,
    image: '/juice-apple.png'
  },
  {
    id: '3',
    name: 'Mango Juice',
    price: 100,
    image: '/juice-mango.png'
  },
  {
    id: '4',
    name: 'Pineapple Juice',
    price: 95,
    image: '/juice-pineapple.png'
  },
  {
    id: '5',
    name: 'Watermelon Juice',
    price: 85,
    image: '/juice-watermelon.png'
  },
  {
    id: '6',
    name: 'Mixed Fruit Juice',
    price: 120,
    image: '/juice-mixed.png'
  },
  {
    id: '7',
    name: 'Grape Juice',
    price: 90,
    image: '/juice-grape.png'
  },
  {
    id: '8',
    name: 'Strawberry Juice',
    price: 110,
    image: '/juice-strawberry.png'
  }
];

// Generate mock tables data
export const generateTables = (): Table[] => {
  const locations: Array<Table['location']> = ['Garden', 'AC Room', 'Balcony', 'Pond', 'Terrace', 'Parcel'];
  const tables: Table[] = [];
  
  locations.forEach(location => {
    for (let i = 1; i <= 10; i++) {
      tables.push({
        id: `${location.toLowerCase().replace(' ', '-')}-${i}`,
        number: i,
        location,
        status: 'Free'
      });
    }
  });
  
  return tables;
};

export const tables = generateTables();
