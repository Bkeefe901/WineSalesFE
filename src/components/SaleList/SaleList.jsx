import style from './SaleList.module.css';
import { useState } from 'react';


// Components
import InputForm from '../../components/InputForm/InputForm';
import ListCard from '../ListCard/ListCard';
import SearchForm from '../SearchForm/SearchForm';

export default function SaleList({ setList, saleData }) {
    const [search, setSearch] = useState({ startDate: "", endDate: "", account: "", invoiceId: ""});


    return (
        <div className={style.setListMain}>
            <InputForm setList={setList} />
            <SearchForm setSearch={setSearch} search={search} />
            <ListCard saleData={saleData} setList={setList} search={search} />

        </div>
    )
}