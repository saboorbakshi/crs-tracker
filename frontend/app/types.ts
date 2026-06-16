import { z } from 'zod'

export const RawRoundSchema = z.object({
  drawNumber: z.string(),
  drawNumberURL: z.string(),
  drawDate: z.string().transform((val) => new Date(val)),
  drawDateFull: z.string(),
  drawName: z.string(),
  drawSize: z.number(),
  drawCRS: z.number(),
  mitext: z.string(),
  DrawText1: z.string(),
  drawText2: z.string(),
  drawDateTime: z.string(),
  drawCutOff: z.string(),
  drawDistributionAsOn: z.string(),
  dd1: z.number(),
  dd2: z.number(),
  dd3: z.number(),
  dd4: z.number(),
  dd5: z.number(),
  dd6: z.number(),
  dd7: z.number(),
  dd8: z.number(),
  dd9: z.number(),
  dd10: z.number(),
  dd11: z.number(),
  dd12: z.number(),
  dd13: z.number(),
  dd14: z.number(),
  dd15: z.number(),
  dd16: z.number(),
  dd17: z.number(),
  dd18: z.number(),
})

export const ApiResponseSchema = z.object({
  updatedAt: z.string(),
  payload: z.object({
    classes: z.string(),
    rounds: z.array(RawRoundSchema).min(1),
  }),
})

export type ApiResponse = z.infer<typeof ApiResponseSchema>

export type RawRound = z.infer<typeof RawRoundSchema>

export type Round = {
  drawDate: Date
  drawDateFull: string
  score: number
  invitations: number
  category: string
  distributionDateFull: string
  pool: Record<string, number>
  totalCandidates: number
}

export type DrawDataPoint = {
  index: number
  date: Date
  dateFull: string
  score: number
  invitations: number
  category: string
}

export type StackedInvitationDataPoint = {
  year: number
  month: number
  [category: string]: number
}

export type PoolDataPoint = {
  range: string
  count: number
}
