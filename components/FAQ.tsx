import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={`url-${i}`}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={`txt-${i}`}>{part}</React.Fragment>;
  });
};

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  label: string;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    label: '入退室・お部屋',
    items: [
      { question: 'チェックイン・チェックアウトの時間は？', answer: 'チェックイン：15:00〜／チェックアウト：〜10:00\n※ご希望の場合は事前にお問い合わせください。' },
      { question: 'チェックイン方法は？', answer: 'セルフチェックインです。ご予約後のお案内に沿って、暗証番号またはスマートロックでご入室いただけます。' },
      { question: 'スタッフの対応は？', answer: '常駐スタッフはいませんが、電話・メッセージでのサポートに対応しています。\n対応時間：9:00〜17:00' },
      { question: '荷物の預かりは？', answer: '原則お預かりは行っておりません。ご希望の場合は事前にご相談ください。' },
    ],
  },
  {
    label: '設備・周辺',
    items: [
      { question: '駐車場はありますか？', answer: '無料駐車場をご利用いただけます。台数に限りがありますので、事前にご確認ください。' },
      { question: '自転車は持ち込めますか？', answer: 'はい、可能です。しまなみ海道サイクリングのお客様も多くご利用いただいています。室内の保管可否は事前にご確認ください。' },
      { question: 'Wi-Fiはありますか？', answer: '無料Wi-Fiを完備しています。パスワードはお部屋内にご案内があります。' },
      { question: 'アメニティは？', answer: 'タオル類、シャンプー・ボディソープ、ドライヤー、歯ブラシ、カミソリ、ボディタオルをご用意しています。' },
      { question: '食事はありますか？', answer: 'お部屋での提供はありませんが、隣の「おばんざいアゲハ食堂」や近隣の飲食店をご利用いただけます。' },
    ],
  },
  {
    label: 'ご予約・その他',
    items: [
      { question: '子ども連れは可能ですか？', answer: 'はい、ご利用可能です。安全にご注意ください。' },
      {
        question: 'SAGAWA手ぶらサービス（手ぶらサイクリング）は利用できますか？',
        answer:
          'しまなみ海道の「SAGAWA手ぶらサービス（手ぶらサイクリング）」をご利用いただけます。\n詳細はこちら： https://www.sagawa-exp.co.jp/hands-freetravel/service/cycling/',
      },
      { question: 'ペットは宿泊できますか？', answer: '申し訳ございませんが、ペットの宿泊はお断りしております。' },
      { question: 'キャンセルポリシーは？', answer: 'ご予約されたサイトの条件に準じます。詳細は予約時の内容をご確認ください。' },
      { question: 'お問い合わせ方法は？', answer: 'お電話、予約サイトのメッセージ、SNS（Instagram DMなど）からご連絡ください。' },
    ],
  },
];

const FAQ: React.FC = () => {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggleItem = (key: string) => {
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <section id="faq" className="relative py-12 sm:py-20 md:py-32 lg:py-48">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
          {/* Title */}
          <div className="lg:w-1/4 flex-shrink-0">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain mb-2">FAQ</h2>
            <p className="font-serif text-sm text-gray-500 tracking-widest">よくあるご質問</p>
            <div className="w-12 h-[1px] bg-gray-300 mt-6"></div>
          </div>

          {/* FAQ by category */}
          <div className="lg:flex-1 space-y-10 md:space-y-14">
            {FAQ_CATEGORIES.map((category) => (
              <div key={category.label}>
                <h3 className="font-display text-sm font-light text-gray-400 tracking-[0.2em] uppercase mb-4">
                  {category.label}
                </h3>
                <div className="space-y-0">
                  {category.items.map((item, idx) => {
                    const key = `${category.label}-${idx}`;
                    const isOpen = openKey === key;
                    return (
                      <div
                        key={key}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between py-4 sm:py-5 text-left group gap-4"
                          aria-expanded={isOpen}
                        >
                          <span className="font-serif text-sm sm:text-base text-textMain group-hover:text-textLight transition-colors flex-1 text-left">
                            {item.question}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors"
                          >
                            <ChevronDown size={16} className="text-gray-500" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                              className="overflow-hidden"
                            >
                              <p className="font-serif text-sm text-textLight leading-relaxed whitespace-pre-line pb-4 pl-0 pr-12">
                                {linkify(item.answer.replace(/\*\*(.*?)\*\*/g, '$1'))}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
