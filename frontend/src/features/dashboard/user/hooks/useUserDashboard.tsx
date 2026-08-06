import { useState, useEffect } from "react";
import {
  getUserDashboard,
  type UserDashboardData,
} from "../services/userDashboardService";

export const useUserDashboard = () => {
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const responseData = await getUserDashboard();
        setData(responseData);
      } catch (error) {
        console.error("Gagal fetch user dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
};
