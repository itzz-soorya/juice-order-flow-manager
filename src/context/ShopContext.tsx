
import { createContext, useState, useContext, ReactNode } from 'react';
import { Table, Juice, Order, OrderItem, OrderStatus } from '@/types';
import { tables as initialTables, juices as initialJuices } from '@/data/mockData';

interface ShopContextType {
  tables: Table[];
  juices: Juice[];
  orders: Order[];
  currentOrder: Order | null;
  setTableStatus: (tableId: string, status: Table['status']) => void;
  createOrder: (tableId: string) => void;
  addItemToOrder: (juiceId: string, quantity: number) => void;
  removeItemFromOrder: (juiceId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  completeOrder: () => void;
  cancelOrder: () => void;
  addJuice: (juice: Omit<Juice, 'id'>) => void;
  updateJuice: (id: string, juice: Partial<Juice>) => void;
  deleteJuice: (id: string) => void;
  selectedTable: Table | null;
  selectTable: (tableId: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [juices, setJuices] = useState<Juice[]>(initialJuices);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const setTableStatus = (tableId: string, status: Table['status']) => {
    setTables(
      tables.map((table) =>
        table.id === tableId ? { ...table, status } : table
      )
    );
  };

  const selectTable = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId) || null;
    setSelectedTable(table);
    
    // Check if there's already a pending order for this table
    const existingOrder = orders.find(
      (o) => o.tableId === tableId && o.status === 'Pending'
    );
    
    if (existingOrder) {
      setCurrentOrder(existingOrder);
    } else {
      setCurrentOrder(null);
    }
  };

  const createOrder = (tableId: string) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      tableId,
      items: [],
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrentOrder(newOrder);
    setOrders([...orders, newOrder]);
    setTableStatus(tableId, 'Occupied');
  };

  const addItemToOrder = (juiceId: string, quantity: number) => {
    if (!currentOrder) return;

    const juice = juices.find((j) => j.id === juiceId);
    if (!juice) return;

    const updatedItems = [...currentOrder.items];
    const existingItemIndex = updatedItems.findIndex(
      (item) => item.juiceId === juiceId
    );

    if (existingItemIndex !== -1) {
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      updatedItems.push({
        juiceId,
        quantity,
        price: juice.price,
      });
    }

    const updatedOrder = {
      ...currentOrder,
      items: updatedItems,
      updatedAt: new Date(),
    };

    setCurrentOrder(updatedOrder);
    setOrders(
      orders.map((o) => (o.id === currentOrder.id ? updatedOrder : o))
    );
  };

  const removeItemFromOrder = (juiceId: string) => {
    if (!currentOrder) return;

    const updatedItems = currentOrder.items.filter(
      (item) => item.juiceId !== juiceId
    );

    const updatedOrder = {
      ...currentOrder,
      items: updatedItems,
      updatedAt: new Date(),
    };

    setCurrentOrder(updatedOrder);
    setOrders(
      orders.map((o) => (o.id === currentOrder.id ? updatedOrder : o))
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date() }
        : order
    );
    setOrders(updatedOrders);

    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({ ...currentOrder, status, updatedAt: new Date() });
    }
  };

  const completeOrder = () => {
    if (!currentOrder) return;
    updateOrderStatus(currentOrder.id, 'Served');
    setCurrentOrder(null);
  };

  const cancelOrder = () => {
    if (!currentOrder) return;
    updateOrderStatus(currentOrder.id, 'Cancelled');
    
    // Free up the table
    if (currentOrder.tableId) {
      setTableStatus(currentOrder.tableId, 'Free');
    }
    
    setCurrentOrder(null);
  };

  const addJuice = (juice: Omit<Juice, 'id'>) => {
    const newJuice = {
      ...juice,
      id: Date.now().toString(),
    };
    setJuices([...juices, newJuice]);
  };

  const updateJuice = (id: string, juiceUpdate: Partial<Juice>) => {
    setJuices(
      juices.map((juice) =>
        juice.id === id ? { ...juice, ...juiceUpdate } : juice
      )
    );
  };

  const deleteJuice = (id: string) => {
    setJuices(juices.filter((juice) => juice.id !== id));
  };

  return (
    <ShopContext.Provider
      value={{
        tables,
        juices,
        orders,
        currentOrder,
        setTableStatus,
        createOrder,
        addItemToOrder,
        removeItemFromOrder,
        updateOrderStatus,
        completeOrder,
        cancelOrder,
        addJuice,
        updateJuice,
        deleteJuice,
        selectedTable,
        selectTable,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
