import style from './Dashboard.module.css';
import { useState } from "react";
import { useUser } from "../../context/userContext/userContext";
import { useAuth } from "../../context/authContext/authContext";
import { useEffect } from "react";
import axios from "axios";

//Components
import SaleList from "../../components/SaleList/SaleList";

export default function Dashboard() {
  const [saleData, setSaleData] = useState(null);
  const [list, setList] = useState(false); // toggle to update list (dependency in useEffect)
  const { user } = useUser();
  const { cookies } = useAuth();
  const connStr = `http://localhost:3000/api`;

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    let token = cookies.token;
    let options = { headers: { "x-auth-token": token }};
    if (user) {
      async function getSales() {
        try {
          let res = await axios.get(`${connStr}/sale/user/${user._id}`, { ...options, signal: controller.signal });

          if (isMounted) {
            setSaleData(res.data);
          }
          
        } catch (err) {
            console.error(`❌ Error fetching sales: ${err.message}`);
        }
      }
      getSales();
    };

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [user, list]);

  function Loaded() {
    return <SaleList saleData={saleData} setList={setList} />
  }

  function Loading() {
    return <h1>Loading</h1>
  }

  return saleData ? <Loaded /> : <Loading />; 

}
