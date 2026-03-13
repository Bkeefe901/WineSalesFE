import style from "./EditRow.module.css";
import { useAuth } from "../../context/authContext/authContext";
import apiService from "../../utilities/apiService.mjs";

export default function EditRow({ edit, setEdit, setList }) {
  const { cookies } = useAuth();
  let date = new Date(edit.saleDate).toISOString().split("T")[0];

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
      };

      await apiService.updateSale(edit.id, updatedSale, cookies.token);
      setList((prev) => !prev);
      setEdit({ ...edit, on: false });
    } catch (err) {
      console.error(err.message);
      alert(`❌ Sale was not updated, try again.`);
    }
  }

  return (
    <tr key={edit.id} className={style.tr}>
      <td>
        <input
          type="text"
          name="invoiceId"
          value={edit.invoiceId}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="date"
          name="saleDate"
          value={date}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="text"
          name="shopName"
          value={edit.shopName}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="number"
          name="total"
          value={edit.total}
          onChange={handleChange}
        />
      </td>
      <td>
        <button className={style.btn} onClick={handleSave}>
          Save
        </button>
      </td>
    </tr>
  );
}
