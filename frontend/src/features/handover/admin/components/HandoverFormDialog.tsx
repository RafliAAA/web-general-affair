import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, ChevronsUpDown, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAssets } from "../hooks/useAssets";
import { useEffect, useState } from "react";
import { useUserSearch } from "../../../user/hooks/useUserSearch";
import { useEntity } from "../../../entity/hooks/useEntity";
import { useDirectorate } from "../../../directorate/hooks/useDirectorate";
import type { CreateHandoverPayload } from "@/types/handover";

const itemSchema = z.object({
  asset_id: z.string().min(1, "Aset wajib dipilih"),
  notes: z.string().min(1, "Keterangan wajib diisi"),
});

const handoverSchema = z.object({
  user_id: z.string().min(1, "Penerima wajib dipilih"),
  handover_date: z.string().min(1, "Tanggal wajib diisi"),
  entity_id: z.string().min(1, "Entity wajib dipilih"),
  directorate_id: z.string().min(1, "Direktorat wajib diisi"),
  recipient_type: z.enum(["Personal", "Divisi"]),
  items: z.array(itemSchema).min(1, "Minimal 1 item aset"),
});

type HandoverFormValues = z.infer<typeof handoverSchema>;

interface HandoverFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateHandoverPayload) => void;
  isSubmitting: boolean;
}

const HandoverFormDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: HandoverFormDialogProps) => {
  const { assets, isLoading: isLoadingAssets } = useAssets();
  const { users, isSearching: isLoadingUsers, searchUsers } = useUserSearch();
  const { entities } = useEntity();
  const { directorates, fetchDirectorates } = useDirectorate();

  const [userKeyword, setUserKeyword] = useState("");
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const form = useForm<HandoverFormValues>({
    resolver: zodResolver(handoverSchema),
    defaultValues: {
      user_id: "",
      handover_date: new Date().toISOString().split("T")[0],
      entity_id: "",
      directorate_id: "",
      recipient_type: "Personal", // DEFAULT
      items: [{ asset_id: "", notes: "" }],
    },
  });

  useEffect(() => {
    if (userKeyword.trim().length >= 2) {
      searchUsers(userKeyword);
    }
  }, [userKeyword, searchUsers]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const watchedUserId = form.watch("user_id");
  const watchedEntityId = form.watch("entity_id");
  const watchedRecipientType = form.watch("recipient_type"); // WATCH RECIPIENT TYPE

  const selectedAssetIds = watchedItems.map((i) => i.asset_id).filter(Boolean);
  const selectedUser = users.find((u) => u.user_id === watchedUserId);

  useEffect(() => {
    if (watchedEntityId) {
      fetchDirectorates(watchedEntityId);
      form.setValue("directorate_id", "");
    }
  }, [watchedEntityId, fetchDirectorates, form]);

  const handleSubmit = (values: HandoverFormValues) => {
    onSubmit(values);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat handover baru</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Info Utama */}
            <div className="grid grid-cols-2 gap-4">
              {/* DROPDOWN JENIS PENERIMA */}
              <FormField
                control={form.control}
                name="recipient_type"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Jenis Penerima</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis Penerima" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Personal">
                          Personal (Individu)
                        </SelectItem>
                        <SelectItem value="Divisi">
                          Divisi / Departemen
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      {watchedRecipientType === "Divisi"
                        ? "PIC Divisi (Penanggung Jawab)"
                        : "Penerima"}
                    </FormLabel>
                    <Popover
                      open={userPopoverOpen}
                      onOpenChange={setUserPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                            disabled={isLoadingUsers}
                          >
                            {isLoadingUsers
                              ? "Memuat karyawan..."
                              : selectedUser
                                ? `${selectedUser.profile?.name ?? selectedUser.email}`
                                : "Pilih karyawan..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Cari nama karyawan..."
                            value={userKeyword}
                            onValueChange={setUserKeyword}
                          />
                          <CommandList>
                            {isLoadingUsers ? (
                              <div className="py-6 text-center text-sm text-muted-foreground">
                                Mencari...
                              </div>
                            ) : (
                              <CommandGroup>
                                {users.map((user) => {
                                  const isSelected =
                                    field.value === user.user_id;
                                  return (
                                    <CommandItem
                                      key={user.user_id}
                                      value={`${user.profile?.name ?? ""} ${user.email}`}
                                      onSelect={() =>
                                        field.onChange(user.user_id)
                                      }
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          isSelected
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                          {user.profile?.name ?? "—"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {user.email} · {user.role}
                                        </p>
                                      </div>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="handover_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal handover</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entity_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity (Perusahaan)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Entity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entities.map((ent) => (
                          <SelectItem key={ent.entity_id} value={ent.entity_id}>
                            {ent.entity_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="directorate_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      {watchedRecipientType === "Divisi"
                        ? "Divisi Penerima"
                        : "Direktorat"}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!watchedEntityId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Direktorat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {directorates.map((dir) => (
                          <SelectItem
                            key={dir.directorate_id}
                            value={dir.directorate_id}
                          >
                            {dir.directorate_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Daftar Item Aset */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Daftar aset</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ asset_id: "", notes: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Tambah aset
                </Button>
              </div>

              {fields.map((field, index) => {
                const selectedAssetId = watchedItems[index]?.asset_id;
                const selectedAsset = assets.find(
                  (a) => a.asset_id === selectedAssetId,
                );

                return (
                  <div
                    key={field.id}
                    className="p-3 rounded-lg border bg-muted/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">
                        Aset {index + 1}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`items.${index}.asset_id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Pilih aset</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                  disabled={isLoadingAssets}
                                >
                                  {isLoadingAssets
                                    ? "Memuat aset..."
                                    : selectedAsset
                                      ? `${selectedAsset.asset_code} — ${selectedAsset.asset_name}`
                                      : "Pilih aset..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-120 p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Cari nama atau kode aset..." />
                                <CommandList>
                                  <CommandEmpty>
                                    Aset tidak ditemukan
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {assets.map((asset) => {
                                      const isSelected =
                                        field.value === asset.asset_id;
                                      const isUsedElsewhere =
                                        !isSelected &&
                                        selectedAssetIds.includes(
                                          asset.asset_id,
                                        );
                                      return (
                                        <CommandItem
                                          key={asset.asset_id}
                                          value={`${asset.asset_code} ${asset.asset_name}`}
                                          onSelect={() => {
                                            if (!isUsedElsewhere)
                                              field.onChange(asset.asset_id);
                                          }}
                                          disabled={isUsedElsewhere}
                                          className={cn(
                                            isUsedElsewhere &&
                                              "opacity-40 cursor-not-allowed",
                                          )}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              isSelected
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                              {asset.asset_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {asset.asset_code} ·{" "}
                                              {asset.asset_type} ·{" "}
                                              {asset.condition}
                                            </p>
                                          </div>
                                          {isUsedElsewhere && (
                                            <span className="text-xs text-muted-foreground ml-2">
                                              sudah dipilih
                                            </span>
                                          )}
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedAsset && (
                      <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-background border text-xs text-muted-foreground">
                        <span>
                          S/N:{" "}
                          <span className="font-mono">
                            {selectedAsset.serial_number}
                          </span>
                        </span>
                        <span>·</span>
                        <span>
                          Kondisi:{" "}
                          <span className="font-medium text-foreground">
                            {selectedAsset.condition}
                          </span>
                        </span>
                        <span>·</span>
                        <span>
                          Status:{" "}
                          <span className="font-medium text-foreground">
                            {selectedAsset.status}
                          </span>
                        </span>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name={`items.${index}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Keterangan</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="cth: Tas + Charger"
                              {...field}
                              className="text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan handover"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HandoverFormDialog;
