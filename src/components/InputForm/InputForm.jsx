import style from "./InputForm.module.css";
import { useAuth } from "../../context/authContext/authContext";
import { useUser } from "../../context/userContext/userContext";
import { useState } from "react";
import apiService from "../../utilities/apiService.mjs";

export default function InputForm({ setList }) {
  const { user } = useUser();
  const { cookies } = useAuth();
  let today = new Date().toISOString().split("T")[0];

  const [error, setError] = useState(null);

  const [newSale, setNewSale] = useState({
    user: user._id,
    invoiceId: "",
    saleDate: today,
    shopName: "",
    total: 0,
  });

  const [showToast, setShowToast] = useState(false);

  function showSnackBar() {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError(null);
      await apiService.createSale(newSale, cookies.token);
      setList((prev) => !prev);
      setNewSale({
        user: user._id,
        invoiceId: "",
        saleDate: today,
        shopName: "",
        total: 0,
      });
      showSnackBar();
    } catch (err) {
      setError(
        err.response?.data?.msg ?? "Failed to add sale. Please try again.",
      );
      console.error(err.message);
    }
  }

  function handleChange(e) {
    setNewSale({ ...newSale, [e.target.name]: e.target.value });
  }

  return (
    <div className={style.saleInput}>
      <form className={style.inputForm} onSubmit={handleSubmit}>
        <div>
          <h1>Sale Input</h1>
        </div>
        <label>
          Invoice Id
          <input
            type="text"
            name="invoiceId"
            value={newSale.invoiceId}
            onChange={handleChange}
          />
        </label>
        <label>
          Sale Date
          <input
            type="date"
            name="saleDate"
            value={newSale.saleDate}
            onChange={handleChange}
          />
        </label>
        <label>
          Shop Name
          <input
            type="text"
            name="shopName"
            value={newSale.shopName}
            onChange={handleChange}
          />
        </label>
        <label>
          Total
          <input
            type="number"
            name="total"
            value={newSale.total}
            onChange={handleChange}
          />
        </label>
        <input className={style.addSaleButton} type="submit" value="Add Sale" />
        {error && <p className={style.error}>{error}</p>}
      </form>
      <div className={showToast ? style.visible : style.invisible}>
        <h1>Sale Has been added to database</h1>
      </div>
    </div>
  );
}
