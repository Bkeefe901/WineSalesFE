import { useState } from "react";
import { useUser } from "../../context/userContext/userContext";
import { useAuth } from "../../context/authContext/authContext";
import { useEffect } from "react";
import apiService from "../../utilities/apiService.mjs";

//Components
import SaleList from "../../components/SaleList/SaleList";

export default function Dashboard() {
  const [saleData, setSaleData] = useState(null);
  const [list, setList] = useState(false); // toggle to update list (dependency in useEffect)
  const { user } = useUser();
  const { cookies } = useAuth();

  useEffect(() => {
    let isMounted = true;
    if (user) {
      async function fetchSales() {
        try {
          let data = await apiService.getSales(user._id, cookies.token);
          if (isMounted) setSaleData(data);
        } catch (err) {
          console.error(`❌ Error fetching sales: ${err.message}`);
        }
      }
      fetchSales();
    }

    return () => { isMounted = false; };
  }, [user, list]);


  return saleData 
    ? <SaleList saleData={saleData} setList={setList} /> 
    : <h1>Loading</h1>; 

}
