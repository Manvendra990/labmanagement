import { db } from '../config/db.js';

const serialize = (category) => category && ({ ...category, id: Number(category.id) });

export async function findAll() {
	const rows = await db.testCategory.findMany({
		where: { active: true },
		orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
	});
	return rows.map(serialize);
}

export async function findById(id) {
	return serialize(await db.testCategory.findUnique({ where: { id: BigInt(id) } }));
}

export async function findByName(name, excludeId = null) {
	return db.testCategory.findFirst({
		where: { name, ...(excludeId ? { id: { not: BigInt(excludeId) } } : {}) },
		select: { id: true },
	}).then((category) => category && ({ id: Number(category.id) }));
}

export async function create(name) {
	const category = await db.$transaction(async (tx) => {
		const maximum = await tx.testCategory.aggregate({
			where: { active: true },
			_max: { sortOrder: true },
		});
		return tx.testCategory.create({
			data: { name, sortOrder: (maximum._max.sortOrder ?? 0) + 1 },
		});
	});
	return serialize(category);
}

export async function update(id, name) {
	const result = await db.testCategory.updateMany({
		where: { id: BigInt(id), active: true },
		data: { name },
	});
	return result.count ? findById(id) : null;
}
