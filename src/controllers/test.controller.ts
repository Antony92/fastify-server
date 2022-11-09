import { FastifyRequest, FastifyReply } from 'fastify'

export const testGetHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	return { message: `Get test works` }
}

export const testGetByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = request.params as any
	return { message: `Get test by id works`, id }
}

export const testPostHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { number, name } = request.body as any
	return { number, name }
}

export const testUploadHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const data = await request.saveRequestFiles({
		limits: {
			files: 1,
			fileSize: 1 * 1024 * 1024 // 1MB
		}
	})
	return { message: `Upload file works` }
}

export const testSecuredHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	return { message: `Secured by logged user`, user: request.user }
}

export const testAdminHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	return { message: `Secured by role admin`, user: request.user }
}