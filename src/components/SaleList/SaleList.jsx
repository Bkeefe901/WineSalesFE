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
    const [showSearch, setShowSearch] = useState(true);

    // Toggle to display InputForm
    const [showInput, setShowInput] = useState(true);

    function handleClick() {
        setShowSearch((prev) => !prev);
    }

    function handleInput() {
        setShowInput((prev) => !prev);
    }


    return (
        <div className={style.setListMain}>
            <section className={style.formContainer}>
            {showInput ? <InputForm setShowInput={setShowInput} setList={setList} /> : <button onClick={handleInput}>Show Search</button>}
            {showSearch ? <SearchForm setSearch={setSearch} search={search} setShowSearch={setShowSearch}/> : <button onClick={handleClick}>Show Filters</button>}
            </section>
            <section>
                <h1>Total of All Shown:</h1>
                <h3>{grandTotal.toFixed(2)}</h3>
                <h1>Commision:</h1>
                <h3>{(grandTotal * 0.03).toFixed(2)}</h3>
            </section>
            <ListCard setGrandTotal={setGrandTotal} saleData={saleData} setList={setList} search={search} />

        </div>
    )
}