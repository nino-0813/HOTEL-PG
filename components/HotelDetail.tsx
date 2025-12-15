import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, ChevronLeft, MapPin, Calendar, X } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  description: string;
  size: string;
  capacity: string;
  features: string[];
  image: string;
}

interface HotelDetailProps {
  hotel: {
    id: string;
    name: string;
    location: string;
    description: string;
    images: string[];
    rooms: Room[];
    concept: string;
    dining: string;
    facilities: string[];
  };
  onClose: () => void;
}

const HotelDetail: React.FC<HotelDetailProps> = ({ hotel, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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

      {/* Hero Image Gallery */}
      {hotel.images && hotel.images.length > 0 && (
        <div className="relative h-[60vh] md:h-[70vh] bg-gray-100 overflow-hidden">
          <img
            src={hotel.images[currentImageIndex]}
            alt={hotel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />

          {/* Image Navigation */}
          {hotel.images.length > 1 && (
            <>
              {/* Previous Button */}
              {currentImageIndex > 0 && (
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                >
                  <ChevronLeft size={24} className="text-textMain" />
                </button>
              )}

              {/* Next Button */}
              {currentImageIndex < hotel.images.length - 1 && (
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                >
                  <ChevronRight size={24} className="text-textMain" />
                </button>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {hotel.images.map((_, idx) => (
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

          {/* Overlay with Hotel Name */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
            <div className="container mx-auto px-6 md:px-12 pb-12">
              <h2 className="font-display text-4xl md:text-6xl font-light text-white tracking-[0.1em] mb-4">
                {hotel.name}
              </h2>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin size={16} />
                <span className="font-body text-sm tracking-widest">{hotel.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 py-20 md:py-32">
        {/* Concept Section */}
        <section className="mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-display text-3xl md:text-4xl font-light text-textMain mb-8 tracking-[0.1em]">
              Concept
            </h3>
            <p className="font-serif text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
              {hotel.concept}
            </p>
          </motion.div>
        </section>

        {/* Rooms Section */}
        <section className="mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-display text-3xl md:text-4xl font-light text-textMain mb-12 tracking-[0.1em]">
              Rooms
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotel.rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                >
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="w-full bg-white border border-gray-200 hover:border-textMain hover:shadow-lg transition-all duration-300 text-left group overflow-hidden"
                  >
                    {/* Room Image */}
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Room Info */}
                    <div className="p-6">
                      <h4 className="font-display text-xl md:text-2xl font-light text-textMain mb-3 tracking-[0.1em]">
                        {room.name}
                      </h4>
                      <p className="font-serif text-sm text-gray-600 leading-relaxed mb-4">
                        {room.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span>{room.size}</span>
                        <span>•</span>
                        <span>{room.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-textMain group-hover:text-textLight transition-colors">
                        <span className="font-display text-xs tracking-[0.2em] uppercase">View Details</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Dining Section */}
        <section className="mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="font-display text-3xl md:text-4xl font-light text-textMain mb-8 tracking-[0.1em]">
              Dining
            </h3>
            <p className="font-serif text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
              {hotel.dining}
            </p>
          </motion.div>
        </section>

        {/* Facilities Section */}
        <section className="mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h3 className="font-display text-3xl md:text-4xl font-light text-textMain mb-8 tracking-[0.1em]">
              Facilities
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotel.facilities.map((facility, idx) => (
                <li key={idx} className="font-serif text-base text-gray-700 flex items-center">
                  <span className="w-1.5 h-1.5 bg-textMain rounded-full mr-4"></span>
                  {facility}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* Reserve Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center pt-12 border-t border-gray-200"
        >
          <a
            href="#reserve"
            onClick={onClose}
            className="inline-block font-display text-sm tracking-[0.2em] uppercase text-white bg-textMain px-12 py-5 hover:bg-textLight transition-colors duration-300"
          >
            Reserve Now
          </a>
        </motion.div>
      </div>

      {/* Room Detail Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 z-[200]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoom(null)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-[201] flex items-center justify-center p-6 md:p-12 pointer-events-none"
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="fixed top-20 sm:top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors z-[110] bg-white rounded-full shadow-lg"
                  >
                    <X size={20} className="text-textMain" />
                  </button>

                  {/* Room Image */}
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={selectedRoom.image}
                      alt={selectedRoom.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Room Details */}
                  <div className="p-8 md:p-12">
                    <h2 className="font-display text-3xl md:text-4xl font-light text-textMain mb-6 tracking-[0.1em]">
                      {selectedRoom.name}
                    </h2>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <span>{selectedRoom.size}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <span>{selectedRoom.capacity}</span>
                      </div>
                    </div>

                    <p className="font-serif text-base text-gray-700 leading-relaxed mb-8">
                      {selectedRoom.description}
                    </p>

                    {/* Features */}
                    <div className="pt-8 border-t border-gray-200">
                      <h3 className="font-display text-xl font-light text-textMain mb-4 tracking-[0.1em]">
                        Features
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedRoom.features.map((feature, idx) => (
                          <li key={idx} className="font-serif text-sm text-gray-700 flex items-center">
                            <span className="w-1.5 h-1.5 bg-textMain rounded-full mr-3"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotelDetail;

