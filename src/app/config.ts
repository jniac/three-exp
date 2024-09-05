export const isProduction = process.env.NODE_ENV === 'production'
export const basePathname = isProduction ? '/three-exp-test' : ''