import style from './SaleList.module.css';
import { useState } from 'react';


// Components
import InputForm from '../../components/InputForm/InputForm';
import ListCard from '../ListCard/ListCard';
import SearchForm from '../SearchForm/SearchForm';

export default function SaleList({ setList, saleData }) {
    const [search, setSearch] = useState({ startDate: "", endDate: "", account: "", invoiceId: ""});

    // Total for all shown Sales
    const [grandTotal, setGrandTotal] = useState(0);
    
    // Toggle to display SearchForm
    const [showSearch, setShowSearch] = useState(false);

    function handleClick(){
        setShowSearch((prev) => !prev);
    }


    return (
        <div className={style.setListMain}>
            <InputForm setList={setList} />
            {showSearch ? <SearchForm setSearch={setSearch} search={search} setShowSearch={setShowSearch}/> : <button onClick={handleClick}>Show Filters</button>}
            <section>
                <h1>Total of All Shown:</h1>
                <h3>{grandTotal}</h3>
                <h1>Commision:</h1>
                <h3>{(grandTotal * 0.03).toFixed(2)}</h3>
            </section>
            <ListCard setGrandTotal={setGrandTotal} saleData={saleData} setList={setList} search={search} />

        </div>
    )
}