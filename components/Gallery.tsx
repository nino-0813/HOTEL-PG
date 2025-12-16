import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
  src: string;
  alt: string;
  category: 'room' | 'food';
  hotel?: 'I' | 'II' | 'III';
  roomType?: 'single' | 'family';
}

const GALLERY_IMAGES: GalleryImage[] = [
  // ALL category images (6 images for 3x3 grid)
  { src: '/images/gallery/DSC04514.png', alt: 'ホテル', category: 'room' },
  { src: '/images/gallery/DSC04542.png', alt: 'ホテル', category: 'room' },
  { src: '/images/gallery/DSC04555.png', alt: '客室', category: 'room' },
  { src: '/images/gallery/DSC04582.png', alt: '客室', category: 'room' },
  { src: '/images/gallery/DSC04591.png', alt: '客室', category: 'room' },
  { src: '/images/gallery/DSC04605.png', alt: '客室', category: 'room' },
  // ROOM category images - HOTEL PG -I- (7 images)
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.00.png', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.12.png', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.20.png', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.32.png', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.41.png', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.30.53.png', alt: '客室', category: 'room', hotel: 'I' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.31.02.png', alt: '客室', category: 'room', hotel: 'I' },
  // ROOM category images - HOTEL PG -II- シングルタイプ (3 images)
  { src: '/images/gallery/DSC04635.png', alt: '客室', category: 'room', hotel: 'II', roomType: 'single' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.28.39.png', alt: '客室', category: 'room', hotel: 'II', roomType: 'single' },
  { src: '/images/gallery/スクリーンショット 2025-12-15 0.28.56.png', alt: '客室', category: 'room', hotel: 'II', roomType: 'single' },
  // ROOM category images - HOTEL PG -II- ファミリータイプ (6 images)
  { src: '/images/gallery/DSC04582.png', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  { src: '/images/gallery/DSC04613.png', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  { src: '/images/gallery/DSC04591.png', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  { src: '/images/gallery/DSC04593.png', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  { src: '/images/gallery/DSC04605.png', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  { src: '/images/gallery/DSC04576.png', alt: '客室', category: 'room', hotel: 'II', roomType: 'family' },
  // FOOD category images
  { src: '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.jpg', alt: '料理', category: 'food' },
  { src: '/images/gallery/DSC04467 (1).png', alt: '料理', category: 'food' },
  { src: '/images/gallery/DSC04496.png', alt: '料理', category: 'food' },
  { src: '/images/gallery/DSC04494.png', alt: '料理', category: 'food' },
  { src: '/images/gallery/DSC04487.png', alt: '料理', category: 'food' },
  { src: '/images/gallery/DSC04480.png', alt: '料理', category: 'food' },
];

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'room' | 'food'>('all');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());
  const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map());

  // IntersectionObserver for lazy loading optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            setVisibleImages((prev) => new Set([...prev, img.src]));
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    imageRefs.current.forEach((img) => {
      if (img) observer.observe(img);
    });

    return () => {
      imageRefs.current.forEach((img) => {
        if (img) observer.unobserve(img);
      });
    };
  }, [selectedCategory]);

  const filteredImages = selectedCategory === 'all' 
    ? GALLERY_IMAGES.slice(0, 6) // ALL category shows first 6 images (3x3 grid)
    : GALLERY_IMAGES.filter(img => img.category === selectedCategory);

  // Separate room images by hotel
  const roomImagesI = GALLERY_IMAGES.filter(img => img.category === 'room' && img.hotel === 'I');
  const roomImagesIISingle = GALLERY_IMAGES.filter(img => img.category === 'room' && img.hotel === 'II' && img.roomType === 'single');
  const roomImagesIIFamily = GALLERY_IMAGES.filter(img => img.category === 'room' && img.hotel === 'II' && img.roomType === 'family');

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
    { value: 'all' as const, label: 'All' },
    { value: 'room' as const, label: 'Room' },
    { value: 'food' as const, label: 'Food' },
  ];

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
            <div className="space-y-16 md:space-y-24">
              {/* HOTEL PG -I- */}
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-light text-textMain mb-8 text-center">HOTEL PG -I-</h3>
                <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1">
                  {roomImagesI.map((image, index) => (
                    <div
                      key={`${image.src}-${index}`}
                      onClick={() => {
                        const allRoomImages = GALLERY_IMAGES.filter(img => img.category === 'room');
                        const roomIndex = allRoomImages.findIndex(img => img === image);
                        openLightbox(roomIndex);
                      }}
                      className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-100"
                    >
                      <img
                        ref={(el) => {
                          if (el) imageRefs.current.set(image.src, el);
                        }}
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                        loading={index < 6 ? "eager" : "lazy"}
                        fetchPriority={index < 3 ? "high" : "auto"}
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* HOTEL PG -II- */}
              <div className="space-y-12 md:space-y-16">
                <h3 className="font-display text-2xl md:text-3xl font-light text-textMain mb-8 text-center">HOTEL PG -II-</h3>
                
                {/* シングルタイプ */}
                <div>
                  <h4 className="font-display text-xl md:text-2xl font-light text-textMain mb-6 text-center">シングルタイプ</h4>
                  <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1">
                    {roomImagesIISingle.map((image, index) => (
                      <div
                        key={`${image.src}-${index}`}
                        onClick={() => {
                          const allRoomImages = GALLERY_IMAGES.filter(img => img.category === 'room');
                          const roomIndex = allRoomImages.findIndex(img => img === image);
                          openLightbox(roomIndex);
                        }}
                        className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-100"
                      >
                        <img
                          ref={(el) => {
                            if (el) imageRefs.current.set(image.src, el);
                          }}
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                          loading={index < 3 ? "eager" : "lazy"}
                          fetchPriority={index < 2 ? "high" : "auto"}
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ファミリータイプ */}
                <div>
                  <h4 className="font-display text-xl md:text-2xl font-light text-textMain mb-6 text-center">ファミリータイプ</h4>
                  <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1">
                    {roomImagesIIFamily.map((image, index) => (
                      <div
                        key={`${image.src}-${index}`}
                        onClick={() => {
                          const allRoomImages = GALLERY_IMAGES.filter(img => img.category === 'room');
                          const roomIndex = allRoomImages.findIndex(img => img === image);
                          openLightbox(roomIndex);
                        }}
                        className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-100"
                      >
                        <img
                          ref={(el) => {
                            if (el) imageRefs.current.set(image.src, el);
                          }}
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                          loading={index < 6 ? "eager" : "lazy"}
                          fetchPriority={index < 3 ? "high" : "auto"}
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* HOTEL PG -III- */}
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-light text-textMain mb-8 text-center">HOTEL PG -III-</h3>
                <div className="text-center py-12 md:py-16">
                  <p className="font-serif text-base md:text-lg text-gray-500">オープンまで、もうしばらくお待ちください</p>
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
                      <img
                          ref={(el) => {
                            if (el) imageRefs.current.set(image.src, el);
                          }}
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                          loading={index < 6 ? "eager" : "lazy"}
                          fetchPriority={index < 3 ? "high" : "auto"}
                          decoding="async"
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
              className="relative max-w-7xl w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={(selectedCategory === 'room' ? GALLERY_IMAGES.filter(img => img.category === 'room') : filteredImages)[lightboxImage].src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={(selectedCategory === 'room' ? GALLERY_IMAGES.filter(img => img.category === 'room') : filteredImages)[lightboxImage].src}
                alt={(selectedCategory === 'room' ? GALLERY_IMAGES.filter(img => img.category === 'room') : filteredImages)[lightboxImage].alt}
                className="w-full max-w-full h-auto max-h-[85vh] object-contain shadow-2xl"
              />
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
