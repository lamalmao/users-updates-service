const { config } = require('dotenv');
const { Client } = require('pg');

const connectionString = config().parsed.DATABASE;

const client = new Client({
  connectionString
});

const createUpdate = async action => {
  // prettier-ignore
  const query = `INSERT INTO "Action"(ip, "userId", date, action${action.data ? ', data' : ''}) VALUES ($1, $2, $3, $4${action.data ? ', $5' : ''})`;
  const values = [action.ip, action.target, action.date, action.type];
  if (action.data) {
    values.push(JSON.stringify(action.data));
  }

  return client.query(query, values);
};

const getUpdates = async (limit, offset, id) => {
  const filter = id ? ` WHERE "userId"=${id} ` : ' ';
  const query = `SELECT * FROM "Action"${filter}LIMIT ${limit} OFFSET ${offset}`;

  const data = await client.query(query);
  return data.rows;
};

const countUpdates = async id => {
  const filter = id ? `WHERE "userId"=${id}` : '';
  const query = `SELECT COUNT(*) FROM "Action"${filter}`;
  const result = await client.query(query);

  return Number(result.rows[0].count);
};

module.exports.client = client;
module.exports.createUpdate = createUpdate;
module.exports.getUpdates = getUpdates;
module.exports.countUpdates = countUpdates;
