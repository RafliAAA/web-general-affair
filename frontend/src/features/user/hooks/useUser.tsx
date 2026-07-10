import { useCallback, useState } from "react";
import { toast } from "sonner";
import { userService } from "../services/userService";
import type { User, CreateUserPayload } from "../services/userService";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      toast.error("Gagal memuat data user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, isLoading, fetchUsers };
};

export const useCreateUser = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUser = useCallback(
    async (payload: CreateUserPayload) => {
      setIsSubmitting(true);
      try {
        await userService.create(payload);
        toast.success("User berhasil ditambahkan");
        onSuccess?.();
      } catch {
        toast.error("Gagal menambahkan user");
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return { isSubmitting, createUser };
};
