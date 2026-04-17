'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LogIn } from 'lucide-react';
import { setAdminLoggedIn, getAdminPassword, isAdminLoggedIn } from '@/lib/admin-auth';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isAdminLoggedIn()) router.replace('/admin/blog');
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password === getAdminPassword()) {
      setAdminLoggedIn();
      router.replace('/admin/blog');
    } else {
      setError('パスワードが正しくありません。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Lock size={24} className="text-gray-600" />
          <h1 className="font-display text-xl text-textMain">管理ページ</h1>
        </div>
        <p className="text-sm text-gray-500 text-center mb-6">HOTEL PG 管理用</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-textMain focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            placeholder="パスワードを入力"
            autoFocus
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-textMain text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <LogIn size={18} />
            ログイン
          </button>
        </form>
        <p className="mt-6 text-xs text-gray-400 text-center">
          初期パスワードは「admin」です。本番では .env に NEXT_PUBLIC_ADMIN_PASSWORD を設定してください。
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
