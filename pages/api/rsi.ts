import type { NextApiRequest, NextApiResponse } from 'next'
import ccxt from 'ccxt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const exchange = new ccxt.binance();
    const ohlcv = await exchange.fetch_ohlcv('BTC/USDT', '1h', { limit: 100 });

    const data = ohlcv.map(item => ({
      timestamp: item[0],
      close: item[4],
    }));

    const closes = data.map(d => d.close);
    const rsi = (source: number[], period = 14) => {
      let gains = [], losses = [];
      for (let i = 1; i < source.length; i++) {
        const diff = source[i] - source[i - 1];
        if (diff >= 0) gains.push(diff);
        else losses.push(Math.abs(diff));
      }
      const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
      const rs = avgGain / (avgLoss || 1);
      return 100 - (100 / (1 + rs));
    };

    const lastRsi = rsi(closes);
    const response = data.slice(-5).map(d => ({ ...d, rsi: lastRsi }));

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}