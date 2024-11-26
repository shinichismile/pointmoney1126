import React, { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Wallet, TrendingUp, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Worker, PointTransaction } from '../types';
import { useAuthStore } from '../stores/authStore';

const mockWorkers: Worker[] = [
  { id: '1', name: '山田 太郎', email: 'worker@example.com', points: 0, totalEarned: 0, joinedAt: '2024-01-15', status: 'active' },
];

const mockPointHistory: PointTransaction[] = [];

const chartData = [
  { name: '3/4', total: 0 },
  { name: '3/5', total: 0 },
  { name: '3/6', total: 0 },
  { name: '3/7', total: 0 },
  { name: '3/8', total: 0 },
  { name: '3/9', total: 0 },
  { name: '3/10', total: 0 }
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [operationType, setOperationType] = useState<'add' | 'subtract'>('add');
  const [pointAmount, setPointAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handlePointOperation = () => {
    if (!selectedWorker || !pointAmount || !reason) {
      toast.error('すべての項目を入力してください');
      return;
    }

    const amount = parseInt(pointAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('有効なポイント数を入力してください');
      return;
    }

    const operation = operationType === 'add' ? '付与' : '減算';
    toast.success(`${selectedWorker.name}さんのポイントを${amount.toLocaleString()}${operation}しました`);
    setSelectedWorker(null);
    setPointAmount('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">アクティブユーザー</p>
              <p className="text-2xl font-bold text-gray-900">{mockWorkers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">総発行ポイント</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">今月の発行</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">ポイント操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ワーカー
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedWorker?.id || ''}
              onChange={(e) => {
                const worker = mockWorkers.find(w => w.id === e.target.value);
                setSelectedWorker(worker || null);
              }}
            >
              <option value="">選択してください</option>
              {mockWorkers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              操作タイプ
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={operationType}
              onChange={(e) => setOperationType(e.target.value as 'add' | 'subtract')}
            >
              <option value="add">付与</option>
              <option value="subtract">減算</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ポイント数
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={pointAmount}
                onChange={(e) => setPointAmount(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="100"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">P</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              理由
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={operationType === 'add' ? 'タスク完了ボーナス' : 'タスク未完了によるペナルティ'}
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handlePointOperation}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              operationType === 'add' 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-red-600 hover:bg-red-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {operationType === 'add' ? (
              <Plus className="h-4 w-4 mr-2" />
            ) : (
              <Minus className="h-4 w-4 mr-2" />
            )}
            ポイントを{operationType === 'add' ? '付与' : '減算'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">ポイント履歴</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ワーカー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ポイント
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  理由
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPointHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    履歴はありません
                  </td>
                </tr>
              ) : (
                mockPointHistory.map((history) => (
                  <tr key={history.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(history.timestamp), 'yyyy年M月d日 HH:mm', { locale: ja })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {history.workerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {history.adminName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        history.type === 'add'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {history.type === 'add' ? '付与' : '減算'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${
                        history.type === 'add' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {history.type === 'add' ? '+' : '-'}{history.amount.toLocaleString()} P
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {history.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}