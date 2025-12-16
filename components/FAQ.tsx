import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'チェックイン・チェックアウトの時間を教えてください',
    answer: 'チェックイン：15:00〜\nチェックアウト：〜10:00\n\n※早め・遅めをご希望の場合は、事前にお問い合わせください。'
  },
  {
    question: 'チェックイン方法はどうなっていますか？',
    answer: '**セルフチェックイン（無人チェックイン）**です。\n\nご予約後にお送りする案内に沿って、\n暗証番号またはスマートロックでご入室いただけます。'
  },
  {
    question: 'フロントスタッフはいますか？',
    answer: '常駐スタッフはいませんが、\n電話・メッセージでのサポートは対応可能です。\n\nご不明点があればお気軽にご連絡ください。'
  },
  {
    question: '駐車場はありますか？',
    answer: 'はい、無料駐車場をご利用いただけます。\n台数に限りがありますので、事前にご確認ください。'
  },
  {
    question: '自転車は持ち込めますか？（サイクリスト向け）',
    answer: 'はい、可能です 🚴‍♂️\nしまなみ海道サイクリングのお客様も多くご利用いただいています。\n\n※室内持ち込み可否・保管場所については事前にご確認ください。'
  },
  {
    question: 'チェックイン前・チェックアウト後に荷物は預けられますか？',
    answer: '原則としてお預かりは行っておりません。\nご希望がある場合は事前にご相談ください。'
  },
  {
    question: 'Wi-Fiはありますか？',
    answer: 'はい、無料Wi-Fiを完備しています。\nパスワードはお部屋内にご案内があります。'
  },
  {
    question: 'キッチンや調理器具はありますか？',
    answer: 'お部屋タイプによって異なります。\n詳細は各お部屋の案内ページをご確認ください。'
  },
  {
    question: 'アメニティは何がありますか？',
    answer: '基本的なアメニティをご用意しています。\n\nタオル類\nシャンプー・ボディソープ\nドライヤー\n歯ブラシ\nカミソリ\nボディタオル'
  },
  {
    question: '食事の提供はありますか？',
    answer: 'お食事の提供は行っておりませんが、\nすぐ隣に「おばんざいアゲハ食堂」がございます。\n因島の旬の食材を使ったおばんざいをお楽しみいただけます。\n\nその他、近隣の飲食店もご利用いただけます。'
  },
  {
    question: '子どもと一緒に泊まれますか？',
    answer: 'はい、お子さま連れもご利用可能です。\nただし設備上、安全にご注意ください。'
  },
  {
    question: 'ペットは宿泊できますか？',
    answer: '申し訳ありませんが、ペットの宿泊は不可となっております。'
  },
  {
    question: 'キャンセルポリシーを教えてください',
    answer: 'キャンセル規定は\nご予約されたサイトの条件に準じます。\n\n詳細は予約時の内容をご確認ください。'
  },
  {
    question: '問い合わせ方法を教えてください',
    answer: 'お電話\n予約サイトのメッセージ\nSNS（Instagram DM など）\n\nいずれかからご連絡ください。'
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-12 sm:py-20 md:py-32 lg:py-48">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-32">
          {/* Title */}
          <div className="lg:w-1/4">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain mb-6">FAQ</h2>
            <p className="font-serif text-sm text-gray-500 tracking-widest mb-8">よくあるご質問</p>
            <div className="w-12 h-[1px] bg-gray-300"></div>
          </div>

          {/* FAQ List */}
          <div className="lg:w-3/4">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-textMain/30 transition-colors"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6 text-left group"
                    aria-expanded={openIndex === index}
                  >
                    <span className="font-serif text-xs sm:text-sm md:text-base text-textMain group-hover:text-textLight transition-colors pr-4 flex-1 leading-snug">
                      {item.question}
                    </span>
                    <motion.div 
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                    >
                      <ChevronDown size={16} className="sm:w-5 sm:h-5 text-gray-400 group-hover:text-textMain transition-colors" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 border-t border-gray-100">
                            <p className="font-serif text-xs sm:text-sm text-textLight leading-relaxed whitespace-pre-line pt-3 sm:pt-4">
                                {item.answer.replace(/\*\*(.*?)\*\*/g, '$1')}
                            </p>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
