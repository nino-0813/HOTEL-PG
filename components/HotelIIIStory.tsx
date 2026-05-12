import React, { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { ArrowLeft, Calendar, MapPin, Building2, X, ChevronRight } from 'lucide-react';
import { useHydrated } from '@/lib/useHydrated';

interface StoryStep {
  id: string;
  title: string;
  date?: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  statusLabel?: string; // 表示用ラベル（例: 完成ステップを「オープン予定」など）
  image?: string;
  images?: string[];
  video?: string; // 動画URL（YouTube、Vimeo、または直接動画ファイル）
  details?: string;
}

const HotelIIIStory: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const reveal = hydrated && isInView;

  const [selectedStep, setSelectedStep] = useState<StoryStep | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const storySteps: StoryStep[] = [
    {
      id: 'groundbreaking',
      title: '着工',
      description: 'HOTEL PG -III- の建設工事が開始されました。因島の景観を損なわないよう、慎重に進められています。',
      status: 'completed',
      images: [
        '/images/gallery/4155B79E-4132-40E1-97CE-DC85F9BF176E.webp',
        '/images/gallery/8779D702-559A-4E6D-B55C-A7AC035BB91C.webp',
        '/images/gallery/66AA3C58-C4A1-4964-9C9A-A90FF6FCF8D8.webp',
        '/images/gallery/3F40148E-223F-4CD9-BBAA-894F8D56A37F.webp'
      ],
      details: '建設工事が正式に開始。因島の美しい自然環境を守りながら、慎重に工事が進められています。'
    },
    {
      id: 'topping-out',
      title: '上棟',
      description: '建物の骨組みが完成。堅牢な構造が形になりました。',
      status: 'completed',
      video: '/videos/9264621d-2988-4217-b042-7f05aaf5f265.mp4',
      images: [
        '/images/gallery/A5017896-5870-4EDA-BF38-6931F239E168.webp',
        '/images/gallery/CDA7B1FB-A7FA-4B1E-A49D-B065B13ED921.webp',
        '/images/gallery2/105173_0.webp',
        '/images/gallery2/2A180EC2-5178-4D76-A49A-AA5B6295C169.webp',
        '/images/gallery2/6C1F413F-32A7-4BAB-8236-7A1538E4D0C9.webp',
        '/images/gallery2/8B4F402F-01D6-4325-9398-AD248FEF7967.webp',
        '/images/gallery2/8B785325-48D5-4928-9252-A3541EA5A7E6.webp'
      ],
      details: '上棟式を迎え、建物の骨組みが完成しました。'
    },
    {
      id: 'interior-work',
      title: '内装工事',
      description: '上棟後、内装・設備工事を実施。窓からの眺めや室内の仕上げを進めています。',
      status: 'in-progress',
      video: '/videos/d610a408-a45a-45d0-b98f-cd75773bd27d.mp4',
      images: [
        '/images/gallery2/105175_0.webp',
        '/images/gallery2/105176_0.webp',
        '/images/gallery2/105177_0.webp',
        '/images/gallery2/105178_0.webp',
        '/images/gallery2/105179_0.webp',
        '/images/gallery2/105180_0.webp',
        '/images/gallery2/105181_0.webp',
        '/images/gallery2/105182_0.webp',
        '/images/gallery2/105183_0.webp',
        '/images/gallery2/105184_0.webp',
        '/images/gallery2/105185_0.webp',
        '/images/gallery2/105186_0.webp',
        '/images/gallery2/105201_0.webp',
        '/images/gallery2/105210_0.webp'
      ],
      details: '内装・設備工事を実施。窓からの眺めや室内の仕上げを進め、完成に向けて準備を進めています。'
    },
    {
      id: 'completion',
      title: '完成',
      description: 'HOTEL PG -III- の完成に向けて、最後の仕上げを進めています。完成の様子は、今後こちらでご紹介いたします。',
      status: 'in-progress',
      statusLabel: 'オープン予定',
      details: 'HOTEL PG -III- の完成に向けて、最後の仕上げを進めています。完成の様子は、今後こちらでご紹介いたします。'
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
        return '施工中';
      case 'upcoming':
        return '予定';
      default:
        return '';
    }
  };


  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background pt-20">
      {/* Back Button */}
      <div className="fixed top-20 sm:top-24 left-6 md:left-12 z-[110]">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-textMain hover:text-textLight transition-colors bg-white/90 hover:bg-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm"
        >
          <ArrowLeft size={18} />
          <span className="font-display text-sm tracking-[0.1em]">Back</span>
        </button>
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
                animate={reveal ? { opacity: 1, y: 0 } : false}
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
                    className="w-full bg-white border border-gray-200 overflow-hidden rounded-lg hover:border-textMain hover:shadow-xl transition-all duration-500 text-left group cursor-pointer transform hover:-translate-y-1"
                  >
                    {/* Image/Video Preview - 上部に配置：動画あり＝動画、画像のみ＝画像、それ以外＝今後動画を追加予定 */}
                    {(step.video || (step.images && step.images.length > 0) || step.status === 'in-progress' || step.status === 'upcoming') && (
                      <div className="relative aspect-video bg-gray-100 overflow-hidden">
                        {step.video ? (
                          <>
                            {/* Video Thumbnail */}
                            {(() => {
                              if (step.video.includes('youtube.com') || step.video.includes('youtu.be')) {
                                let videoId = '';
                                if (step.video.includes('youtu.be/')) {
                                  videoId = step.video.split('youtu.be/')[1]?.split('?')[0] || '';
                                } else if (step.video.includes('youtube.com/watch?v=')) {
                                  videoId = step.video.split('v=')[1]?.split('&')[0] || '';
                                } else if (step.video.includes('youtube.com/embed/')) {
                                  videoId = step.video.split('youtube.com/embed/')[1]?.split('?')[0] || '';
                                }
                                
                                if (videoId) {
                                  return (
                                    <img 
                                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.webp`}
                                      alt={step.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.webp`;
                                      }}
                                    />
                                  );
                                }
                              }
                              
                              if (step.video.endsWith('.mp4') || step.video.endsWith('.webm') || step.video.endsWith('.mov')) {
                                return (
                                  <video
                                    src={step.video}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    muted
                                    preload="metadata"
                                    onLoadedMetadata={(e) => {
                                      const video = e.target as HTMLVideoElement;
                                      video.currentTime = 0.1;
                                    }}
                                  />
                                );
                              }
                              
                              return null;
                            })()}
                            
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                              <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl">
                                <svg className="w-8 h-8 text-textMain ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                            
                            {/* Video Badge */}
                            <div className="absolute bottom-3 right-3 bg-textMain/90 backdrop-blur-sm text-white text-xs font-body tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2 z-10">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              動画
                            </div>
                          </>
                        ) : (step.images && step.images.length > 0) ? (
                          <>
                            {/* 画像のみのステップ：画像サムネイルを表示 */}
                            <img 
                              src={step.images[0]} 
                              alt={step.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-body tracking-widest px-3 py-1.5 rounded-full z-10 flex items-center gap-2">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              画像{step.images.length > 1 ? ` +${step.images.length - 1}` : ''}
                            </div>
                          </>
                        ) : (
                          <div className="relative w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center px-6">
                              <div className="inline-block px-6 py-3 rounded-full mb-4 bg-gray-500 text-white shadow-lg">
                                <span className="font-body text-sm font-medium tracking-widest uppercase">
                                  {step.statusLabel ?? (step.status === 'completed' ? '完了' : step.status === 'in-progress' ? '施工中' : '予定')}
                                </span>
                              </div>
                              <div className="bg-white/90 backdrop-blur-sm text-textMain px-6 py-3 rounded-full shadow-lg">
                                <span className="font-body text-sm tracking-widest">今後動画を追加予定</span>
                              </div>
                              <div className="mt-6 flex justify-center">
                                <svg className="w-16 h-16 text-gray-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6 md:p-8">
                      {/* Date & Status Row */}
                      <div className="flex items-center justify-between mb-4">
                        {step.date && (
                          <div className="flex items-center gap-2 text-textMain">
                            <Calendar size={16} className="text-textMain/60" />
                            <span className="font-display text-sm font-medium tracking-widest">{step.date}</span>
                          </div>
                        )}
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-body tracking-widest uppercase ${
                            step.id === 'interior-work' && step.status === 'in-progress'
                              ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-200 animate-pulse'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {step.statusLabel ?? getStatusText(step.status)}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-2xl md:text-3xl font-light text-textMain mb-3 tracking-[0.1em] group-hover:text-textMain/80 transition-colors">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="font-serif text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {step.description}
                      </p>

                      {/* View More Indicator */}
                      <div className="flex items-center gap-2 text-textMain/60 group-hover:text-textMain transition-colors">
                        <span className="font-body text-xs tracking-widest uppercase">詳細を見る</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
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
                  {/* Back Button */}
                  <button
                    onClick={() => setSelectedStep(null)}
                    className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/90 hover:bg-white px-4 py-2 rounded-full shadow-lg transition-all"
                  >
                    <ArrowLeft size={18} className="text-textMain" />
                    <span className="font-display text-sm tracking-[0.1em] text-textMain">Back</span>
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedStep(null)}
                    className="fixed top-20 sm:top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors z-[110] bg-white rounded-full shadow-lg"
                  >
                    <X size={20} className="text-textMain" />
                  </button>

                  {/* Video Player - スマホは縦動画向け aspect-[9/16]、それ以上は 16:9 */}
                  {selectedStep.video && (
                    <div className="relative aspect-[9/16] sm:aspect-video bg-black rounded-t-lg overflow-hidden">
                      {(() => {
                        // YouTube動画のURL解析
                        if (selectedStep.video.includes('youtube.com') || selectedStep.video.includes('youtu.be')) {
                          let videoId = '';
                          if (selectedStep.video.includes('youtu.be/')) {
                            videoId = selectedStep.video.split('youtu.be/')[1]?.split('?')[0] || '';
                          } else if (selectedStep.video.includes('youtube.com/embed/')) {
                            videoId = selectedStep.video.split('youtube.com/embed/')[1]?.split('?')[0] || '';
                          } else if (selectedStep.video.includes('youtube.com/watch?v=')) {
                            videoId = selectedStep.video.split('v=')[1]?.split('&')[0] || '';
                          }
                          
                          if (videoId) {
                            return (
                              <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                title={selectedStep.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            );
                          }
                        }
                        
                        // Vimeo動画
                        if (selectedStep.video.includes('vimeo.com')) {
                          const vimeoId = selectedStep.video.split('vimeo.com/')[1]?.split('?')[0] || '';
                          if (vimeoId) {
                            return (
                              <iframe
                                className="w-full h-full"
                                src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
                                title={selectedStep.title}
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                              />
                            );
                          }
                        }
                        
                        // 直接動画ファイル
                        return (
                          <video
                            className="w-full h-full object-contain"
                            controls
                            autoPlay={false}
                            playsInline
                            src={selectedStep.video}
                            ref={(video) => {
                              if (video) {
                                video.playbackRate = 3.0; // 3倍速で再生
                              }
                            }}
                          >
                            お使いのブラウザは動画タグをサポートしていません。
                          </video>
                        );
                      })()}
                    </div>
                  )}

                  {/* Images Gallery - Show when no video */}
                  {selectedStep.images && selectedStep.images.length > 0 && !selectedStep.video && (
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
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(selectedStep.status)} ${
                          selectedStep.id === 'interior-work' && selectedStep.status === 'in-progress'
                            ? 'animate-pulse ring-2 ring-blue-200 ring-offset-2'
                            : ''
                        }`}
                      />
                      <span
                        className={`font-display text-xs tracking-[0.2em] uppercase ${
                          selectedStep.id === 'interior-work' && selectedStep.status === 'in-progress'
                            ? 'text-blue-600 animate-pulse'
                            : 'text-gray-500'
                        }`}
                      >
                        {selectedStep.statusLabel ?? getStatusText(selectedStep.status)}
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

                    {/* Photo Gallery - Show below content when images exist */}
                    {selectedStep.images && selectedStep.images.length > 0 && (
                      <div className="pt-12 border-t border-gray-200 mt-8">
                        <h3 className="font-display text-xl font-light text-textMain mb-6 tracking-[0.1em]">
                          写真ギャラリー
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedStep.images.map((image, idx) => (
                            <motion.div
                              key={image}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: Math.min(idx * 0.1, 0.5) }}
                              className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 group cursor-pointer"
                              onClick={() => {
                                setSelectedImage(image);
                                setCurrentImageIndex(idx);
                              }}
                            >
                              <img
                                src={image}
                                alt={`${selectedStep.title} - 写真 ${idx + 1}`}
                                className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${['66AA3C58', '3F40148E', 'A5017896', '2A180EC2', '6C1F413F', '8B4F402F', '8B785325'].some((id) => image.includes(id)) ? 'rotate-90 scale-[1.4]' : ''}`}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && selectedStep && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/90 z-[300]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            />
            
            {/* Image Modal */}
            <motion.div
              className="fixed inset-0 z-[301] flex items-center justify-center p-6 md:p-12 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-6xl max-h-[90vh] pointer-events-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors z-10"
                >
                  <X size={24} className="text-white" />
                </button>

                {/* Main Image */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <img
                    src={selectedImage}
                    alt={selectedStep.title}
                    className={`w-full h-auto max-h-[90vh] object-contain ${['66AA3C58', '3F40148E', 'A5017896', '2A180EC2', '6C1F413F', '8B4F402F', '8B785325'].some((id) => selectedImage.includes(id)) ? 'rotate-90' : ''}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Navigation */}
                {selectedStep.images && selectedStep.images.length > 1 && (
                  <>
                    {/* Previous Button */}
                    {currentImageIndex > 0 && (
                      <button
                        onClick={() => {
                          const newIndex = currentImageIndex - 1;
                          setCurrentImageIndex(newIndex);
                          setSelectedImage(selectedStep.images![newIndex]);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                      >
                        <ChevronRight size={24} className="text-textMain rotate-180" />
                      </button>
                    )}

                    {/* Next Button */}
                    {currentImageIndex < selectedStep.images.length - 1 && (
                      <button
                        onClick={() => {
                          const newIndex = currentImageIndex + 1;
                          setCurrentImageIndex(newIndex);
                          setSelectedImage(selectedStep.images![newIndex]);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                      >
                        <ChevronRight size={24} className="text-textMain" />
                      </button>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-sm font-body tracking-widest px-4 py-2 rounded-full">
                      {currentImageIndex + 1} / {selectedStep.images.length}
                    </div>
                  </>
                )}
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

