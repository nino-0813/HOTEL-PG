import React from 'react';
import { Phone, MapPin, Instagram } from 'lucide-react';

const Contact: React.FC = () => {

  return (
    <section id="contact" className="relative py-12 sm:py-20 md:py-32 lg:py-48">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-32">
          {/* Left Side - Info */}
          <div className="lg:w-2/5">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain mb-6">Contact</h2>
            <p className="font-serif text-sm text-gray-500 tracking-widest mb-12">お問い合わせ・ご予約</p>
            <div className="w-12 h-[1px] bg-gray-300 mb-12"></div>

            <div className="space-y-10 mb-12">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-textMain mt-1 flex-shrink-0" />
                <div>
                  <p className="font-serif text-sm text-textMain mb-2">住所</p>
                  <p className="font-serif text-xs text-textLight leading-relaxed">
                    広島県尾道市因島土生町1896-17
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
                    href="https://www.instagram.com/hotel_pg_/" 
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
                ご予約・お問い合わせは、お電話よりお願いいたします。
              </p>
              <p className="font-serif text-xs text-textLight">
                受付時間: 9:00 - 20:00
              </p>
            </div>
          </div>

          {/* Right Side - Reservation Links */}
          <div className="lg:w-3/5">
            <div className="space-y-6">
              {/* HOTEL PG -I- */}
              <div className="border border-gray-200 p-6 sm:p-8 hover:border-textMain transition-all duration-300 group">
                <h3 className="font-display text-2xl font-light text-textMain mb-3 tracking-[0.1em]">
                  HOTEL PG -I-
                </h3>
                <p className="font-serif text-sm text-gray-600 mb-6 leading-relaxed">
                  瀬戸内の静寂に包まれた、最初の隠れ家リゾート
                </p>
                <a
                  href="https://vacation-stay.jp/listings/917598?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg w-full sm:w-auto text-center"
                >
                  予約する →
                </a>
              </div>

              {/* HOTEL PG -II- シングルタイプ */}
              <div className="border border-gray-200 p-6 sm:p-8 hover:border-textMain transition-all duration-300 group">
                <h3 className="font-display text-2xl font-light text-textMain mb-3 tracking-[0.1em]">
                  HOTEL PG -II- 【シングルタイプ】
                </h3>
                <p className="font-serif text-sm text-gray-600 mb-6 leading-relaxed">
                  海と空が交わる場所に佇む、第二の特別な空間
                </p>
                <a
                  href="https://vacation-stay.jp/listings/1138330?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg w-full sm:w-auto text-center"
                >
                  予約する →
                </a>
              </div>

              {/* HOTEL PG -II- ファミリータイプ */}
              <div className="border border-gray-200 p-6 sm:p-8 hover:border-textMain transition-all duration-300 group">
                <h3 className="font-display text-2xl font-light text-textMain mb-3 tracking-[0.1em]">
                  HOTEL PG -II- 【ファミリータイプ】
                </h3>
                <p className="font-serif text-sm text-gray-600 mb-6 leading-relaxed">
                  ご家族での滞在に最適な広々とした空間
                </p>
                <a
                  href="https://vacation-stay.jp/listings/1138335?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg w-full sm:w-auto text-center"
                >
                  予約する →
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
