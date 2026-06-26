import { CannotRepairDTO, CompleteMaintenanceDTO, CreateMaintenanceDTO, TakeMaintenanceDTO, VerifyMaintenanceDTO } from "./maintenance.dto";
import maintenanceRepository from "./maintenance.repository";

const createMaintenance = async (data: CreateMaintenanceDTO) => {
  const maintenance = await maintenanceRepository.createMaintenance(data);

  if (!maintenance) throw new Error("Failed to create maintenance");

  return maintenance;
};

const getAllMaintenances = async () => {
  const maintenance = await maintenanceRepository.getAllMaintenance();

  if (!maintenance) throw new Error("Failed to fetch maintenance");

  return maintenance;
};

const getMaintenanceById = async (maintenance_id: string) => {
  const maintenance =
    await maintenanceRepository.getMaintenanceById(maintenance_id);

  if (!maintenance) throw new Error("Failed to fetch maintenance");

  return maintenance;
};

const getMyMaintenance = async (user_id: string) => {
  const maintenance = await maintenanceRepository.getMyMaintenance(user_id);

  if (!maintenance) throw new Error("Failed to fetch maintenance");

  return maintenance;
};

const verifyMaintenance = async (data: VerifyMaintenanceDTO) => {
  const maintenance = await maintenanceRepository.verifyMaintenance(data);

  if (!maintenance) throw new Error("Failed to verify maintenance");

  return maintenance;
};

const takeMaintenance = async (data: TakeMaintenanceDTO) => {
  const maintenance = await maintenanceRepository.takeMaintenance(data);
  if (!maintenance) throw new Error("Failed to take maintenance");
  return maintenance;
};

const completeMaintenance = async (data: CompleteMaintenanceDTO) => {
  const maintenance = await maintenanceRepository.completeMaintenance(data);
  if (!maintenance) throw new Error("Failed to complete maintenance");
  return maintenance;
};

const cannotRepair = async (data: CannotRepairDTO) => {
  const maintenance = await maintenanceRepository.cannotRepair(data);
  if (!maintenance) throw new Error("Failed to update maintenance");
  return maintenance;
};

const getActualizationForm = async (maintenance_id: string) => {
  const form = await maintenanceRepository.getActualizationForm(maintenance_id);
  if (!form) throw new Error("Actualization form not found");
  return form;
};

export default {
  createMaintenance,
  getAllMaintenances,
  getMaintenanceById,
  getMyMaintenance,
  verifyMaintenance,
  takeMaintenance,
  completeMaintenance,
  cannotRepair,
  getActualizationForm
};
