import { z } from "zod";

export const salesReportQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  groupBy: z.enum(["day", "week", "month"]).optional(),
});

export type SalesReportQueryInput = z.input<typeof salesReportQuerySchema>;
