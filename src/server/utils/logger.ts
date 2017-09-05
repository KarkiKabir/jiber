const level = process.env.REJIBE_LOG_LEVEL || 0
const log = console.log as any

const logAtLevel = (min: number) => {
  return (...params: any[]) => {
    if (level >= min) log(...params)
  }
}

export const logger = {
  debug: logAtLevel(0),
  info: logAtLevel(1),
  warning: logAtLevel(2),
  error: logAtLevel(3)
}
