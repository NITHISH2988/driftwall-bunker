/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, X, ArrowRight, MoreVertical, UploadCloud } from 'lucide-react';
import DriftWall from './components/DriftWall';
import OptionWheel from './components/OptionWheel';
import BorderGlow from './components/BorderGlow';
import ElasticSlider from './components/ElasticSlider';
import PixelBlast from './components/PixelBlast';
import DotField from './components/DotField';
import FlowingMenu from './components/FlowingMenu';

const items = [
  { image: 'https://w.wallhaven.cc/full/vq/wallhaven-vqo2ol.jpg', title: 'Straw Hat Pirates', href: '#' },
  { image: 'https://w.wallhaven.cc/full/x1/wallhaven-x1xy9l.jpg', title: 'Monkey D. Luffy', href: '#' },
  { image: 'https://w.wallhaven.cc/full/6q/wallhaven-6qz7dw.jpg', title: 'Roronoa Zoro', href: '#' },
  { image: 'https://w.wallhaven.cc/full/dp/wallhaven-dpgdp3.jpg', title: 'The Grand Line', href: '#' },
  { image: 'https://w.wallhaven.cc/full/43/wallhaven-43k193.jpg', title: 'New World', href: '#' },
  { image: 'https://w.wallhaven.cc/full/28/wallhaven-28j5dm.jpg', title: 'Thousand Sunny', href: '#' },
  { image: 'https://w.wallhaven.cc/full/72/wallhaven-72lej9.png', title: 'Wanted Posters', href: '#' },
  { image: 'https://w.wallhaven.cc/full/v9/wallhaven-v973e3.jpg', title: 'Wano Country', href: '#' },
  { image: 'https://w.wallhaven.cc/full/ne/wallhaven-nex1l0.jpg', title: 'Pirate King', href: '#' },
  { image: 'https://w.wallhaven.cc/full/42/wallhaven-42dj2g.jpg', title: 'Yonko', href: '#' },
  { image: 'https://w.wallhaven.cc/full/0p/wallhaven-0p6kzp.jpg', title: 'Portgas D. Ace', href: '#' },
  { image: 'https://w.wallhaven.cc/full/6d/wallhaven-6doodl.jpg', title: 'Trafalgar Law', href: '#' },
  { image: 'https://w.wallhaven.cc/full/x6/wallhaven-x6ddxl.jpg', title: 'Going Merry', href: '#' },
  { image: 'https://w.wallhaven.cc/full/gp/wallhaven-gpj1eq.jpg', title: 'Sabo', href: '#' },
  { image: 'https://w.wallhaven.cc/full/mp/wallhaven-mp86g8.jpg', title: 'Shanks', href: '#' },
  { image: 'https://w.wallhaven.cc/full/o3/wallhaven-o3d3w7.jpg', title: 'Sanji', href: '#' },
  { image: 'https://w.wallhaven.cc/full/9d/wallhaven-9d3l21.png', title: 'Nami', href: '#' },
  { image: 'https://w.wallhaven.cc/full/9d/wallhaven-9d82q8.png', title: 'Nico Robin', href: '#' },
  { image: 'https://w.wallhaven.cc/full/j8/wallhaven-j8l1dq.jpg', title: 'Vinsmoke', href: '#' },
  { image: 'https://w.wallhaven.cc/full/we/wallhaven-we8xoq.jpg', title: 'Marineford', href: '#' },
  { image: 'https://w.wallhaven.cc/full/j5/wallhaven-j5x6ky.jpg', title: 'Charlotte Katakuri', href: '#' },
  { image: 'https://w.wallhaven.cc/full/2y/wallhaven-2yo2yx.jpg', title: 'Gol D. Roger', href: '#' },
  { image: 'https://w.wallhaven.cc/full/n6/wallhaven-n6wjm6.jpg', title: 'Kaido', href: '#' },
  { image: 'https://w.wallhaven.cc/full/lq/wallhaven-lq8zr2.jpg', title: 'Big Mom', href: '#' }
];

const ONE_PIECE_TRACKS: Track[] = [
  { title: "Overtaken", url: "/one_piece_overtaken.mp3", duration: "2:10" },
  { title: "The Very Very Strongest", url: "/very_strongest.mp3", duration: "1:45" },
  { title: "Binks Sake", url: "/binks_sake.mp3", duration: "3:10" },
  { title: "We Are!", url: "/we_are.mp3", duration: "4:00" },
];

export default function App() {
  const [config, setConfig] = useState({
    columns: 5,
    tileWidth: 200,
    tileHeight: 132,
    gap: 18,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showGithubPage, setShowGithubPage] = useState(false);
  const [driftItems, setDriftItems] = useState(items);
  const [showMenu, setShowMenu] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(console.error);
        setIsPlaying(true);
    }
  }, [currentTrackIndex, isPlaying]);

  const [showCustomizePage, setShowCustomizePage] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When the user moves the slider, change the volume and attempt to play if it's paused.
  const handleVolumeChange = (newVolume: number) => {
    if (!hasInteracted) setHasInteracted(true);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      if (audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setConfig({ columns: 3, tileWidth: 120, tileHeight: 80, gap: 10 });
      } else if (w < 1024) {
        setConfig({ columns: 4, tileWidth: 160, tileHeight: 100, gap: 14 });
      } else {
        setConfig({ columns: 5, tileWidth: 200, tileHeight: 132, gap: 18 });
      }
    };
    handleResize(); // Initial setup
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(
        file => file.type.startsWith('image/')
      );
      
      if (files.length > 0) {
        const newItems = files.map(file => ({
          image: URL.createObjectURL(file),
          title: file.name,
          href: undefined
        }));
        
        setDriftItems(prev => [...newItems, ...prev]);
        // Close overlay to let user see their new images
        setShowCustomizePage(false);
      }
    }
  };

  return (
    <div className="relative w-full h-[2200vh] bg-[#060010] text-white overflow-x-hidden font-sans">
      {/* Background DriftWall - fixed so perspective remains stable while scrolling */}
      <div className="fixed inset-0 w-full h-screen z-0">
        <DriftWall
          items={driftItems}
          columns={config.columns}
          tileWidth={config.tileWidth}
          tileHeight={config.tileHeight}
          gap={config.gap}
          tilt={16}
          turn={-14}
          perspective={1200}
          depth={120}
          speed={42}
          direction="up"
          variance={0.45}
          parallax={0.6}
          lift={64}
          fade={0.6}
          dim={0.55}
          overlayColor="#060010"
        />
      </div>

      {/* Top Bar Contract: 3 zones (Brand, Nav, Actions) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 pointer-events-auto bg-gradient-to-b from-[#060010]/80 to-transparent">
        <img src="/logo.png" alt="One Piece" className="h-10 md:h-12 object-contain" />
        <div className="hidden lg:flex items-center text-2xl font-display font-semibold tracking-[0.2em] text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] absolute left-1/2 -translate-x-1/2 uppercase">
          Esper LLC
        </div>
        <div className="flex items-center gap-4 relative ml-auto">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-white/90 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-full"
            aria-label="Menu"
          >
            <MoreVertical size={24} />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 w-full h-screen bg-[#120F17] z-[100] flex flex-col pointer-events-auto"
              >
                <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 pointer-events-auto">
                  <img src="/logo.png" alt="One Piece" className="h-10 md:h-12 object-contain" />
                  <div className="hidden lg:flex items-center text-2xl font-display font-semibold tracking-[0.2em] text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] absolute left-1/2 -translate-x-1/2 uppercase">
                    Esper LLC
                  </div>
                  <button 
                    onClick={() => setShowMenu(false)}
                    className="p-2 text-white/90 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-full bg-white/10"
                    aria-label="Close Menu"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 w-full h-full mt-20 relative flex flex-col justify-center">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Jolly_Roger_of_the_Straw_Hat_Pirates.png" 
                      alt="Straw Hat Pirates" 
                      className="w-80 h-80 md:w-[500px] md:h-[500px] object-contain drop-shadow-2xl" 
                    />
                  </div>
                  <div className="relative z-10 w-full h-full">
                    <FlowingMenu 
                      bgColor="transparent"
                      items={[
                        { link: '#', text: 'Customize Background', image: 'https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Jolly_Roger_of_the_Straw_Hat_Pirates.png', onClick: () => { setShowCustomizePage(true); setShowMenu(false); } },
                        { link: '#', text: 'Destinations', image: 'https://w.wallhaven.cc/full/vq/wallhaven-vqo2ol.jpg', onClick: () => setShowMenu(false) },
                        { link: '#', text: 'Journeys', image: 'https://w.wallhaven.cc/full/x1/wallhaven-x1xy9l.jpg', onClick: () => setShowMenu(false) },
                        { link: '#', text: 'Music', image: 'https://w.wallhaven.cc/full/6q/wallhaven-6qz7dw.jpg', onClick: () => { setShowMusicPlayer(true); setShowMenu(false); } }
                      ]}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Option Wheel on the Right */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 h-[500px] w-64 pointer-events-auto">
        <OptionWheel
          items={['Chatroom', 'GitHub', 'Support Ticket', 'About Us', 'Contact']}
          defaultSelected={1}
          side="right"
          fontSize={1.5}
          spacing={2.5}
          inset={40}
          curve={0.8}
          tilt={12}
          blur={1.5}
          onChange={(idx, label) => console.log('Selected:', label)}
          onItemClick={(label) => {
            if (label === 'GitHub') {
              setShowGithubPage(true);
            }
          }}
        />
      </div>

      {/* Elastic Slider (Audio Control) at Bottom Left */}
      <div className="fixed bottom-8 left-8 z-50 pointer-events-auto bg-black/30 p-4 rounded-3xl backdrop-blur-md border border-white/10">
        <ElasticSlider
          defaultValue={30}
          startingValue={0}
          maxValue={100}
          isStepped={true}
          stepSize={5}
          onChange={handleVolumeChange}
        />
      </div>

      {/* Audio Element for playlist */}
      <audio
        ref={audioRef}
        src={ONE_PIECE_TRACKS[currentTrackIndex].url}
        onEnded={() => {
          if (isShuffle) {
            setCurrentTrackIndex(Math.floor(Math.random() * ONE_PIECE_TRACKS.length));
          } else {
            setCurrentTrackIndex((prev) => (prev + 1) % ONE_PIECE_TRACKS.length);
          }
        }}
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen pointer-events-none px-6">
        <h1 className="text-7xl md:text-9xl font-display font-medium tracking-tight mb-6 pointer-events-auto text-center leading-[1.05]">
          The world,<br />
          <span className="italic text-white/70">curated.</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-xl text-center pointer-events-auto mb-12 leading-relaxed font-medium">
          Discover breathtaking landscapes and hidden gems. Interact with the visual archive below to let your journey begin.
        </p>
        <div className="pointer-events-auto flex flex-col sm:flex-row gap-6">
          <BorderGlow
            backgroundColor="transparent"
            glowColor="190 80 80"
            borderRadius={9999}
            glowRadius={30}
            className="rounded-full w-fit !p-0"
            animated={true}
          >
            <button className="px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white whitespace-nowrap h-full block">
              Start Journey
            </button>
          </BorderGlow>
        </div>
      </div>

      {/* Scroll Sections */}
      <div className="relative z-10 flex flex-col items-center w-full pointer-events-none px-6 mt-[200vh]">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-20%' }}
          className="flex flex-col items-center text-center max-w-3xl"
        >
          <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-6 pointer-events-auto">
            King of the Pirates
          </h2>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed font-medium pointer-events-auto">
            "I don't care if I die trying. It's what I want to do, so I'm doing it." — Monkey D. Luffy. Every tile on the wall behind you represents a fragment of our shared world, waiting to be discovered.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full pointer-events-none px-6 mt-[300vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-25%' }}
          className="flex flex-col items-center text-center max-w-2xl bg-black/40 p-12 rounded-3xl backdrop-blur-md border border-white/10 pointer-events-auto"
        >
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
            A Man's Dream
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            "A man's dream will never die!" — Marshall D. Teach. The Grand Line is carefully selected to bring you the most awe-inspiring views. From the calm blue seas to the dangerous New World.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full pointer-events-none px-6 mt-[300vh]">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-10%' }}
          className="flex flex-col items-center text-center max-w-4xl"
        >
          <h2 className="text-6xl md:text-8xl font-display font-medium tracking-tight mb-8 pointer-events-auto">
            Set Sail
          </h2>
          <div className="pointer-events-auto">
            <BorderGlow
              backgroundColor="transparent"
              glowColor="190 80 80"
              borderRadius={9999}
              glowRadius={30}
              className="rounded-full w-fit !p-0"
              animated={false}
            >
              <button className="px-10 py-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white whitespace-nowrap h-full block">
                Enter the Grand Line
              </button>
            </BorderGlow>
          </div>
        </motion.div>
      </div>

      {/* GitHub Landing Page Overlay */}
      <AnimatePresence>
        {showGithubPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] bg-black text-white"
          >
            <div className="absolute inset-0 w-full h-full">
              <PixelBlast
                variant="circle"
                pixelSize={6}
                color="#B497CF"
                patternScale={3}
                patternDensity={1.2}
                pixelSizeJitter={0.5}
                enableRipples
                rippleSpeed={0.4}
                rippleThickness={0.12}
                rippleIntensityScale={1.5}
                liquid
                liquidStrength={0.12}
                liquidRadius={1.2}
                liquidWobbleSpeed={5}
                speed={0.6}
                edgeFade={0.25}
                transparent={false}
              />
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
              <motion.div
                initial={{ y: 50, scale: 0.95, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 20, scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="pointer-events-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 md:p-16 max-w-xl w-full text-center shadow-2xl relative"
              >
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
                  <Github size={40} className="text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
                  GitHub Profile
                </h2>
                <p className="text-lg text-white/60 mb-10 leading-relaxed">
                  Explore open source projects, experimental UI components, and the code behind the magic.
                </p>
                
                <a 
                  href="https://github.com/NITHISH2988" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white whitespace-nowrap w-full sm:w-auto"
                >
                  Visit Profile 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>

            <button 
              onClick={() => setShowGithubPage(false)}
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customize Background Overlay */}
      <AnimatePresence>
        {showCustomizePage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] bg-black text-white"
          >
            <div className="absolute inset-0 w-full h-full pointer-events-auto">
              <DotField
                dotRadius={1.5}
                dotSpacing={14}
                bulgeStrength={67}
                glowRadius={160}
                sparkle={false}
                waveAmplitude={0}
              />
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none">
              <motion.div
                initial={{ y: 50, scale: 0.95, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 20, scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="max-w-xl w-full pointer-events-auto"
              >
                <BorderGlow
                  edgeSensitivity={30}
                  glowColor="40 80 80"
                  backgroundColor="#120F17"
                  borderRadius={28}
                  glowRadius={40}
                  glowIntensity={1.0}
                  coneSpread={25}
                  animated={true}
                  colors={['#c084fc', '#f472b6', '#38bdf8']}
                  className="w-full"
                >
                  <div 
                    className={`p-10 md:p-16 text-center transition-colors duration-300 h-full flex flex-col items-center justify-center min-h-[400px] cursor-pointer ${isDraggingFile ? 'bg-white/5' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const files = Array.from(e.target.files);
                          const newItems = files.map(file => ({
                            image: URL.createObjectURL(file),
                            title: file.name,
                            href: undefined
                          }));
                          setDriftItems(prev => [...newItems, ...prev]);
                          setShowCustomizePage(false);
                        }
                      }} 
                    />
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20 pointer-events-none">
                      <UploadCloud size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight mb-4 pointer-events-none">
                      Drop Your Photos
                    </h2>
                    <p className="text-lg text-white/60 mb-6 leading-relaxed pointer-events-none">
                      Drag and drop local image files or GIFs here to customize the drifting background wall.
                    </p>
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-medium rounded-full border border-white/20 pointer-events-none">
                      Supported formats: JPG, PNG, GIF
                    </div>
                  </div>
                </BorderGlow>
              </motion.div>
            </div>

            <button 
              onClick={() => setShowCustomizePage(false)}
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white pointer-events-auto"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
