export async function handler() {
  const { rows } = await sql`
    SELECT 
      t.*,
      c.name as crypto_name,
      c.symbol as crypto_symbol
    FROM tweets t
    JOIN cryptocurrencies c ON c.id = t.crypto_id
    ORDER BY t.posted_at DESC
    LIMIT 10
  `;

  return { tweets: rows };
}