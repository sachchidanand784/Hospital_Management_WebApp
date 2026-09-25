'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { Glasses, Search, Filter, ShoppingBag, CheckCircle, Tag, ArrowRight } from 'lucide-react';

const OPTICAL_DEMO_PRODUCTS = [
  {
    id: 'opt-1',
    name_en: 'Ray-Ban Wayfarer Classic Frame',
    name_hi: 'रे-बैन वेफेरर क्लासिक चश्मा फ्रेम',
    category: 'FRAME',
    brand: 'Ray-Ban',
    price: 3490,
    availability: 'IN_STOCK',
    isNew: true,
    desc_en: 'Premium acetate full-rim unisex frame, light weight and high durability.',
    desc_hi: 'उच्च गुणवत्ता वाला लाइटवेट फुल-रिम चश्मा फ्रेम।',
  },
  {
    id: 'opt-2',
    name_en: 'Crizal Prevencia Anti-Glare Blue Light Lens',
    name_hi: 'क्रिजल एंटी-ग्लेयर ब्लू लाइट सुरक्षा लेंस',
    category: 'LENS',
    brand: 'Essilor',
    price: 1800,
    availability: 'IN_STOCK',
    isNew: true,
    desc_en: 'Computer lens protecting eyes from harmful screen blue light and glare.',
    desc_hi: 'कंप्यूटर एवं स्क्रीन उपयोग हेतु ब्लू-लाइट प्रोटेक्टिव एंटी-ग्लेयर लेंस।',
  },
  {
    id: 'opt-3',
    name_en: 'Titan Eyeplus Lightweight Titanium Frame',
    name_hi: 'टाइटन आईप्लस लाइटवेट टाइटेनियम फ्रेम',
    category: 'FRAME',
    brand: 'Titan',
    price: 2450,
    availability: 'IN_STOCK',
    isNew: false,
    desc_en: 'Ultra-flexible corrosion resistant titanium alloy frame.',
    desc_hi: 'अत्यंत हल्का एवं लचीला टाइटेनियम अलॉय फ्रेम।',
  },
  {
    id: 'opt-4',
    name_en: 'Fastrack Polarized Aviator Sunglasses',
    name_hi: 'फास्टट्रैक पोलराइज्ड धूप का चश्मा',
    category: 'SUNGLASS',
    brand: 'Fastrack',
    price: 1599,
    availability: 'IN_STOCK',
    isNew: false,
    desc_en: '100% UV400 protection polarized driving sunglasses.',
    desc_hi: '100% यूवी400 सुरक्षा युक्त पोलराइज्ड सनग्लास।',
  },
];

export default function OpticalStorePage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = OPTICAL_DEMO_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.name_hi.includes(searchQuery) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-dark to-primary text-white p-8 rounded-2xl shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-accent/20 px-3 py-1 rounded-full text-xs font-semibold text-cyan-200">
            <Glasses className="w-4 h-4 text-accent" />
            <span>Hospital Optical Department</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{messages.optical.title}</h1>
          <p className="text-xs sm:text-sm text-cyan-100 max-w-xl">{messages.optical.subtitle}</p>
        </div>

        <Link
          href={`/${locale}/appointment?service=srv-optometry`}
          className="bg-accent hover:bg-teal-500 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg text-xs flex items-center shrink-0 transition"
        >
          <Glasses className="w-4 h-4 mr-2" />
          {messages.optical.bookOpticalAppt}
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="surface-card p-4 rounded-2xl shadow-card flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl transition ${selectedCategory === 'ALL' ? 'bg-primary text-white shadow' : 'bg-gray-100 text-hospitalText hover:bg-gray-200'}`}
          >
            {messages.optical.allProducts}
          </button>
          <button
            onClick={() => setSelectedCategory('FRAME')}
            className={`px-4 py-2 rounded-xl transition ${selectedCategory === 'FRAME' ? 'bg-primary text-white shadow' : 'bg-gray-100 text-hospitalText hover:bg-gray-200'}`}
          >
            {messages.optical.frames}
          </button>
          <button
            onClick={() => setSelectedCategory('LENS')}
            className={`px-4 py-2 rounded-xl transition ${selectedCategory === 'LENS' ? 'bg-primary text-white shadow' : 'bg-gray-100 text-hospitalText hover:bg-gray-200'}`}
          >
            {messages.optical.lenses}
          </button>
          <button
            onClick={() => setSelectedCategory('SUNGLASS')}
            className={`px-4 py-2 rounded-xl transition ${selectedCategory === 'SUNGLASS' ? 'bg-primary text-white shadow' : 'bg-gray-100 text-hospitalText hover:bg-gray-200'}`}
          >
            {messages.optical.sunglasses}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={messages.common.search}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-primary"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div key={prod.id} className="surface-card p-5 rounded-2xl shadow-card hover:shadow-xl transition space-y-4 flex flex-col justify-between relative border border-hospitalBorder">
            {prod.isNew && (
              <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                {messages.optical.newArrival}
              </span>
            )}

            <div className="space-y-3">
              {/* Neutral Glasses Frame Placeholder Image */}
              <div className="w-full h-40 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl flex items-center justify-center border border-gray-200 text-primary">
                <Glasses className="w-16 h-16 opacity-60" />
              </div>

              <div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{prod.brand}</span>
                <h3 className="font-bold text-sm text-primary-dark mt-0.5">{locale === 'hi' ? prod.name_hi : prod.name_en}</h3>
              </div>

              <p className="text-xs text-mutedText line-clamp-2 leading-relaxed">
                {locale === 'hi' ? prod.desc_hi : prod.desc_en}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-base font-extrabold text-primary-dark">₹{prod.price}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {messages.optical.inStock}
                </span>
              </div>

              <Link
                href={`/${locale}/appointment?service=srv-optometry`}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-xl text-xs font-bold text-center block transition shadow-sm"
              >
                {messages.optical.bookOpticalAppt}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
