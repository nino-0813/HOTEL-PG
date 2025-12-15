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
    answer: '基本的なアメニティをご用意しています。\n\nタオル類\nシャンプー・ボディソープ\nドライヤー\n\n※歯ブラシなど一部アメニティはご持参をお願いする場合があります。'
  },
  {
    question: '食事の提供はありますか？',
    answer: 'お食事の提供は行っておりません。\n近隣の飲食店をご利用ください。\n\n※周辺おすすめ情報はご案内できます。'
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
    <section id="faq" className="relative py-20 sm:py-32 md:py-48">
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
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                    aria-expanded={openIndex === index}
                  >
                    <span className="font-serif text-sm sm:text-base md:text-lg text-textMain group-hover:text-textLight transition-colors pr-4 sm:pr-8 flex-1">
                      {item.question}
                    </span>
                    <motion.div 
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex-shrink-0"
                    >
                      <ChevronDown size={20} className="text-gray-400 group-hover:text-textMain transition-colors" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                        >
                            <div className="pb-6 pl-0 md:pl-8">
                            <p className="font-serif text-sm md:text-base text-textLight leading-relaxed whitespace-pre-line">
                                {item.answer.replace(/\*\*(.*?)\*\*/g, '$1')}
                            </p>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="font-serif text-sm text-gray-500 mb-6">
                その他のご質問がございましたら、お気軽にお問い合わせください。
              </p>
              <a
                href="#contact"
                className="inline-block font-display text-sm tracking-[0.2em] uppercase text-textMain border-b border-textMain pb-2 hover:opacity-60 transition-opacity"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
