import React, { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { Clock, UtensilsCrossed, MapPin, ArrowRight, X, Check } from 'lucide-react';

interface StayPlan {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  highlights: string[];
  detailedDescription: string;
  schedule: {
    day: number;
    time: string;
    activity: string;
  }[];
  includes: string[];
  image?: string;
}

const StayPlans: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [selectedPlan, setSelectedPlan] = useState<StayPlan | null>(null);

  const plans: StayPlan[] = [
    {
      id: 'relax',
      title: '凪の時間',
      subtitle: '静寂とリラックス',
      duration: '1泊2日',
      description: '何もしない贅沢を、因島で。静かな時間の中で、自分自身と向き合う特別な1泊2日。',
      highlights: [
        'チェックイン後、テラスで瀬戸内の風を感じながら過ごす',
        '近隣のレストランで因島の食材を味わう',
        '朝は鳥のさえずりと共に目覚める',
        'ゆっくりと朝食を楽しみ、島の散策へ'
      ],
      detailedDescription: '因島の静けさの中で、時間を忘れて過ごす贅沢な1泊2日。何も予定を入れず、ただ島のリズムに身を任せ、自分自身と向き合う時間をお過ごしください。',
      image: '/images/gallery/DSC04519.png',
      schedule: [
        { day: 1, time: '15:00', activity: 'チェックイン。テラスで瀬戸内の風を感じながら、ゆっくりと時間を過ごす' },
        { day: 1, time: '18:00', activity: '近隣のレストランで因島の食材を使ったディナーを楽しむ' },
        { day: 1, time: '20:00', activity: '部屋に戻り、静かな夜を過ごす' },
        { day: 2, time: '7:00', activity: '鳥のさえずりと共に目覚める。朝の散歩で島の空気を感じる' },
        { day: 2, time: '9:00', activity: 'ゆっくりと朝食を楽しむ' },
        { day: 2, time: '10:00', activity: '島の散策。因島の歴史と文化に触れる' },
        { day: 2, time: '11:00', activity: 'チェックアウト' },
      ],
      includes: [
        '1泊2日の宿泊',
        '朝食（近隣レストランでの利用券）',
        '島の散策マップ',
        'Wi-Fi完備',
        '基本的なアメニティ'
      ],
    },
    {
      id: 'active',
      title: '島のリズム',
      subtitle: 'アクティブに楽しむ',
      duration: '2泊3日',
      description: 'しまなみ海道を走り、島々を巡る。アクティブに因島を満喫する2泊3日のプラン。',
      highlights: [
        'しまなみ海道サイクリングツアー',
        '瀬戸内の島々を巡るクルーズ',
        '地元の新鮮な魚介を味わう',
        '早朝のビーチヨガで身体を目覚めさせる'
      ],
      detailedDescription: 'しまなみ海道を走り、島々を巡る。アクティブに因島を満喫する2泊3日のプラン。サイクリングやクルーズなど、島の自然を体感できるアクティビティが充実しています。',
      image: '/images/gallery/shimanami-kaidou-route_thumb.webp',
      schedule: [
        { day: 1, time: '15:00', activity: 'チェックイン。サイクリングの準備とガイドからの説明' },
        { day: 1, time: '18:00', activity: '地元の新鮮な魚介を使ったディナーを楽しむ' },
        { day: 1, time: '20:00', activity: '早めに就寝し、翌日に備える' },
        { day: 2, time: '7:00', activity: '早朝のビーチヨガで身体を目覚めさせる' },
        { day: 2, time: '8:00', activity: '朝食を楽しむ' },
        { day: 2, time: '9:00', activity: 'しまなみ海道サイクリングツアーへ出発' },
        { day: 2, time: '12:00', activity: 'サイクリング中に島のレストランでランチ' },
        { day: 2, time: '15:00', activity: 'ホテルに戻り、ゆっくりと休息' },
        { day: 2, time: '18:00', activity: '瀬戸内の島々を巡るサンセットクルーズ' },
        { day: 3, time: '9:00', activity: '朝食後、島の散策' },
        { day: 3, time: '11:00', activity: 'チェックアウト' },
      ],
      includes: [
        '2泊3日の宿泊',
        'しまなみ海道サイクリングツアー（ガイド付き）',
        'サンセットクルーズ',
        '早朝ビーチヨガ',
        '朝食・ディナー（近隣レストランでの利用券）',
        'サイクリング用マップ',
        'Wi-Fi完備',
        '基本的なアメニティ'
      ],
    },
    {
      id: 'premium',
      title: '至福のひととき',
      subtitle: '特別な時間を',
      duration: '2泊3日',
      description: '因島の恵みを五感で味わい、最高の時間を過ごす。特別な記念日に最適なプラン。',
      highlights: [
        '瀬戸内の食材を使った特別ディナー',
        'プライベートテラスでの星空観賞',
        '地域の素材を活かしたスパ体験',
        '島の歴史と文化を学ぶガイドツアー'
      ],
      detailedDescription: '因島の恵みを五感で味わい、最高の時間を過ごす特別なプラン。記念日や特別な日に最適です。瀬戸内の食材を使った特別なディナーや、プライベートテラスでの星空観賞など、贅沢な体験をお楽しみいただけます。',
      image: '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.jpg',
      schedule: [
        { day: 1, time: '15:00', activity: 'チェックイン。ウェルカムドリンクと共に、プランのご案内' },
        { day: 1, time: '16:00', activity: '地域の素材を活かしたスパ体験でリラックス' },
        { day: 1, time: '19:00', activity: '瀬戸内の食材を使った特別ディナー（プライベートテラスでの提供も可能）' },
        { day: 1, time: '21:00', activity: 'プライベートテラスでの星空観賞' },
        { day: 2, time: '9:00', activity: '朝食（因島の食材を使った特別メニュー）' },
        { day: 2, time: '10:00', activity: '島の歴史と文化を学ぶプライベートガイドツアー' },
        { day: 2, time: '14:00', activity: '自由時間。テラスでゆっくりと過ごす' },
        { day: 2, time: '18:00', activity: '瀬戸内のワインと日本酒を楽しむディナー' },
        { day: 3, time: '9:00', activity: '朝食後、チェックアウト準備' },
        { day: 3, time: '11:00', activity: 'チェックアウト' },
      ],
      includes: [
        '2泊3日の宿泊',
        '瀬戸内の食材を使った特別ディナー（2回）',
        '因島の食材を使った特別朝食（2回）',
        'プライベートテラスでの星空観賞',
        '地域の素材を活かしたスパ体験',
        '島の歴史と文化を学ぶプライベートガイドツアー',
        '瀬戸内のワイン・日本酒セレクション',
        'ウェルカムドリンク',
        'Wi-Fi完備',
        'プレミアムアメニティ'
      ],
    },
  ];

  return (
    <section id="stay-plans" className="relative py-20 sm:py-32 md:py-48 bg-background">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          className="mb-16 md:mb-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-textMain mb-4">
            因島で過ごす<br />あなたの時間
          </h2>
          <p className="font-serif text-sm sm:text-base text-gray-500 tracking-widest mb-6">
            理想の1日・2日を選ぶ
          </p>
          <p className="font-body text-xs sm:text-sm text-gray-400 tracking-widest uppercase">
            宿泊 × 食事 × 過ごし方
          </p>
          <div className="w-12 h-[1px] bg-gray-300 mt-6 mx-auto"></div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className="bg-white border border-gray-200 overflow-hidden hover:border-textMain hover:shadow-xl transition-all duration-500 group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {/* Plan Header */}
              <div className="p-2 sm:p-4 md:p-6 lg:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-4 gap-1 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xs sm:text-base md:text-2xl lg:text-3xl font-light text-textMain mb-1 sm:mb-2 tracking-[0.1em] line-clamp-2">
                      {plan.title}
                    </h3>
                    <p className="font-body text-[9px] sm:text-[10px] md:text-xs text-gray-500 tracking-widest uppercase mb-1 sm:mb-3">
                      {plan.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-gray-400 flex-shrink-0">
                    <Clock size={10} className="sm:w-4 sm:h-4" />
                    <span className="font-body text-[9px] sm:text-[10px] md:text-xs tracking-widest whitespace-nowrap">{plan.duration}</span>
                  </div>
                </div>
                <p className="font-serif text-[10px] sm:text-xs md:text-sm text-gray-700 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {plan.description}
                </p>
              </div>

              {/* Plan Highlights */}
              <div className="p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="space-y-1.5 sm:space-y-2 md:space-y-4">
                  {plan.highlights.slice(0, 2).map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-textMain mt-1 sm:mt-1.5 md:mt-2 flex-shrink-0"></div>
                      <p className="font-serif text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-600 leading-tight sm:leading-relaxed flex-1 line-clamp-2">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Footer */}
              <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-center sm:justify-between group-hover:text-textMain transition-colors">
                  <span className="font-body text-[9px] sm:text-[10px] md:text-xs tracking-widest uppercase text-gray-500 group-hover:text-textMain text-center sm:text-left">
                    詳細
                  </span>
                  <ArrowRight size={10} className="sm:w-4 sm:h-4 text-gray-400 group-hover:text-textMain group-hover:translate-x-1 transition-all duration-300 hidden sm:block" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 md:mt-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <a
            href="#reservation"
            className="inline-block px-8 py-4 bg-textMain text-white hover:bg-textLight transition-colors duration-300 font-body text-xs tracking-widest uppercase"
          >
            プランを予約する
          </a>
        </motion.div>
      </div>

      {/* Plan Detail Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 z-[200]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-[201] flex items-center justify-center p-6 md:p-12 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="fixed top-20 sm:top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors z-[110] bg-white rounded-full shadow-lg"
                  >
                    <X size={20} className="text-textMain" />
                  </button>

                  {/* Hero Image */}
                  {selectedPlan.image && (
                    <div className="relative h-[40vh] md:h-[50vh] bg-gray-100 overflow-hidden">
                      <img
                        src={selectedPlan.image}
                        alt={selectedPlan.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="p-8 md:p-12 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="font-display text-3xl md:text-4xl font-light text-textMain mb-2 tracking-[0.1em]">
                          {selectedPlan.title}
                        </h2>
                        <p className="font-body text-sm text-gray-500 tracking-widest uppercase mb-3">
                          {selectedPlan.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={18} />
                        <span className="font-body text-sm tracking-widest">{selectedPlan.duration}</span>
                      </div>
                    </div>
                    <p className="font-serif text-base text-gray-700 leading-relaxed">
                      {selectedPlan.detailedDescription}
                    </p>
                  </div>

                  {/* Schedule */}
                  <div className="p-8 md:p-12 border-b border-gray-200">
                    <h3 className="font-display text-xl md:text-2xl font-light text-textMain mb-6 tracking-[0.1em]">
                      日程の例
                    </h3>
                    <div className="space-y-6">
                      {selectedPlan.schedule.map((item, idx) => (
                        <div key={idx} className="flex gap-6">
                          <div className="flex-shrink-0 w-24">
                            <div className="font-body text-xs text-gray-500 tracking-widest uppercase mb-1">
                              {item.day === 1 ? '1日目' : item.day === 2 ? '2日目' : '3日目'}
                            </div>
                            <div className="font-display text-sm font-medium text-textMain">
                              {item.time}
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-serif text-sm text-gray-700 leading-relaxed">
                              {item.activity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Includes */}
                  <div className="p-8 md:p-12">
                    <h3 className="font-display text-xl md:text-2xl font-light text-textMain mb-6 tracking-[0.1em]">
                      プランに含まれるもの
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPlan.includes.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check size={18} className="text-textMain flex-shrink-0 mt-0.5" />
                          <p className="font-serif text-sm text-gray-700 leading-relaxed">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="p-8 md:p-12 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div>
                        <p className="font-body text-xs text-gray-500 tracking-widest uppercase mb-2">
                          このプランで予約する
                        </p>
                        <p className="font-serif text-sm text-gray-600">
                          詳細な料金や空室状況は予約ページでご確認ください
                        </p>
                      </div>
                      <a
                        href="#reservation"
                        onClick={() => setSelectedPlan(null)}
                        className="inline-block px-8 py-4 bg-textMain text-white hover:bg-textLight transition-colors duration-300 font-body text-xs tracking-widest uppercase whitespace-nowrap"
                      >
                        予約ページへ →
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StayPlans;

