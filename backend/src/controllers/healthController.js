import { db } from '../config/db.js';

export async function health(req, res) {
	try {
		await db.$queryRaw`SELECT 1`;
		res.json({ status: 'ok', database: 'connected' });
	} catch (error) {
		res.status(503).json({ status: 'error', message: error.message });
	}
}