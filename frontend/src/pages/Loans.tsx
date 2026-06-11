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
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

interface Loan {
  loan_id: string;
  asset_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected" | "borrowed";
  loan_date: string;
  approved_date?: string;
  rejection_reason?: string;
  asset?: {
    asset_name: string;
    asset_type: string;
    serial_number: string;
  };
  user?: {
    email: string;
  };
}

const statusConfig: Record<
  string,
  { color: string; icon: React.ReactNode; label: string }
> = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="w-4 h-4" />,
    label: "Menunggu Persetujuan",
  },
  approved: {
    color: "bg-blue-100 text-blue-800",
    icon: <CheckCircle className="w-4 h-4" />,
    label: "Disetujui",
  },
  borrowed: {
    color: "bg-green-100 text-green-800",
    icon: <ArrowRight className="w-4 h-4" />,
    label: "Dipinjam",
  },
  rejected: {
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="w-4 h-4" />,
    label: "Ditolak",
  },
};

export const LoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredLoans(loans);
    } else {
      setFilteredLoans(loans.filter((loan) => loan.status === filterStatus));
    }
  }, [loans, filterStatus]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/loans");
      const data = await response.json();
      if (data.success) {
        setLoans(data.data);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (loan_id: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/loans/${loan_id}/approve`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (data.success) {
        fetchLoans();
        setSelectedLoan(null);
      }
    } catch (error) {
      console.error("Error approving loan:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (loan_id: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/loans/${loan_id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejection_reason: rejectionReason }),
      });
      const data = await response.json();
      if (data.success) {
        fetchLoans();
        setSelectedLoan(null);
        setRejectionReason("");
      }
    } catch (error) {
      console.error("Error rejecting loan:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBorrow = async (loan_id: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/loans/${loan_id}/borrow`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (data.success) {
        fetchLoans();
        setSelectedLoan(null);
      }
    } catch (error) {
      console.error("Error borrowing asset:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout title="Peminjaman Aset">
      <div className="space-y-6">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
          >
            Semua
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            onClick={() => setFilterStatus("pending")}
          >
            Menunggu Persetujuan
          </Button>
          <Button
            variant={filterStatus === "approved" ? "default" : "outline"}
            onClick={() => setFilterStatus("approved")}
          >
            Disetujui
          </Button>
          <Button
            variant={filterStatus === "borrowed" ? "default" : "outline"}
            onClick={() => setFilterStatus("borrowed")}
          >
            Dipinjam
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredLoans.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Tidak ada data peminjaman
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aset</TableHead>
                  <TableHead>Peminjam</TableHead>
                  <TableHead>Tanggal Pinjam</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Approval</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan) => {
                  const config = statusConfig[loan.status];
                  return (
                    <TableRow key={loan.loan_id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">
                            {loan.asset?.asset_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {loan.asset?.serial_number}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{loan.user?.email}</TableCell>
                      <TableCell>{formatDate(loan.loan_date)}</TableCell>
                      <TableCell>
                        <Badge className={config.color}>
                          <span className="mr-2">{config.icon}</span>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {loan.approved_date
                          ? formatDate(loan.approved_date)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLoan(loan)}
                            >
                              Detail
                            </Button>
                          </DialogTrigger>
                          {selectedLoan?.loan_id === loan.loan_id && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detail Peminjaman</DialogTitle>
                                <DialogDescription>
                                  Kelola status peminjaman aset
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-medium">Aset</p>
                                  <p className="text-sm text-gray-600">
                                    {selectedLoan.asset?.asset_name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Peminjam
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {selectedLoan.user?.email}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Status</p>
                                  <p className="text-sm text-gray-600">
                                    {statusConfig[selectedLoan.status].label}
                                  </p>
                                </div>
                                {selectedLoan.rejection_reason && (
                                  <div>
                                    <p className="text-sm font-medium text-red-600">
                                      Alasan Penolakan
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {selectedLoan.rejection_reason}
                                    </p>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  {selectedLoan.status === "pending" && (
                                    <>
                                      <Button
                                        className="w-full"
                                        onClick={() =>
                                          handleApprove(selectedLoan.loan_id)
                                        }
                                        disabled={actionLoading}
                                      >
                                        Setujui Peminjaman
                                      </Button>
                                      <div>
                                        <input
                                          type="text"
                                          placeholder="Alasan penolakan (jika ditolak)"
                                          value={rejectionReason}
                                          onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                          }
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                      </div>
                                      <Button
                                        className="w-full"
                                        variant="destructive"
                                        onClick={() =>
                                          handleReject(selectedLoan.loan_id)
                                        }
                                        disabled={
                                          actionLoading || !rejectionReason
                                        }
                                      >
                                        Tolak Peminjaman
                                      </Button>
                                    </>
                                  )}
                                  {selectedLoan.status === "approved" && (
                                    <Button
                                      className="w-full"
                                      onClick={() =>
                                        handleBorrow(selectedLoan.loan_id)
                                      }
                                      disabled={actionLoading}
                                    >
                                      Konfirmasi Pengambilan Aset
                                    </Button>
                                  )}
                                </div>
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

export default LoansPage;
