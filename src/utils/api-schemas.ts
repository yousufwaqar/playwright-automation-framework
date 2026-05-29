import { z } from "zod";

/**
 * API Schemas - Defined using Zod for robust runtime validation
 */

export const HealthCheckSchema = z.object({
  status: z.string(),
  version: z.string().optional(),
  timestamp: z.string().optional(),
});

export const ReportSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  status: z.enum(["active", "archived", "draft"]),
  owner: z.string().optional(),
});

export const ReportsResponseSchema = z.object({
  data: z.array(ReportSchema),
  total: z.number().optional(),
});

export type HealthCheck = z.infer<typeof HealthCheckSchema>;
export type Report = z.infer<typeof ReportSchema>;
export type ReportsResponse = z.infer<typeof ReportsResponseSchema>;
