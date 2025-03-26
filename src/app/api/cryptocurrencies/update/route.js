export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true"
    );
    if (!response.ok) throw new Error("Failed to fetch crypto data");
    const cryptoData = await response.json();
    
    // const updates = cryptoData.map((crypto) => {
    //   return sql`
    //     INSERT INTO cryptocurrencies (
    //       name, symbol, price, change_24h, change_7d, 
    //       market_cap, volume_24h, price_history
    //     )
    //     VALUES (
    //       ${crypto.name},
    //       ${crypto.symbol.toUpperCase()},
    //       ${crypto.current_price},
    //       ${crypto.price_change_percentage_24h},
    //       ${crypto.price_change_percentage_7d_in_currency},
    //       ${crypto.market_cap},
    //       ${crypto.total_volume},
    //       ${JSON.stringify(crypto.sparkline_in_7d.price)}
    //     )
    //     ON CONFLICT (symbol) 
    //     DO UPDATE SET 
    //       price = EXCLUDED.price,
    //       change_24h = EXCLUDED.change_24h,
    //       change_7d = EXCLUDED.change_7d,
    //       market_cap = EXCLUDED.market_cap,
    //       volume_24h = EXCLUDED.volume_24h,
    //       price_history = EXCLUDED.price_history,
    //       updated_at = CURRENT_TIMESTAMP
    //   `;
    // });

    // await sql.transaction(updates);

    return new Response(JSON.stringify({
      success: true,
      data: cryptoData
    }, null, 4));
  } catch (error) {
    return { error: error.message };
  }
}
