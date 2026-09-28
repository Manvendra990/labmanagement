
import { db } from '../config/db.js';

const serialize = (unit) => unit && ({ ...unit, id: Number(unit.id) });

export async function findAll() {
  const rows = await db.labUnit.findMany({
    where: { active: true },
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
  });
  return rows.map(serialize);
}

export async function findByName(name, excludeId = null) {
  const unit = await db.labUnit.findFirst({
    where: {
      name: name.trim(),
      active: true,
      ...(excludeId !== null && excludeId !== undefined ? { id: { not: BigInt(excludeId) } } : {}),
    },
    select: { id: true, name: true },
  });
  return unit && ({ ...unit, id: Number(unit.id) });
}

export async function create(name) {
  return serialize(await db.labUnit.create({ data: { name: name.trim() } }));
}

export async function update(id, name) {
  const result = await db.labUnit.updateMany({
    where: { id: BigInt(id), active: true },
    data: { name: name.trim() },
  });
  if (!result.count) return null;
  return serialize(await db.labUnit.findUnique({ where: { id: BigInt(id) } }));
}

export async function remove(id) {
  const result = await db.labUnit.updateMany({
    where: { id: BigInt(id), active: true },
    data: { active: false },
  });
  return result.count > 0;
}