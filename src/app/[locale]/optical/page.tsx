'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import {
  Glasses,
  Search,
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface OpticalView {
  label_en: string;
  label_hi: string;
  src: string;
}

interface OpticalProduct {
  id: string;
  name_en: string;
  name_hi: string;
  category: 'FRAME' | 'LENS' | 'SUNGLASS';
  brand: string;
  price: number;
  availability: 'IN_STOCK';
  isNew: boolean;
  shape_en: string;
  shape_hi: string;
  desc_en: string;
  desc_hi: string;
  views: OpticalView[];
}

const OPTICAL_PRODUCTS: OpticalProduct[] = [
  {
    id: 'opt-1',
    name_en: 'Ray-Ban Wayfarer Classic Black Frame',
    name_hi: 'रे-बैन वेफेरर क्लासिक ब्लैक चश्मा फ्रेम',
    category: 'FRAME',
    brand: 'Ray-Ban',
    price: 3490,
    availability: 'IN_STOCK',
    isNew: true,
    shape_en: 'Wayfarer Full-Rim',
    shape_hi: 'वेफेरर फुल-रिम',
    desc_en: 'Iconic full-rim black acetate frame with durable metal hinges, suitable for both prescription reading and fashion wear.',
    desc_hi: 'प्रीमियम ब्लैक एसीटेट फुल-रिम फ्रेम, उच्च गुणवत्ता वाली टिकाऊ हिंज के साथ, नजर एवं फैशन दोनों के लिए उपयुक्त।',
    views: [
      { label_en: 'Front View', label_hi: 'सामने का दृश्य', src: '/images/optical/opt-1-front.jpg' },
      { label_en: '45° Side Angle', label_hi: 'साइड एंगल दृश्य', src: '/images/optical/opt-1-side.jpg' },
      { label_en: 'Folded Profile', label_hi: 'फोल्डेड दृश्य', src: '/images/optical/opt-1-folded.jpg' }
    ]
  },
  {
    id: 'opt-2',
    name_en: 'Essilor Crizal Anti-Glare Computer Glasses',
    name_hi: 'क्रिजल एंटी-ग्लेयर ब्लू-कट कंप्यूटर चश्मा',
    category: 'LENS',
    brand: 'Essilor',
    price: 2150,
    availability: 'IN_STOCK',
    isNew: true,
    shape_en: 'Round Retro Crystal',
    shape_hi: 'राउंड रेट्रो क्रिस्टल',
    desc_en: 'Crizal blue-cut anti-reflective lenses in crystal clear round frame for long laptop/mobile screen hours and zero eye strain.',
    desc_hi: 'कंप्यूटर स्क्रीन और मोबाइल उपयोग हेतु एंटी-रिफ्लेक्टिव ब्लू-कट लेंस व आकर्षक क्रिस्टल राउंड फ्रेम।',
    views: [
      { label_en: 'Front View', label_hi: 'सामने का दृश्य', src: '/images/optical/opt-2-front.jpg' },
      { label_en: '45° Side Angle', label_hi: 'साइड एंगल दृश्य', src: '/images/optical/opt-2-side.jpg' },
      { label_en: 'Folded Profile', label_hi: 'फोल्डेड दृश्य', src: '/images/optical/opt-2-folded.jpg' }
    ]
  },
  {
    id: 'opt-3',
    name_en: 'Titan Eyeplus Sleek Titanium Wireframe',
    name_hi: 'टाइटन आईप्लस लाइटवेट टाइटेनियम फ्रेम',
    category: 'FRAME',
    brand: 'Titan',
    price: 2890,
    availability: 'IN_STOCK',
    isNew: false,
    shape_en: 'Geometric Wireframe',
    shape_hi: 'ज्योमेट्रिक वायरफ्रेम',
    desc_en: 'Featherweight corrosion-free titanium alloy frame with flexible memory bridge for all-day comfortable office wear.',
    desc_hi: 'अत्यंत हल्का एवं जंग-रहित टाइटेनियम अलॉय फ्रेम, पूरे दिन आरामदेह उपयोग हेतु फ्लेक्सिबल ब्रिज के साथ।',
    views: [
      { label_en: 'Front View', label_hi: 'सामने का दृश्य', src: '/images/optical/opt-3-front.jpg' },
      { label_en: '45° Side Angle', label_hi: 'साइड एंगल दृश्य', src: '/images/optical/opt-3-side.jpg' },
      { label_en: 'Folded Profile', label_hi: 'फोल्डेड दृश्य', src: '/images/optical/opt-3-folded.jpg' }
    ]
  },
  {
    id: 'opt-4',
    name_en: 'Fastrack Polarized Aviator Sunglasses',
    name_hi: 'फास्टट्रैक पोलराइज्ड एविएटर धूप का चश्मा',
    category: 'SUNGLASS',
    brand: 'Fastrack',
    price: 1799,
    availability: 'IN_STOCK',
    isNew: false,
    shape_en: 'Pilot Aviator Teardrop',
    shape_hi: 'पायलट एविएटर टियरड्रॉप',
    desc_en: '100% UV400 polarized driving teardrop sunglasses with glare reduction and scratch-resistant coating.',
    desc_hi: '100% यूवी400 पोलराइज्ड टियरड्रॉप एविएटर सनग्लास, ड्राइविंग व तेज धूप से आंखों की पूर्ण सुरक्षा हेतु।',
    views: [
      { label_en: 'Front View', label_hi: 'सामने का दृश्य', src: '/images/optical/opt-4-front.jpg' },
      { label_en: '45° Side Angle', label_hi: 'साइड एंगल दृश्य', src: '/images/optical/opt-4-side.jpg' },
      { label_en: 'Folded Profile', label_hi: 'फोल्डेड दृश्य', src: '/images/optical/opt-4-folded.jpg' }
    ]
  },
  {
    id: 'opt-5',
    name_en: 'Vincent Chase Tortoiseshell Vintage Round Frame',
    name_hi: 'विंसेंट चेस विंटेज कछुआ-पैटर्न राउंड फ्रेम',
    category: 'FRAME',
    brand: 'Vincent Chase',
    price: 2290,
    availability: 'IN_STOCK',
    isNew: true,
    shape_en: 'Vintage Round Havana',
    shape_hi: 'विंटेज राउंड हवाना',
    desc_en: 'Classic tortoiseshell acetate rim frame with keyhole nose-bridge, popular for creative professionals and intellectuals.',
    desc_hi: 'क्लासिक विंटेज कछुआ-पैटर्न ब्राउन फ्रेम, कीहोल नोज-ब्रिज व आकर्षक रेट्रो लुक के साथ।',
    views: [
      { label_en: 'Front View', label_hi: 'सामने का दृश्य', src: '/images/optical/opt-5-front.jpg' },
      { label_en: '45° Side Angle', label_hi: 'साइड एंगल दृश्य', src: '/images/optical/opt-5-side.jpg' },
      { label_en: 'Folded Profile', label_hi: 'फोल्डेड दृश्य', src: '/images/optical/opt-5-folded.jpg' }
    ]
  },
  {
    id: 'opt-6',
    name_en: 'Oakley Athletic Polarized Sport Wrap Sunglasses',
    name_hi: 'ओकले स्पोर्टी रैप-अराउंड पोलराइज्ड सनग्लास',
    category: 'SUNGLASS',
    brand: 'Oakley',
    price: 4290,
    availability: 'IN_STOCK',
    isNew: false,
    shape_en: 'Aerodynamic Sport Wrap',
    shape_hi: 'एयरोडायनामिक स्पोर्ट्स रैप',
    desc_en: 'Wrap-around windproof sports sunglasses with anti-slip rubber ear socks and high-impact polycarbonate UV protection.',
    desc_hi: 'स्पोर्ट्स एवं आउटडोर एक्टिविटी हेतु एंटी-स्लिप ग्रिप व हाई-इम्पैक्ट पॉलीकार्बोनेट लेंस युक्त सनग्लास।',
    views: [
      { label_en: 'Front View', label_hi: 'सामने का दृश्य', src: '/images/optical/opt-6-front.jpg' },
      { label_en: '45° Side Angle', label_hi: 'साइड एंगल दृश्य', src: '/images/optical/opt-6-side.jpg' },
      { label_en: 'Folded Profile', label_hi: 'फोल्डेड दृश्य', src: '/images/optical/opt-6-folded.jpg' }
    ]
  },
  {
    id: 'opt-7',
    name_en: 'Vogue Eyewear Rose-Gold Designer Cat-Eye Frame',
    name_hi: 'वोग डिजाइनर रोज-गोल्ड कैट-आई चश्मा फ्रेम',
    category: 'FRAME',
    brand: 'Vogue',
    price: 3190,
    availability: 'IN_STOCK',
    isNew: true,
    shape_en: 'Feminine Cat-Eye',
    shape_hi: 'कैट-आई डिजाइनर',
    desc_en: 'Glamorous rose-gold cat-eye frame sculpted for women, combining modern luxury aesthetics with optical precision.',
    desc_hi: 'महिलाओं के लिए विशेष रूप से तैयार किया गया रोज-गोल्ड कैट-आई प्रीमियम चश्मा फ्रेम।',
    views: [
      { label_en: 'Front View', label_hi: 'सामने का दृश्य', src: '/images/optical/opt-7-front.jpg' },
      { label_en: '45° Side Angle', label_hi: 'साइड एंगल दृश्य', src: '/images/optical/opt-7-side.jpg' },
      { label_en: 'Folded Profile', label_hi: 'फोल्डेड दृश्य', src: '/images/optical/opt-7-folded.jpg' }
    ]
  },
  {
    id: 'opt-8',
    name_en: 'John Jacobs Clubmaster Browline Semi-Rimless Frame',
    name_hi: 'जॉन जैकब्स क्लबमास्टर ब्रोलाइन सेमी-रिमलेस फ्रेम',
    category: 'FRAME',
    brand: 'John Jacobs',
    price: 2990,
    availability: 'IN_STOCK',
    isNew: false,
    shape_en: 'Clubmaster Semi-Rimless',
    shape_hi: 'क्लबमास्टर सेमी-रिमलेस',
    desc_en: 'Timeless retro browline frame featuring black acetate upper rim and silver eyewire for an executive professional presence.',
    desc_hi: 'शानदार रेट्रो क्लबमास्टर सेमी-रिमलेस चश्मा फ्रेम, ऑफिस एवं प्रोफेशनल उपयोग के लिए सर्वश्रेष्ठ।',
    views: [
      { label_en: 'Front View', label_hi: 'सामने का दृश्य', src: '/images/optical/opt-8-front.jpg' },
      { label_en: '45° Side Angle', label_hi: 'साइड एंगल दृश्य', src: '/images/optical/opt-8-side.jpg' },
      { label_en: 'Folded Profile', label_hi: 'फोल्डेड दृश्य', src: '/images/optical/opt-8-folded.jpg' }
    ]
  }
];

function GlassesCard({
  prod,
  locale,
  messages
}: {
  prod: OpticalProduct;
  locale: 'en' | 'hi';
  messages: any;
}) {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const totalViews = prod.views.length;

  const nextView = () => {
    setCurrentViewIndex((prev) => (prev + 1) % totalViews);
  };

  const prevView = () => {
    setCurrentViewIndex((prev) => (prev - 1 + totalViews) % totalViews);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) nextView();
      else prevView();
    }
    setStartX(null);
  };

  // Mouse handlers for desktop click-drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || startX === null) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) nextView();
      else prevView();
    }
    setIsDragging(false);
    setStartX(null);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setStartX(null);
  };

  const currentView = prod.views[currentViewIndex];

  return (
    <div className="surface-card rounded-2xl shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border border-hospitalBorder overflow-hidden group">
      {/* Multi-View Interactive Photo Stage with Drag / Swipe */}
      <div
        className="relative h-56 w-full bg-slate-900 select-none cursor-grab active:cursor-grabbing overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main Photo with smooth transition */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentView.src}
          src={currentView.src}
          alt={`${locale === 'hi' ? prod.name_hi : prod.name_en} - ${locale === 'hi' ? currentView.label_hi : currentView.label_en}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
          draggable={false}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex justify-between items-start z-10 pointer-events-none">
          {/* Active View Label & Indicator */}
          <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-white/20 flex items-center shadow-md">
            <RotateCw className="w-3 h-3 mr-1 text-cyan-300" />
            {currentViewIndex + 1}/{totalViews}: {locale === 'hi' ? currentView.label_hi : currentView.label_en}
          </span>

          {prod.isNew && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
              {messages.optical.newArrival}
            </span>
          )}
        </div>

        {/* Interactive Left & Right Navigation Arrows */}
        <button
          type="button"
          aria-label="Previous view"
          onClick={(e) => {
            e.stopPropagation();
            prevView();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md opacity-80 group-hover:opacity-100 transition z-20 shadow-md border border-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Next view"
          onClick={(e) => {
            e.stopPropagation();
            nextView();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md opacity-80 group-hover:opacity-100 transition z-20 shadow-md border border-white/20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Drag Hint at Center (Shown briefly or subtle) */}
        <div className="absolute bottom-10 inset-x-0 text-center pointer-events-none">
          <span className="text-[9px] font-bold text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">
            {locale === 'hi' ? '‹ ड्रैग या स्वाइप करें ›' : '‹ Drag / Swipe 360° ›'}
          </span>
        </div>

        {/* 3 Clickable View Selector Pills at Bottom */}
        <div className="absolute bottom-2.5 inset-x-3 flex justify-center items-center space-x-1.5 z-20">
          {prod.views.map((v, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentViewIndex(idx);
              }}
              className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold transition-all duration-200 backdrop-blur-md border ${
                currentViewIndex === idx
                  ? 'bg-primary text-white border-white/40 shadow-md scale-105'
                  : 'bg-black/60 text-gray-200 hover:bg-black/80 border-white/10'
              }`}
            >
              {idx === 0
                ? (locale === 'hi' ? 'सामने' : 'Front')
                : idx === 1
                ? (locale === 'hi' ? 'साइड 45°' : 'Side')
                : (locale === 'hi' ? 'फोल्डेड' : 'Folded')}
            </button>
          ))}
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[11px] font-extrabold text-accent uppercase tracking-wider">{prod.brand}</span>
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
              {locale === 'hi' ? prod.shape_hi : prod.shape_en}
            </span>
          </div>

          <h3 className="font-extrabold text-sm text-primary-dark leading-snug">
            {locale === 'hi' ? prod.name_hi : prod.name_en}
          </h3>

          <p className="text-xs text-mutedText line-clamp-2 leading-relaxed">
            {locale === 'hi' ? prod.desc_hi : prod.desc_en}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400 block -mb-0.5">Price / कीमत</span>
              <span className="text-lg font-extrabold text-primary-dark">₹{prod.price}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
              {messages.optical.inStock}
            </span>
          </div>

          <Link
            href={`/${locale}/appointment?service=srv-optometry`}
            className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl text-xs font-bold text-center block transition shadow-sm hover:shadow flex items-center justify-center transform active:scale-95"
          >
            <Glasses className="w-3.5 h-3.5 mr-1.5" />
            {locale === 'hi' ? 'स्टोर में ट्रायल एवं फिटिंग बुक करें' : 'Book In-Store Trial & Fitting'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OpticalStorePage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = OPTICAL_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.name_hi.includes(searchQuery) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shape_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shape_hi.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-blue-900 text-white p-8 sm:p-10 rounded-3xl shadow-card space-y-4">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-cyan-200 border border-white/15">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{locale === 'hi' ? 'अस्पताल चश्मा घर — आधुनिक आईवियर गैलरी' : 'Hospital Eyewear & Optical Wing'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {messages.optical.title}
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100 max-w-xl leading-relaxed">
              {locale === 'hi'
                ? 'ब्रांडेड फ्रेम, एंटी-ग्लेयर ब्लू-कट कंप्यूटर लेंस, पोलराइज्ड सनग्लास एवं सटीक कंप्यूटरीकृत चश्मा नंबर जांच।'
                : messages.optical.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/${locale}/appointment?service=srv-optometry`}
              className="bg-accent hover:bg-teal-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg text-xs flex items-center justify-center shrink-0 transition transform active:scale-95"
            >
              <Glasses className="w-4 h-4 mr-2" />
              {messages.optical.bookOpticalAppt}
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="surface-card p-4 rounded-xl border border-hospitalBorder shadow-sm flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <RotateCw className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-primary-dark">{locale === 'hi' ? '360° मल्टी-व्यू' : 'Multi-Angle 360°'}</p>
            <p className="text-[10px] text-mutedText">{locale === 'hi' ? 'हर चश्मे के 3 व्यूज' : '3 Views Per Frame'}</p>
          </div>
        </div>

        <div className="surface-card p-4 rounded-xl border border-hospitalBorder shadow-sm flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-primary-dark">{locale === 'hi' ? '100% ऑरिजिनल' : '100% Certified'}</p>
            <p className="text-[10px] text-mutedText">{locale === 'hi' ? 'ब्रांडेड वारंटी सहित' : 'Brand Authenticity'}</p>
          </div>
        </div>

        <div className="surface-card p-4 rounded-xl border border-hospitalBorder shadow-sm flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
            <Glasses className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-primary-dark">{locale === 'hi' ? 'ब्लू-कट कोटिंग' : 'Blue-Cut Screen'}</p>
            <p className="text-[10px] text-mutedText">{locale === 'hi' ? 'कंप्यूटर व मोबाइल सुरक्षा' : 'Anti-Glare Protection'}</p>
          </div>
        </div>

        <div className="surface-card p-4 rounded-xl border border-hospitalBorder shadow-sm flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-primary-dark">{locale === 'hi' ? 'फ्री फ्रेम ट्रायल' : 'Free In-Store Trial'}</p>
            <p className="text-[10px] text-mutedText">{locale === 'hi' ? 'अस्पताल काउंटर पर' : 'Available in Dildarnagar'}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="surface-card p-4 rounded-2xl shadow-card flex flex-col md:flex-row gap-4 justify-between items-center border border-hospitalBorder">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl transition shadow-sm ${
              selectedCategory === 'ALL'
                ? 'bg-primary text-white shadow'
                : 'bg-gray-100 text-hospitalText hover:bg-gray-200'
            }`}
          >
            {locale === 'hi' ? `सभी उत्पाद (${OPTICAL_PRODUCTS.length})` : `All Products (${OPTICAL_PRODUCTS.length})`}
          </button>
          <button
            onClick={() => setSelectedCategory('FRAME')}
            className={`px-4 py-2 rounded-xl transition shadow-sm ${
              selectedCategory === 'FRAME'
                ? 'bg-primary text-white shadow'
                : 'bg-gray-100 text-hospitalText hover:bg-gray-200'
            }`}
          >
            {messages.optical.frames}
          </button>
          <button
            onClick={() => setSelectedCategory('LENS')}
            className={`px-4 py-2 rounded-xl transition shadow-sm ${
              selectedCategory === 'LENS'
                ? 'bg-primary text-white shadow'
                : 'bg-gray-100 text-hospitalText hover:bg-gray-200'
            }`}
          >
            {messages.optical.lenses}
          </button>
          <button
            onClick={() => setSelectedCategory('SUNGLASS')}
            className={`px-4 py-2 rounded-xl transition shadow-sm ${
              selectedCategory === 'SUNGLASS'
                ? 'bg-primary text-white shadow'
                : 'bg-gray-100 text-hospitalText hover:bg-gray-200'
            }`}
          >
            {messages.optical.sunglasses}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'hi' ? 'चश्मा या ब्रांड खोजें (उदा. Ray-Ban, Titan, गोल, एविएटर)...' : 'Search frames, brands (e.g. Ray-Ban, Aviator)...'}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Multi-View Product Grid (8 Distinct Glasses Models) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <GlassesCard
            key={prod.id}
            prod={prod}
            locale={locale}
            messages={messages}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 surface-card rounded-2xl border border-hospitalBorder space-y-3">
          <Glasses className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-sm font-bold text-gray-600">
            {locale === 'hi' ? 'कोई चश्मा या उत्पाद नहीं मिला' : 'No matching eyewear products found'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
            className="text-xs text-primary font-bold hover:underline"
          >
            {locale === 'hi' ? 'सभी 8 उत्पाद देखें' : 'View all 8 products'}
          </button>
        </div>
      )}
    </div>
  );
}
