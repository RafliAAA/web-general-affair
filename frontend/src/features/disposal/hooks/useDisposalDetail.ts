import { useEffect, useState } from "react";
import { getDisposalById, updateDisposal } from "../services/disposalService";
import type { Disposal, DisposalItemPayload } from "../services/disposalService";

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

  const handleUpdate = (updated: Disposal) => {
    setDisposal(updated);
  };

  // Tambah item baru ke disposal yang sudah ada (gabung item lama + baru)
const handleAddItems = async (newItems: DisposalItemPayload[]) => {
  if (!disposal || !id) return;

  const existingItems: DisposalItemPayload[] =
    disposal.items?.map((i) => ({
      asset_id: i.asset_id,
      method: i.method,
      notes: i.notes,
    })) ?? [];

  const updated = await updateDisposal(id, {
    memo_number: disposal.memo_number,
    memo_date: new Date(disposal.memo_date).toISOString(),
    subject: disposal.subject,
    description: disposal.description,
    items: [...existingItems, ...newItems],
  });
  setDisposal(updated);
};

const handleRemoveItem = async (asset_id: string) => {
  if (!disposal || !id) return;

  const remainingItems: DisposalItemPayload[] =
    disposal.items
      ?.filter((i) => i.asset_id !== asset_id)
      .map((i) => ({
        asset_id: i.asset_id,
        method: i.method,
        notes: i.notes,
      })) ?? [];

  const updated = await updateDisposal(id, {
    memo_number: disposal.memo_number,
    memo_date: new Date(disposal.memo_date).toISOString(),
    subject: disposal.subject,
    description: disposal.description,
    items: remainingItems,
  });
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