import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { X } from 'lucide-react';
import HotelIIIStory from './HotelIIIStory';
import HotelDetail from './HotelDetail';

interface Hotel {
  id: string;
  name: string;
  status: 'open' | 'new' | 'coming';
  description: string;
  location?: string;
  rooms?: string;
  features?: string[];
  image?: string;
  details?: {
    concept?: string;
    rooms?: string;
    dining?: string;
    facilities?: string[];
  };
}

const Hotels: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showStory, setShowStory] = useState(false);
  const [showHotelDetail, setShowHotelDetail] = useState(false);
  const [selectedHotelDetail, setSelectedHotelDetail] = useState<any>(null);

  const hotels: Hotel[] = [
    {
      id: 'hotel-i',
      name: 'HOTEL PG -I-',
      status: 'open',
      description: '瀬戸内の静寂に包まれた、最初の隠れ家リゾート。',
      location: '広島県尾道市因島',
      rooms: '5室',
      features: ['全室オーシャンビュー', 'テラス付きスイート', '瀬戸内の食材を活かした料理'],
      details: {
        concept: '瀬戸内海の静寂に包まれた、最初の隠れ家リゾート。因島の美しい自然と調和した空間で、心身ともにリフレッシュできる特別な時間をお過ごしください。',
        rooms: 'わずか5室の客室は、すべて海に面したスイートルーム。窓を開ければ、しまなみの風が通り抜け、テラスに出れば、手が届きそうな星空が広がります。',
        dining: '瀬戸内の恵みを活かした料理を、朝食・夕食ともにご提供。因島の八朔やレモン、新鮮な魚介類を中心としたメニューをお楽しみいただけます。',
        facilities: ['全室オーシャンビュー', 'テラス付きスイート', '無料Wi-Fi', '駐車場完備']
      }
    },
    {
      id: 'hotel-ii',
      name: 'HOTEL PG -II-',
      status: 'open',
      description: '海と空が交わる場所に佇む、第二の特別な空間。',
      location: '広島県尾道市因島',
      rooms: '5室',
      features: ['全室オーシャンビュー', 'モダンなインテリア', '瀬戸内の食材を活かした料理'],
      details: {
        concept: '海と空が交わる場所に佇む、第二の特別な空間。HOTEL PG -I-の成功を踏まえ、さらに洗練されたデザインとサービスで、新たな滞在体験をお届けします。',
        rooms: '5室のスイートルームは、すべて海に面し、モダンで洗練されたインテリアデザイン。尾道の帆布や因島の除虫菊など、地域の素材をモダンにアレンジしています。',
        dining: '瀬戸内の食材にこだわり、素材の味を極限まで引き出したイノベーティブ・フレンチ。料理に合わせてセレクトした瀬戸内のワインや日本酒と共に、五感で味わう至福のひとときを。',
        facilities: ['全室オーシャンビュー', 'モダンなインテリア', '無料Wi-Fi', '駐車場完備', 'レストラン']
      }
    },
    {
      id: 'hotel-iii',
      name: 'HOTEL PG -III-',
      status: 'coming',
      description: '新築完成予定。最新の設備と洗練されたデザインで、新しい滞在体験を。',
      location: '広島県尾道市因島',
      rooms: '建設中',
      features: ['最新の設備', '洗練されたデザイン', '新たな滞在体験'],
      details: {
        concept: 'HOTEL PG -III- は現在建設中です。最新の設備と洗練されたデザインで、これまでにない新しい滞在体験をお届けする準備を進めております。',
        rooms: '詳細は決定次第、お知らせいたします。',
        dining: '詳細は決定次第、お知らせいたします。',
        facilities: ['詳細は決定次第、お知らせいたします。']
      }
    }
  ];

  return (
    <section id="hotels" className="relative py-32 md:py-48 bg-background">
      <div ref={ref} className="container mx-auto px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-textMain mb-4">
            Our Hotels
          </h2>
          <p className="font-serif text-sm text-gray-500 tracking-widest">
            私たちのホテル
          </p>
          <div className="w-12 h-[1px] bg-gray-300 mt-6"></div>
        </motion.div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Card */}
              <button
                onClick={() => {
                  if (hotel.id === 'hotel-iii') {
                    setShowStory(true);
                  } else {
                    // Hotel detail data
                    const hotelDetailData = {
                      id: hotel.id,
                      name: hotel.name,
                      location: hotel.location || '広島県尾道市因島',
                      description: hotel.description,
                      images: hotel.id === 'hotel-i' 
                        ? [
                            '/images/gallery/3b28601b853b111ff30dfbe827b53f76e3b7ad52.47.9.26.3.jpg',
                            '/images/hero/innnoshima1-1280.jpg',
                            '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.jpg'
                          ]
                        : [
                            '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.jpg',
                            '/images/gallery/d3fbfc1e80a9dc5693dc704be0a6b65aa4ec47d2.47.9.26.3.jpg',
                            '/images/gallery/ac006cf89d55c5d57caeb27feccbca77f92bab50.47.9.26.3.jpg'
                          ],
                      rooms: hotel.id === 'hotel-i'
                        ? [
                            {
                              id: 'room-1',
                              name: 'Suite Ocean View',
                              description: '瀬戸内海を一望できる広々としたスイートルーム。テラスからは美しい夕日と星空を楽しめます。',
                              size: '60㎡',
                              capacity: '2名',
                              features: ['オーシャンビュー', 'プライベートテラス', 'バスタブ', 'ミニバー', '無料Wi-Fi'],
                              image: '/images/gallery/3b28601b853b111ff30dfbe827b53f76e3b7ad52.47.9.26.3.jpg'
                            },
                            {
                              id: 'room-2',
                              name: 'Deluxe Ocean View',
                              description: '海に面したデラックスルーム。自然光がたっぷりと差し込む明るい空間で、ゆったりとお過ごしいただけます。',
                              size: '45㎡',
                              capacity: '2名',
                              features: ['オーシャンビュー', 'バスタブ', 'ミニバー', '無料Wi-Fi'],
                              image: '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.jpg'
                            },
                            {
                              id: 'room-3',
                              name: 'Standard Ocean View',
                              description: '瀬戸内の美しい景色を楽しめるスタンダードルーム。シンプルで上質な空間です。',
                              size: '35㎡',
                              capacity: '2名',
                              features: ['オーシャンビュー', 'ミニバー', '無料Wi-Fi'],
                              image: '/images/gallery/d3fbfc1e80a9dc5693dc704be0a6b65aa4ec47d2.47.9.26.3.jpg'
                            },
                            {
                              id: 'room-4',
                              name: 'Twin Ocean View',
                              description: '2名様用のツインルーム。海を眺めながら、ゆっくりとお過ごしいただけます。',
                              size: '40㎡',
                              capacity: '2名',
                              features: ['オーシャンビュー', 'ツインベッド', 'ミニバー', '無料Wi-Fi'],
                              image: '/images/gallery/ac006cf89d55c5d57caeb27feccbca77f92bab50.47.9.26.3.jpg'
                            },
                            {
                              id: 'room-5',
                              name: 'Family Ocean View',
                              description: 'ご家族やグループでのご利用に最適な広々としたルーム。',
                              size: '70㎡',
                              capacity: '4名',
                              features: ['オーシャンビュー', 'プライベートテラス', 'バスタブ', 'キッチン', '無料Wi-Fi'],
                              image: '/images/hero/innnoshima1-1280.jpg'
                            }
                          ]
                        : [
                            {
                              id: 'room-1',
                              name: 'Premium Suite',
                              description: 'モダンなデザインと最高級の快適さを兼ね備えたプレミアムスイート。',
                              size: '65㎡',
                              capacity: '2名',
                              features: ['オーシャンビュー', 'プライベートテラス', 'バスタブ', 'ミニバー', '無料Wi-Fi'],
                              image: '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.jpg'
                            },
                            {
                              id: 'room-2',
                              name: 'Modern Deluxe',
                              description: '洗練されたインテリアデザインのデラックスルーム。',
                              size: '50㎡',
                              capacity: '2名',
                              features: ['オーシャンビュー', 'バスタブ', 'ミニバー', '無料Wi-Fi'],
                              image: '/images/gallery/d3fbfc1e80a9dc5693dc704be0a6b65aa4ec47d2.47.9.26.3.jpg'
                            },
                            {
                              id: 'room-3',
                              name: 'Contemporary Standard',
                              description: 'モダンで機能的なスタンダードルーム。',
                              size: '38㎡',
                              capacity: '2名',
                              features: ['オーシャンビュー', 'ミニバー', '無料Wi-Fi'],
                              image: '/images/gallery/ac006cf89d55c5d57caeb27feccbca77f92bab50.47.9.26.3.jpg'
                            },
                            {
                              id: 'room-4',
                              name: 'Design Twin',
                              description: 'デザイン性の高いツインルーム。',
                              size: '42㎡',
                              capacity: '2名',
                              features: ['オーシャンビュー', 'ツインベッド', 'ミニバー', '無料Wi-Fi'],
                              image: '/images/gallery/3b28601b853b111ff30dfbe827b53f76e3b7ad52.47.9.26.3.jpg'
                            },
                            {
                              id: 'room-5',
                              name: 'Executive Suite',
                              description: 'ビジネスや特別な滞在に最適なエグゼクティブスイート。',
                              size: '75㎡',
                              capacity: '4名',
                              features: ['オーシャンビュー', 'プライベートテラス', 'バスタブ', 'ワークスペース', '無料Wi-Fi'],
                              image: '/images/hero/innnoshima1-1280.jpg'
                            }
                          ],
                      concept: hotel.details?.concept || '',
                      dining: hotel.details?.dining || '',
                      facilities: hotel.details?.facilities || []
                    };
                    setSelectedHotelDetail(hotelDetailData);
                    setShowHotelDetail(true);
                  }
                }}
                className="relative w-full h-full bg-white border border-gray-200 p-8 md:p-10 hover:border-textMain transition-all duration-500 hover:shadow-lg text-left"
              >
                {/* Status Badge */}
                {hotel.status === 'coming' && (
                  <div className="absolute top-6 right-6 bg-textMain text-white text-xs tracking-widest px-3 py-1">
                    COMING SOON
                  </div>
                )}
                {hotel.status === 'open' && (
                  <div className="absolute top-6 right-6 bg-green-600 text-white text-xs tracking-widest px-3 py-1">
                    OPEN
                  </div>
                )}

                {/* Hotel Name */}
                <h3 className="font-display text-2xl md:text-3xl font-light text-textMain mb-6 tracking-[0.15em]">
                  {hotel.name}
                </h3>

                {/* Description */}
                <p className="font-serif text-sm text-gray-600 leading-relaxed mb-8">
                  {hotel.description}
                </p>

                {/* Decorative Line */}
                <div className="w-12 h-[1px] bg-gray-300 group-hover:bg-textMain transition-colors duration-500"></div>

                {/* Hover Effect Indicator */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="font-display text-xs tracking-[0.2em] text-textMain uppercase">
                    Learn More →
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Hotel Detail Modal */}
        <AnimatePresence>
          {selectedHotel && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/60 z-[100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedHotel(null)}
              />
              
              {/* Modal */}
              <motion.div
                className="fixed inset-0 z-[101] flex items-center justify-center p-6 md:p-12 pointer-events-none"
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
                >
                  <div className="relative p-8 md:p-12">
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedHotel(null)}
                      className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} className="text-textMain" />
                    </button>

                    {/* Hotel Name */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-4">
                        <h2 className="font-display text-4xl md:text-5xl font-light text-textMain tracking-[0.15em]">
                          {selectedHotel.name}
                        </h2>
                        {selectedHotel.status === 'coming' && (
                          <span className="bg-textMain text-white text-xs tracking-widest px-3 py-1">
                            COMING SOON
                          </span>
                        )}
                        {selectedHotel.status === 'open' && (
                          <span className="bg-green-600 text-white text-xs tracking-widest px-3 py-1">
                            OPEN
                          </span>
                        )}
                      </div>
                      {selectedHotel.location && (
                        <p className="font-serif text-sm text-gray-500 tracking-widest">
                          {selectedHotel.location}
                        </p>
                      )}
                    </div>

                    {/* Details */}
                    {selectedHotel.details && (
                      <div className="space-y-8">
                        {/* Concept */}
                        {selectedHotel.details.concept && (
                          <div>
                            <h3 className="font-display text-xl font-light text-textMain mb-4 tracking-[0.1em]">
                              Concept
                            </h3>
                            <p className="font-serif text-sm text-gray-700 leading-relaxed">
                              {selectedHotel.details.concept}
                            </p>
                          </div>
                        )}

                        {/* Rooms */}
                        {selectedHotel.details.rooms && (
                          <div>
                            <h3 className="font-display text-xl font-light text-textMain mb-4 tracking-[0.1em]">
                              Rooms
                            </h3>
                            <p className="font-serif text-sm text-gray-700 leading-relaxed">
                              {selectedHotel.details.rooms}
                            </p>
                          </div>
                        )}

                        {/* Dining */}
                        {selectedHotel.details.dining && (
                          <div>
                            <h3 className="font-display text-xl font-light text-textMain mb-4 tracking-[0.1em]">
                              Dining
                            </h3>
                            <p className="font-serif text-sm text-gray-700 leading-relaxed">
                              {selectedHotel.details.dining}
                            </p>
                          </div>
                        )}

                        {/* Facilities */}
                        {selectedHotel.details.facilities && selectedHotel.details.facilities.length > 0 && (
                          <div>
                            <h3 className="font-display text-xl font-light text-textMain mb-4 tracking-[0.1em]">
                              Facilities
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedHotel.details.facilities.map((facility, idx) => (
                                <li key={idx} className="font-serif text-sm text-gray-700 flex items-center">
                                  <span className="w-1 h-1 bg-textMain rounded-full mr-3"></span>
                                  {facility}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reserve Button (only for open hotels) */}
                    {selectedHotel.status === 'open' && (
                      <div className="mt-12 pt-8 border-t border-gray-200">
                        <a
                          href="#reserve"
                          onClick={() => setSelectedHotel(null)}
                          className="inline-block font-display text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300"
                        >
                          Reserve Now
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hotel III Story Page */}
        <AnimatePresence>
          {showStory && (
            <HotelIIIStory onClose={() => setShowStory(false)} />
          )}
        </AnimatePresence>

        {/* Hotel Detail Page */}
        <AnimatePresence>
          {showHotelDetail && selectedHotelDetail && (
            <HotelDetail 
              hotel={selectedHotelDetail} 
              onClose={() => {
                setShowHotelDetail(false);
                setSelectedHotelDetail(null);
              }} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hotels;

