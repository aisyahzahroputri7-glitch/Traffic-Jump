const BASE_URL = "http://localhost:3001/api";

export const getDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`);
  return res.json();
};

export const getPelanggaran = async () => {
  const res = await fetch(`${BASE_URL}/pelanggaran`);
  return res.json();
};
