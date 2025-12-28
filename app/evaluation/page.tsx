"use client";

import API_BASE from '../config';

import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface Metrics {
    rmse: number;
    mae: number;
    precision: { [key: string]: number };
    recall: { [key: string]: number };
}

export default function EvaluationPage() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // Fetch from new endpoint
                const res = await fetch(`${API_BASE}/evaluation`);
                if (!res.ok) throw new Error('Failed to fetch metrics');
                const data = await res.json();
                setMetrics(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                <p className="text-zinc-400">Đang đánh giá mô hình trên tập dữ liệu...</p>
                <p className="text-xs text-zinc-600">(Quá trình này có thể mất vài giây)</p>
            </div>
        );
    }

    if (error || !metrics) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-red-500">Error: {error || 'No data'}</div>
            </div>
        );
    }

    // Prepare chart data
    const chartData = Object.keys(metrics.precision).map(k => ({
        name: `K=${k}`,
        Precision: parseFloat((metrics.precision[k] * 100).toFixed(1)),
        Recall: parseFloat((metrics.recall[k] * 100).toFixed(1))
    }));

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                    Đánh Giá Hiệu Suất Mô Hình
                </h1>

                {/* Error Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-zinc-400 text-sm uppercase font-semibold mb-2">RMSE (Root Mean Square Error)</h3>
                        <p className="text-4xl font-bold text-white">{metrics.rmse}</p>
                        <p className="text-xs text-zinc-500 mt-2">
                            Độ lệch chuẩn của sai số dự đoán. Càng thấp càng tốt.
                        </p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-zinc-400 text-sm uppercase font-semibold mb-2">MAE (Mean Absolute Error)</h3>
                        <p className="text-4xl font-bold text-white">{metrics.mae}</p>
                        <p className="text-xs text-zinc-500 mt-2">
                            Sai số tuyệt đối trung bình. Càng thấp càng tốt.
                        </p>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        Precision & Recall @ K
                        <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">Top-K Recommendations</span>
                    </h2>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" unit="%" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e4e4e7' }}
                                />
                                <Legend />
                                <Bar dataKey="Precision" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Precision (%)" />
                                <Bar dataKey="Recall" fill="#ec4899" radius={[4, 4, 0, 0]} name="Recall (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 text-sm text-zinc-400 space-y-2">
                        <p><strong>Precision@K:</strong> Tỷ lệ phim "phù hợp" trong top K kết quả gợi ý.</p>
                        <p><strong>Recall@K:</strong> Tỷ lệ phim "phù hợp" tìm được so với tổng số phim phù hợp trong nhóm kiểm thử.</p>
                        <p className="text-xs text-zinc-600 italic">* "Phù hợp" được định nghĩa là có chung ít nhất một thể loại với phim gốc.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
