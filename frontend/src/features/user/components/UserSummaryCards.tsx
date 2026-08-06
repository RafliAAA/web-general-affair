import { UserCircle } from "lucide-react";
import type { User } from "../services/userService";

interface Props {
  users: User[];
}

const UserSummaryCards = ({ users }: Props) => {
  const cards = [
    { role: "USER", label: "Karyawan" },
    { role: "ADMIN", label: "General Affair" },
    { role: "IT", label: "Tim IT" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map(({ role, label }) => (
        <div
          key={role}
          className="rounded-lg border bg-card p-4 flex items-center gap-3"
        >
          <div className="p-2 rounded-md bg-muted">
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold">
              {users.filter((u) => u.role === role).length}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserSummaryCards;
