import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Sparkles, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Data mock pelanggaran
const violationData = [
  {
    id: "V001",
    plat: "B 1234 ABC",
    lokasi: "Jl. Sudirman",
    tanggal: "27 Jan 2026",
    waktu: "08:15",
    status: "Belum Diproses",
    durasi: "3 menit",
  },
  {
    id: "V002",
    plat: "B 5678 DEF",
    lokasi: "Jl. Thamrin",
    tanggal: "27 Jan 2026",
    waktu: "09:23",
    status: "Disanksi",
    durasi: "5 menit",
  },
  {
    id: "V003",
    plat: "B 9012 GHI",
    lokasi: "Jl. Gatot Subroto",
    tanggal: "27 Jan 2026",
    waktu: "10:45",
    status: "Belum Diproses",
    durasi: "2 menit",
  },
  {
    id: "V004",
    plat: "B 3456 JKL",
    lokasi: "Jl. Rasuna Said",
    tanggal: "10 Jan 2026",
    waktu: "11:30",
    status: "Disanksi",
    durasi: "7 menit",
  },
  {
    id: "V005",
    plat: "B 7890 MNO",
    lokasi: "Jl. Sudirman",
    tanggal: "10 Jan 2026",
    waktu: "12:15",
    status: "Belum Diproses",
    durasi: "4 menit",
  },
  {
    id: "V006",
    plat: "B 2468 PQR",
    lokasi: "Jl. Thamrin",
    tanggal: "10 Jan 2026",
    waktu: "13:22",
    status: "Belum Diproses",
    durasi: "6 menit",
  },
  {
    id: "V007",
    plat: "B 1357 STU",
    lokasi: "Jl. Semanggi",
    tanggal: "15 Jan 2026",
    waktu: "14:10",
    status: "Disanksi",
    durasi: "8 menit",
  },
  {
    id: "V008",
    plat: "B 9753 VWX",
    lokasi: "Jl. Thamrin",
    tanggal: "15 Jan 2026",
    waktu: "15:45",
    status: "Belum Diproses",
    durasi: "3 menit",
  },
];

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Halo! Saya asisten AI Clear-O. Ada yang bisa saya bantu? Anda bisa tanya tentang pelanggaran, lokasi CCTV, laporan, atau ketik 'bantuan' untuk panduan.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // --- Salam ---
    if (msg.match(/^(halo|hai|hi|hello|hey|selamat)/)) {
      return `Halo ${user?.username}! Senang bisa membantu Anda hari ini. Silakan tanyakan apa saja seputar sistem Clear-O. 😊`;
    }

    // --- Terima kasih ---
    if (
      msg.includes("terima kasih") ||
      msg.includes("makasih") ||
      msg.includes("thanks")
    ) {
      return "Sama-sama! Senang bisa membantu. Jangan ragu untuk bertanya lagi kapan saja. 😊";
    }

    // --- Bantuan / Help ---
    if (
      msg.includes("bantuan") ||
      msg.includes("help") ||
      msg.includes("bisa apa")
    ) {
      if (user?.userType === "petugas") {
        return `Saya bisa membantu Anda dengan:\n\n• Cari pelanggaran berdasarkan lokasi atau tanggal\n• Info status CCTV\n• Panduan laporan & export data\n• Info statistik pelanggaran\n• Cara proses pelanggaran\n\nContoh: "pelanggaran di thamrin tanggal 10" atau "berapa CCTV aktif"`;
      } else {
        return `Saya bisa membantu Anda dengan:\n\n• Cara bayar denda\n• Info riwayat pelanggaran\n• Daftar kendaraan\n• Pengaturan notifikasi\n• Cara banding pelanggaran\n\nContoh: "cara bayar denda" atau "cara daftar kendaraan"`;
      }
    }

    // --- Pencarian pelanggaran berdasarkan lokasi + tanggal (PETUGAS) ---
    if (user?.userType === "petugas") {
      const lokasiMap: { [key: string]: string } = {
        sudirman: "Jl. Sudirman",
        thamrin: "Jl. Thamrin",
        gatot: "Jl. Gatot Subroto",
        rasuna: "Jl. Rasuna Said",
        semanggi: "Jl. Semanggi",
        kuningan: "Jl. Kuningan",
      };

      // Cari lokasi dalam pesan
      let foundLokasi = "";
      for (const [key, val] of Object.entries(lokasiMap)) {
        if (msg.includes(key)) {
          foundLokasi = val;
          break;
        }
      }

      // Cari tanggal dalam pesan (misal: "tanggal 10", "10 jan", "tgl 10")
      const tanggalMatch = msg.match(
        /(?:tanggal|tgl|tanggal\s+|tgl\s+)?(\d{1,2})(?:\s+(?:jan|feb|mar|apr|mei|jun|jul|ags|sep|okt|nov|des))?/,
      );
      const foundTanggal = tanggalMatch ? tanggalMatch[1] : "";

      if (foundLokasi || foundTanggal) {
        let filtered = violationData;

        if (foundLokasi) {
          filtered = filtered.filter((v) => v.lokasi === foundLokasi);
        }
        if (foundTanggal) {
          filtered = filtered.filter((v) =>
            v.tanggal.includes(` ${foundTanggal} `),
          );
        }

        if (filtered.length === 0) {
          const lokDesc = foundLokasi ? `di ${foundLokasi}` : "";
          const tglDesc = foundTanggal ? `tanggal ${foundTanggal}` : "";
          return `Tidak ditemukan pelanggaran ${lokDesc} ${tglDesc}. Coba cek menu Pelanggaran untuk data lengkap.`;
        }

        const lokDesc = foundLokasi ? `di ${foundLokasi}` : "";
        const tglDesc = foundTanggal ? `tanggal ${foundTanggal}` : "";
        let result = `Ditemukan ${filtered.length} pelanggaran ${lokDesc} ${tglDesc}:\n\n`;
        filtered.forEach((v) => {
          result += `• ${v.id} | ${v.plat}\n  ${v.lokasi} • ${v.tanggal} ${v.waktu}\n  Status: ${v.status}\n\n`;
        });
        result += "Untuk detail lengkap, buka menu Pelanggaran.";
        return result;
      }

      // --- Cari plat nomor ---
      const platMatch = msg.match(/[a-z]{1,2}\s*\d{1,4}\s*[a-z]{1,3}/i);
      if (platMatch) {
        const platQuery = platMatch[0].toUpperCase().replace(/\s+/g, " ");
        const found = violationData.filter((v) =>
          v.plat.replace(/\s+/g, " ").includes(platQuery),
        );
        if (found.length > 0) {
          let result = `Data kendaraan ${platQuery}:\n\n`;
          found.forEach((v) => {
            result += `• ${v.id} | ${v.lokasi}\n  ${v.tanggal} ${v.waktu} | ${v.durasi}\n  Status: ${v.status}\n\n`;
          });
          return result;
        } else {
          return `Kendaraan dengan plat ${platQuery} tidak ditemukan dalam database. Pastikan penulisan plat sudah benar.`;
        }
      }

      // --- CCTV ---
      if (msg.includes("cctv") || msg.includes("kamera")) {
        if (msg.includes("aktif") || msg.includes("online")) {
          return "Saat ini terdapat 24 CCTV aktif dari total 28 kamera. 4 kamera sedang offline dan membutuhkan perbaikan (CCTV-05, CCTV-12, CCTV-19, CCTV-23). Cek menu Peta CCTV untuk detail lokasi.";
        }
        if (
          msg.includes("offline") ||
          msg.includes("mati") ||
          msg.includes("rusak")
        ) {
          return "CCTV yang sedang offline: CCTV-05, CCTV-12, CCTV-19, CCTV-23. Harap segera koordinasi dengan tim teknis untuk perbaikan.";
        }
        return "Sistem CCTV kami memiliki 24 kamera aktif dari 28 total. Anda bisa monitor live feed di menu CCTV Live atau lihat peta sebaran di menu Peta CCTV.";
      }

      // --- Statistik ---
      if (
        msg.includes("statistik") ||
        msg.includes("total") ||
        msg.includes("berapa") ||
        msg.includes("data")
      ) {
        return "Statistik hari ini:\n\n• Total Pelanggaran: 127\n• Kendaraan Unik: 98\n• Sudah Diproses: 85 (67%)\n• Belum Diproses: 42 (33%)\n• CCTV Aktif: 24/28\n\nUntuk laporan lengkap, buka menu Laporan & Riwayat.";
      }

      // --- Laporan ---
      if (
        msg.includes("laporan") ||
        msg.includes("export") ||
        msg.includes("pdf") ||
        msg.includes("excel")
      ) {
        return "Untuk mengekspor laporan:\n\n1. Buka menu Laporan & Riwayat\n2. Pilih periode (Harian/Mingguan/Bulanan)\n3. Klik tombol Export PDF atau Export Excel\n\nLaporan akan otomatis terunduh ke perangkat Anda.";
      }

      // --- Cara proses pelanggaran ---
      if (
        msg.includes("proses") ||
        msg.includes("sanksi") ||
        msg.includes("cara")
      ) {
        return "Cara memproses pelanggaran:\n\n1. Buka menu Pelanggaran\n2. Klik ikon mata (👁) pada baris pelanggaran\n3. Periksa foto bukti CCTV\n4. Klik '✓ Ilegal/Melanggar' untuk memberi sanksi\n5. Atau klik '✗ Legal/Tidak Melanggar' jika tidak terbukti";
      }
    }

    // --- WARGA ---
    if (user?.userType === "warga") {
      // Bayar denda
      if (
        msg.includes("bayar") ||
        msg.includes("denda") ||
        msg.includes("pembayaran")
      ) {
        return "Cara membayar denda:\n\n1. Buka menu Laporan & Riwayat\n2. Klik tombol 'Bayar Denda' pada pelanggaran\n3. Pilih metode pembayaran:\n   • Transfer Bank (BRI, BNI, Mandiri)\n   • Virtual Account\n   • QRIS\n   • Minimarket\n4. Ikuti instruksi pembayaran\n\nStatus akan otomatis diperbarui setelah pembayaran berhasil.";
      }

      // Riwayat pelanggaran
      if (
        msg.includes("riwayat") ||
        msg.includes("pelanggaran") ||
        msg.includes("tilang") ||
        msg.includes("kena")
      ) {
        return "Untuk melihat riwayat pelanggaran Anda:\n\n1. Buka menu Laporan & Riwayat\n2. Semua pelanggaran atas nama Anda akan ditampilkan\n3. Klik 'Lihat Detail' untuk informasi lengkap termasuk foto bukti CCTV\n\nJika ada pelanggaran yang tidak Anda lakukan, segera hubungi customer service.";
      }

      // Daftar kendaraan
      if (
        msg.includes("kendaraan") ||
        msg.includes("motor") ||
        msg.includes("mobil") ||
        msg.includes("daftar")
      ) {
        return "Cara mendaftarkan kendaraan:\n\n1. Buka menu Pengaturan\n2. Scroll ke bagian 'Kendaraan Terdaftar'\n3. Klik '+ Tambah Kendaraan'\n4. Masukkan nomor plat, jenis, dan data kendaraan\n5. Klik Simpan\n\nMaksimal 5 kendaraan per akun.";
      }

      // Notifikasi
      if (
        msg.includes("notifikasi") ||
        msg.includes("pemberitahuan") ||
        msg.includes("email")
      ) {
        return "Pengaturan notifikasi:\n\n1. Buka menu Pengaturan\n2. Scroll ke 'Pengaturan Notifikasi'\n3. Aktifkan/nonaktifkan jenis notifikasi:\n   • Pelanggaran baru\n   • Status sanksi\n   • Pengingat pembayaran\n   • Info CCTV area tertentu";
      }

      // Banding / keberatan
      if (
        msg.includes("banding") ||
        msg.includes("keberatan") ||
        msg.includes("salah") ||
        msg.includes("tidak melanggar")
      ) {
        return "Jika Anda merasa pelanggaran tidak valid:\n\n1. Kumpulkan bukti (foto, video, saksi)\n2. Hubungi customer service:\n   📞 WhatsApp: 0812-3456-7890\n   📧 Email: support@dishub.jakarta.go.id\n3. Jelaskan kronologi kejadian\n4. Tim kami akan memproses dalam 3-5 hari kerja.";
      }

      // Password / akun
      if (
        msg.includes("password") ||
        msg.includes("lupa") ||
        msg.includes("akun") ||
        msg.includes("login")
      ) {
        return "Masalah akun:\n\n• Ubah password: Pengaturan > Akun & Profil > Ubah Password\n• Lupa password: Hubungi customer service di 0812-3456-7890\n• Akun diblokir: Hubungi support@dishub.jakarta.go.id";
      }
    }

    // --- Kontak ---
    if (
      msg.includes("kontak") ||
      msg.includes("hubungi") ||
      msg.includes("telepon") ||
      msg.includes("cs") ||
      msg.includes("customer")
    ) {
      return "Informasi kontak Clear-O:\n\n📞 WhatsApp: 0812-3456-7890\n📧 Email: support@dishub.jakarta.go.id\n🕐 Jam Operasional: Senin-Jumat, 08:00-17:00 WIB\n\nUntuk pengaduan darurat, hubungi Dishub DKI Jakarta di 021-1365.";
    }

    // Default response yang lebih helpful
    return `Maaf, saya kurang memahami pertanyaan Anda. Coba tanyakan dengan lebih spesifik, misalnya:\n\n${
      user?.userType === "petugas"
        ? '• "pelanggaran di sudirman tanggal 27"\n• "berapa CCTV yang aktif"\n• "cara export laporan pdf"\n• "plat B 1234 ABC"'
        : '• "cara bayar denda"\n• "lihat riwayat pelanggaran"\n• "cara daftar kendaraan"\n• "hubungi customer service"'
    }\n\nAtau ketik 'bantuan' untuk melihat semua topik.`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateBotResponse(userMessage.text),
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      },
      800 + Math.random() * 700,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-8 w-[calc(100vw-2rem)] sm:w-96 h-[500px] sm:h-[600px] max-w-md bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-cyan-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <Bot className="w-6 h-6 sm:w-8 sm:h-8" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">
              Asisten AI Clear-O
            </h3>
            <p className="text-xs text-cyan-100">Siap membantu Anda</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-2 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-200"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {message.text}
              </p>
              <p
                className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-400"}`}
              >
                {message.timestamp.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto">
        {(user?.userType === "petugas"
          ? ["Statistik hari ini", "CCTV aktif", "Cara proses", "Bantuan"]
          : [
              "Cara bayar denda",
              "Riwayat saya",
              "Daftar kendaraan",
              "Kontak CS",
            ]
        ).map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setInput(suggestion);
            }}
            className="whitespace-nowrap text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors flex-shrink-0"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan Anda..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-2 sm:p-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-40 group"
      >
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        <div className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Tanya Asisten AI
        </div>
      </button>

      <Chatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
