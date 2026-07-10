import { Badge } from "@/components/ui/badge";
import type { Room } from "@/types/rooms";

interface RoomStatusBadgeProps {
  status: Room["status"];
}

const RoomStatusBadge = ({ status }: RoomStatusBadgeProps) => {
  return (
    <Badge variant={status === "Tersedia" ? "success" : "destructive"}>
      {status === "TidakTersedia" ? "Tidak Tersedia" : status}
    </Badge>
  );
};

export default RoomStatusBadge;
