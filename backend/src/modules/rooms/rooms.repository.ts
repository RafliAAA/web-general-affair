import prisma from "../../config/prisma";
import { RoomStatus, BookingStatus } from "@prisma/client";
import type {
  CreateRoomDTO,
  UpdateRoomDTO,
  CreateBookingDTO,
  ReviewBookingDTO,
} from "./rooms.dto";

// ─── Room ─────────────────────────────────────────────────────────────────────

const createRoom = async (data: CreateRoomDTO) => {
  return await prisma.room.create({
    data: {
      name: data.name,
      capacity: data.capacity,
      location: data.location,
      facilities: {
        create: data.facilities.map((name) => ({ name })),
      },
    },
    include: { facilities: true },
  });
};

const getAllRooms = async () => {
  return await prisma.room.findMany({
    where: { deletedAt: null },
    include: { facilities: true },
    orderBy: { createdAt: "desc" },
  });
};

const getRoomById = async (room_id: string) => {
  return await prisma.room.findFirst({
    where: { room_id, deletedAt: null },
    include: { facilities: true },
  });
};

const updateRoom = async (room_id: string, data: UpdateRoomDTO) => {
  return await prisma.$transaction(async (tx) => {
    if (data.facilities) {
      await tx.roomFacility.deleteMany({ where: { room_id } });
      await tx.roomFacility.createMany({
        data: data.facilities.map((name) => ({ room_id, name })),
      });
    }

    return await tx.room.update({
      where: { room_id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.capacity && { capacity: data.capacity }),
        ...(data.location && { location: data.location }),
        ...(data.status && { status: data.status as RoomStatus }),
      },
      include: { facilities: true },
    });
  });
};

const deleteRoom = async (room_id: string) => {
  return await prisma.room.update({
    where: { room_id },
    data: { deletedAt: new Date() },
  });
};

// ─── Booking ──────────────────────────────────────────────────────────────────

const createBooking = async (data: CreateBookingDTO, user_id: string) => {
  return await prisma.$transaction(async (tx) => {
    const room = await tx.room.findFirst({
      where: { room_id: data.room_id, deletedAt: null },
    });

    if (!room) throw new Error("Ruangan tidak ditemukan");
    if (room.status === RoomStatus.TidakTersedia) {
      throw new Error("Ruangan tidak tersedia");
    }

    // cek bentrok jadwal
    const conflict = await tx.roomBooking.findFirst({
      where: {
        room_id: data.room_id,
        date: new Date(data.date),
        status: BookingStatus.Disetujui,
        AND: [
          { start_time: { lt: data.end_time } },
          { end_time: { gt: data.start_time } },
        ],
      },
    });

    if (conflict) {
      throw new Error(
        `Ruangan sudah dibooking pada jam ${conflict.start_time} - ${conflict.end_time}`,
      );
    }

    return await tx.roomBooking.create({
      data: {
        room_id: data.room_id,
        user_id,
        date: new Date(data.date),
        start_time: data.start_time,
        end_time: data.end_time,
        purpose: data.purpose,
      },
      include: {
        room: { include: { facilities: true } },
        user: { select: { profile: { select: { name: true } } } },
      },
    });
  });
};

const getAllBookings = async () => {
  return await prisma.roomBooking.findMany({
    include: {
      room: { include: { facilities: true } },
      user: { select: { profile: { select: { name: true } } } },
      reviewer: { select: { profile: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getBookingById = async (booking_id: string) => {
  return await prisma.roomBooking.findUnique({
    where: { booking_id },
    include: {
      room: { include: { facilities: true } },
      user: { select: { profile: { select: { name: true } } } },
      reviewer: { select: { profile: { select: { name: true } } } },
    },
  });
};

const getBookingByUser = async (user_id: string) => {
  return await prisma.roomBooking.findMany({
    where: { user_id },
    include: {
      room: { include: { facilities: true } },
      reviewer: { select: { profile: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
};

// jadwal ruangan untuk ditampilkan ke semua user (hanya yang Disetujui)
const getRoomSchedule = async (room_id: string, date?: string) => {
  return await prisma.roomBooking.findMany({
    where: {
      room_id,
      status: BookingStatus.Disetujui,
      ...(date ? { date: new Date(date) } : {}),
    },
    include: {
      user: { select: { profile: { select: { name: true } } } },
    },
    orderBy: [{ date: "asc" }, { start_time: "asc" }],
  });
};

const reviewBooking = async (
  booking_id: string,
  reviewed_by: string,
  data: ReviewBookingDTO,
) => {
  const booking = await prisma.roomBooking.findUnique({
    where: { booking_id },
  });

  if (!booking) throw new Error("Booking tidak ditemukan");
  if (booking.status !== BookingStatus.Menunggu) {
    throw new Error("Booking sudah diproses");
  }

  return await prisma.roomBooking.update({
    where: { booking_id },
    data: {
      status: data.status as BookingStatus,
      reviewed_by,
      reject_notes: data.reject_notes ?? null,
    },
    include: {
      room: { include: { facilities: true } },
      user: { select: { profile: { select: { name: true } } } },
      reviewer: { select: { profile: { select: { name: true } } } },
    },
  });
};

const cancelBooking = async (booking_id: string, user_id: string) => {
  const booking = await prisma.roomBooking.findUnique({
    where: { booking_id },
  });

  if (!booking) throw new Error("Booking tidak ditemukan");
  if (booking.user_id !== user_id) throw new Error("Tidak memiliki akses");
  if (booking.status !== BookingStatus.Menunggu) {
    throw new Error("Booking tidak bisa dibatalkan");
  }

  return await prisma.roomBooking.delete({ where: { booking_id } });
};

export default {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingByUser,
  getRoomSchedule,
  reviewBooking,
  cancelBooking,
};
