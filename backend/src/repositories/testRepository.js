import { db } from '../config/db.js';

const typeLabels = {
	single: 'Single parameter',
	multi: 'Multi parameter',
	nested: 'Multi parameter nested',
	document: 'Document',
};

function serialize(test) {
	return {
		id: Number(test.id),
		type: test.type,
		name: test.name,
		shortName: test.shortName || '',
		categoryId: Number(test.categoryId),
		categoryName: test.category.name,
		price: Number(test.price),
		unitId: test.unitId === null ? null : Number(test.unitId),
		inputType: test.inputType,
		defaultResult: test.defaultResult,
		optional: test.optional,
		displayName: test.displayName,
		method: test.method,
		instrument: test.instrument,
		interpretation: test.interpretation,
		typeLabel: typeLabels[test.type] || 'Document',
	};
}

const testInclude = { category: { select: { name: true } } };

export async function findAll() {
	const tests = await db.labTest.findMany({
		where: { active: true },
		include: testInclude,
		orderBy: { id: 'asc' },
	});
	return tests.map(serialize);
}

export async function findById(id) {
	const test = await db.labTest.findFirst({
		where: { id: BigInt(id), active: true },
		include: {
			...testInclude,
			parameters: { orderBy: [{ order: 'asc' }, { id: 'asc' }] },
		},
	});
	if (!test) return null;
	return {
		...serialize(test),
		parameters: test.parameters.map((parameter) => ({
			id: Number(parameter.id),
			order: parameter.order,
			name: parameter.name,
			unitId: parameter.unitId === null ? null : Number(parameter.unitId),
			inputType: parameter.inputType,
			groupBy: parameter.groupBy,
			defaultResult: parameter.defaultResult,
			optional: parameter.optional,
			parentParameterId: parameter.parentParameterId === null ? null : Number(parameter.parentParameterId),
		})),
	};
}

function testData(data) {
	return {
		type: data.type,
		name: data.name,
		shortName: data.shortName || null,
		categoryId: BigInt(data.categoryId),
		price: data.price || 0,
		unitId: data.unitId ? BigInt(data.unitId) : null,
		inputType: data.inputType || null,
		defaultResult: data.defaultResult || null,
		optional: Boolean(data.optional),
		displayName: data.displayName !== false,
		method: data.method || null,
		instrument: data.instrument || null,
		interpretation: data.interpretation || null,
	};
}

function parameterData(parameter) {
	return {
		order: parameter.order,
		name: parameter.name,
		unitId: parameter.unitId ? BigInt(parameter.unitId) : null,
		inputType: parameter.inputType || 'single_line',
		groupBy: parameter.groupBy || null,
		defaultResult: parameter.defaultResult || null,
		optional: Boolean(parameter.optional),
		parentParameterId: parameter.parentParameterId ? BigInt(parameter.parentParameterId) : null,
	};
}

export async function create(data) {
	const test = await db.labTest.create({
		data: {
			...testData(data),
			parameters: { create: (data.parameters || []).map(parameterData) },
		},
		select: { id: true },
	});
	return Number(test.id);
}

export async function update(id, data) {
	const result = await db.$transaction(async (tx) => {
		const existing = await tx.labTest.findFirst({
			where: { id: BigInt(id), active: true },
			select: { id: true },
		});
		if (!existing) return false;
		await tx.labTest.update({ where: { id: BigInt(id) }, data: testData(data) });
		await tx.labTestParameter.deleteMany({ where: { testId: BigInt(id) } });
		if (data.parameters?.length) {
			await tx.labTestParameter.createMany({
				data: data.parameters.map((parameter) => ({ ...parameterData(parameter), testId: BigInt(id) })),
			});
		}
		return true;
	});
	return result;
}

export async function remove(id) {
	const result = await db.labTest.updateMany({
		where: { id: BigInt(id), active: true },
		data: { active: false },
	});
	return result.count > 0;
}
