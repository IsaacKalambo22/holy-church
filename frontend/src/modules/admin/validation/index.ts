import * as z from 'zod';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  STUDENT = 'STUDENT',
}

export const phoneNumberRegex =
  /^\+?[1-9]\d{1,14}$/;

export const createUserSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' }),
  phoneNumber: z
    .string()
    .regex(phoneNumberRegex, {
      message: 'Invalid phone number format',
    }),
  name: z.string().min(2, {
    message:
      'Name must be at least 2 characters long',
  }),
  role: z.nativeEnum(Role, {
    required_error: 'Role is required',
  }),
});

export const updateUserSchema =
  createUserSchema.partial();

export const VALID_IMAGE_TYPES = [
  'image/jpeg', // JPG, JPEG
  'image/jpg',
  'image/png', // PNG
  'image/gif', // GIF
  'image/webp', // WEBP
  'image/bmp', // BMP
  'image/svg+xml', // SVG
];

export const courseSchema = z.object({
  courseTitle: z
    .string()
    .min(1, 'Title is required'),
  courseDescription: z
    .string()
    .min(1, 'Description is required'),
  courseCategory: z
    .string()
    .min(1, 'Category is required'),
  coursePrice: z
    .number()
    .min(0, 'Price must be a positive number'),
  images: z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0, {
      message: 'At least one image is required.',
    })
    .refine((files) => files.length <= 1, {
      message: 'You can upload one image only.',
    })
    .refine(
      (files) =>
        files.every(
          (file) => file.size <= 5 * 1024 * 1024
        ),
      {
        message: `Each file must be less than 5MB.`,
      }
    )
    .refine(
      (files) =>
        files.every((file) =>
          VALID_IMAGE_TYPES.includes(file.type)
        ),
      {
        message:
          'Only image files are allowed (JPEG, PNG, GIF, WEBP, SVG, etc.).',
      }
    ),
  courseStatus: z.boolean(),
});

export type CourseFormData = z.infer<
  typeof courseSchema
>;

// Chapter Schemas
export const chapterSchema = z.object({
  title: z
    .string()
    .min(
      2,
      'Title must be at least 2 characters'
    ),
  content: z
    .string()
    .min(
      10,
      'Content must be at least 10 characters'
    ),
  video: z
    .union([z.string(), z.instanceof(File)])
    .optional(),
});

export type ChapterFormData = z.infer<
  typeof chapterSchema
>;

// Section Schemas
export const sectionSchema = z.object({
  title: z
    .string()
    .min(
      2,
      'Title must be at least 2 characters'
    ),
  description: z
    .string()
    .min(
      10,
      'Description must be at least 10 characters'
    ),
});

export type SectionFormData = z.infer<
  typeof sectionSchema
>;

// Guest Checkout Schema
export const guestSchema = z.object({
  email: z
    .string()
    .email('Invalid email address'),
});

export type GuestFormData = z.infer<
  typeof guestSchema
>;

// Notification Settings Schema
export const notificationSettingsSchema =
  z.object({
    courseNotifications: z.boolean(),
    emailAlerts: z.boolean(),
    smsAlerts: z.boolean(),
    notificationFrequency: z.enum([
      'immediate',
      'daily',
      'weekly',
    ]),
  });

export type NotificationSettingsFormData =
  z.infer<typeof notificationSettingsSchema>;

export enum AccountType {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
  PRO = 'PRO',
}
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export const createStudentSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' }),
  phoneNumber: z
    .string()
    .regex(phoneNumberRegex, {
      message: 'Invalid phone number format',
    })
    .optional(),
  name: z.string().min(2, {
    message:
      'Name must be at least 2 characters long',
  }),
  avatar: z.optional(z.string()),
  about: z.string().optional(),
  age: z.number().min(1, {
    message: 'Age must be a positive number',
  }),
  contactInfo: z.string().optional(),
  backgroundSummary: z.string().optional(),
  initialAssessment: z.string().optional(),
  aptitudesAndStrengths: z.string().optional(),
  shortTermGoals: z.string().optional(),
  longTermObjectives: z.string().optional(),
  workshopsAttended: z.string().optional(),
  resourcesUtilized: z.string().optional(),
  skillsDevelopment: z.string().optional(),
  behavioralChanges: z.string().optional(),
  feedbackAndSelfReflection: z
    .string()
    .optional(),
  obstaclesEncountered: z.string().optional(),
  interventionsProvided: z.string().optional(),
  accountType: z.nativeEnum(AccountType, {
    required_error: 'Account type is required',
  }),
  gender: z.nativeEnum(Gender, {
    required_error: 'Gender is required',
  }),
});

export const updateStudentSchema =
  createStudentSchema.partial();

export const chapterSchemaValidation = z.object({
  title: z
    .string()
    .min(
      5,
      'Chapter title must be at least 5 characters'
    ),
  description: z
    .string()
    .min(
      10,
      'Chapter description must be at least 10 characters'
    ),
  content: z
    .string()
    .min(
      10,
      'Chapter content must be at least 10 characters'
    ),
  isPublished: z.boolean(),
  isFree: z.boolean(),
});

export const updateChapterSchema =
  chapterSchemaValidation.partial();

// Schema for an attachment
const attachmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Attachment filename is required'),
});

enum Category {
  DESTINY = 'Destiny',
  SUCCESS = 'Success',
  IDENTITY = 'Identity',
  PURPOSE_OF_EXISTENCE = 'Purpose of existence',
}
export const createCourseSchema = z.object({
  title: z
    .string()
    .min(
      5,
      'Course title must be at least 5 characters'
    )
    .optional(),
  description: z.string().optional(),
  category: z.nativeEnum(Category).optional(),
  price: z
    .number()
    .min(0, 'Price must be a non-negative number')
    .optional(),
  isPublished: z.boolean().optional(),
});
