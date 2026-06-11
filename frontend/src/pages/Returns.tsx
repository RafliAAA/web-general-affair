import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, AlertCircle, Trash2 } from "lucide-react";

interface Return {
  return_id: string;
  loan_id: string;
  return_date: string;
  condition: "good" | "damaged" | "lost";
  notes?: string;
  received_by?: string;
  loan?: {
    asset: {
      asset_name: string;
      serial_number: string;
    };
    user: {
      email: string;
    };
  };
}

const conditionConfig: Record<
  string,
  { color: string; icon: React.ReactNode; label: string }
> = {
  good: {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="w-4 h-4" />,
    label: "Baik",
  },
  damaged: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <AlertCircle className="w-4 h-4" />,
    label: "Rusak",
  },
  lost: {
    color: "bg-red-100 text-red-800",
    icon: <Trash2 className="w-4 h-4" />,
    label: "Hilang",
  },
};

export const ReturnsPage = () => {
  const [returns, setReturns] = useState<Return[]>([]);
  const [filteredReturns, setFilteredReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCondition, setFilterCondition] = useState<string>("all");
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, []);

  useEffect(() => {
    if (filterCondition === "all") {
      setFilteredReturns(returns);
    } else {
      setFilteredReturns(
        returns.filter((ret) => ret.condition === filterCondition),
      );
    }
  }, [returns, filterCondition]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/returns");
      const data = await response.json();
      if (data.success) {
        setReturns(data.data);
      }
    } catch (error) {
      console.error("Error fetching returns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReturn = async (return_id: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/returns/${return_id}/confirm`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (data.success) {
        fetchReturns();
        setSelectedReturn(null);
      }
    } catch (error) {
      console.error("Error confirming return:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout title="Pengembalian Aset">
      <div className="space-y-6">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterCondition === "all" ? "default" : "outline"}
            onClick={() => setFilterCondition("all")}
          >
            Semua
          </Button>
          <Button
            variant={filterCondition === "good" ? "default" : "outline"}
            onClick={() => setFilterCondition("good")}
          >
            Baik
          </Button>
          <Button
            variant={filterCondition === "damaged" ? "default" : "outline"}
            onClick={() => setFilterCondition("damaged")}
          >
            Rusak
          </Button>
          <Button
            variant={filterCondition === "lost" ? "default" : "outline"}
            onClick={() => setFilterCondition("lost")}
          >
            Hilang
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredReturns.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Tidak ada data pengembalian
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aset</TableHead>
                  <TableHead>Peminjam</TableHead>
                  <TableHead>Tanggal Pengembalian</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Diterima Oleh</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((ret) => {
                  const config = conditionConfig[ret.condition];
                  return (
                    <TableRow key={ret.return_id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">
                            {ret.loan?.asset.asset_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ret.loan?.asset.serial_number}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{ret.loan?.user.email}</TableCell>
                      <TableCell>{formatDate(ret.return_date)}</TableCell>
                      <TableCell>
                        <Badge className={config.color}>
                          <span className="mr-2">{config.icon}</span>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{ret.received_by || "-"}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedReturn(ret)}
                            >
                              Detail
                            </Button>
                          </DialogTrigger>
                          {selectedReturn?.return_id === ret.return_id && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detail Pengembalian</DialogTitle>
                                <DialogDescription>
                                  Kelola pengembalian aset
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-medium">Aset</p>
                                  <p className="text-sm text-gray-600">
                                    {selectedReturn.loan?.asset.asset_name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Peminjam
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {selectedReturn.loan?.user.email}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Tanggal Pengembalian
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {formatDate(selectedReturn.return_date)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Kondisi</p>
                                  <p className="text-sm text-gray-600">
                                    {
                                      conditionConfig[selectedReturn.condition]
                                        .label
                                    }
                                  </p>
                                </div>
                                {selectedReturn.notes && (
                                  <div>
                                    <p className="text-sm font-medium">
                                      Catatan
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {selectedReturn.notes}
                                    </p>
                                  </div>
                                )}
                                {selectedReturn.received_by && (
                                  <div>
                                    <p className="text-sm font-medium">
                                      Diterima Oleh
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {selectedReturn.received_by}
                                    </p>
                                  </div>
                                )}

                                {!selectedReturn.received_by && (
                                  <Button
                                    className="w-full"
                                    onClick={() =>
                                      handleConfirmReturn(
                                        selectedReturn.return_id,
                                      )
                                    }
                                    disabled={actionLoading}
                                  >
                                    Konfirmasi Penerimaan
                                  </Button>
                                )}
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReturnsPage;
