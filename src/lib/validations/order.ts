import * as z from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const newOrderSchema = z.object({
  material: z.string({
    required_error: "Please select a material",
  }),
  quantity: z.number({
    required_error: "Please enter quantity",
  })
    .min(24, "Minimum order is 24 pieces")
    .max(1000, "Maximum order is 1000 pieces"),
  design: z.any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  design_description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
})

export type NewOrderSchema = z.infer<typeof newOrderSchema>