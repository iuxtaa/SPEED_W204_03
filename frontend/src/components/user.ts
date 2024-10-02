// src/types/User.ts


export type User = {
    _id?: string;            
    firstName: string;       
    lastName: string;       
    username: string;        
    email: string;           
    password: string;        
    confirmPassword?: string; 
    
  };
  
  export const DefaultEmptyUser: User = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
   
  };
  