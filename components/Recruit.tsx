import React from 'react';
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';

const Recruit: React.FC = () => {
  return (
    <section id="recruit" className="relative py-12 sm:py-20 md:py-24 lg:py-32 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="border border-gray-200 p-6 sm:p-8 md:p-10 rounded-xl hover:border-textMain transition-all duration-300 group bg-white shadow-sm hover:shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <Users size={24} className="text-textMain mt-1 flex-shrink-0" />
              <div>
                <span className="inline-block font-display text-[10px] sm:text-xs tracking-[0.2em] uppercase text-textMain/70 mb-2">
                  RECRUIT
                </span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-textMain tracking-[0.05em] leading-tight">
                  スタッフ募集
                </h2>
              </div>
            </div>
            <p className="font-serif text-sm text-textLight leading-relaxed mb-8">
              これからできる HOTEL PG -III- の仲間を募集しています。
              HK（ハウスキーパー）・事務員・朝食スタッフ。未経験OK、主婦・主夫、学生歓迎。土生町エリア、時給1,100円〜、社保完備。
            </p>
            <Link
              href="/recruit"
              className="inline-flex items-center gap-2 font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg rounded"
            >
              募集詳細を見る
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recruit;
