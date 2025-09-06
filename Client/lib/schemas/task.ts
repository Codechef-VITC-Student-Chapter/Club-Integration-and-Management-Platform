import z from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(100, "Title too long"),
  points: z
    .number()
    .min(1, "Points must be at least 1")
    .max(1000, "Points too high"),
});

export type TaskFormData = z.infer<typeof taskSchema>;
