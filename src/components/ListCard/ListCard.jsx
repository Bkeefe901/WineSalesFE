import style from './ListCard.module.css';
import axios from 'axios';
import { useUser } from '../../context/userContext/userContext';
import { useAuth } from '../../context/authContext/authContext';
import { useState } from 'react';



export default function ListCard({ setList, saleData }) {
    const { user } = useUser();
    const { cookies } = useAuth();
    let token = cookies.token;
    let options = { headers: { "x-auth-token": token }};

    async function handleClick(obj) {

        const saleObj = {
            user: user._id,
            invoiceId: obj.invoiceId,
            saleDate: obj.saleDate,
            shopName: obj.shopName,
            total: obj.total,
        }
        try {
            await axios.put(`http://localhost:3000/api/sale/${obj._id}`, saleObj, options);
            alert(`✅ Sale has succesfully been updated`);
            
        } catch (err) {
            console.error(err.message);
            alert(`❌ Error - sale failed to update`);
        }
        
    }

    async function handleDelete(obj) {
        const config = { ...options, data: { id: user._id }};
        const userConfirmed = confirm("Are you sure you want to delete this sale from the database?");

        if(userConfirmed){
            try {
                console.log(obj._id);
                await axios.delete(`http://localhost:3000/api/sale/${obj._id}`, config);
                alert(`✅ Sale has been deleted from database!`);
                setList((prev) => !prev); // refreshes sale list
                
            } catch (err) {
                console.error(err.message);
                alert(`❌ The sale did not succesfully get removed from the database. Try again.`)
            }
        }
    }

    const saleInfo = saleData.map((obj, i) => {
        return (
            <article key={i} className={style.saleCard}>
                <h3>{obj.invoiceId}</h3>
                <h3>{obj.saleDate}</h3>
                <h3>{obj.shopName}</h3>
                <h3>{obj.total}</h3>
                <button onClick={() => handleClick(obj)}>Edit</button>
                <button onClick={() => handleDelete(obj)}>Delete</button>
            </article>
        )
    });

    return (
        <>
            <div className={style.cardList}>
                {saleInfo}
            </div>
        </>
    )


}