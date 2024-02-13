import { SQLITE_FULL_PATH } from '$env/static/private';
import Database from 'better-sqlite3';
import type { Cik } from './types';

const db = new Database(SQLITE_FULL_PATH, { verbose: console.log }); // remove in prod

export function getCik(
	limit: number,
	q: string = '',
	skip: number,
	order_by: string,
	order_dir: string
): Cik[] {
	const sql = `
		SELECT
		COUNT(*) OVER () AS num_entries,
		id,
		every_cik_latest_qtr_stats.cik AS cik,
		cik_name,
		cum_mean_twrr_per_cik_per_qtr_cons AS cum_twrr_cons,
		(select count(*) from cik_md) AS initial_num_entries
		FROM every_cik_latest_qtr_stats
		LEFT JOIN
		(select cik, cik_name from cik_md) AS cik_md
		ON every_cik_latest_qtr_stats.cik = cik_md.cik
		WHERE UPPER(cik_name) LIKE UPPER('%${q}%')
		ORDER BY ${order_by ? order_by : 'cik'} ${order_dir ? order_dir : 'ASC'}
		LIMIT $limit OFFSET $skip
	`;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ limit, q, skip });
	console.log(rows.slice(0, 2));
	console.log(rows.length);
	return rows as Cik[];
}