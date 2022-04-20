import { createContext, useContext } from "react";
import activityStore from "./activityStore";

interface Store {
    activtystore : activityStore
}

export const store : Store =  {
    activtystore : new activityStore()
}

export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}