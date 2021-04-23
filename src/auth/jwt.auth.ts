import { FastifyRequest } from 'fastify'
import fs from 'fs'
import { sign, decode, verify } from 'jsonwebtoken'
import config from '../config'

const algorithm = 'RS256'
const issuer = config.jwt.issuer
const audience = config.jwt.audience
const expiresIn = config.jwt.expire

const privateKeyPath = `${__dirname}/pk/jwt.priv`
const publicKeyPath = `${__dirname}/pk/jwt.pub`

const privateKey = fs.existsSync(privateKeyPath) ? fs.readFileSync(privateKeyPath, 'utf8') : null
const publicKey = fs.existsSync(publicKeyPath) ? fs.readFileSync(publicKeyPath, 'utf8') : null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createJWT = async (payload: any) => {
	return new Promise<string>((resolve, reject) => {
		try {
			const jwt = sign(payload, privateKey, {
				algorithm,
				issuer,
				expiresIn,
				audience,
			})
			resolve(jwt)
		} catch (error) {
			reject(error)
		}
	})
}

export const getJWTPayload = (jwt: string) => {
	return decode(jwt)
}

export const getJWTFromRequest = (request: FastifyRequest) => {
	if (request.headers.authorization && request.headers.authorization.includes('Bearer')) return request.headers.authorization.split(' ')[1]
	if (request.headers['X-Api-Key']) return request.headers['X-Api-Key'].toString()
}

export const isJWTValid = async (jwt: string) => {
	return new Promise<boolean>((resolve, reject) => {
		try {
			verify(jwt, publicKey, {
				algorithms: [algorithm],
				audience,
				issuer,
			})
			resolve(true)
		} catch (error) {
			reject(false)
		}
	})
}
