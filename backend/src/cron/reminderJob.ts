import cron from "node-cron";
import prisma from "../config/prisma";
import { sendEmail } from "../helper/email";
import { generateEmailTemplate } from "../helper/email.template"; // 🌟 SESUAIKAN PATH IMPORT TEMPLATE ANDA

export const startReminderJob = () => {
  // Jalankan setiap hari jam 08:00 Pagi (00 08 * * *)
  cron.schedule("* * * * *", async () => {
    console.log("⏰ [CRON JOB] Running asset return reminder...");

    try {
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));

      // 1. Cari semua peminjaman yang statusnya Disetujui DAN jatuh tempo HARI INI
      const dueBorrows = await prisma.borrow.findMany({
        where: {
          status: "Disetujui",
          expected_return_date: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        include: {
          asset: true,
          user: {
            include: {
              profile: true,
            },
          },
        },
      });

      // 2. Kirim notifikasi & Email untuk setiap peminjam yang jatuh tempo
      for (const borrow of dueBorrows) {
        // Cek apakah notifikasi untuk borrow ini sudah pernah dikirim agar tidak dobel
        const existingNotif = await prisma.notification.findFirst({
          where: {
            user_id: borrow.user_id,
            type: "BORROW_STATUS",
            link: `/aset-saya`,
            message: { contains: borrow.asset.asset_name },
            createdAt: { gte: startOfToday },
          },
        });

        if (!existingNotif) {
          const userName = borrow.user.profile?.name || "Pengguna";
          const assetName = borrow.asset.asset_name;
          const userEmail = borrow.user.email;

          // a. Buat Notifikasi di Database (untuk lonceng di frontend)
          await prisma.notification.create({
            data: {
              user_id: borrow.user_id,
              title: "Pengingat Pengembalian Aset",
              message: `Aset ${assetName} yang Anda pinjam jatuh tempo hari ini. Mohon segera kembalikan.`,
              type: "BORROW_STATUS",
              link: `/aset-saya`,
            },
          });

          // b. Generate isi email menggunakan template Anda
          const emailHtml = generateEmailTemplate(
            "Pengingat Pengembalian Aset", // Title
            `Aset ${assetName} yang Anda pinjam jatuh tempo hari ini. Mohon segera kembalikan ke unit General Affair.`, // Message
            "/aset-saya", // Link (untuk tombol)
            `${process.env.APP_URL}/aset-saya`, // FullLink (URL utuh)
            userName, // UserName
          );

          // c. Kirim Email
          await sendEmail({
            to: userEmail,
            subject: "Pengingat: Pengembalian Aset Jatuh Tempo Hari Ini",
            text: `Halo ${userName},\n\nAset ${assetName} yang Anda pinjam jatuh tempo hari ini. Mohon segera kembalikan ke unit General Affair.\n\nTerima kasih.`,
            html: emailHtml, // 🌟 PAKAI HTML DARI TEMPLATE
          });

          console.log(
            `✅ Reminder (Notif + Email) sent to: ${userEmail} for asset: ${assetName}`,
          );
        }
      }

      console.log(
        `✅ [CRON JOB] Done. Processed ${dueBorrows.length} reminders.`,
      );
    } catch (error) {
      console.error("❌ [CRON JOB] Error:", error);
    }
  });

  console.log("✅ Cron job for asset reminder is scheduled.");
};
