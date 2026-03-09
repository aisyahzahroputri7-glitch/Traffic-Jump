const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = require("./db");

// Test koneksi
app.get("/api/test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ status: "Database terkoneksi!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Total pelanggaran
app.get("/api/pelanggaran", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pelanggaran");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Dashboard stats
app.get("/api/dashboard", async (req, res) => {
  try {
    const [total] = await db.query("SELECT COUNT(*) as total FROM pelanggaran");
    const [sanksi] = await db.query("SELECT COUNT(*) as total FROM sanksi");
    const [hari_ini] = await db.query(
      "SELECT COUNT(*) as total FROM pelanggaran WHERE DATE(waktu_pelanggaran) = CURDATE()",
    );
    const [per_lokasi] = await db.query(`
      SELECT lc.nama_jalan, COUNT(p.id) as jumlah
      FROM pelanggaran p
      JOIN lokasi_cctv lc ON p.lokasi_cctv_id = lc.id
      GROUP BY lc.nama_jalan
    `);
    const [bulanan] = await db.query(`
      SELECT MONTHNAME(waktu_pelanggaran) as bulan, COUNT(*) as total
      FROM pelanggaran
      WHERE waktu_pelanggaran >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY MONTH(waktu_pelanggaran), MONTHNAME(waktu_pelanggaran)
      ORDER BY MONTH(waktu_pelanggaran)
    `);

    res.json({
      total_pelanggaran: total[0].total,
      total_sanksi: sanksi[0].total,
      pelanggaran_hari_ini: hari_ini[0].total,
      distribusi_lokasi: per_lokasi,
      tren_bulanan: bulanan,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ← TAMBAHAN BARU DI SINI
// API: Semua pelanggaran dengan detail
app.get("/api/pelanggaran-detail", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.kode_pelanggaran,
        p.no_polisi,
        p.jenis_kendaraan,
        p.waktu_pelanggaran,
        p.status,
        p.foto_url,
        lc.nama_jalan as lokasi,
        jp.nama as jenis_pelanggaran,
        jp.denda_amount,
        pt.nama_lengkap as petugas
      FROM pelanggaran p
      LEFT JOIN lokasi_cctv lc ON p.lokasi_cctv_id = lc.id
      LEFT JOIN jenis_pelanggaran jp ON p.jenis_pelanggaran_id = jp.id
      LEFT JOIN petugas pt ON p.petugas_id = pt.id
      ORDER BY p.waktu_pelanggaran DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Update status pelanggaran
app.put("/api/pelanggaran/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query("UPDATE pelanggaran SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Dashboard stats untuk petugas
app.get("/api/dashboard-petugas", async (req, res) => {
  try {
    const [hari_ini] = await db.query(
      "SELECT COUNT(*) as total FROM pelanggaran WHERE DATE(waktu_pelanggaran) = CURDATE()",
    );
    const [kendaraan_unik] = await db.query(
      "SELECT COUNT(DISTINCT no_polisi) as total FROM pelanggaran WHERE DATE(waktu_pelanggaran) = CURDATE()",
    );
    const [cctv_aktif] = await db.query(
      "SELECT COUNT(*) as total FROM lokasi_cctv WHERE status = 'aktif'",
    );
    const [cctv_nonaktif] = await db.query(
      "SELECT COUNT(*) as total FROM lokasi_cctv WHERE status != 'aktif'",
    );
    const [per_jam] = await db.query(`
      SELECT HOUR(waktu_pelanggaran) as jam, COUNT(*) as total
      FROM pelanggaran
      WHERE DATE(waktu_pelanggaran) = CURDATE()
      GROUP BY HOUR(waktu_pelanggaran)
      ORDER BY jam
    `);

    res.json({
      pelanggaran_hari_ini: hari_ini[0].total,
      kendaraan_unik: kendaraan_unik[0].total,
      cctv_aktif: cctv_aktif[0].total,
      cctv_nonaktif: cctv_nonaktif[0].total,
      per_jam,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password, userType } = req.body;

    // Cari user berdasarkan email atau nama
    const [users] = await db.query(
      "SELECT * FROM users WHERE (email = ? OR nama = ?) AND role = ? AND is_active = 1",
      [username, username, userType === "petugas" ? "petugas" : "warga"],
    );

    if (users.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Username tidak ditemukan" });
    }

    const user = users[0];

    // Cek password (sementara pakai plain text, nanti bisa pakai bcrypt)
    // Password default: nama_role + 123, misal: petugas123, warga123
    const validPasswords = {
      petugas: "petugas123",
      warga: "warga123",
      admin: "admin123",
    };

    const isValid =
      password === validPasswords[userType] || password === "password123";

    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Password salah" });
    }

    // Ambil detail tambahan
    let detail = null;
    if (userType === "petugas") {
      const [pet] = await db.query("SELECT * FROM petugas WHERE user_id = ?", [
        user.id,
      ]);
      detail = pet[0] || null;
    } else {
      const [wrg] = await db.query("SELECT * FROM warga WHERE user_id = ?", [
        user.id,
      ]);
      detail = wrg[0] || null;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.nama,
        email: user.email,
        role: userType === "petugas" ? "Petugas Lalu Lintas" : "Warga",
        userType,
        detail,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
