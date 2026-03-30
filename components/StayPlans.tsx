import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { Clock, ArrowRight, X, Check } from 'lucide-react';
import { STAY_PLANS } from '../constants';
import type { StayPlan } from '../types';

const StayPlans: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [selectedPlan, setSelectedPlan] = useState<StayPlan | null>(null);

  const plans = STAY_PLANS;

  return (
    <section id="stay-plans" className="relative py-12 sm:py-20 md:py-32 lg:py-48 bg-background">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          className="mb-8 md:mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-textMain mb-2 sm:mb-3">
            因島で過ごす<br />あなたの時間
          </h2>
          <p className="font-serif text-sm sm:text-base text-gray-500 tracking-widest mb-3">
            理想の1日・2日を選ぶ
          </p>
          <p className="font-body text-xs sm:text-sm text-gray-400 tracking-widest uppercase">
            宿泊 × 食事 × 過ごし方
          </p>
          <div className="w-12 h-[1px] bg-gray-300 mt-4 mx-auto"></div>
        </motion.div>

        {/* Coming Soon: プラン未設定時 */}
        {plans.length === 0 && (
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="border border-gray-200 rounded-xl p-8 sm:p-10 md:p-12 bg-white shadow-sm">
              <h3 className="font-display text-2xl sm:text-3xl font-light text-textMain mb-6 tracking-[0.08em]">
                滞在プランを準備中です
              </h3>
              <div className="space-y-4 mb-8">
                <p className="font-serif text-base text-textLight leading-relaxed">
                  1泊2日・2泊3日など、理想の過ごし方に合わせたプランをご用意できるよう、鋭意準備を進めております。
                </p>
                <p className="font-serif text-sm text-gray-400">
                  決まり次第、こちらでご案内いたします。
                </p>
              </div>
              <a
                href="#reservation"
                className="inline-flex items-center gap-2 font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-6 py-3 hover:bg-textLight transition-colors"
              >
                ご予約はこちら
                <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        )}

        {/* Plans Grid: プランがある場合 */}
        {plans.length > 0 && (
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
        )}

        {/* CTA: プランがある場合のみ */}
        {plans.length > 0 && (
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
        )}
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
                      <Image
                        src={selectedPlan.image}
                        alt={selectedPlan.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="object-cover"
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

