import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface IUser {
  id: number;
  employee_id: string;
  username: string;
  last_login: string; // หรือใช้ Date ถ้า API ส่งมาเป็น timestamp
  fullName: string;
  department: string;
  position: string;
  line_group_id: string;
  dashboard_url: string
  name: string;
  company_id: string;
  imageUrl:string
}
interface ILocation {
  latitude:number
  longitude:number
}
interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser) => void;
  location:any;
  setLocation:(location:ILocation)=>void;
}


const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [location,setLocation] = useState<ILocation>();
  useEffect(()=>{
    const profile = localStorage.getItem('profile');
    if(profile){
        const userobj = JSON.parse(profile);
        setUser(userobj);
        if(!userobj?.member){
          navigate('/RegisterForm')
        }
    }else{
    }
  },[])
  return (
    <UserContext.Provider value={{ user, setUser,location,setLocation }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
