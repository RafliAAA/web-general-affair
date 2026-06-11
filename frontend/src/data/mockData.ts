import type { SOP } from "@/types/sop";
import type {
  Asset,
  BorrowRequest,
  Room,
  RoomBooking,
  Projects,
} from "../types/inventory";

export const companyAssets: Asset[] = [
  {
    asset_id: "1",
    asset_name: 'MacBook Pro 14"',
    asset_type: "Laptop",
    serial_number: "MBP-2024-001",
    status: "Tersedia",
    asset_code: "",
    condition: "",
    purchase_date: null,
    warranty_date: null,
    photo: null,
    createdAt: "",
    updatedAt: "",
    borrow: []
  },
  {
    asset_id: "2",
    asset_name: 'Dell Monitor 27"',
    asset_type: "Monitor",
    serial_number: "DM-2024-015",
    status: "Tersedia",
    asset_code: "",
    condition: "",
    purchase_date: null,
    warranty_date: null,
    photo: null,
    createdAt: "",
    updatedAt: "",
    borrow: []
  },
  {
    asset_id: "3",
    asset_name: "Proyektor Epson",
    asset_type: "Proyektor",
    serial_number: "EP-2023-003",
    status: "Tersedia",
    asset_code: "",
    condition: "",
    purchase_date: null,
    warranty_date: null,
    photo: null,
    createdAt: "",
    updatedAt: "",
    borrow: []
  },
  {
    asset_id: "4",
    asset_name: "Kamera Sony A7 III",
    asset_type: "Kamera",
    serial_number: "SNY-2024-008",
    status: "maintenance",
    asset_code: "",
    condition: "",
    purchase_date: null,
    warranty_date: null,
    photo: null,
    createdAt: "",
    updatedAt: "",
    borrow: []
  },
  {
    asset_id: "5",
    asset_name: 'iPad Pro 12.9"',
    asset_type: "Tablet",
    serial_number: "IPD-2024-012",
    status: "Tersedia",
    asset_code: "",
    condition: "",
    purchase_date: null,
    warranty_date: null,
    photo: null,
    createdAt: "",
    updatedAt: "",
    borrow: []
  },
];



export const borrowRequests: BorrowRequest[] = [
  {
    id: "req-1",
    assetId: "1",
    assetName: 'MacBook Pro 14"',
    requestedBy: "user-3",
    requestedByName: "Budi Santoso",
    requestDate: new Date("2024-12-28"),
    startDate: new Date("2025-01-02"),
    endDate: new Date("2025-01-31"),
    status: "rejected",
    reason: "Untuk project development aplikasi mobile",
  },
  {
    id: "req-2",
    assetId: "3",
    assetName: "Proyektor Epson",
    requestedBy: "user-4",
    requestedByName: "Dewi Lestari",
    requestDate: new Date("2024-12-27"),
    startDate: new Date("2025-01-05"),
    endDate: new Date("2025-01-05"),
    status: "pending",
    reason: "Presentasi client di kantor cabang",
  },
  {
    id: "req-3",
    assetId: "5",
    assetName: 'iPad Pro 12.9"',
    requestedBy: "user-5",
    requestedByName: "Rudi Hermawan",
    requestDate: new Date("2024-12-26"),
    startDate: new Date("2024-12-28"),
    endDate: new Date("2025-01-10"),
    status: "approved",
    reason: "Demo produk ke customer",
  },
];

export const rooms: Room[] = [
  {
    id: "room-1",
    name: "Ruang Meeting Utama",
    capacity: 20,
    facilities: ["Proyektor", "Whiteboard", "Video Conference", "AC"],
  },
  {
    id: "room-2",
    name: "Ruang Rapat Kecil A",
    capacity: 8,
    facilities: ["TV", "Whiteboard", "AC"],
  },
  {
    id: "room-3",
    name: "Ruang Rapat Kecil B",
    capacity: 6,
    facilities: ["Monitor", "Whiteboard", "AC"],
  },
  {
    id: "room-4",
    name: "Ruang Training",
    capacity: 30,
    facilities: ["Proyektor", "Sound System", "AC", "Microphone"],
  },
];

export const roomBookings: RoomBooking[] = [
  {
    id: "book-1",
    roomId: "room-1",
    roomName: "Ruang Meeting Utama",
    bookedBy: "user-1",
    bookedByName: "Ahmad Rizki",
    date: new Date("2025-01-02"),
    startTime: "09:00",
    endTime: "11:00",
    purpose: "Weekly Team Meeting",
    status: "approved",
  },
  {
    id: "book-2",
    roomId: "room-2",
    roomName: "Ruang Rapat Kecil A",
    bookedBy: "user-3",
    bookedByName: "Budi Santoso",
    date: new Date("2025-01-03"),
    startTime: "14:00",
    endTime: "16:00",
    purpose: "Interview Kandidat",
    status: "pending",
  },
  {
    id: "book-3",
    roomId: "room-4",
    roomName: "Ruang Training",
    bookedBy: "user-4",
    bookedByName: "Dewi Lestari",
    date: new Date("2025-01-06"),
    startTime: "09:00",
    endTime: "17:00",
    purpose: "Training New Employee",
    status: "approved",
  },
];

// export const vehicles: Vehicle[] = [
//   {
//     id: 'veh-1',
//     name: 'Toyota Innova',
//     plateNumber: 'B 1234 ABC',
//     type: 'MPV',
//     status: 'available',
//     capacity: 7,
//     fuelType: 'Bensin',
//     description: 'Toyota Innova Zenix 2.0 G CVT',
//   },
//   {
//     id: 'veh-2',
//     name: 'Honda HR-V',
//     plateNumber: 'B 5678 DEF',
//     type: 'SUV',
//     status: 'borrowed',
//     capacity: 5,
//     fuelType: 'Bensin',
//     description: 'Honda HR-V 1.5 SE CVT',
//   },
//   {
//     id: 'veh-3',
//     name: 'Daihatsu Gran Max',
//     plateNumber: 'B 9012 GHI',
//     type: 'Pick Up',
//     status: 'available',
//     capacity: 2,
//     fuelType: 'Solar',
//     description: 'Daihatsu Gran Max Pick Up 1.5',
//   },
//   {
//     id: 'veh-4',
//     name: 'Toyota Avanza',
//     plateNumber: 'B 3456 JKL',
//     type: 'MPV',
//     status: 'maintenance',
//     capacity: 7,
//     fuelType: 'Bensin',
//     description: 'Toyota Avanza 1.5 G CVT',
//   },
//   {
//     id: 'veh-5',
//     name: 'Mitsubishi Pajero Sport',
//     plateNumber: 'B 7890 MNO',
//     type: 'SUV',
//     status: 'available',
//     capacity: 7,
//     fuelType: 'Solar',
//     description: 'Mitsubishi Pajero Sport Dakar 4x2 AT',
//   },
// ];

// export const vehicleBookings: VehicleBooking[] = [
//   {
//     id: 'vbook-1',
//     vehicleId: 'veh-2',
//     vehicleName: 'Honda HR-V',
//     bookedBy: 'user-1',
//     bookedByName: 'Ahmad Rizki',
//     date: new Date('2025-01-02'),
//     startTime: '08:00',
//     endTime: '17:00',
//     destination: 'Kantor Cabang Bandung',
//     purpose: 'Meeting dengan client',
//     status: 'approved',
//   },
//   {
//     id: 'vbook-2',
//     vehicleId: 'veh-1',
//     vehicleName: 'Toyota Innova',
//     bookedBy: 'user-3',
//     bookedByName: 'Budi Santoso',
//     date: new Date('2025-01-05'),
//     startTime: '06:00',
//     endTime: '20:00',
//     destination: 'Semarang',
//     purpose: 'Kunjungan vendor',
//     status: 'pending',
//   },
//   {
//     id: 'vbook-3',
//     vehicleId: 'veh-5',
//     vehicleName: 'Mitsubishi Pajero Sport',
//     bookedBy: 'user-2',
//     bookedByName: 'Siti Nurhaliza',
//     date: new Date('2025-01-08'),
//     startTime: '09:00',
//     endTime: '15:00',
//     destination: 'Bogor',
//     purpose: 'Team outing',
//     status: 'approved',
//   },
// ];

export const projects: Projects[] = [
  {
    id: "proj-1",
    name: "Website Redesign",
    description: "Redesign website perusahaan dengan tampilan modern",
    status: "in-progress",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-03-31"),
    priority: "high",
  },
  {
    id: "proj-2",
    name: "Mobile App Development",
    description: "Pengembangan aplikasi mobile untuk customer",
    status: "completed",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-06-30"),
    priority: "high",
  },
  {
    id: "proj-3",
    name: "ERP Integration",
    description: "Integrasi sistem ERP dengan aplikasi internal",
    status: "on-hold",
    startDate: new Date("2024-11-01"),
    endDate: new Date("2025-04-30"),
    priority: "medium",
  },
  {
    id: "proj-4",
    name: "Data Migration",
    description: "Migrasi data dari sistem lama ke sistem baru",
    status: "completed",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-12-31"),
    priority: "low",
  },
  {
    id: "proj-5",
    name: "Security Audit",
    description: "Audit keamanan sistem dan infrastruktur IT",
    status: "in-progress",
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-02-28"),
    priority: "high",
  },
];

export const categories = ["Aset", "Kendaraan", "Ruangan", "Umum", "Keamanan"];

export const initialSOPs: SOP[] = [
  {
    id: "1",
    title: "SOP Peminjaman Aset Perusahaan",
    category: "Aset",
    description:
      "Prosedur standar untuk peminjaman aset perusahaan oleh karyawan.",
    steps: [
      {
        order: 1,
        description:
          "Karyawan mengajukan permohonan peminjaman melalui sistem.",
      },
      {
        order: 2,
        description: "Admin General Affair menerima dan mereview permohonan.",
      },
      {
        order: 3,
        description: "Admin melakukan pengecekan ketersediaan aset.",
      },
      {
        order: 4,
        description:
          "Jika disetujui, admin menyiapkan berita acara serah terima.",
      },
      {
        order: 5,
        description: "Karyawan menandatangani berita acara dan menerima aset.",
      },
      {
        order: 6,
        description: "Admin mencatat peminjaman dalam sistem inventaris.",
      },
    ],
    createdAt: "2025-01-15",
    updatedAt: "2025-03-10",
  },
  {
    id: "2",
    title: "SOP Booking Ruangan Meeting",
    category: "Ruangan",
    description: "Prosedur standar untuk booking ruangan meeting perusahaan.",
    steps: [
      {
        order: 1,
        description: "Karyawan mengecek ketersediaan ruangan melalui sistem.",
      },
      {
        order: 2,
        description: "Karyawan mengisi form booking dengan detail acara.",
      },
      {
        order: 3,
        description:
          "Sistem mengkonfirmasi booking secara otomatis jika tersedia.",
      },
      { order: 4, description: "Karyawan menerima konfirmasi via notifikasi." },
      {
        order: 5,
        description:
          "Setelah selesai, karyawan memastikan ruangan dalam keadaan rapi.",
      },
    ],
    createdAt: "2025-02-01",
    updatedAt: "2025-02-20",
  },
  {
    id: "3",
    title: "SOP Peminjaman Kendaraan Dinas",
    category: "Kendaraan",
    description:
      "Prosedur standar untuk peminjaman kendaraan dinas perusahaan.",
    steps: [
      {
        order: 1,
        description:
          "Karyawan mengajukan permohonan peminjaman kendaraan minimal H-1.",
      },
      {
        order: 2,
        description: "Admin mengecek ketersediaan kendaraan dan supir.",
      },
      {
        order: 3,
        description: "Admin menyetujui dan menentukan kendaraan serta supir.",
      },
      {
        order: 4,
        description:
          "Karyawan melakukan pengecekan kondisi kendaraan bersama supir.",
      },
      {
        order: 5,
        description:
          "Setelah selesai, kendaraan dikembalikan dan dilakukan pengecekan ulang.",
      },
      {
        order: 6,
        description:
          "Admin mencatat penggunaan BBM dan kilometer dalam sistem.",
      },
    ],
    createdAt: "2025-01-20",
    updatedAt: "2025-03-05",
  },
];

export const emptySOP = {
  title: "",
  category: "",
  description: "",
  steps: [{ order: 1, description: "" }],
};
