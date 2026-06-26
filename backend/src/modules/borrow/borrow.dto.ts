import { z } from "zod"

export const CreateBorrowSchema = z.object({
    asset_id: z.string(),
    borrow_date: z.coerce.date(),
    borrow_reason: z.string(),
    expected_return_date: z.coerce.date()
})

export type CreateBorrowBody = z.infer<typeof CreateBorrowSchema>

export type CreateBorrowInput = CreateBorrowBody & {
    user_id: string
}