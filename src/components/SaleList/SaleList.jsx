import style from "./SaleList.module.css";
import { useState } from "react";

// Components
import InputForm from "../../components/InputForm/InputForm";
import ListCard from "../ListCard/ListCard";
import SearchForm from "../SearchForm/SearchForm";
import InvoiceDrop from "../InvoiceDrop/InvoiceDrop";

export default function SaleList({ setList, saleData }) {
  const [search, setSearch] = useState({
    startDate: "",
    endDate: "",
    account: "",
    invoiceId: "",
  });

  // Total for all shown Sales
  const [grandTotal, setGrandTotal] = useState(0);

  // Toggle to displays
  const [toggle, setToggle] = useState(true);

  // Toggle to display InvoiceDrop
  const [showDrop, setShowDrop] = useState(false);

  function handleFormToggle(e) {
    setToggle((prev) => !prev);
  }

  return (
    <div className={style.setListMain}>
      {/* Print-only header — hidden in the browser, shown when printing.
                Displays report title, any active filters, and the totals summary
                so the printed page has context without the interactive form UI. */}
      <div className={style.printHeader}>
        <h2>Sales Report</h2>
        {/* Only render filter details if at least one filter is active */}
        {(search.startDate ||
          search.endDate ||
          search.account ||
          search.invoiceId) && (
          <p className={style.printFilters}>
            {search.startDate && <span>From: {search.startDate} </span>}
            {search.endDate && <span>To: {search.endDate} </span>}
            {search.account && <span>Account: {search.account} </span>}
            {search.invoiceId && <span>Invoice: {search.invoiceId}</span>}
          </p>
        )}
        <p>
          <strong>Total:</strong> ${grandTotal.toFixed(2)}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>Commission (3%):</strong> ${(grandTotal * 0.03).toFixed(2)}
        </p>
      </div>

      <section className={style.formContainer}>
        {/* {showInput ? <InputForm setShowInput={setShowInput} setList={setList} /> : <button onClick={handleInput}>Show Search</button>}
            {showSearch ? <SearchForm setSearch={setSearch} search={search} setShowSearch={setShowSearch}/> : <button onClick={handleClick}>Show Filters</button>} */}
        <div className={style.saleInput}>
          <button className={style.formToggle} onClick={handleFormToggle}>
            Toggle Input/Filter Form
          </button>
          {toggle ? (
            <InputForm setList={setList} />
          ) : (
            <SearchForm setSearch={setSearch} search={search} />
          )}
        </div>
      </section>
      <div className={style.uploadRow}>
        {showDrop ? (
          <InvoiceDrop setList={setList} setShowDrop={setShowDrop} />
        ) : (
          <button className={style.pdfButton} onClick={() => setShowDrop(true)}>
            Upload Invoice PDF
          </button>
        )}
      </div>
      <section className={style.totals}>
        <div>
          <h1>Total of All Shown:</h1>
          <h3>{grandTotal.toFixed(2)}</h3>
        </div>
        <div>
          <h1>Commision:</h1>
          <h3>{(grandTotal * 0.03).toFixed(2)}</h3>
        </div>
      </section>

      {/* Print button — triggers the browser's native print/save-as-PDF dialog.
                Hidden automatically via @media print so it won't appear in the output. */}
      <button className={style.printButton} onClick={() => window.print()}>
        Print / Save as PDF
      </button>

      <ListCard
        setGrandTotal={setGrandTotal}
        saleData={saleData}
        setList={setList}
        search={search}
      />
    </div>
  );
}
