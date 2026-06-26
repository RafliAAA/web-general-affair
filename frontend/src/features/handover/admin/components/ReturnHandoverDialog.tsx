import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ReturnHandoverPayload } from "@/types/handover";

const returnSchema = z.object({
  return_notes: z.string().min(1, "Catatan pengembalian wajib diisi"),
});

type ReturnFormValues = z.infer<typeof returnSchema>;

interface ReturnHandoverDialogProps {
  open: boolean;
  handoverId: string | null;
  onClose: () => void;
  onSubmit: (id: string, payload: ReturnHandoverPayload) => void;
  isSubmitting: boolean;
}

const ReturnHandoverDialog = ({
  open,
  handoverId,
  onClose,
  onSubmit,
  isSubmitting,
}: ReturnHandoverDialogProps) => {
  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: { return_notes: "" },
  });

  const handleSubmit = (values: ReturnFormValues) => {
    if (!handoverId) return;
    onSubmit(handoverId, values);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Proses Pengembalian</DialogTitle>
          <DialogDescription>
            Isi catatan pengembalian aset. Status handover akan berubah menjadi{" "}
            <strong>Dikembalikan</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="return_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan Pengembalian</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tuliskan kondisi aset saat dikembalikan..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Memproses..." : "Konfirmasi Pengembalian"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnHandoverDialog;
