import React, { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { ArrowLeft, Calendar, MapPin, Building2, X, ChevronRight } from 'lucide-react';

interface StoryStep {
  id: string;
  title: string;
  date?: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  image?: string;
  images?: string[];
  details?: string;
}

const HotelIIIStory: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const [selectedStep, setSelectedStep] = useState<StoryStep | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const storySteps: StoryStep[] = [
    {
      id: 'concept',
      title: 'コンセプト設計',
      date: '2024.01',
      description: 'HOTEL PG -I-、-II-の成功を踏まえ、さらなる進化を目指した第三のホテルのコンセプトが誕生。最新の設備と洗練されたデザインで、新しい滞在体験を提供することを目指します。',
      status: 'completed',
      images: [
        '/images/gallery/3b28601b853b111ff30dfbe827b53f76e3b7ad52.47.9.26.3.jpg',
        '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.jpg'
      ],
      details: 'コンセプト設計では、HOTEL PG -I-、-II-で培った経験を活かし、さらに洗練された空間設計を目指しました。因島の自然環境と調和しながら、現代的な快適さを両立させる設計思想が確立されました。'
    },
    {
      id: 'planning',
      title: '基本設計・計画',
      date: '2024.03',
      description: '因島の美しい自然環境と調和する建築計画を策定。全室オーシャンビューを実現し、より快適で贅沢な空間を創造する設計が完成しました。',
      status: 'completed',
      images: [
        '/images/gallery/d3fbfc1e80a9dc5693dc704be0a6b65aa4ec47d2.47.9.26.3.jpg',
        '/images/gallery/ac006cf89d55c5d57caeb27feccbca77f92bab50.47.9.26.3.jpg'
      ],
      details: '基本設計では、全室オーシャンビューを実現するための配置計画、因島の景観を損なわない外観デザイン、そして快適な滞在を支える設備計画が詳細に検討されました。'
    },
    {
      id: 'construction-start',
      title: '着工',
      date: '2024.06',
      description: '建設工事が開始されました。因島の景観を損なわないよう、慎重に進められています。',
      status: 'completed',
      images: [
        '/images/hero/innnoshima1-1280.jpg'
      ],
      details: '2024年6月、HOTEL PG -III- の建設工事が正式に開始されました。因島の美しい自然環境を守りながら、慎重に工事が進められています。'
    },
    {
      id: 'foundation',
      title: '基礎工事',
      date: '2024.07',
      description: '堅牢な基礎工事が完了。瀬戸内の気候に適した構造で、長く愛されるホテルを目指します。',
      status: 'completed',
      images: [
        '/images/gallery/shimanami-kaidou-route_thumb.webp'
      ],
      details: '基礎工事では、瀬戸内の気候条件を考慮した堅牢な構造が完成しました。長期的な耐久性と安全性を確保するための重要な工程です。'
    },
    {
      id: 'structure',
      title: '躯体工事',
      date: '2024.09',
      description: '建物の骨組みが完成。全室オーシャンビューを実現するための構造が形になってきました。',
      status: 'in-progress',
      images: [
        '/images/gallery/3b28601b853b111ff30dfbe827b53f76e3b7ad52.47.9.26.3.jpg'
      ],
      details: '躯体工事が進行中です。建物の骨組みが徐々に形になり、全室オーシャンビューを実現するための構造が完成しつつあります。'
    },
    {
      id: 'interior',
      title: '内装工事',
      date: '2025.01',
      description: '洗練されたインテリアデザインの実装が進行中。地域の素材を活かしたモダンな空間が生まれつつあります。',
      status: 'in-progress',
      images: [
        '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.jpg'
      ],
      details: '内装工事が進行中です。尾道の帆布や因島の除虫菊など、地域の素材をモダンにアレンジしたインテリアデザインが実装されています。'
    },
    {
      id: 'facilities',
      title: '設備設置',
      date: '2025.03',
      description: '最新の設備の設置が進んでいます。快適な滞在を支える様々な設備が整いつつあります。',
      status: 'upcoming',
      images: [],
      details: '最新の設備の設置が予定されています。快適な滞在を支える様々な設備が整い、完成に向けて最終段階に入ります。'
    },
    {
      id: 'completion',
      title: '完成・オープン予定',
      date: '2025.06',
      description: 'HOTEL PG -III- の完成を目指して、日々工事が進められています。オープンまで、もうしばらくお待ちください。',
      status: 'upcoming',
      images: [],
      details: 'HOTEL PG -III- の完成を目指して、日々工事が進められています。オープンまで、もうしばらくお待ちください。最新情報は随時お知らせいたします。'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'in-progress':
        return '進行中';
      case 'upcoming':
        return '予定';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-textMain hover:text-textLight transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-display text-sm tracking-[0.1em]">Back</span>
          </button>
          <h1 className="font-display text-2xl md:text-3xl font-light text-textMain tracking-[0.15em]">
            HOTEL PG -III-
          </h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block bg-textMain text-white text-xs tracking-widest px-4 py-2 mb-6">
              COMING SOON
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-light text-textMain mb-6 tracking-[0.1em]">
              建設のストーリー
            </h2>
            <p className="font-serif text-base md:text-lg text-gray-600 leading-relaxed">
              HOTEL PG -III- が完成するまでの過程を、<br />
              段階的にご紹介いたします。
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story Timeline */}
      <div ref={ref} className="container mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="max-w-4xl mx-auto relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] bg-gray-200 hidden md:block" style={{ top: '2rem', bottom: '2rem' }}></div>

          {/* Story Steps */}
          <div className="relative space-y-16 md:space-y-24">
            {storySteps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white bg-white z-10 hidden md:block">
                  <div className={`w-full h-full rounded-full ${getStatusColor(step.status)}`}></div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}>
                  <button
                    onClick={() => {
                      setSelectedStep(step);
                      setCurrentImageIndex(0);
                    }}
                    className="w-full bg-white border border-gray-200 p-8 hover:border-textMain hover:shadow-lg transition-all duration-300 text-left group cursor-pointer"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(step.status)}`}></div>
                      <span className="font-display text-xs tracking-[0.2em] text-gray-500 uppercase">
                        {getStatusText(step.status)}
                      </span>
                    </div>

                    {/* Date */}
                    {step.date && (
                      <div className="flex items-center gap-2 mb-4 text-gray-500">
                        <Calendar size={14} />
                        <span className="font-body text-xs tracking-widest">{step.date}</span>
                      </div>
                    )}

                    {/* Title */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-2xl md:text-3xl font-light text-textMain tracking-[0.1em]">
                        {step.title}
                      </h3>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-textMain group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    {/* Description */}
                    <p className="font-serif text-sm text-gray-700 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Image Preview */}
                    {step.images && step.images.length > 0 && (
                      <div className="mt-6 aspect-video bg-gray-100 overflow-hidden rounded">
                        <img 
                          src={step.images[0]} 
                          alt={step.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Detail Modal */}
      <AnimatePresence>
        {selectedStep && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 z-[200]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStep(null)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-[201] flex items-center justify-center p-6 md:p-12 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedStep(null)}
                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors z-10 bg-white rounded-full shadow-lg"
                  >
                    <X size={20} className="text-textMain" />
                  </button>

                  {/* Images Gallery */}
                  {selectedStep.images && selectedStep.images.length > 0 && (
                    <div className="relative">
                      {/* Main Image */}
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <img
                          src={selectedStep.images[currentImageIndex]}
                          alt={selectedStep.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>

                      {/* Image Navigation */}
                      {selectedStep.images.length > 1 && (
                        <>
                          {/* Previous Button */}
                          {currentImageIndex > 0 && (
                            <button
                              onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                            >
                              <ChevronRight size={20} className="text-textMain rotate-180" />
                            </button>
                          )}

                          {/* Next Button */}
                          {currentImageIndex < selectedStep.images.length - 1 && (
                            <button
                              onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                            >
                              <ChevronRight size={20} className="text-textMain" />
                            </button>
                          )}

                          {/* Image Indicators */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {selectedStep.images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`h-2 rounded-full transition-all ${
                                  idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8 md:p-12">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedStep.status)}`}></div>
                      <span className="font-display text-xs tracking-[0.2em] text-gray-500 uppercase">
                        {getStatusText(selectedStep.status)}
                      </span>
                    </div>

                    {/* Date */}
                    {selectedStep.date && (
                      <div className="flex items-center gap-2 mb-6 text-gray-500">
                        <Calendar size={16} />
                        <span className="font-body text-sm tracking-widest">{selectedStep.date}</span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="font-display text-3xl md:text-4xl font-light text-textMain mb-6 tracking-[0.1em]">
                      {selectedStep.title}
                    </h2>

                    {/* Description */}
                    <p className="font-serif text-base text-gray-700 leading-relaxed mb-8">
                      {selectedStep.description}
                    </p>

                    {/* Details */}
                    {selectedStep.details && (
                      <div className="pt-8 border-t border-gray-200">
                        <h3 className="font-display text-xl font-light text-textMain mb-4 tracking-[0.1em]">
                          詳細情報
                        </h3>
                        <p className="font-serif text-sm text-gray-700 leading-relaxed">
                          {selectedStep.details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="bg-gray-50 py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Building2 size={48} className="text-textMain mx-auto mb-6 opacity-50" />
              <h3 className="font-display text-3xl md:text-4xl font-light text-textMain mb-6 tracking-[0.1em]">
                オープンまで、もうしばらくお待ちください
              </h3>
              <p className="font-serif text-base text-gray-600 leading-relaxed mb-8">
                HOTEL PG -III- の完成を心よりお待ちしております。<br />
                最新情報は、随時お知らせいたします。
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <MapPin size={16} />
                <span className="font-body text-sm tracking-widest">広島県尾道市因島</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelIIIStory;

