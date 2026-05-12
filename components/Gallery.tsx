import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackReservationClick } from '../utils/analytics';

interface GalleryImage {
  src: string;
  alt: string;
  category: 'room' | 'food';
  hotel?: 'I' | 'II' | 'III';
  roomType?: 'single' | 'family' | 'maisonette';
}

const GALLERY_IMAGES: GalleryImage[] = [
  // ALL category images (6 images for 3x3 grid)
  { src: '/images/gallery/DSC04514.webp', alt: 'ホテル', category: 'room' },
  { src: '/images/gallery/DSC04542.webp', alt: 'ホテル', category: 'room' },
  { src: '/images/gallery/DSC04555.webp', alt: '客室', category: 'room' },
  { src: '/images/gallery/DSC04582.webp', alt: '客室', category: 'room' },
  { src: '/images/gallery/DSC04591.webp', alt: '客室', category: 'room' },
  { src: '/images/gallery/DSC04605.webp', alt: '客室', category: 'room' },
  // ROOM category images - HOTEL PG -I- (7 images)
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.00.webp', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.12.webp', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.20.webp', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.32.webp', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.41.webp', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.53.webp', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.31.02.webp', alt: '客室', category: 'room', hotel: 'I' },
  // ROOM category images - HOTEL PG -II- シングルタイプ (3 images)
  { src: '/images/gallery/DSC04635.webp', alt: '客室', category: 'room', hotel: 'II', roomType: 'single' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.28.39.webp', alt: '客室', category: 'room', hotel: 'II', roomType: 'single' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.28.56.webp', alt: '客室', category: 'room', hotel: 'II', roomType: 'single' },
  // ROOM category images - HOTEL PG -II- ファミリータイプ (6 images)
  { src: '/images/gallery/DSC04582.webp', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  { src: '/images/gallery/DSC04613.webp', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  { src: '/images/gallery/DSC04591.webp', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  { src: '/images/gallery/DSC04593.webp', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  { src: '/images/gallery/DSC04605.webp', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  { src: '/images/gallery/DSC04576.webp', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  // ROOM category images - HOTEL PG -III- 3名タイプ (5 images)
  { src: '/hotel3/pg3-three-01.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'single' },
  { src: '/hotel3/pg3-three-02.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'single' },
  { src: '/hotel3/pg3-three-03.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'single' },
  { src: '/hotel3/pg3-three-04.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'single' },
  { src: '/hotel3/pg3-three-05.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'single' },
  // ROOM category images - HOTEL PG -III- 4名タイプ (5 images)
  { src: '/hotel3/pg3-room-01.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'family' },
  { src: '/hotel3/pg3-room-02.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'family' },
  { src: '/hotel3/pg3-room-03.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'family' },
  { src: '/hotel3/pg3-room-04.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'family' },
  { src: '/hotel3/pg3-room-05.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'family' },
  // ROOM category images - HOTEL PG -III- メゾネット洋室 (5 images)
  { src: '/hotel3/pg3-maisonette-01.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'maisonette' },
  { src: '/hotel3/pg3-maisonette-02.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'maisonette' },
  { src: '/hotel3/pg3-maisonette-03.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'maisonette' },
  { src: '/hotel3/pg3-maisonette-04.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'maisonette' },
  { src: '/hotel3/pg3-maisonette-05.webp', alt: '客室', category: 'room', hotel: 'III', roomType: 'maisonette' },
  // FOOD category images
  { src: '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.webp', alt: '料理', category: 'food' },
  { src: '/images/gallery/DSC04467 (1).webp', alt: '料理', category: 'food' },
  { src: '/images/gallery/DSC04496.webp', alt: '料理', category: 'food' },
  { src: '/images/gallery/DSC04494.webp', alt: '料理', category: 'food' },
  { src: '/images/gallery/DSC04487.webp', alt: '料理', category: 'food' },
  { src: '/images/gallery/DSC04480.webp', alt: '料理', category: 'food' },
];

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'room' | 'food'>('room');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const filteredImages = GALLERY_IMAGES.filter(img => img.category === selectedCategory);

  // Separate room images by hotel
  const roomImagesI = GALLERY_IMAGES.filter(img => img.category === 'room' && img.hotel === 'I');
  const roomImagesIISingle = GALLERY_IMAGES.filter(img => img.category === 'room' && img.hotel === 'II' && img.roomType === 'single');
  const roomImagesIIFamily = GALLERY_IMAGES.filter(img => img.category === 'room' && img.hotel === 'II' && img.roomType === 'family');
  const roomImagesIIIThree = GALLERY_IMAGES.filter(img => img.category === 'room' && img.hotel === 'III' && img.roomType === 'single');
  const roomImagesIIIFour = GALLERY_IMAGES.filter(img => img.category === 'room' && img.hotel === 'III' && img.roomType === 'family');
  const roomImagesIIIMaisonette = GALLERY_IMAGES.filter(img => img.category === 'room' && img.hotel === 'III' && img.roomType === 'maisonette');

  const openLightbox = (index: number) => {
    setLightboxImage(index);
    // モバイルでもスクロール可能にするため、bodyのoverflowはロックしない
    // 代わりにライトボックス内でスクロール可能にする
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    // bodyのoverflowは変更していないので、何もしない
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxImage === null) return;
    const currentImages = selectedCategory === 'room' 
      ? GALLERY_IMAGES.filter(img => img.category === 'room')
      : filteredImages;
    const currentIndex = currentImages.findIndex(img => 
      currentImages[lightboxImage] === img
    );
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % currentImages.length
      : (currentIndex - 1 + currentImages.length) % currentImages.length;
    setLightboxImage(newIndex);
  };

  const categories = [
    { value: 'room' as const, label: 'Room' },
    { value: 'food' as const, label: 'Food' },
  ];

  const galleryReserveBtnClass =
    'inline-flex items-center justify-center w-full max-w-sm sm:w-auto sm:min-w-[240px] min-h-[48px] text-center font-display text-xs sm:text-sm tracking-[0.12em] sm:tracking-[0.18em] uppercase text-black bg-gray-100 border border-gray-300 px-6 sm:px-8 py-3.5 sm:py-4 hover:bg-white hover:border-gray-400 shadow-sm hover:shadow transition-all duration-300 rounded-lg';

  /** Room タブ：施設・タイプごとのカード枠 */
  const galleryRoomCardClass =
    'rounded-2xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 md:p-8';
  const galleryRoomHeadClass =
    'text-center pb-6 sm:pb-7 mb-6 sm:mb-7 border-b border-gray-100';
  const galleryRoomTitleClass =
    'font-display text-2xl md:text-3xl font-light text-textMain tracking-[0.06em]';
  const galleryRoomLeadClass =
    'font-serif text-xs sm:text-sm text-gray-500 mt-3 max-w-lg mx-auto leading-relaxed';
  const galleryRoomSubTitleClass =
    'font-display text-lg sm:text-xl md:text-2xl font-light text-textMain tracking-[0.04em]';
  const galleryGridShellClass = 'overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200/80';
  const galleryReserveBandClass =
    'mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100 flex flex-col items-center';

  return (
    <>
      <section id="gallery" className="relative py-12 sm:py-20 md:py-32 lg:py-48">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex flex-col items-center mb-20 text-center">
            <h2 className="font-display text-4xl md:text-6xl font-light text-textMain mb-6">Gallery</h2>
            <p className="font-serif text-sm text-gray-500 tracking-widest mb-10">因島の記憶</p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {categories.map((category) => (
                <button
                    key={category.value}
                    onClick={() => {
                        setSelectedCategory(category.value);
                        setLightboxImage(null);
                    }}
                    className={`pb-2 font-body text-xs tracking-[0.2em] uppercase transition-all duration-300 border-b ${
                    selectedCategory === category.value
                        ? 'border-textMain text-textMain'
                        : 'border-transparent text-gray-400 hover:text-textMain hover:border-gray-200'
                    }`}
                >
                    {category.label}
                </button>
                ))}
            </div>
          </div>

          {/* Image Grid */}
          {selectedCategory === 'room' ? (
            // ROOM category: Show by hotel sections
            <div className="space-y-12 md:space-y-16 lg:space-y-20">
              {/* HOTEL PG -I- */}
              <div className={galleryRoomCardClass}>
                <div className={galleryRoomHeadClass}>
                  <h3 className={galleryRoomTitleClass}>HOTEL PG -I-</h3>
                  <p className={galleryRoomLeadClass}>写真をタップすると拡大表示されます。</p>
                </div>
                <div className={galleryGridShellClass}>
                  <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-1.5">
                  {roomImagesI.map((image, index) => (
                    <div
                      key={`${image.src}-${index}`}
                      onClick={() => {
                        const allRoomImages = GALLERY_IMAGES.filter(img => img.category === 'room');
                        const roomIndex = allRoomImages.findIndex(img => img === image);
                        openLightbox(roomIndex);
                      }}
                      className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-200/60"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                        loading={index < 6 ? 'eager' : 'lazy'}
                        priority={index < 3}
                      />
                    </div>
                  ))}
                  </div>
                </div>
                <div className={galleryReserveBandClass}>
                  <a
                    href="/rooms/pg1"
                    onClick={() => trackReservationClick('gallery_room:pg1')}
                    className={galleryReserveBtnClass}
                  >
                    HOTEL PG -I- のご予約・詳細
                  </a>
                </div>
              </div>

              {/* HOTEL PG -II- */}
              <div className="space-y-8 md:space-y-10">
                <div className="text-center px-2">
                  <h3 className={galleryRoomTitleClass}>HOTEL PG -II-</h3>
                  <p className={galleryRoomLeadClass}>シングル／ファミリータイプの客室です。</p>
                </div>

                {/* シングルタイプ */}
                <div className={galleryRoomCardClass}>
                  <div className={galleryRoomHeadClass}>
                    <h4 className={galleryRoomSubTitleClass}>シングルタイプ</h4>
                    <p className={galleryRoomLeadClass}>写真をタップすると拡大表示されます。</p>
                  </div>
                  <div className={galleryGridShellClass}>
                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-1.5">
                    {roomImagesIISingle.map((image, index) => (
                      <div
                        key={`${image.src}-${index}`}
                        onClick={() => {
                          const allRoomImages = GALLERY_IMAGES.filter(img => img.category === 'room');
                          const roomIndex = allRoomImages.findIndex(img => img === image);
                          openLightbox(roomIndex);
                        }}
                        className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-200/60"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                          loading={index < 3 ? 'eager' : 'lazy'}
                          priority={index < 2}
                        />
                      </div>
                    ))}
                    </div>
                  </div>
                  <div className={galleryReserveBandClass}>
                    <a
                      href="/rooms/pg2-single"
                      onClick={() => trackReservationClick('gallery_room:pg2_single')}
                      className={galleryReserveBtnClass}
                    >
                      シングルタイプのご予約・詳細
                    </a>
                  </div>
                </div>

                {/* ファミリータイプ */}
                <div className={galleryRoomCardClass}>
                  <div className={galleryRoomHeadClass}>
                    <h4 className={galleryRoomSubTitleClass}>ファミリータイプ</h4>
                    <p className={galleryRoomLeadClass}>写真をタップすると拡大表示されます。</p>
                  </div>
                  <div className={galleryGridShellClass}>
                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-1.5">
                    {roomImagesIIFamily.map((image, index) => (
                      <div
                        key={`${image.src}-${index}`}
                        onClick={() => {
                          const allRoomImages = GALLERY_IMAGES.filter(img => img.category === 'room');
                          const roomIndex = allRoomImages.findIndex(img => img === image);
                          openLightbox(roomIndex);
                        }}
                        className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-200/60"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                          loading={index < 6 ? 'eager' : 'lazy'}
                          priority={index < 3}
                        />
                      </div>
                    ))}
                    </div>
                  </div>
                  <div className={galleryReserveBandClass}>
                    <a
                      href="/rooms/pg2-family"
                      onClick={() => trackReservationClick('gallery_room:pg2_family')}
                      className={galleryReserveBtnClass}
                    >
                      ファミリータイプのご予約・詳細
                    </a>
                  </div>
                </div>
              </div>

              {/* HOTEL PG -III- */}
              <div className={galleryRoomCardClass}>
                <div className={galleryRoomHeadClass}>
                  <h3 className={galleryRoomTitleClass}>HOTEL PG -III-</h3>
                  <p className={galleryRoomLeadClass}>3名タイプ・4名タイプの写真です。写真はタップで拡大します。</p>
                </div>
                <div className="space-y-8">
                  <div>
                    <div className="text-center font-display text-sm sm:text-base tracking-[0.14em] uppercase text-gray-500">
                      3名タイプ
                    </div>
                    <div className={`mt-3 ${galleryGridShellClass}`}>
                      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-1.5">
                        {roomImagesIIIThree.map((image, index) => (
                          <div
                            key={`${image.src}-${index}`}
                            onClick={() => {
                              const allRoomImages = GALLERY_IMAGES.filter((img) => img.category === 'room');
                              const roomIndex = allRoomImages.findIndex((img) => img === image);
                              openLightbox(roomIndex);
                            }}
                            className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-200/60"
                          >
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              sizes="(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                              loading={index < 5 ? 'eager' : 'lazy'}
                              priority={index < 3}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={galleryReserveBandClass}>
                      <a
                        href="/rooms/pg3"
                        onClick={() => trackReservationClick('gallery_room:pg3_three')}
                        className={galleryReserveBtnClass}
                      >
                        PG-III 3名タイプのご予約・詳細
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="text-center font-display text-sm sm:text-base tracking-[0.14em] uppercase text-gray-500">
                      4名タイプ
                    </div>
                    <div className={`mt-3 ${galleryGridShellClass}`}>
                      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-1.5">
                        {roomImagesIIIFour.map((image, index) => (
                          <div
                            key={`${image.src}-${index}`}
                            onClick={() => {
                              const allRoomImages = GALLERY_IMAGES.filter((img) => img.category === 'room');
                              const roomIndex = allRoomImages.findIndex((img) => img === image);
                              openLightbox(roomIndex);
                            }}
                            className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-200/60"
                          >
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              sizes="(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                              loading={index < 5 ? 'eager' : 'lazy'}
                              priority={index < 3}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={galleryReserveBandClass}>
                      <a
                        href="/rooms/pg3-four"
                        onClick={() => trackReservationClick('gallery_room:pg3_four')}
                        className={galleryReserveBtnClass}
                      >
                        PG-III 4名タイプのご予約・詳細
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="text-center font-display text-sm sm:text-base tracking-[0.14em] uppercase text-gray-500">
                      メゾネット洋室
                    </div>
                    <div className={`mt-3 ${galleryGridShellClass}`}>
                      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-1.5">
                        {roomImagesIIIMaisonette.map((image, index) => (
                          <div
                            key={`${image.src}-${index}`}
                            onClick={() => {
                              const allRoomImages = GALLERY_IMAGES.filter((img) => img.category === 'room');
                              const roomIndex = allRoomImages.findIndex((img) => img === image);
                              openLightbox(roomIndex);
                            }}
                            className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-200/60"
                          >
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              sizes="(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                              loading={index < 5 ? 'eager' : 'lazy'}
                              priority={index < 3}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={galleryReserveBandClass}>
                      <a
                        href="/rooms/pg3-maisonette"
                        onClick={() => trackReservationClick('gallery_room:pg3_maisonette')}
                        className={galleryReserveBtnClass}
                      >
                        PG-III メゾネット洋室のご予約・詳細
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Other categories: Normal grid
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {filteredImages.map((image, index) => (
                  <div
                      key={`${image.src}-${index}`}
                      onClick={() => openLightbox(index)}
                      className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-100"
                  >
                      <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                          loading={index < 6 ? 'eager' : 'lazy'}
                          priority={index < 3}
                      />
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
      {lightboxImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/98 overflow-y-auto"
          onClick={closeLightbox}
        >
          <div className="min-h-full flex flex-col items-center justify-center py-20 px-4">
            <button
              onClick={closeLightbox}
              className="fixed top-20 sm:top-8 right-8 text-white/50 hover:text-white transition-colors z-[120] bg-black/50 rounded-full p-2"
            >
              <X size={32} strokeWidth={1} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('prev');
              }}
              className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[120] hidden md:block bg-black/50 rounded-full p-2"
            >
              <ChevronLeft size={48} strokeWidth={1} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('next');
              }}
              className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[120] hidden md:block bg-black/50 rounded-full p-2"
            >
              <ChevronRight size={48} strokeWidth={1} />
            </button>

            <div
              className="relative max-w-7xl w-full flex flex-col items-center justify-center min-h-[50vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={(selectedCategory === 'room' ? GALLERY_IMAGES.filter(img => img.category === 'room') : filteredImages)[lightboxImage].src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-full h-[85vh] min-h-[300px]"
              >
                <Image
                  src={(selectedCategory === 'room' ? GALLERY_IMAGES.filter(img => img.category === 'room') : filteredImages)[lightboxImage].src}
                  alt={(selectedCategory === 'room' ? GALLERY_IMAGES.filter(img => img.category === 'room') : filteredImages)[lightboxImage].alt}
                  fill
                  sizes="100vw"
                  className="object-contain shadow-2xl"
                />
              </motion.div>
            </div>

            <div className="mt-4 text-white/60 text-xs font-serif tracking-widest text-center">
              {(selectedCategory === 'room' ? GALLERY_IMAGES.filter(img => img.category === 'room') : filteredImages)[lightboxImage].alt}
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
