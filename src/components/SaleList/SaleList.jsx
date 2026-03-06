import style from './SaleList.module.css';
import ListCard from '../ListCard/ListCard';

// Components
import InputForm from '../../components/InputForm/InputForm';

export default function SaleList({ setList, saleData }) {

    return (
        <div className={style.setListMain}>
            <InputForm setList={setList} />
            <ListCard saleData={saleData} setList={setList} />

        </div>
    )
}