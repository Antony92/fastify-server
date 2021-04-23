import dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/.env` })

const config = {
    environment: process.env.ENVIRONMENT || 'development',
    server: {
        port: parseInt(process.env.SERVER_PORT) || 8080,
        rateLimit: parseInt(process.env.SERVER_RATE_LIMIT) || 1000,
    }
}

export default config