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
    answer: 'チェックインは15:00から、チェックアウトは11:00までとなっております。ご希望に応じて時間の調整も可能ですので、お気軽にお問い合わせください。'
  },
  {
    question: '駐車場はありますか？',
    answer: 'はい、各エリアに駐車場をご用意しております。予約時に駐車場のご利用をご希望の場合は、お知らせください。'
  },
  {
    question: 'Wi-Fiは利用できますか？',
    answer: 'はい、全室・全エリアで無料Wi-Fiをご利用いただけます。パスワードはチェックイン時にお渡しします。'
  },
  {
    question: 'ペットの同伴は可能ですか？',
    answer: '申し訳ございませんが、現在ペットの同伴はお受けしておりません。ご理解のほど、よろしくお願いいたします。'
  },
  {
    question: 'キャンセルポリシーを教えてください',
    answer: 'ご予約のキャンセルは、宿泊日の3日前までにご連絡いただいた場合、キャンセル料はかかりません。2日前は宿泊料金の50%、前日・当日は100%のキャンセル料をいただきます。'
  },
  {
    question: '食事は提供されますか？',
    answer: '朝食はご予約いただけます。地元の食材を使ったやんばるの現代的なクスイムンをご提供しております。夕食のご用意も可能ですので、事前にお問い合わせください。'
  },
  {
    question: '最寄りの空港からのアクセス方法を教えてください',
    answer: '那覇空港から車で約2時間です。レンタカーでのご来館をおすすめしております。詳細なアクセス方法は予約確認メールにてご案内いたします。'
  },
  {
    question: 'プライベートプールの利用について',
    answer: '各庭には小さなプールがございます。24時間ご利用いただけますが、夜間のご利用の際は、近隣への配慮をお願いいたします。'
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-32 md:py-48">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          {/* Title */}
          <div className="lg:w-1/4">
            <h2 className="font-display text-4xl md:text-5xl font-light text-textMain mb-6">FAQ</h2>
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
                    <span className="font-serif text-base md:text-lg text-textMain group-hover:text-textLight transition-colors pr-8 flex-1">
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
                            <p className="font-serif text-sm md:text-base text-textLight leading-relaxed">
                                {item.answer}
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
