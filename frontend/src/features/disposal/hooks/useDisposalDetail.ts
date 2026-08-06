import { useEffect, useState } from "react";
import {
  getDisposalById,
  updateDisposalHeader,
  addDisposalItems,
  removeDisposalItem,
} from "../services/disposalService";
import type {
  Disposal,
  DisposalItemPayload,
  UpdateDisposalHeaderPayload,
} from "../services/disposalService";

export const useDisposalDetail = (id: string | undefined) => {
  const [disposal, setDisposal] = useState<Disposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getDisposalById(id)
      .then(setDisposal)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (payload: UpdateDisposalHeaderPayload) => {
    if (!id) return;
    const updated = await updateDisposalHeader(id, payload);
    setDisposal(updated);
  };

  const handleAddItems = async (newItems: DisposalItemPayload[]) => {
    if (!id) return;
    const updated = await addDisposalItems(id, newItems);
    setDisposal(updated);
  };

  const handleRemoveItem = async (asset_id: string) => {
    if (!id) return;
    const updated = await removeDisposalItem(id, asset_id);
    setDisposal(updated);
  };

  return {
    disposal,
    loading,
    error,
    handleUpdate,
    handleAddItems,
    handleRemoveItem,
  };
};
