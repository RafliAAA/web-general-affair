import { useEffect, useState } from "react";
import api from "../../../../lib/axios";

export interface UserOption {
  user_id: string;
  email: string;
  role: string;
  profile: {
    name: string | null;
    foto_profil: string | null;
  } | null;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { users, isLoading, error };
};
