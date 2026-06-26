export interface ProcurementItem {
  procurement_item_id: string;
  procurement_id: string;
  part_number: string;
  description: string;
  quantity: number;
  unit_of_measure: string;
}

export interface Procurement {
  procurement_id: string;
  pr_number: string;
  pr_date: string;
  print_date: string;
  due_date: string;
  end_user: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  items?: ProcurementItem[];
}

export interface CreateProcurementPayload {
  pr_number: string;
  pr_date: string;
  print_date: string;
  due_date: string;
  end_user: string;
  remarks: string;
  items: {
    part_number: string;
    description: string;
    quantity: number;
    unit_of_measure: string;
  }[];
}
