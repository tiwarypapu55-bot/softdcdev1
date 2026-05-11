
import { Link } from 'react-router-dom';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Camera, Image as ImageIcon } from 'lucide-react';

export const Gallery = () => {
  const { businessProfile } = useApp();
  const gallery = businessProfile.gallery || [];

  return (
    <WebsiteLayout>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <section className="relative py-24 bg-[#141414] overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full bg-blue-600 skew-x-12 translate-x-3/4 opacity-20"></div>
           <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30">
                  <Camera size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Visual History</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                  Our <span className="text-blue-500">Institute</span> Gallery
                </h1>
                <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto">
                  Capturing moments of learning, innovation, and success at Softdev Tally Guru.
                </p>
              </motion.div>
           </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            {gallery.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gallery.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl relative cursor-pointer">
                      <img 
                        src={item.url} 
                        alt={item.caption || 'Gallery Image'} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10">
                        <p className="text-white font-black uppercase tracking-tight text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          {item.caption || 'Softdev Moment'}
                        </p>
                        <div className="h-1 w-12 bg-blue-600 mt-4 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 bg-gray-50 rounded-[4rem] border border-dashed border-gray-200">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm mb-6">
                    <ImageIcon size={32} />
                 </div>
                 <p className="text-sm font-black text-[#888888] uppercase tracking-widest">No gallery images uploaded yet</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-32">
           <div className="max-w-7xl mx-auto px-6">
              <div className="bg-blue-600 rounded-[4rem] p-12 lg:p-24 text-center space-y-10 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-black/10 -skew-y-6 translate-y-1/2"></div>
                 <h2 className="text-4xl lg:text-6xl font-black text-white relative z-10 leading-none">WANT TO BE PART OF OUR NEXT STORY?</h2>
                 <p className="text-blue-100 text-lg font-medium relative z-10">Join our upcoming batch and start your journey towards technological excellence.</p>
                 <div className="relative z-10">
                    <Link 
                      to="/student-zone?tab=registration"
                      className="inline-block px-12 py-6 bg-white text-blue-600 text-xs font-black uppercase tracking-widest rounded-3xl hover:bg-[#141414] hover:text-white transition-all shadow-2xl"
                    >
                      Register Online Now
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </WebsiteLayout>
  );
};
