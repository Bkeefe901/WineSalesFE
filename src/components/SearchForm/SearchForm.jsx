import style from "./SearchForm.module.css";

export default function SearchForm({ setSearch, search, setShowSearch }) {

  function handleClick(){
    setShowSearch((prev) => !prev);
  }

  function handleChange(e) {
    setSearch({ ...search, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSearch({startDate: "", endDate: "", account: "", invoiceId: ""});
  }

  return (
    <div className={style.searchContainer}>
      <form className={style.searchForm} onSubmit={handleSubmit}>
        <div>
        <button className={style.hideButton} onClick={handleClick}>Hide Filters</button>
        <h1>Filter Form</h1>
        </div>
        <label>
          Start Date
          <input type="date" onChange={handleChange} name="startDate" value={search.startDate}/>
        </label>
        <label>
          End Date
          <input type="date" onChange={handleChange} name="endDate" value={search.endDate}/>
        </label>
        <label>
          Account Name
          <input type="text" onChange={handleChange} name="account" value={search.account}/>
        </label>
        <label>
          Invoice Number
          <input type="text" onChange={handleChange} name="invoiceId" value={search.invoiceId}/>
        </label>
        <input type="submit" value="Clear Filters" />
      </form>
      
    </div>
  );
}
