
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Package, Calendar, Clock } from "lucide-react";
import type { BorrowRequest, RoomBooking } from "@/types/inventory";

interface ApprovalCardProps {
  assetRequests: BorrowRequest[];
  bookingRequests: RoomBooking[];
  onApprove: (request: BorrowRequest | RoomBooking) => void;
  onReject: (request: BorrowRequest | RoomBooking) => void;
}

export function ApprovalCard({
  assetRequests,
  bookingRequests,
  onApprove,
  onReject,
}: ApprovalCardProps) {
  const pendingAssets = assetRequests.filter((r) => r.status === "pending");
  const pendingBookings = bookingRequests.filter((r) => r.status === "pending");
  const allPending = [
    ...pendingAssets.map((r) => ({ ...r, type: "asset" as const })),
    ...pendingBookings.map((r) => ({ ...r, type: "room" as const })),
  ];

  if (allPending.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Card Grid Style
          <Badge className="ml-2">{allPending.length}</Badge>
        </h3>
      </div>
      <div className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allPending.map((item) => {
            const isAsset = item.type === "asset";
            const assetReq = item as BorrowRequest & { type: string };
            const roomReq = item as RoomBooking & { type: string };
            const name = isAsset
              ? assetReq.requestedByName
              : roomReq.bookedByName;
            const initials = name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <Card
                key={item.id}
                className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="h-1.5" />
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-card-foreground truncate">
                        {name}
                      </p>
                      <p className="text-xs text-muted-foreground">Pemohon</p>
                    </div>
                    {isAsset ? (
                      <Package className="h-5 w-5 text-primary" />
                    ) : (
                      <Calendar className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm text-card-foreground">
                      {isAsset ? assetReq.assetName : roomReq.roomName}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {/* {isAsset
                          ? `${format(assetReq.startDate, "d MMM", {
                              locale: id,
                            })} - ${format(assetReq.endDate, "d MMM", {
                              locale: id,
                            })}`
                          : `${format(roomReq.date, "d MMM", {
                              locale: id,
                            })}, ${roomReq.startTime}-${roomReq.endTime}`} */}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => onApprove(item)}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Setujui
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => onReject(item)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Tolak
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
