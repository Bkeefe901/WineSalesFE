import axios from "axios";

const baseURL = "https://winesalesbe.onrender.com/api";

function authHeaders(token) {
  return { headers: { "x-auth-token": token } };
}

async function getUser(token) {
  let res = await axios.get(`${baseURL}/auth`, authHeaders(token));
  return res.data;
}

async function getSales(userId, token) {
  let res = await axios.get(`${baseURL}/sale/user/${userId}`, authHeaders(token));
  return res.data;
}

async function createSale(saleData, token) {
  let res = await axios.post(`${baseURL}/sale`, saleData, authHeaders(token));
  return res.data;
}

async function updateSale(saleId, saleData, token) {
  let res = await axios.put(`${baseURL}/sale/${saleId}`, saleData, authHeaders(token));
  return res.data;
}

async function deleteSale(saleId, userId, token) {
  let res = await axios.delete(`${baseURL}/sale/${saleId}`, {
    ...authHeaders(token),
    data: { id: userId },
  });
  return res.data;
}

export default { getUser, getSales, createSale, updateSale, deleteSale };
