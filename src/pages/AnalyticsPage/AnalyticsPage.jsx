import { useState, useEffect } from "react";
import { useUser } from "../../context/userContext/userContext";
import { useAuth } from "../../context/authContext/authContext";
import apiService from "../../utilities/apiService.mjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import style from "./AnalyticsPage.module.css";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function buildMonthlyTotals(sales, year) {
  const totals = new Array(12).fill(0);
  sales.forEach((sale) => {
    const date = new Date(sale.saleDate);
    if (date.getFullYear() === year) {
      totals[date.getMonth()] += sale.total;
    }
  });
  return totals;
}

export default function AnalyticsPage() {
  const { user } = useUser();
  const { cookies } = useAuth();
  const [saleData, setSaleData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSales() {
      try {
        setLoading(true);
        const data = await apiService.getSales(user._id, cookies.token);
        setSaleData(data);

        // Default to the most recent year that has data
        const years = [
          ...new Set(data.map((s) => new Date(s.saleDate).getFullYear())),
        ].sort((a, b) => b - a);
        if (years.length > 0) setSelectedYear(years[0]);
      } catch (err) {
        setError("Failed to load sales data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user?._id) fetchSales();
  }, [user, cookies.token]);

  const years = [
    ...new Set(saleData.map((s) => new Date(s.saleDate).getFullYear())),
  ].sort((a, b) => b - a);

  const currentTotals = buildMonthlyTotals(saleData, selectedYear);
  const previousTotals = buildMonthlyTotals(saleData, selectedYear - 1);

  const chartData = MONTHS.map((month, i) => ({
    month,
    [selectedYear]: parseFloat(currentTotals[i].toFixed(2)),
    [selectedYear - 1]: parseFloat(previousTotals[i].toFixed(2)),
  }));

  return (
    <div className={style.container}>
      <h2 className={style.title}>Sales Analytics</h2>

      <div className={style.controls}>
        <label htmlFor="yearSelect">Year</label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className={style.select}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className={style.message}>Loading...</p>}
      {error && <p className={style.message}>{error}</p>}

      {!loading && !error && (
        <ResponsiveContainer width="100%" height={420}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5a7a" />
            <XAxis
              dataKey="month"
              stroke="#fffcfa"
              tick={{ fill: "#fffcfa" }}
            />
            <YAxis
              stroke="#fffcfa"
              tick={{ fill: "#fffcfa" }}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2c3954",
                border: "1px solid #bb9457",
                color: "#fffcfa",
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
            />
            <Legend wrapperStyle={{ color: "#fffcfa" }} />
            <Line
              type="monotone"
              dataKey={String(selectedYear)}
              stroke="white"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey={String(selectedYear - 1)}
              stroke="orange"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
