import { useState, useEffect } from "react";
import {
  getITDashboard,
  type ITDashboardData,
} from "../services/ITDashboardService";

export const useITDashboard = () => {
  const [data, setData] = useState<ITDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const responseData = await getITDashboard();
        setData(responseData);
      } catch (error) {
        console.error("Gagal fetch IT dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
};
