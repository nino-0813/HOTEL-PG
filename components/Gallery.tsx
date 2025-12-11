import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
  src: string;
  alt: string;
  category: 'view' | 'room' | 'food' | 'activity';
}

const GALLERY_IMAGES: GalleryImage[] = [
  { src: 'https://images.unsplash.com/photo-1549144405-b0b979a40679?q=80&w=1600&auto=format&fit=crop', alt: '瀬戸内海', category: 'view' },
  { src: 'https://images.unsplash.com/photo-1548261314-9989f66085a8?q=80&w=1200&auto=format&fit=crop', alt: '島並み', category: 'view' },
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop', alt: '客室', category: 'room' },
  { src: 'https://images.unsplash.com/photo-1606744888344-4932389566b1?q=80&w=1200&auto=format&fit=crop', alt: 'テラス', category: 'room' },
  { src: 'https://images.unsplash.com/photo-1600266046467-f472643a531e?q=80&w=1600&auto=format&fit=crop', alt: '料理', category: 'food' },
  { src: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=1200&auto=format&fit=crop', alt: 'レストラン', category: 'food' },
  { src: 'https://images.unsplash.com/photo-1565673661608-d1445b2323cc?q=80&w=1600&auto=format&fit=crop', alt: 'サイクリング', category: 'activity' },
  { src: 'https://images.unsplash.com/photo-1621235654575-e018df56c336?q=80&w=2560&auto=format&fit=crop', alt: '水面', category: 'view' },
  { src: 'https://images.unsplash.com/photo-1595820849301-49658b1e4b95?q=80&w=1200&auto=format&fit=crop', alt: '館内', category: 'room' },
];

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'view' | 'room' | 'food' | 'activity'>('all');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === 'all' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxImage === null) return;
    const currentIndex = GALLERY_IMAGES.findIndex(img => 
      filteredImages[lightboxImage] === img
    );
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % GALLERY_IMAGES.length
      : (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    setLightboxImage(GALLERY_IMAGES.findIndex(img => img === filteredImages[newIndex]));
  };

  const categories = [
    { value: 'all' as const, label: 'All' },
    { value: 'view' as const, label: 'View' },
    { value: 'room' as const, label: 'Room' },
    { value: 'food' as const, label: 'Food' },
    { value: 'activity' as const, label: 'Activity' },
  ];

  return (
    <>
      <section id="gallery" className="relative py-32 md:py-48">
        <div className="container mx-auto px-6 md:px-12">
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
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
          >
            <AnimatePresence>
                {filteredImages.map((image, index) => (
                <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={`${image.src}-${index}`}
                    onClick={() => openLightbox(index)}
                    className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-100"
                >
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-white text-xs font-serif tracking-widest border border-white/50 px-6 py-3 bg-black/10 backdrop-blur-sm">
                            拡大
                        </span>
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
      {lightboxImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-20"
          >
            <X size={32} strokeWidth={1} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('prev');
            }}
            className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-20 hidden md:block"
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('next');
            }}
            className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-20 hidden md:block"
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>

          <div
            className="relative max-w-7xl max-h-[85vh] w-full h-full px-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={filteredImages[lightboxImage].src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={filteredImages[lightboxImage].src}
              alt={filteredImages[lightboxImage].alt}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs font-serif tracking-widest">
            {filteredImages[lightboxImage].alt}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
