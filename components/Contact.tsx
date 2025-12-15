import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Calendar, Users, Instagram } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-20 sm:py-32 md:py-48">
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
                  <a href="tel:05054446620" className="font-serif text-xs text-textLight hover:text-textMain transition-colors">
                    050-5444-6620
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
                ご予約・お問い合わせは、お電話または下記フォームよりお願いいたします。
              </p>
              <p className="font-serif text-xs text-textLight">
                受付時間: 9:00 - 18:00
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

            {/* Contact Form Section */}
            <div className="mt-12 pt-12 border-t border-gray-200">
              <h3 className="font-display text-2xl font-light text-textMain mb-6 tracking-[0.1em]">
                お問い合わせフォーム
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-serif text-xs text-textMain mb-2 tracking-wider">
                      お名前 <span className="text-gray-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-b border-gray-300 bg-transparent font-serif text-sm text-textMain focus:outline-none focus:border-textMain transition-colors"
                      placeholder="山田 太郎"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-serif text-xs text-textMain mb-2 tracking-wider">
                      メールアドレス <span className="text-gray-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-b border-gray-300 bg-transparent font-serif text-sm text-textMain focus:outline-none focus:border-textMain transition-colors"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block font-serif text-xs text-textMain mb-2 tracking-wider">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-b border-gray-300 bg-transparent font-serif text-sm text-textMain focus:outline-none focus:border-textMain transition-colors"
                    placeholder="090-1234-5678"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-serif text-xs text-textMain mb-2 tracking-wider">
                    メッセージ
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-b border-gray-300 bg-transparent font-serif text-sm text-textMain focus:outline-none focus:border-textMain transition-colors resize-none"
                    placeholder="ご質問やご要望がございましたら、お気軽にお書きください。"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200">
                    <p className="font-serif text-sm text-green-800">
                      お問い合わせありがとうございます。担当者より2営業日以内にご連絡いたします。
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full md:w-auto px-12 py-4 border border-textMain text-textMain overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  <span className="absolute inset-0 bg-textMain translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></span>
                  <span className="relative font-body text-xs tracking-[0.2em] uppercase group-hover:text-white transition-colors duration-500 flex items-center justify-center gap-2">
                    {isSubmitting ? '送信中...' : (
                      <>
                        <Send size={14} />
                        送信する
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
