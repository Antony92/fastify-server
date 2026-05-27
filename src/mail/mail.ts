import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';

const __dirname = dirname(fileURLToPath(import.meta.url));

const transporter = nodemailer.createTransport({
	pool: true,
	host: 'mail',
	port: 587,
	tls: {
		rejectUnauthorized: false,
	},
});

export const sendEmail = async (options: { from: string; to: string | string[]; subject: string; html: string }) => {
	try {
		const { to, subject, html } = options;
		await transporter.sendMail({
			from: 'todo',
			to,
			subject,
			html,
		});
	} catch (error) {
		console.error('error sending email', error);
	}
};

export const sendEmailFromTemplate = async (options: { to: string | string[]; subject: string; templateName: string; context: unknown }) => {
	try {
		const { to, subject, templateName, context } = options;
		const file = fs.readFileSync(`${__dirname}/templates/${templateName}`, 'utf8');
		const template = handlebars.compile(file);
		const html = template(context);
		await transporter.sendMail({
			from: 'todo',
			to,
			subject,
			html,
		});
	} catch (error) {
		console.error('error sending email from template', error);
	}
};
