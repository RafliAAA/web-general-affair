import { Request, Response } from "express";
import maintenanceService from "./maintenance.service";
import {
  cannotRepairSchema,
  completeMaintenanceSchema,
  createMaintenanceSchema,
  takeMaintenanceSchema,
  verifyMaintenanceSchema,
} from "./maintenance.dto";
import { AuthRequest } from "../../middleware/auth";
import notificationService from "../notifications/notification.service"; 

const createMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const reported_by = req.user?.user_id;

    const data = createMaintenanceSchema.parse({ ...req.body, reported_by });

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    const result = await maintenanceService.createMaintenance(data);

    await notificationService.sendNotificationToRoles({
      roles: ["ADMIN"],
      title: "Laporan Kerusakan Baru",
      message: `Ada laporan kerusakan aset baru yang perlu diverifikasi.`,
      type: "MAINTENANCE_REPORT",
      link: "/pemeliharaan",
    });

    return res.status(200).json({
      success: true,
      message: "Maintenance report created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create maintenance report",
      error: (error as Error).message,
    });
  }
};

const getAllMaintenance = async (req: Request, res: Response) => {
  try {
    const result = await maintenanceService.getAllMaintenances();

    return res.status(200).json({
      success: true,
      message: "Maintenance fetch successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance",
      error: (error as Error).message,
    });
  }
};

const getMaintenanceById = async (req: Request, res: Response) => {
  try {
    const { maintenance_id } = req.params;

    if (!maintenance_id) {
      return res.status(400).json({
        success: false,
        message: "Maintenance ID is required",
      });
    }

    const result = await maintenanceService.getMaintenanceById(maintenance_id);

    return res.status(200).json({
      success: true,
      message: "Maintenance fetch successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance",
      error: (error as Error).message,
    });
  }
};

const getMyMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await maintenanceService.getMyMaintenance(user_id);

    return res.status(200).json({
      success: true,
      message: "Maintenance fetch successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance",
      error: (error as Error).message,
    });
  }
};

const verifyMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const verified_by = req.user?.user_id;
    const data = verifyMaintenanceSchema.parse({
      maintenance_id: req.params.maintenance_id,
      verified_by,
    });
    const result = await maintenanceService.verifyMaintenance(data);

    await notificationService.sendNotification({
      user_id: result.reported_by,
      title: "Laporan Diverifikasi",
      message: `Laporan kerusakan aset Anda telah diverifikasi dan akan diperbaiki.`,
      type: "MAINTENANCE_STATUS",
      link: "/lapor-kerusakan",
      sendEmailFlag: false,
    });

    return res.status(200).json({
      success: true,
      message: "Maintenance verified successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify maintenance",
      error: (error as Error).message,
    });
  }
};

const takeMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const taken_by = req.user?.user_id;
    const data = takeMaintenanceSchema.parse({
      maintenance_id: req.params.maintenance_id,
      taken_by,
    });
    const result = await maintenanceService.takeMaintenance(data);

    // 3. KIRIM NOTIF KE USER (Aset sedang diperbaiki)
    await notificationService.sendNotification({
      user_id: result.reported_by,
      title: "Aset Sedang Diperbaiki",
      message: `Aset yang Anda laporkan sedang dalam proses perbaikan.`,
      type: "MAINTENANCE_STATUS",
      link: "/lapor-kerusakan",
      sendEmailFlag: false,
    });

    return res.status(200).json({
      success: true,
      message: "Maintenance taken successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to take maintenance",
      error: (error as Error).message,
    });
  }
};

const completeMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const data = completeMaintenanceSchema.parse({
      maintenance_id: req.params.maintenance_id,
      resolution_notes: req.body.resolution_notes,
    });
    const result = await maintenanceService.completeMaintenance(data);

    // 4. KIRIM NOTIF KE USER (Perbaikan selesai)
    await notificationService.sendNotification({
      user_id: result.reported_by,
      title: "Perbaikan Selesai",
      message: `Perbaikan aset yang Anda laporkan telah selesai dilakukan.`,
      type: "MAINTENANCE_STATUS",
      link: "/lapor-kerusakan",
      sendEmailFlag: true,
    });

    return res.status(200).json({
      success: true,
      message: "Maintenance completed successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to complete maintenance",
      error: (error as Error).message,
    });
  }
};

const completeMaintenanceExternal = async (req: AuthRequest, res: Response) => {
  try {
    const data = completeMaintenanceSchema.parse({
      maintenance_id: req.params.maintenance_id,
      resolution_notes: req.body.resolution_notes,
    });

    const result = await maintenanceService.completeMaintenanceExternal(data);

    // KIRIM NOTIF KE USER (Perbaikan selesai oleh vendor)
    await notificationService.sendNotification({
      user_id: result.reported_by,
      title: "Perbaikan Selesai",
      message: `Perbaikan aset yang Anda laporkan telah selesai dilakukan oleh vendor eksternal.`,
      type: "MAINTENANCE_STATUS",
      link: "/lapor-kerusakan",
      sendEmailFlag: true,
    });

    return res.status(200).json({
      success: true,
      message: "External maintenance completed successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to complete external maintenance",
      error: (error as Error).message,
    });
  }
};

const cannotRepair = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const data = cannotRepairSchema.parse({
      maintenance_id: req.params.maintenance_id,
      ...req.body,
    });

    const result = await maintenanceService.cannotRepair(data);

    await notificationService.sendNotification({
      user_id: result.reported_by,
      title: "Aset Tidak Dapat Diperbaiki",
      message: `Aset yang Anda laporkan memerlukan perbaikan lebih lanjut oleh vendor eksternal. Tim General Affair akan segera mengoordinasikan proses perbaikan tersebut. Mohon menunggu.`,
      type: "MAINTENANCE_STATUS",
      link: "/lapor-kerusakan",
      sendEmailFlag: true,
    });

    return res.status(200).json({
      success: true,
      message: "Maintenance marked as cannot repair",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update maintenance",
      error: (error as Error).message,
    });
  }
};

const getAllActualizations = async (req: Request, res: Response) => {
  try {
    const result  = await maintenanceService.getAllActualizations();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getActualizationForm = async (req: Request, res: Response) => {
  try {
    const { maintenance_id } = req.params;

    if (!maintenance_id) {
      return res.status(400).json({
        success: false,
        message: "Maintenance ID is required",
      });
    }
    const result =
      await maintenanceService.getActualizationForm(maintenance_id);
    return res.status(200).json({
      success: true,
      message: "Actualization form fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch actualization form",
      error: (error as Error).message,
    });
  }
};

export default {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  getMyMaintenance,
  verifyMaintenance,
  takeMaintenance,
  completeMaintenance,
  completeMaintenanceExternal,
  cannotRepair,
  getAllActualizations,
  getActualizationForm,
};
