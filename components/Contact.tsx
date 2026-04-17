import React from 'react';
import { Phone, MapPin, Instagram } from 'lucide-react';
import { INSTAGRAM_DM_URL, INSTAGRAM_PROFILE_URL } from '../constants';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="relative py-12 sm:py-20 md:py-32 lg:py-48">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain mb-6">Contact</h2>
            <p className="font-serif text-sm text-gray-500 tracking-widest mb-12">お問い合わせ・ご予約</p>
            <div className="w-12 h-[1px] bg-gray-300 mb-12"></div>

            <div className="space-y-10 mb-12">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-textMain mt-1 flex-shrink-0" />
                <div>
                  <p className="font-serif text-sm text-textMain mb-2">住所</p>
                  <p className="font-serif text-xs text-textLight leading-relaxed">
                    広島県尾道市因島土生町1896-8
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone size={20} className="text-textMain mt-1 flex-shrink-0" />
                <div>
                  <p className="font-serif text-sm text-textMain mb-2">電話番号</p>
                  <a href="tel:07083289154" className="font-serif text-xs text-textLight hover:text-textMain transition-colors">
                    070-8328-9154
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Instagram size={20} className="text-textMain mt-1 flex-shrink-0" />
                <div>
                  <p className="font-serif text-sm text-textMain mb-2">Instagram</p>
                  <a 
                    href={INSTAGRAM_PROFILE_URL} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-xs text-textLight hover:text-textMain transition-colors"
                  >
                    @hotel_pg_
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <p className="font-serif text-xs text-textLight leading-relaxed mb-4">
                ご予約・お問い合わせは、Instagram DMまたはお電話よりお願いいたします。
              </p>
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 mb-4"
              >
                <Instagram size={16} />
                Instagram DMへ
              </a>
              <p className="font-serif text-xs text-textLight">
                受付時間: 9:00 - 20:00
              </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
