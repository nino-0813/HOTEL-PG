import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, X, Check } from 'lucide-react';
import { EXPERIENCE_PLANS_PAGE_PATH, STAY_PLANS, STAY_PLAN_IDS_HIDDEN_ON_HOME } from '../constants';
import type { StayPlan } from '../types';
import { useHydrated } from '@/lib/useHydrated';

const StayPlans: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const reveal = hydrated && isInView;
  const [selectedPlan, setSelectedPlan] = useState<StayPlan | null>(null);

  const visiblePlans = useMemo(
    () => STAY_PLANS.filter((p) => !STAY_PLAN_IDS_HIDDEN_ON_HOME.includes(p.id)),
    [],
  );
  const experiencePlansHref = EXPERIENCE_PLANS_PAGE_PATH;
  const isExternalExperienceLink = /^https?:\/\//i.test(experiencePlansHref);

  return (
    <section id="stay-plans" className="relative py-12 sm:py-20 md:py-32 lg:py-48 bg-background">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          className="mb-8 md:mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={reveal ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-textMain mb-2 sm:mb-3">
            体験プラン
          </h2>
          <p className="font-serif text-sm sm:text-base text-gray-500 tracking-widest mb-3">
            因島と瀬戸内の自然を、宿泊とセットで遊びつくす1日プラン
          </p>
          <p className="font-body text-xs sm:text-sm text-gray-400 tracking-widest uppercase">
            体験 × 宿泊 × 因島
          </p>
          <div className="w-12 h-[1px] bg-gray-300 mt-4 mx-auto"></div>
        </motion.div>

        {STAY_PLANS.length > 0 && (
          <motion.div
            className="mt-6 sm:mt-8 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={reveal ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {isExternalExperienceLink ? (
              <a
                href={experiencePlansHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-textMain text-white hover:bg-textLight transition-colors duration-300 font-body text-xs sm:text-sm tracking-widest uppercase"
              >
                体験プランを見る
                <ArrowRight size={16} />
              </a>
            ) : (
              <Link
                href={experiencePlansHref}
                className="inline-flex items-center gap-2 px-8 py-4 bg-textMain text-white hover:bg-textLight transition-colors duration-300 font-body text-xs sm:text-sm tracking-widest uppercase"
              >
                体験プランを見る
                <ArrowRight size={16} />
              </Link>
            )}
          </motion.div>
        )}

        {/* Coming Soon: プラン未設定時 */}
        {STAY_PLANS.length === 0 && (
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={reveal ? { opacity: 1, y: 0 } : false}
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
        {visiblePlans.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {visiblePlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className="bg-white border border-gray-200 overflow-hidden hover:border-textMain hover:shadow-xl transition-all duration-500 group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {plan.image && (
                <div className="relative aspect-[4/3] w-full bg-gray-100">
                  <Image
                    src={plan.image}
                    alt={plan.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              {/* Plan Header */}
              <div className="p-4 sm:p-5 md:p-6 lg:p-8 border-b border-gray-100">
                <div className="space-y-3 sm:space-y-3.5 mb-3 sm:mb-4">
                  <div>
                    <p className="font-body text-[10px] sm:text-[11px] text-gray-400 tracking-[0.2em] uppercase mb-1.5">
                      {plan.subtitle}
                    </p>
                    <h3 className="font-display text-xl sm:text-2xl md:text-[1.65rem] font-light text-textMain tracking-[0.06em] leading-snug">
                      {plan.title}
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-3 py-1.5 text-gray-600">
                    <Clock size={14} className="shrink-0 text-gray-400" aria-hidden />
                    <span className="font-body text-[11px] sm:text-xs tracking-wide leading-none">
                      {plan.duration}
                    </span>
                  </div>
                </div>
                <p className="font-serif text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {plan.description}
                </p>
              </div>

              {/* Plan Highlights */}
              <div className="p-4 sm:p-5 md:p-6 lg:p-8 pt-3 sm:pt-4">
                <div className="space-y-2.5 sm:space-y-3">
                  {plan.highlights.slice(0, 2).map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 sm:gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-textMain" />
                      <p className="font-serif text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Footer */}
              <div className="p-4 sm:p-5 md:p-6 lg:p-8 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-center sm:justify-between group-hover:text-textMain transition-colors">
                  <span className="font-body text-xs tracking-[0.15em] uppercase text-gray-500 group-hover:text-textMain text-center sm:text-left">
                    詳細
                  </span>
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-textMain group-hover:translate-x-1 transition-all duration-300 hidden sm:block" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
                    {selectedPlan.relatedLinks && selectedPlan.relatedLinks.length > 0 && (
                      <div className="mt-6 space-y-3">
                        {selectedPlan.relatedLinks.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-body text-sm text-textMain underline underline-offset-4 hover:text-textLight transition-colors"
                          >
                            {link.label}
                            <ArrowRight size={14} className="flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}
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
                          ご予約・お問い合わせ
                        </p>
                        <p className="font-serif text-sm text-gray-600">
                          ご希望日・人数・オプションは予約ページまたはお問い合わせよりご確認ください
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

