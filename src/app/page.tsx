"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';
import { Play, BookOpen, ShieldCheck, Globe, History, MapPin, Cpu } from 'lucide-react';
import { audioEngine } from '@/src/lib/audio-engine';

export default function LandingPage() {
  useEffect(() => {
    // Start ambient savanna sound on landing
    audioEngine.startAmbient();
    return () => audioEngine.stopAmbient();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center w-full overflow-x-hidden">
      {/* Hero Section - Immersive Savanna Experience */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#30221e] to-[#5b433b] z-0" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')] z-0" />
        
        {/* Floating Decorative Elements - Mapungubwe Gold Rhino Reference */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 opacity-10 bg-yellow-500 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-48 h-48 opacity-10 bg-[#f27696] rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-[#f27696] font-bold tracking-[0.3em] uppercase text-sm md:text-base">
              The Game of the Herd
            </span>
            <h1 className="text-6xl md:text-9xl font-display font-bold text-[#fdf8f6] tracking-tighter leading-none">
              MORABARABA
            </h1>
            <p className="text-[#bfa094] text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed italic">
              "Where the mind meets the savanna, and every move is a legacy."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/play">
              <Button 
                className="bg-[#f27696] hover:bg-[#e94a74] text-white px-12 py-8 text-2xl font-bold rounded-2xl shadow-[0_0_40px_rgba(242,118,150,0.3)] group transition-all hover:scale-105 active:scale-95"
                onClick={() => audioEngine.play('click')}
              >
                <Play className="w-8 h-8 mr-3 fill-current" />
                PLAY NOW
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="border-2 border-[#bfa094] text-[#bfa094] hover:bg-[#bfa094] hover:text-[#30221e] px-10 py-8 text-xl font-bold rounded-2xl transition-all"
              onClick={() => {
                audioEngine.play('click');
                document.getElementById('heritage')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <BookOpen className="w-6 h-6 mr-3" />
              LEARN HERITAGE
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Heritage Section - Mapungubwe & Pastoral Roots */}
      <section id="heritage" className="w-full bg-[#fdf8f6] py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#eaddd7] rounded-full text-[#846358] font-bold text-xs tracking-widest uppercase">
              <History className="w-4 h-4" />
              Ancient Roots
            </div>
            <h2 className="text-5xl font-display font-bold text-[#5b433b] leading-tight">
              The Legacy of <span className="text-[#f27696]">Mapungubwe</span>
            </h2>
            <div className="space-y-6 text-[#846358] text-lg leading-relaxed">
              <p>
                Morabaraba is not just a game; it is a living artifact of Southern African history. Its origins trace back centuries, echoing the strategic brilliance of the Kingdom of Mapungubwe.
              </p>
              <p>
                As a pastoral game, it reflects the deep connection between the people and their cattle—the "cows" on the board representing wealth, status, and survival. To master Morabaraba is to understand the rhythm of the herd and the wisdom of the elders.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-[#5b433b] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#f27696]" />
                    Strategy
                  </h4>
                  <p className="text-sm">Honed over generations for mental agility.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-[#5b433b] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#f27696]" />
                    Community
                  </h4>
                  <p className="text-sm">Played in dust, on stone, and now, digitally.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
          >
            <img 
              src="https://picsum.photos/seed/mapungubwe/800/800" 
              alt="Mapungubwe Heritage"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#30221e]/80 to-transparent flex items-end p-12">
              <p className="text-white text-xl font-display italic">
                "The mind is a herd that must be guided with patience."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Modern Tech meets Tradition */}
      <section className="w-full bg-[#eaddd7] py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-display font-bold text-[#5b433b]">MODERN TRADITION</h2>
            <p className="text-[#846358] max-w-2xl mx-auto">Experience the official digital version designed for the next generation of masters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "PWA Ready", desc: "Play offline, anywhere in the world, without an app store." },
              { icon: Cpu, title: "Smart AI", desc: "Challenge our Minimax engine across four difficulty levels." },
              { icon: ShieldCheck, title: "Official Rules", desc: "Strict adherence to MSSA Generally Accepted Rules (GAR)." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-[#fdf8f6] rounded-3xl shadow-xl space-y-4 border-b-8 border-[#f27696]"
              >
                <div className="w-12 h-12 bg-[#eaddd7] rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[#f27696]" />
                </div>
                <h3 className="text-xl font-bold text-[#5b433b]">{feature.title}</h3>
                <p className="text-[#846358] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="w-full bg-[#30221e] py-16 px-6 text-center space-y-8">
        <h2 className="text-3xl font-display font-bold text-[#fdf8f6]">READY TO JOIN THE HERD?</h2>
        <Link href="/play">
          <Button 
            className="bg-[#f27696] hover:bg-[#e94a74] text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-lg"
            onClick={() => audioEngine.play('click')}
          >
            START YOUR JOURNEY
          </Button>
        </Link>
        <div className="pt-8 border-t border-[#5b433b] text-[#bfa094] text-xs uppercase tracking-widest">
          © 2026 Morabaraba Digital Heritage • Built with Ubuntu
        </div>
      </footer>
    </div>
  );
}
