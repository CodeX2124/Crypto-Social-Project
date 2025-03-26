export async function handler(req) {
  try {
    const { rows } = await sql`
      SELECT 
        c.name,
        c.symbol,
        sm.*
      FROM social_metrics sm
      JOIN cryptocurrencies c ON c.id = sm.crypto_id
      ORDER BY sm.twitter_followers DESC
    `;

    return {
      socialMetrics: rows,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching social data:", error);
    return {
      error: "Failed to fetch social metrics data",
      success: false,
    };
  }
}