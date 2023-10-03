import { SwaggerOptions } from '@fastify/swagger'

const swaggerOptions: SwaggerOptions = {
	openapi: {
		info: {
			title: 'Server API',
			description: 'TODO',
			version: '2.0.0',
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
