import prisma from "../../config/prisma";
import { RoomStatus, BookingStatus } from "@prisma/client";
import { CreateBookingDTO, ReviewBookingDTO } from "./bookings.dto";

const createBooking = async (data: CreateBookingDTO, user_id: string) => {
  return await prisma.$transaction(async (tx) => {
    const room = await tx.room.findFirst({
      where: { room_id: data.room_id, deletedAt: null },
    });

    if (!room) throw new Error("Ruangan tidak ditemukan");
    if (room.status === RoomStatus.TidakTersedia) {
      throw new Error("Ruangan tidak tersedia");
    }

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
        user: {
          select: {
            profile: {
              select: {
                name: true,
                entity: {
                  select: { entity_name: true },
                },
                directorate: {
                  select: { directorate_name: true },
                },
              },
            },
          },
        },
      },
    });
  });
};

const getAllBookings = async () => {
  return await prisma.roomBooking.findMany({
    include: {
      room: { include: { facilities: true } },
      user: {
        select: {
          profile: {
            select: {
              name: true,
              entity: {
                select: { entity_name: true },
              },
              directorate: {
                select: { directorate_name: true },
              },
            },
          },
        },
      },
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
      user: {
        select: {
          profile: {
            select: {
              name: true,
              entity: {
                select: { entity_name: true },
              },
              directorate: {
                select: { directorate_name: true },
              },
            },
          },
        },
      },
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

const getRoomSchedule = async (room_id: string, date?: string) => {
  return await prisma.roomBooking.findMany({
    where: {
      room_id,
      status: BookingStatus.Disetujui,
      ...(date ? { date: new Date(date) } : {}),
    },
    include: {
      user: {
        select: {
          profile: {
            select: {
              name: true,
              entity: {
                select: { entity_name: true },
              },
              directorate: {
                select: { directorate_name: true },
              },
            },
          },
        },
      },
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
      user: {
        select: {
          profile: {
            select: {
              name: true,
              entity: {
                select: { entity_name: true },
              },
              directorate: {
                select: { directorate_name: true },
              },
            },
          },
        },
      },
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
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingByUser,
  getRoomSchedule,
  reviewBooking,
  cancelBooking,
};
