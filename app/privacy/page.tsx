'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { FileText, Shield, Cookie, AlertCircle, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { INSTAGRAM_DM_URL } from '@/constants';
import { getBreadcrumbSchema } from '@/lib/json-ld';

const MICROSOFT_PRIVACY_URL = 'https://privacy.microsoft.com/ja-jp/privacystatement';
/** 楽天グループ全体の個人情報保護方針（楽天トラベル・楽天おやど共通で参照） */
const RAKUTEN_GROUP_PRIVACY_URL = 'https://privacy.rakuten.co.jp/';
/** 楽天トラベル利用規約 */
const RAKUTEN_TRAVEL_AGREEMENT_URL = 'https://travel.rakuten.co.jp/info/agreement.html';
/** 楽天おやど（Vacation STAY）利用規約 PDF */
const RAKUTEN_OYADO_AGREEMENT_URL = 'https://vacation-stay.jp/info/oyado/agreement.pdf';
/** 楽天ステイ（楽天おやど運営）個人情報保護方針 */
const RAKUTEN_STAY_PRIVACY_URL = 'https://corp.stay.rakuten.co.jp/privacy.html';
const CLARITY_OPTOUT_URL = 'https://choice.microsoft.com/ja-jp/opt-out';

export default function PrivacyPage() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'トップ', url: 'https://www.hotelpg-innosima.com/' },
    { name: 'プライバシーポリシー', url: 'https://www.hotelpg-innosima.com/privacy' },
  ]);

  return (
    <div className="min-h-screen relative">
      <JsonLd data={breadcrumbSchema} />
      <div className="bg-noise" />
      <Header />
      <main className="relative w-full pt-24 sm:pt-28 pb-20 sm:pb-32">
        <div className="relative bg-gradient-to-b from-gray-50 to-background py-16 sm:py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block bg-textMain text-white text-xs tracking-widest px-4 py-2 mb-6">
                PRIVACY
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-textMain mb-6 tracking-[0.08em]">
                プライバシーポリシー
              </h1>
              <p className="font-serif text-base md:text-lg text-textLight leading-relaxed">
                HOTEL PG（当サイト）では、お客様の個人情報の保護に努めています。
              </p>
            </motion.div>
          </div>
        </div>

        <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase text-textMain mb-12 hover:opacity-70 transition-opacity"
          >
            ← トップへ
          </Link>

          <div className="space-y-12 md:space-y-16 font-serif text-textLight">
            {/* 1. 個人情報の取得について */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-6 tracking-[0.08em] flex items-center gap-3">
                <FileText size={22} className="text-textMain/60 flex-shrink-0" />
                1. 個人情報の取得について
              </h2>
              <p className="text-sm leading-relaxed">
                当サイトでは、お問い合わせフォームの送信時などに、お名前・メールアドレス・電話番号・メッセージ内容などの個人情報を取得することがあります。取得はお客様の意思に基づき、必要な範囲で行います。
              </p>
            </motion.section>

            {/* 2. 利用目的 */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-6 tracking-[0.08em] flex items-center gap-3">
                <Shield size={22} className="text-textMain/60 flex-shrink-0" />
                2. 利用目的
              </h2>
              <p className="text-sm leading-relaxed mb-4">
                取得した個人情報は、以下の目的で利用します。
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>お問い合わせへの回答および連絡</li>
                <li>ご予約・ご宿泊に関するご案内</li>
                <li>当サイトの改善およびサービス向上</li>
                <li>法令に基づく対応</li>
              </ul>
            </motion.section>

            {/* 3. 第三者サービスの利用について */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-6 tracking-[0.08em]">
                3. 第三者サービスの利用について
              </h2>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6 bg-white">
                  <h3 className="font-display text-lg font-light text-textMain mb-4 tracking-wider">
                    Microsoft Clarity
                  </h3>
                  <p className="text-sm leading-relaxed mb-4">
                    当サイトは、ユーザー行動分析のため Microsoft Clarity を使用しています。クリック・スクロール・セッション録画などの操作データを収集しますが、個人を特定する情報は収集しません。収集データはサイトの使いやすさやコンテンツの改善に利用します。
                  </p>
                  <p className="text-sm leading-relaxed mb-4">
                    詳細は Microsoft のプライバシーポリシーをご確認ください。
                  </p>
                  <a
                    href={MICROSOFT_PRIVACY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-textMain underline hover:no-underline break-all"
                  >
                    {MICROSOFT_PRIVACY_URL}
                  </a>
                  <p className="text-sm leading-relaxed mt-4 text-textLight/80">
                    Clarity のデータ収集を希望されない場合は、以下のページからオプトアウト（無効化）できます（任意）。
                  </p>
                  <a
                    href={CLARITY_OPTOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-textMain underline hover:no-underline"
                  >
                    オプトアウト：Microsoft の選択肢
                  </a>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 bg-white">
                  <h3 className="font-display text-lg font-light text-textMain mb-4 tracking-wider">
                    楽天おやど（Rakuten Oyado / Vacation STAY）
                  </h3>
                  <p className="text-sm leading-relaxed mb-4">
                    当サイトで紹介している宿泊予約は、楽天おやど（宿泊・民泊予約ならRakuten Oyado）へのリンクとなる場合があります。ご予約時の個人情報の取り扱いは、楽天おやどの利用規約および楽天グループの個人情報保護方針に従います。
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="text-textLight">利用規約（PDF）：</span>
                      <a
                        href={RAKUTEN_OYADO_AGREEMENT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-textMain underline hover:no-underline break-all ml-1"
                      >
                        {RAKUTEN_OYADO_AGREEMENT_URL}
                      </a>
                    </li>
                    <li>
                      <span className="text-textLight">個人情報保護方針：</span>
                      <a
                        href={RAKUTEN_STAY_PRIVACY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-textMain underline hover:no-underline break-all ml-1"
                      >
                        {RAKUTEN_STAY_PRIVACY_URL}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 bg-white">
                  <h3 className="font-display text-lg font-light text-textMain mb-4 tracking-wider">
                    楽天トラベル
                  </h3>
                  <p className="text-sm leading-relaxed mb-4">
                    予約ページが楽天トラベルへ遷移する場合、予約時の個人情報の取り扱いは楽天グループの個人情報保護方針に従います。ご予約の際は、利用規約・プライバシーポリシーをご確認ください。
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="text-textLight">楽天グループ個人情報保護方針：</span>
                      <a
                        href={RAKUTEN_GROUP_PRIVACY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-textMain underline hover:no-underline break-all ml-1"
                      >
                        {RAKUTEN_GROUP_PRIVACY_URL}
                      </a>
                    </li>
                    <li>
                      <span className="text-textLight">楽天トラベル利用規約：</span>
                      <a
                        href={RAKUTEN_TRAVEL_AGREEMENT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-textMain underline hover:no-underline break-all ml-1"
                      >
                        {RAKUTEN_TRAVEL_AGREEMENT_URL}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* 4. Cookieの使用について */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-6 tracking-[0.08em] flex items-center gap-3">
                <Cookie size={22} className="text-textMain/60 flex-shrink-0" />
                4. Cookieの使用について
              </h2>
              <p className="text-sm leading-relaxed mb-4">
                当サイトでは、利便性の向上やアクセス解析のため、Cookie を使用することがあります。Cookie はブラウザに保存される小さなテキストデータで、個人を特定する情報のみでお客様を識別するものではありません。ブラウザの設定により Cookie を無効にすることも可能です（その場合、一部の機能が利用できなくなる場合があります）。
              </p>
            </motion.section>

            {/* 5. 免責事項 */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-6 tracking-[0.08em] flex items-center gap-3">
                <AlertCircle size={22} className="text-textMain/60 flex-shrink-0" />
                5. 免責事項
              </h2>
              <p className="text-sm leading-relaxed">
                当サイトの内容は、できる限り正確な情報を掲載するよう努めていますが、掲載情報の正確性・完全性・有用性等について保証するものではありません。当サイトの利用により生じた損害等について、当サイトは一切の責任を負いかねます。第三者サイトへのリンクを含む場合、リンク先のサイトのプライバシーやコンテンツについて、当サイトは責任を負いません。
              </p>
            </motion.section>

            {/* 6. お問い合わせ */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="border-t border-gray-200 pt-8"
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-6 tracking-[0.08em] flex items-center gap-3">
                <Mail size={22} className="text-textMain/60 flex-shrink-0" />
                6. お問い合わせ
              </h2>
              <p className="text-sm leading-relaxed mb-4">
                本ポリシーや個人情報の取り扱いに関するお問い合わせは、当サイトのお問い合わせフォーム、または Instagram の DM にてお願いいたします。
              </p>
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border-b border-textMain hover:opacity-70 transition-opacity"
              >
                Instagram DM でお問い合わせ
              </a>
            </motion.section>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase text-textMain hover:opacity-70 transition-opacity"
            >
              ← トップへ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
