import style from "./EditRow.module.css";
import { useAuth } from "../../context/authContext/authContext";
import axios from "axios";

export default function EditRow({ edit, setEdit, setList }) {
  const { cookies } = useAuth();
  let token = cookies.token;
  let options = { headers: { "x-auth-token": token } };
  let date = new Date(edit.saleDate).toISOString().split('T')[0];


  function handleChange(e) {
    setEdit({ ...edit, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      let updatedSale = {
        invoiceId: edit.invoiceId,
        saleDate: edit.saleDate,
        shopName: edit.shopName,
        total: edit.total,
      }

      await axios.put(`https://winesalesbe.onrender.com/api/sale/${edit.id}`, updatedSale, options)
      setList((prev) => !prev);
      setEdit({ ...edit, on: false });
    } catch (err){ 
      console.error(err.message);
      res.status(400).json({ msg: `❌ Sale was not updated, try again.`})
    }
  }



  return (
    <article className={style.saleCard}>
      <input 
        type="text"
        name="invoiceId"
        value={edit.invoiceId}
        onChange={handleChange} 
        />
      <input 
        type="date"
        name="saleDate"
        value={date}
        onChange={handleChange} 
        />
      <input 
        type="text"
        name="shopName"
        value={edit.shopName}
        onChange={handleChange} 
        />
      <input 
        type="number"
        name="total"
        value={edit.total}
        onChange={handleChange} 
        />
      <button className={style.btn} onClick={handleSave}>Save</button>
    </article>
  );
}
