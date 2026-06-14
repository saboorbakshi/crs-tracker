import fs from 'fs'
import { z } from 'zod'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND_DATA_FILE = path.resolve(__dirname, '../frontend/data.json')

const RAW_DATA_INPUT = process.argv[2]

if (!RAW_DATA_INPUT) {
  console.error('Error: No input file provided.')
  console.error('Usage: node update-data.js <path-to-raw-json>')
  process.exit(1)
}

const commaInt = z
  .string()
  .regex(/^[\d,]+$/, 'Must contain only digits and commas')
  .transform((val, ctx) => {
    const cleaned = val.replace(/,/g, '')
    const parsed = Number(cleaned)
    if (!Number.isSafeInteger(parsed)) {
      ctx.addIssue({
        code: 'custom',
        message: `"${val}" is not a safe integer`,
      })
      return z.NEVER
    }
    return parsed
  })

const strictISODate = z.string().transform((val) => new Date(val).toISOString())

const RoundSchema = z.object({
  drawNumber: z.string(),
  drawNumberURL: z.string(),
  drawDate: strictISODate,
  drawDateFull: z.string(),
  drawName: z.string(),
  drawSize: commaInt,
  drawCRS: commaInt,
  mitext: z.string(),
  DrawText1: z.string(),
  drawText2: z.string(),
  drawDateTime: z.string(),
  drawCutOff: z.string(),
  drawDistributionAsOn: z.string(),
  dd1: commaInt,
  dd2: commaInt,
  dd3: commaInt,
  dd4: commaInt,
  dd5: commaInt,
  dd6: commaInt,
  dd7: commaInt,
  dd8: commaInt,
  dd9: commaInt,
  dd10: commaInt,
  dd11: commaInt,
  dd12: commaInt,
  dd13: commaInt,
  dd14: commaInt,
  dd15: commaInt,
  dd16: commaInt,
  dd17: commaInt,
  dd18: commaInt,
})

const ApiResponseSchema = z.object({
  classes: z.string(),
  rounds: z.array(RoundSchema).min(1, 'API must contain at least one round'),
})

async function main() {
  try {
    const absolutePath = path.resolve(process.cwd(), RAW_DATA_INPUT)

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Input file not found: ${absolutePath}`)
    }

    console.log(`Reading: ${absolutePath}`)
    const fileContent = fs.readFileSync(absolutePath, 'utf8')
    const apiJson = JSON.parse(fileContent)

    console.log('Validating data structure...')
    const parseResult = ApiResponseSchema.safeParse(apiJson)

    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        console.error(
          `Validation Issue - Path: ${issue.path.join('.')} | ${issue.message}`
        )
      })
      throw new Error('Schema validation failed')
    }

    // Path is guaranteed to exist
    const oldData = JSON.parse(fs.readFileSync(FRONTEND_DATA_FILE, 'utf8'))
    const oldDrawNumber = oldData.payload.rounds[0].drawNumber
    const newDrawNumber = parseResult.data.rounds[0].drawNumber

    console.log(`Current draw: ${oldDrawNumber}`)
    console.log(`API draw:     ${newDrawNumber}`)

    if (newDrawNumber > oldDrawNumber) {
      const updatedData = {
        updatedAt: new Date().toISOString(),
        payload: parseResult.data,
      }

      fs.writeFileSync(FRONTEND_DATA_FILE, JSON.stringify(updatedData, null, 2))
      console.log(`Success: Updated ${FRONTEND_DATA_FILE}`)
    } else {
      console.log('No new draw detected. Skipping update.')
    }
  } catch (error) {
    console.error('Fatal Error:')
    console.error(error.message)
    process.exit(1)
  }
}

main()
