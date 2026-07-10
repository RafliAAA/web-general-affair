import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MapPin, SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoomFormModal from "../components/RoomFormModal";
import { useRoomDetail, useUpdateRoom } from "../hooks/useRooms";
import type { CreateRoomPayload } from "../services/roomsService";

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between py-2 border-b last:border-0">
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-lg border bg-card p-5 space-y-3">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {title}
    </p>
    {children}
  </div>
);

const DetailSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-4 w-20" />
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-5 space-y-3">
          <Skeleton className="h-3 w-24" />
          {Array.from({ length: 3 }).map((_, j) => (
            <div
              key={j}
              className="flex justify-between py-2 border-b last:border-0"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const DetailRoomPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { room, isLoading, fetchRoom } = useRoomDetail();
  const [editOpen, setEditOpen] = useState(false);

  const { isSubmitting, updateRoom } = useUpdateRoom(() => id && fetchRoom(id));

  useEffect(() => {
    if (id) fetchRoom(id);
  }, [id, fetchRoom]);

  const handleUpdate = async (payload: CreateRoomPayload) => {
    if (!id) return;
    await updateRoom(id, payload);
    setEditOpen(false);
  };

  return (
    <DashboardLayout title="Detail Ruangan">
      {isLoading || !room ? (
        <DetailSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-medium">{room.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {room.location} · {room.capacity} orang
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={room.status === "Tersedia" ? "success" : "destructive"}
              >
                {room.status}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                <SquarePen className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionCard title="Informasi ruangan">
              <InfoRow icon={MapPin} label="Lokasi" value={room.location} />
              <InfoRow
                icon={Users}
                label="Kapasitas"
                value={`${room.capacity} orang`}
              />
            </SectionCard>

            <SectionCard title="Fasilitas">
              {room.facilities.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {room.facilities.map((f) => (
                    <Badge key={f.facility_id} variant="outline">
                      {f.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Tidak ada fasilitas
                </p>
              )}
            </SectionCard>
          </div>

          {/* Edit Modal */}
          <RoomFormModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            room={room}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default DetailRoomPage;
