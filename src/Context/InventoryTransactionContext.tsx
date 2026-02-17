import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Swal from 'sweetalert2';
import callApi from '../Services/callApi';
import { number } from 'framer-motion';

export interface IInventoryTransactionOut {
  source_type:string 
  source_id:number
  item_id:number
  quantity:number
  unit:string
}

export interface IInventoryTransactionIn {
  source_type:string 
  source_id:number
  item_id:number
  quantity:number
  unit:string
}

export interface IItems  {
  category:string
  company_id:number
  description:string 
  id:number 
  name:string 
  price:number
  quantity:number 
  unit:string
}


export interface IInventoryTransactionContext {
  itemList:IItems[]
  onLoadItemList:()=>void;
  inventoryTransactionOutList:IInventoryTransactionOut[]
  // inventoryTransactionInList:IInventoryTransactionIn[]
  createInventoryTransactionOut:(data:IInventoryTransactionOut[])=>void;
}

const InventoryTransactionContext = createContext<IInventoryTransactionContext | undefined>(undefined);

export const InventoryTransactionProvider = ({ children }: { children: ReactNode }) => {
  const [itemList,setItemList] = useState<IItems[]>([]);
  const [inventoryTransactionOutList,setInventoryTransactionOutList] = useState<IInventoryTransactionOut[]>([]);
  const createInventoryTransactionOut = async (data:IInventoryTransactionOut[])=>{
    const rs = await callApi.post('',data);
    if(!rs?.data?.success){
      Swal.fire(`Create Inventory Transaction Out Faild. ${rs?.data?.message}`,`error`)
    }
  }

    const onLoadItemList = async () => {
        const res = await callApi('/item?type=list')
        if (res.data?.data) {
            setItemList(res.data.data)
        } else {
            Swal.fire('Error', res?.data?.message, 'error');
        }
    }

  return (
    <InventoryTransactionContext.Provider value={{ createInventoryTransactionOut,inventoryTransactionOutList,itemList,onLoadItemList }}>
      {children}
    </InventoryTransactionContext.Provider>
  );
};

export const useInventoryTransaction = (): IInventoryTransactionContext => {
  const context = useContext(InventoryTransactionContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
