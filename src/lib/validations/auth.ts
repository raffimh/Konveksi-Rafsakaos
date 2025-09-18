import * as z from "zod";
import { validateEmailDomain } from "./email-blacklist";

// Helper function to create email validation with language support
const createEmailValidation = (language: 'id' | 'en' = 'en') => {
  const messages = {
    required: language === 'id' ? 'Email wajib diisi' : 'Email is required',
    invalid: language === 'id' ? 'Format email tidak valid' : 'Invalid email address',
    temporary: language === 'id'
      ? 'Email sementara tidak diperbolehkan. Gunakan email permanen agar kami dapat mengirim update pesanan dan berkomunikasi dengan baik.'
      : 'Temporary email addresses are not allowed. Please use a permanent email address for better communication and order updates.'
  };

  return z
    .string()
    .min(1, { message: messages.required })
    .email({ message: messages.invalid })
    .refine((email) => {
      const validation = validateEmailDomain(email, language);
      return validation.isValid;
    }, {
      message: messages.temporary
    });
};

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .refine((email) => {
        const validation = validateEmailDomain(email, 'en');
        return validation.isValid;
      }, {
        message: "Temporary email addresses are not allowed. Please use a permanent email address for better communication and order updates."
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      ),
    confirmPassword: z.string(),
    displayName: z
      .string()
      .min(3, { message: "Display name must be at least 3 characters" })
      .max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .refine((email) => {
      const validation = validateEmailDomain(email, 'en');
      return validation.isValid;
    }, {
      message: "Temporary email addresses are not allowed. Please use a permanent email address."
    }),
});

// Localized schemas for Indonesian
export const loginSchemaId = z.object({
  email: createEmailValidation('id'),
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter" })
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      {
        message: "Password harus mengandung huruf kecil, huruf besar, angka, dan karakter khusus",
      }
    ),
});

export const registerSchemaId = z
  .object({
    email: createEmailValidation('id'),
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter" })
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        {
          message: "Password harus mengandung huruf kecil, huruf besar, angka, dan karakter khusus",
        }
      ),
    confirmPassword: z.string(),
    displayName: z
      .string()
      .min(3, { message: "Nama tampilan minimal 3 karakter" })
      .max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export const resetPasswordSchemaId = z.object({
  email: createEmailValidation('id'),
});

// Update English schemas to use the helper
export const loginSchemaEn = z.object({
  email: createEmailValidation('en'),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
});

export const registerSchemaEn = z
  .object({
    email: createEmailValidation('en'),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        {
          message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      ),
    confirmPassword: z.string(),
    displayName: z
      .string()
      .min(3, { message: "Display name must be at least 3 characters" })
      .max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchemaEn = z.object({
  email: createEmailValidation('en'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;