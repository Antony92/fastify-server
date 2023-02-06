import { SwaggerOptions } from '@fastify/swagger'

const swaggerOptions: SwaggerOptions = {
	openapi: {
		info: {
			title: 'Test swagger',
			description: 'Testing the Fastify swagger API',
			version: '1.0.0',
		},
		servers: [
			{
				url: 'http://localhost:8080',
				description: 'Local server',
			},
		],
		externalDocs: {
			description: 'Confluence page',
			url: 'https://confluence.com',
		},
		tags: [
			{
				name: 'User',
				description: 'User API',
			},
			{
				name: 'Server events',
				description: 'Server events API'
			},
			{
				name: 'Audit logs',
				description: 'Audit logs API',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				},
			},
		},
	},
}

export default swaggerOptions
