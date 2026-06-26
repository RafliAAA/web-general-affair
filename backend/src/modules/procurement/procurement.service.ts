import procurementRepository from "./procurement.repository";
import {
  CreateProcurementInput,
  UpdateProcurementInput,
} from "./procurement.dto";
import { supabase } from "../../config/supabase";

const createProcurement = async (data: CreateProcurementInput) => {
  const procurement = await procurementRepository.createProcurement(data);

  if (!procurement) throw new Error("Failed to create procurement");

  return procurement;
};

const getAllProcurements = async () => {
  const procurements = await procurementRepository.getAllProcurements();

  if (!procurements) throw new Error("Failed to get procurements");

  return procurements;
};

const getProcurementById = async (procurement_id: string) => {
  const procurement = await procurementRepository.getProcurementById(procurement_id);

  if (!procurement) throw new Error("Procurement not found");

  return procurement;
};

const updateProcurement = async (
  procurement_id: string,
  data: UpdateProcurementInput,
) => {
  const procurement = await procurementRepository.updateProcurement(
    procurement_id,
    data,
  );

  if (!procurement) throw new Error("Failed to update procurement");

  return procurement;
};

const deleteProcurement = async (procurement_id: string) => {
  const procurement = await procurementRepository.deleteProcurement(procurement_id);

  if (!procurement) throw new Error("Failed to delete procurement");

  return procurement;
};



export default {
  createProcurement,
  getAllProcurements,
  getProcurementById,
  updateProcurement,
  deleteProcurement,
};
