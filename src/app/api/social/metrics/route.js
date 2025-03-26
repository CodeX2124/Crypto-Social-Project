export async function handler() {
  const { rows } = await sql`
    SELECT 
      c.name,
      c.symbol,
      sm.*
    FROM social_metrics sm
    JOIN cryptocurrencies c ON c.id = sm.crypto_id
    ORDER BY sm.twitter_followers DESC
  `;

  return { socialMetrics: rows };
}