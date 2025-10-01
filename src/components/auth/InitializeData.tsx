'use client';
import { useAuth } from "@/store/hooks";
import { useEffect } from "react"

const InitializeData = () => {
  const {  setAuthFromStorage } = useAuth()

  useEffect(()=>{
    setAuthFromStorage();
  },[])
  return (
    <div></div>
  )
}

export default InitializeData