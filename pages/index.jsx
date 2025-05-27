import { useEffect, useState } from 'react';
import axios from 'axios';

interface RSIData {
  timestamp: number;
  close: number;
  rsi: number;
}

export default function Home() {
  const [data, setData] = useState<RSIData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/rsi');
        console.log('API response:', res);
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          throw new Error('API verisi beklenen formatta değil.');
        }
      } catch (err: any) {
        console.error('Veri alınamadı:', err);
        setError(err.message || 'Bilinmeyen bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">BTC/USDT RSI Verileri</h1>

        {loading && <p className="text-gray-600">Yükleniyor...</p>}
        {error && <p className="text-red-500">Hata: {error}</p>}

        {!loading && !error && (
          <div className="overflow-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-4 border-b">Zaman</th>
                  <th className="p-4 border-b">Fiyat (Close)</th>
                  <th className="p-4 border-b">RSI</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="p-4 border-b">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="p-4 border-b">{item.close.toFixed(2)}</td>
                    <td className="p-4 border-b">{item.rsi.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
