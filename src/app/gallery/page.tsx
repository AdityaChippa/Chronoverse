'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Calendar, Download, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fetchAPOD, searchNASAImages } from '@/services/nasa';

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  hdurl?: string;
  date: string;
  explanation?: string;
  copyright?: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [apod, setApod] = useState<any>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      // Get APOD
      const apodData = await fetchAPOD();
      setApod(apodData);

      // Search for space images
      const searchResults = await searchNASAImages('galaxy', 'image');
      const formattedImages = searchResults.slice(0, 20).map((item: any) => ({
        id: item.data[0].nasa_id,
        title: item.data[0].title,
        url: item.links[0].href,
        date: item.data[0].date_created,
        explanation: item.data[0].description,
      }));

      setImages(formattedImages);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-cosmic">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display-2 text-cosmic-cream mb-4">Cosmic Gallery</h1>
          <p className="font-body-lg text-cosmic-grey-300 max-w-3xl mx-auto">
            Stunning imagery from Hubble, James Webb, and space missions
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="loading-spinner w-12 h-12" />
          </div>
        ) : (
          <>
            {/* APOD Feature */}
            {apod && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-12"
              >
                <h2 className="font-heading-1 text-cosmic-cream mb-6 text-center">
                  Astronomy Picture of the Day
                </h2>
                <div className="relative group cursor-pointer rounded-xl overflow-hidden cosmic-border"
                     onClick={() => setSelectedImage({
                       id: 'apod',
                       title: apod.title,
                       url: apod.url,
                       hdurl: apod.hdurl,
                       date: apod.date,
                       explanation: apod.explanation,
                       copyright: apod.copyright
                     })}>
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="font-heading-2 text-cosmic-cream mb-2">{apod.title}</h3>
                      <p className="text-cosmic-grey-300 line-clamp-2">{apod.explanation}</p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-cosmic-grey-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(apod.date).toLocaleDateString()}
                        </span>
                        {apod.copyright && (
                          <span>© {apod.copyright}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-square rounded-lg overflow-hidden cosmic-border cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-body font-semibold text-cosmic-cream line-clamp-2">
                        {image.title}
                      </h4>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-5 w-5 text-cosmic-cream" />
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Image Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            {selectedImage && (
              <div className="space-y-4">
                <img
                  src={selectedImage.hdurl || selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full rounded-lg"
                />
                <div>
                  <h3 className="font-heading-2 text-cosmic-cream mb-2">
                    {selectedImage.title}
                  </h3>
                  {selectedImage.explanation && (
                    <p className="text-cosmic-grey-300 mb-4">
                      {selectedImage.explanation}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-cosmic-grey-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedImage.date).toLocaleDateString()}
                      </span>
                      {selectedImage.copyright && (
                        <span>© {selectedImage.copyright}</span>
                      )}
                    </div>
                    {selectedImage.hdurl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedImage.hdurl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        HD Version
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}