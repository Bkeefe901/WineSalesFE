import style from "./ListCard.module.css";
import axios from "axios";
import { useUser } from "../../context/userContext/userContext";
import { useAuth } from "../../context/authContext/authContext";
import { useState } from "react";

// Components
import EditRow from "../EditRow/EditRow";

export default function ListCard({ setGrandTotal, setList, saleData, search }) {
  const [edit, setEdit] = useState({
    on: false,
    id: "",
    saleDate: "",
    shopName: "",
    total: 0,
  }); // *****************************************
  const { user } = useUser();
  const { cookies } = useAuth();
  let token = cookies.token;
  let options = { headers: { "x-auth-token": token } };

  async function handleEdit(obj) {
    setEdit({
      ...edit,
      on: true,
      id: obj._id,
      invoiceId: obj.invoiceId,
      shopName: obj.shopName,
      saleDate: obj.saleDate,
      total: obj.total,
    });
  }



  async function handleDelete(obj) {
    const config = { ...options, data: { id: user._id } };
    const userConfirmed = confirm(
      "Are you sure you want to delete this sale from the database?",
    );

    if (userConfirmed) {
      try {
        console.log(obj._id);
        await axios.delete(`https://winesalesbe.onrender.com/api/sale/${obj._id}`, config);
        alert(`✅ Sale has been deleted from database!`);
        setList((prev) => !prev); // refreshes sale list
      } catch (err) {
        console.error(err.message);
        alert(
          `❌ The sale did not succesfully get removed from the database. Try again.`,
        );
      }
    }
  }

  // Filter All Sales fetched for user by params in search form
  const filteredData = saleData.filter((sale) => {
    let date = sale.saleDate.split('T')[0];

    if(search.startDate !== "" && date < search.startDate){
        return false;
    }
    if(search.endDate !== "" && date > search.endDate){
        return false;
    }
    if(search.account !== "" && !(sale.shopName.includes(search.account))){
        return false;
    }
    if(search.invoiceId !== "" && !(sale.invoiceId.includes(search.invoiceId))){
        return false;
    }

    return true;

  });

  // Create total variable to show total of all filtered objects
  let filteredTotal = 0;

  filteredData.forEach((sale) => {
    filteredTotal += sale.total;
  });

  setGrandTotal(filteredTotal);



  filteredData.sort((a, b) => b.saleDate - a.saleDate);


  const saleInfo = filteredData.map((obj, i) => {

  
    let date = obj.saleDate.split("T")[0];
    return edit.on && edit.id == obj._id ? (
      <EditRow setList={setList} edit={edit} setEdit={setEdit} />
    ) : (
      <tr key={i}>
        <td>{obj.invoiceId}</td>
        <td>{date}</td>
        <td>{obj.shopName}</td>
        <td>{obj.total}</td>
        <td><button className={style.btn} onClick={() => handleEdit(obj)}>Edit</button></td>
        <td><button className={style.btn} onClick={() => handleDelete(obj)}>Delete</button></td>
      </tr>
    );
  });

  return (
    <>
      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Account</th>
              <th>Total</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {saleInfo}
          </tbody>
        </table>
        {/* <article className={style.saleCard}>
          <h3>Invoice ID</h3>
          <h3>Date</h3>
          <h3>Account</h3>
          <h3>Total</h3>
          <h3>Edit</h3>
          <h3>Delete</h3>
        </article>
        {saleInfo} */}
      </div>
    </>
  );
}
