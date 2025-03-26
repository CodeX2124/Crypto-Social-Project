export async function handler() {
  const { rows } = await sql`
    SELECT 
      c.*,
      sm.twitter_followers,
      sm.reddit_subscribers,
      sm.telegram_members,
      sm.twitter_mentions,
      sm.tiktok_mentions,
      sm.reddit_mentions
    FROM cryptocurrencies c
    LEFT JOIN social_metrics sm ON c.id = sm.crypto_id
    ORDER BY c.market_cap DESC
  `;

  return { cryptocurrencies: rows };
}