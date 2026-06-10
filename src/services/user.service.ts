import { and, arrayContains, asc, count, desc, eq, getColumns, ilike, or } from 'drizzle-orm';
import db from '../db/index.js';
import { usersTable } from '../db/schema.js';
import { type CreateUser, Role, type UpdateUser, type UserSearchQuery } from '../types/user.type.js';

export const getRoles = () => {
	return Object.values(Role);
};

export const getUserByUsername = async (username: string) => {
	const user = await db.query.usersTable.findFirst({
		where: {
			username,
		},
	});
	if (!user) {
		throw new Error(`User with username '${username}' not found`);
	}
	return user;
};

export const getUserById = async (id: string) => {
	const user = await db.query.usersTable.findFirst({
		where: {
			id,
		},
	});
	if (!user) {
		throw new Error(`User with id '${id}' not found`);
	}
	return user;
};

export const getUsers = async (query: UserSearchQuery = {}) => {
	const roles = query.roles?.split(',') || getRoles();
	const { skip = 0, limit = 10, sort = 'created', order = 'desc' } = query;
	const conditions = [];
	if (query.active) conditions.push(eq(usersTable.active, query.active));
	if (query.blocked) conditions.push(eq(usersTable.blocked, query.blocked));
	if (query.internal) conditions.push(eq(usersTable.internal, query.internal));
	if (query.name) conditions.push(ilike(usersTable.name, `${query.name}%`));
	if (query.username) conditions.push(ilike(usersTable.username, `${query.username}%`));
	if (query.roles) conditions.push(arrayContains(usersTable.roles, roles));
	if (query.search) conditions.push(or(ilike(usersTable.name, `%${query.search}%`), ilike(usersTable.username, `%${query.search}%`)));

	const where = and(...conditions);

	const columns = getColumns(usersTable);
	const orderBy = order === 'desc' ? desc(columns[sort as keyof typeof columns]) : asc(columns[sort as keyof typeof columns]);

	const [users, [total]] = await Promise.all([
		db.select().from(usersTable).limit(limit).offset(skip).orderBy(orderBy).where(where),
		db.select({ total: count() }).from(usersTable).where(where),
	]);

	return { users, total };
};

export const createUser = async (user: CreateUser) => {
	const [createdUser] = await db.insert(usersTable).values(user).onConflictDoUpdate({ target: usersTable.username, set: user }).returning();
	return createdUser;
};

export const updateUser = async (user: UpdateUser) => {
	const [updatedUser] = await db.update(usersTable).set(user).where(eq(usersTable.id, user.id)).returning();
	return updatedUser;
};

export const deleteUser = async (id: string) => {
	const [deletedUser] = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
	return deletedUser;
};

export const getUserProfile = async (id: string) => {
	const profile = await db.query.usersTable.findFirst({
		where: {
			id,
		},
		with: {
			apiKeys: true,
		},
	});
	return profile;
};
