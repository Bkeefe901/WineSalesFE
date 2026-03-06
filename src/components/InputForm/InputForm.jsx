import style from './InputForm.module.css';
import { useAuth } from "../../context/authContext/authContext";
import { useUser } from "../../context/userContext/userContext";
import { useState } from "react";
import axios from "axios";




export default function InputForm({ setList }) {
    const { user } = useUser();
    const { cookies } = useAuth();
    let token = cookies.token;
    let options = { headers: { "x-auth-token": token }};
    let today = new Date().toISOString().split('T')[0];
    
    const [ newSale, setNewSale ] = useState({
        user: user._id,
        invoiceId: "",
        saleDate: today,
        shopName: "",
        total: 0,
    });

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3000/api/sale`, newSale, options);
            setList((prev) => !prev);
            
        } catch (err) {
            console.error(err.message);
        }
    }

    async function handleChange(e) {
        setNewSale({ ...newSale, [e.target.name]: e.target.value});
    }

    return (
    <div className={style.saleInput}>
        <form className={style.inputForm} onSubmit={handleSubmit}>
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
                    type="text"
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
            <input type="submit" value="Add Sale" />
        </form>
    </div>
    )
}