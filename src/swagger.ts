import { SwaggerOptions } from '@fastify/swagger'

export const swaggerOptions: SwaggerOptions = {
	routePrefix: '/documentation',
	exposeRoute: true,
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
				name: 'Authentication',
				description: 'Authentication API'
			},
			{
				name: 'Test',
				description: 'Test API',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				},
				apiKey: {
					type: 'apiKey',
					name: 'x-api-key',
					in: 'header',
				},
			},
		},
	},
}
