'use client';

import React, { useState } from 'react';
import { useCms } from '@/context/CmsContext';
import type { CmsContent } from '@/context/CmsContext';
import type { SectionContent } from '@/types';
import { Save } from 'lucide-react';

const SECTIONS: { key: keyof CmsContent; label: string }[] = [
  { key: 'concept', label: 'Concept' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'dining', label: 'Dining' },
  { key: 'activity', label: 'Activity' },
];

const AdminContent: React.FC = () => {
  const { content, setContent, save, isSupabaseConfigured, saveError } = useCms();
  const [active, setActive] = useState<keyof CmsContent>('concept');
  const [form, setForm] = useState<SectionContent>(content[active]);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setForm(content[active]);
  }, [active, content]);

  const handleSave = async () => {
    const nextContent = { ...content, [active]: form };
    setContent(nextContent);
    setSaving(true);
    await save({ content: nextContent });
    setSaving(false);
  };

  const updateForm = (patch: Partial<SectionContent>) => {
    setForm((f) => ({ ...f, ...patch }));
  };

  return (
    <div className="max-w-4xl">
      <h2 className="font-display text-2xl text-textMain mb-6">コンテンツ・写真</h2>

      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        {SECTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              active === key ? 'bg-gray-100 text-textMain border border-b-0 border-gray-200 -mb-0.5' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
          <input
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Concept"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">サブタイトル</label>
          <input
            value={form.subtitle}
            onChange={(e) => updateForm({ subtitle: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="凪の水面に、心を浮かべる"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">説明文（1行1段落）</label>
          <textarea
            value={form.description.join('\n')}
            onChange={(e) => updateForm({ description: e.target.value.split('\n').filter(Boolean) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
            placeholder="瀬戸内海、因島。&#10;かつて村上海賊が…"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">写真URL（1行1枚）</label>
          <textarea
            value={form.images.join('\n')}
            onChange={(e) => updateForm({ images: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 font-mono text-sm"
            placeholder="/images/gallery/DSC04519.webp&#10;/images/gallery/DSC04542.webp"
          />
          <p className="mt-1 text-xs text-gray-500">公開フォルダ内のパス（例: /images/gallery/xxx.webp）または外部URLを1行に1つずつ入力</p>
        </div>
        {saveError && <p className="text-sm text-red-600">{saveError}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-textMain text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? '保存中…' : `${SECTIONS.find((s) => s.key === active)?.label} を保存`}
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        {isSupabaseConfigured
          ? '変更は Supabase に保存され、フロントの表示に反映されます。'
          : '変更はこのブラウザのローカルに保存され、公開サイトの表示に反映されます。'}
      </p>
    </div>
  );
};

export default AdminContent;
