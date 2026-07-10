import { useCallback, useState } from "react";
import { userService } from "../services/userService";
import type { User } from "../services/userService";

export const useUserSearch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchUsers = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setUsers([]);
      return;
    }

    setIsSearching(true);

    try {
      const data = await userService.search(keyword);
      setUsers(data);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    users,
    isSearching,
    searchUsers,
  };
};