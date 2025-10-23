"use client";

import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { toast } from "sonner"; // or react-hot-toast
import { useAppDispatch } from "@/store/hooks";
import { usePathname } from "next/navigation";
import { fetchOrders } from "@/store/slices/orderSlice";

export default function OrderNotify() {

  const dispatch  = useAppDispatch();
  const pathname = usePathname()
  useEffect(() => {
    // Skip the initial snapshot so existing notifications don't fire on load
    const q = query(collection(db, "orders"), orderBy("dateTime", "desc"));
    let initialSnapshot = true;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // After the first snapshot, we flip the flag and ignore its 'added' events
      if (initialSnapshot) {
        initialSnapshot = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data() as { message?: string } | undefined;
          const message =  "You have a new order";
          toast.success(`🛒 ${message}`);
          if (pathname == '/orders') {
            dispatch(fetchOrders({page:1,  per_page:10 }) );
            
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return (
   <></>
  );
}
