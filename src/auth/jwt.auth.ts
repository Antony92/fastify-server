import { FastifyRequest } from 'fastify'
import fs from 'fs'
import { sign, decode, verify } from 'jsonwebtoken'
import { User } from '../model/user.model'

const algorithm = 'HS256' //'RS256'
const issuer = 'default'
const audience = 'default'
const expiresIn = 3600 // 1 hour

const privateKeyPath = `${__dirname}/pk/jwt.priv`
const publicKeyPath = `${__dirname}/pk/jwt.pub`

const privateKey = fs.existsSync(privateKeyPath) ? fs.readFileSync(privateKeyPath, 'utf8') : 'test'
const publicKey = fs.existsSync(publicKeyPath) ? fs.readFileSync(publicKeyPath, 'utf8') : 'test'

export const createJWT = (payload: User) => {
	return sign(payload, privateKey, {
		algorithm,
		issuer,
		expiresIn,
		audience,
	})
}

export const getJWTPayload = (jwt: string) => {
	try {
		return decode(jwt) as User
	} catch (error) {
		// log error
		return null
	}
}

export const getJWTFromRequest = (request: FastifyRequest) => {
	if (request.headers.authorization && request.headers.authorization.includes('Bearer')) return request.headers.authorization.split(' ')[1]
	if (request.headers['X-Api-Key']) return request.headers['X-Api-Key'].toString()
}

export const isJWTValid = async (jwt: string) => {
	try {
		verify(jwt, publicKey, {
			algorithms: [algorithm],
			audience,
			issuer,
		})
		return true
	} catch (error) {
		// log error
		return false
	}
}

export const hasRole = (request: FastifyRequest, roles: string[]) => {
	try {
		const jwt = getJWTFromRequest(request)
		const user = getJWTPayload(jwt)
		return user?.roles.some((role) => roles.includes(role))
	} catch (error) {
		// log error
		return false
	}
}
