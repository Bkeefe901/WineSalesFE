import { useState, useRef } from "react";
import { useAuth } from "../../context/authContext/authContext";
import { useUser } from "../../context/userContext/userContext";
import apiService from "../../utilities/apiService.mjs";
import style from "./InvoiceDrop.module.css";

const today = new Date().toISOString().split("T")[0];

function normalize(invoice, userId) {
  return {
    user: userId,
    invoiceId: invoice.invoiceId ?? "",
    saleDate: invoice.saleDate ?? today,
    shopName: invoice.shopName ?? "",
    total: invoice.total ?? 0,
  };
}

export default function InvoiceDrop({ setList, setShowDrop }) {
  const { cookies } = useAuth();
  const { user } = useUser();
  const fileInputRef = useRef(null);

  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedSales, setParsedSales] = useState(null); // array or null

  async function processFile(file) {
    if (!file || file.type !== "application/pdf") {
      setError("Please provide a PDF file.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await apiService.parseInvoice(file, cookies.token);
      const arr = Array.isArray(data) ? data : [data];
      if (arr.length === 0) {
        setError("No TK invoices found in this PDF.");
        return;
      }
      setParsedSales(arr.map((inv) => normalize(inv, user._id)));
    } catch (err) {
      setError("Failed to parse invoice. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  function handleChange(index, e) {
    setParsedSales((prev) =>
      prev.map((sale, i) =>
        i === index ? { ...sale, [e.target.name]: e.target.value } : sale
      )
    );
  }

  function handleRemove(index) {
    setParsedSales((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSaveAll(e) {
    e.preventDefault();
    const results = await Promise.allSettled(
      parsedSales.map((sale) => apiService.createSale(sale, cookies.token))
    );

    const failed = [];
    let anySucceeded = false;

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        anySucceeded = true;
      } else {
        const msg = result.reason?.response?.data?.msg ?? "Failed to save.";
        failed.push({ ...parsedSales[i], _error: msg });
      }
    });

    if (failed.length === 0) {
      setList((prev) => !prev);
      setShowDrop(false);
    } else {
      if (anySucceeded) setList((prev) => !prev);
      setParsedSales(failed);
    }
  }

  return (
    <div className={style.wrapper}>
      {/* Drop Zone */}
      <div
        className={`${style.dropZone} ${dragOver ? style.dragOver : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className={style.hiddenInput}
          onChange={(e) => processFile(e.target.files[0])}
        />
        {loading ? (
          <p>Parsing invoices...</p>
        ) : (
          <>
            <p className={style.dropText}>Drop a PDF invoice here</p>
            <p className={style.dropSubText}>or click to browse</p>
          </>
        )}
        {error && <p className={style.error}>{error}</p>}
      </div>

      {/* Confirmation Modal */}
      {parsedSales && (
        <div className={style.overlay}>
          <div className={style.modal}>
            <div className={style.modalHeader}>
              <h2>Confirm Sales ({parsedSales.length})</h2>
            </div>
            <form onSubmit={handleSaveAll}>
              <div className={style.invoiceList}>
                {parsedSales.map((sale, i) => (
                  <div key={i} className={`${style.invoiceRow} ${sale._error ? style.invoiceRowError : ""}`}>
                    <span className={style.invoiceIndex}>#{i + 1}</span>
                    <label>
                      Invoice ID
                      <input
                        type="text"
                        name="invoiceId"
                        value={sale.invoiceId}
                        onChange={(e) => handleChange(i, e)}
                      />
                    </label>
                    <label>
                      Sale Date
                      <input
                        type="date"
                        name="saleDate"
                        value={sale.saleDate}
                        onChange={(e) => handleChange(i, e)}
                      />
                    </label>
                    <label>
                      Shop Name
                      <input
                        type="text"
                        name="shopName"
                        value={sale.shopName}
                        onChange={(e) => handleChange(i, e)}
                      />
                    </label>
                    <label>
                      Total
                      <input
                        type="number"
                        name="total"
                        value={sale.total}
                        onChange={(e) => handleChange(i, e)}
                      />
                    </label>
                    {sale._error && <p className={style.rowError}>{sale._error}</p>}
                    <button
                      type="button"
                      className={style.removeBtn}
                      onClick={() => handleRemove(i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              {error && <p className={style.error}>{error}</p>}
              <div className={style.modalActions}>
                <input
                  type="submit"
                  value={`Save All (${parsedSales.length})`}
                  disabled={parsedSales.length === 0}
                />
                <button type="button" onClick={() => setParsedSales(null)}>
                  Try Again
                </button>
                <button type="button" onClick={() => setShowDrop(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
