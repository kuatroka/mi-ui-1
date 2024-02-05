import duckdb from 'duckdb';
import { DUCKDB_FULL_PATH } from '$env/static/private';
import type {
	Every_cik_qtr,
	Overview_per_quarter,
	Every_cik_qtr_cusip,
	Quarters_per_cik,
	Overview_tr_closed,
	Tr_per_cik,
	Cusip
} from './types';

// let sql = `SELECT DISTINCT *
// FROM main.overview_per_quarter AS a
// LEFT JOIN
// (SELECT quarter,
//     any_value(roll_mean_all_cik_qtr_adj_median_sec_pnl_prc) AS TWRR ,
//     any_value(roll_mean_all_cik_qtr_prc_change) AS TWRR_prc_change
// FROM main.every_cik_qtr
// GROUP BY quarter) AS b
// ON a.quarter = b.quarter
// order by a.quarter`; // Use template literals correctly

// Instantiate DuckDB
const db = new duckdb.Database(DUCKDB_FULL_PATH, { access_mode: 'READ_ONLY' });
const conn = db.connect();

///////// Overview of every quarter /////////
export async function get_overview_per_quarter(): Promise<Overview_per_quarter[]> {
	const query = (query: string) => {
		return new Promise<Overview_per_quarter[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};
	let sql = `SELECT DISTINCT *
					quarter,
					ttl_value_all_ciks_per_qtr AS value,
					mean_curr_twrr_all_ciks_per_qtr_cons AS TWRR,
    			FROM every_qtr_twrr`; // Use template literals correctly

	const overview_per_quarter: Overview_per_quarter[] = await query(sql);
	// db.close()
	// console.log('overview_per_quarter:',overview_per_quarter.slice(0, 1));
	return overview_per_quarter as Overview_per_quarter[]; // Return an object with entries property
}

///////// Every cik and quarter with parameters /////////
// console.time("get_every_cik_qtr_no_params")
export async function get_every_cik_qtr_no_params(): Promise<Every_cik_qtr[]> {
	const query = (query: string) => {
		return new Promise<Every_cik_qtr[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};

	let sql = `
    SELECT 
        cik,
        quarter,
        cum_mean_twrr_per_cik_per_qtr_cons,
        num_assets_per_cik_per_qtr,
        ttl_value_per_cik_per_qtr,
        ttl_value_per_cik_per_qtr_prc_chg
    FROM every_cik_qtr_twrr`;

	const get_every_cik_qtr_no_params: Every_cik_qtr[] = await query(sql);
	// console.log('get_every_cik_qtr_no_params:',get_every_cik_qtr_no_params.slice(0, 1));
	// db.close()
	return get_every_cik_qtr_no_params as Every_cik_qtr[]; // Return an object with entries property
}
// console.timeEnd("get_every_cik_qtr_no_params")
//////////////////////////////////////////////
// console.time("get_every_cik_qtr")
export async function get_every_cik_qtr(superinvestor?: string): Promise<Every_cik_qtr[]> {
	const query = (query: string) => {
		return new Promise<Every_cik_qtr[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};

	let sql = `
    SELECT 
        cik,
        quarter,
        quarter_end_date,
        roll_mean_cik_qtr_adj_median_sec_pnl_prc,
        roll_mean_cik_qtr_prc_change,
        cum_pnl_per_cik_quarter,
        cum_pnl_per_cik_quarter_prc_change,
        prc_change_value,
        prc_change_num_assets,
        num_assets,
        value_usd,
        pct_pct
    FROM every_cik_qtr
    WHERE cik = '${superinvestor}'`;

	// if (superinvestor) {
	//     sql += `
	//     WHERE cik = '${superinvestor}' `;
	// };
	sql += `ORDER BY quarter DESC`;

	const get_every_cik_qtr: Every_cik_qtr[] = await query(sql);
	console.log('get_every_cik_qtr:', get_every_cik_qtr.slice(0, 1));
	// db.close()
	return get_every_cik_qtr as Every_cik_qtr[]; // Return an object with entries property
}
// console.timeEnd("get_every_cik_qtr")

///////// Every cik, quarter and cusip with parameters /////////
// console.time("get_every_cik_qtr_cusip")
export async function get_every_cik_qtr_cusip(
	superinvestor?: string
): Promise<Every_cik_qtr_cusip[]> {
	const query = (query: string) => {
		return new Promise<Every_cik_qtr_cusip[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};

	let sql = `
    SELECT cusip, value, shares, cusip_ticker,  quarter, prc_change_value,
    prc_change_shares, cusip_weight, rolling_twrr
    FROM main.every_cik_qtr_cusip`;

	if (superinvestor) {
		sql += `
        WHERE cik = '${superinvestor}' `;
	}

	sql += `AND value > 0.0`;

	sql += `ORDER BY value DESC`;

	const every_cik_qtr_cusip: Every_cik_qtr_cusip[] = await query(sql);

	// db.close()
	// console.log('get_every_cik_qtr_cusip:',every_cik_qtr_cusip.slice(0, 1));

	return every_cik_qtr_cusip as Every_cik_qtr_cusip[]; // Return an object with entries property
}
// console.timeEnd("get_every_cik_qtr_cusip")

///////////

export async function get_quarters_per_cik(superinvestor?: string): Promise<Quarters_per_cik[]> {
	const query = (query: string) => {
		return new Promise<Quarters_per_cik[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};

	let sql = `
    SELECT cik, value_usd AS value, shares, cusip_ticker,  quarter, pct_pct
    FROM main.all_cik_quarter_cusip
    where cik = '${superinvestor}' `;

	const every_cik_qtr_cusip: Quarters_per_cik[] = await query(sql);
	// db.close()
	return every_cik_qtr_cusip as Quarters_per_cik[]; // Return an object with entries property
}

///////
export async function get_overview_tr_closed(
	superinvestor?: string
): Promise<Overview_tr_closed[]> {
	const query = (query: string) => {
		return new Promise<Overview_tr_closed[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};

	let sql = `
        SELECT *
        FROM main.overview_tr_closed`;

	if (superinvestor) {
		sql += `
            WHERE cik = '${superinvestor}'`;
	}
	// sql += `ORDER BY value DESC`;

	const overview_tr_closed: Overview_tr_closed[] = await query(sql);
	// db.close()
	return overview_tr_closed as Overview_tr_closed[]; // Return an object with entries property
}

export async function get_tr_per_cik(
	superinvestor?: string,
	asset?: string
): Promise<Tr_per_cik[]> {
	const query = (query: string) => {
		return new Promise<Tr_per_cik[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};

	let sql = `
        SELECT *,
        ROW_NUMBER() OVER( ORDER BY tr_open) AS tr_number,
        '?tr_id=' || tr_id as link,
        FROM main.tr_per_cik
        `;

	if (superinvestor && asset) {
		sql += `
            WHERE cik = '${superinvestor}' AND cusip = '${asset}'`;
	}

	const get_tr_per_cik: Tr_per_cik[] = await query(sql);
	// db.close()
	return get_tr_per_cik as Tr_per_cik[]; // Return an object with entries property
}

/////////////
export async function get_tr_per_cik_drilldown(
	superinvestor?: string,
	asset?: string
): Promise<Tr_per_cik[]> {
	const query = (query: string) => {
		return new Promise<Tr_per_cik[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};

	let sql = `
    SELECT *
    FROM main.tr_per_cik_drilldown
    `;

	if (superinvestor && asset) {
		sql += `
        WHERE cik = '${superinvestor}' AND cusip = '${asset}'`;
	}

	const get_tr_per_cik_drilldown: Tr_per_cik[] = await query(sql);
	// db.close()

	return get_tr_per_cik_drilldown as Tr_per_cik[]; // Return an object with entries property
}

export async function get_other_cik_per_cusip(asset?: string): Promise<Tr_per_cik[]> {
	const query = (query: string) => {
		return new Promise<Tr_per_cik[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};

	let sql = `
    SELECT 
        cik::string AS cik,
        '/superinvestors/' || cik::string  || '/${asset}'as link,
        COUNT(DISTINCT tr_id) AS num_tr_per_cik, 
        ROUND(AVG(DISTINCT tr_adj_median_sec_pnl_prc),2) AS avg_tr_pnl_per_cik,
        (SELECT COUNT(DISTINCT tr_id) FROM main.main WHERE cusip = '${asset}') AS total_num_tr,
        (SELECT COUNT(DISTINCT cik) FROM main.main WHERE cusip = '${asset}') AS total_num_cik,
    FROM main.main
    WHERE cusip = '${asset}'
    GROUP BY 1, 3`;

	const get_other_cik_per_cusip: Tr_per_cik[] = await query(sql);
	// db.close()
	return get_other_cik_per_cusip as Tr_per_cik[]; // Return an object with entries property
}

export async function getCusip(limit = 151): Promise<Cusip[]> {
	const query = (query: string) => {
		return new Promise<Cusip[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};
	const sql = `
        SELECT DISTINCT      
            quarter,
            total_value_per_quarter_usd
        FROM overview_per_quarter
        LIMIT '${limit}' 
        `;

	const get_cusip: Cusip[] = await query(sql);
	return get_cusip as Cusip[];
	// console.log(rows.slice(0, 2))
}
