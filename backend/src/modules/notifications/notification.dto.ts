import { z } from "zod";

export const createNotificationSchema = z.object({
  user_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum([
    "BORROW_REQUEST",
    "BORROW_STATUS",
    "RETURN_REQUEST",
    "MAINTENANCE_REPORT",
    "MAINTENANCE_STATUS",
    "ROOM_BOOKING_REQUEST",
    "ROOM_BOOKING_STATUS",
    "PROCUREMENT_STATUS",
    "HANDOVER",
    "SYSTEM",
  ]),
  link: z.string().optional(),
  sendEmailFlag: z.boolean().optional().default(true),
});

export type CreateNotificationDTO = z.infer<typeof createNotificationSchema>;
