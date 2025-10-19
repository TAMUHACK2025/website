"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Search, Heart, MapPin, User, Filter, ShoppingBag, Music } from "lucide-react";
import { useState, useEffect } from "react";

interface Album {
  id: number;
  title: string;
  artist: string;
  year: string;
  image: string;
  price: number;
  format: "Vinyl" | "CD" | "Cassette";
  condition: string;
  location: string;
  seller: string;
  likes: number;
}

const mockAlbums: Album[] = [
  { 
    id: 1,
    title: "The Miseducation of Lauryn Hill", 
    artist: "Lauryn Hill", 
    year: "1998",
    image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=400&fit=crop",
    price: 45,
    format: "Vinyl",
    condition: "Near Mint",
    location: "Portland, OR",
    seller: "thriftedvinyl",
    likes: 95
  },
  { 
    id: 2,
    title: "Kind of Blue", 
    artist: "Miles Davis", 
    year: "1959",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    price: 55,
    format: "Vinyl",
    condition: "Very Good",
    location: "New York, NY",
    seller: "vinylcollector",
    likes: 23
  },
  { 
    id: 3,
    title: "OK Computer", 
    artist: "Radiohead", 
    year: "1997",
    image: "https://images.unsplash.com/photo-1653383454515-0b42b711ed7c?w=400&h=400&fit=crop",
    price: 42,
    format: "CD",
    condition: "Near Mint",
    location: "Seattle, WA",
    seller: "cdcollection",
    likes: 145
  },
  { 
    id: 4,
    title: "What's Going On", 
    artist: "Marvin Gaye", 
    year: "1971",
    image: "https://images.unsplash.com/photo-1618034100983-e1d78be0dc80?w=400&h=400&fit=crop",
    price: 38,
    format: "Vinyl",
    condition: "Very Good",
    location: "Portland, OR",
    seller: "thriftedvinyl",
    likes: 34
  },
  { 
    id: 5,
    title: "To Pimp a Butterfly", 
    artist: "Kendrick Lamar", 
    year: "2015",
    image: "https://images.unsplash.com/photo-1573566472937-1fa7a6230e93?w=400&h=400&fit=crop",
    price: 52,
    format: "Vinyl",
    condition: "Mint",
    location: "Los Angeles, CA",
    seller: "raparchives",
    likes: 189
  },
  { 
    id: 6,
    title: "Rumours", 
    artist: "Fleetwood Mac", 
    year: "1977",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    price: 35,
    format: "Cassette",
    condition: "Good",
    location: "San Francisco, CA",
    seller: "classicvibes",
    likes: 67
  }
];

export function ResonateCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [albums, setAlbums] = useState<Album[]>(mockAlbums);
  const [selectedFormat, setSelectedFormat] = useState<string>("all");

  const SoundWaveIcon = () => (
    <div className="flex items-end gap-0.5 h-6">
      <div className="w-1 bg-black h-2"></div>
      <div className="w-1 bg-black h-4"></div>
      <div className="w-1 bg-black h-6"></div>
      <div className="w-1 bg-black h-4"></div>
      <div className="w-1 bg-black h-2"></div>
    </div>
  );

  const filteredAlbums = albums.filter(album => {
    if (selectedFormat === "all") return true;
    return album.format.toLowerCase() === selectedFormat.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <div className="border-b border-gray-100 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <SoundWaveIcon />
                <h1 className="text-2xl font-bold text-black">RESONATE</h1>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 ml-8">
                <button className="hover:text-black transition-colors">Discover</button>
                <button className="hover:text-black transition-colors">Vinyl</button>
                <button className="hover:text-black transition-colors">CDs</button>
                <button className="hover:text-black transition-colors">Cassettes</button>
                <button className="hover:text-black transition-colors">Brands</button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingBag size={20} className="text-gray-600" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                <User size={16} />
                <span>Sign In</span>
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                placeholder="Search vinyl, CDs, artists, genres..." 
                className="w-full bg-gray-50 border-0 pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shuffle & Discover Section */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">SHUFFLE & DISCOVER</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <button className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 hover:border-black transition-colors">
                <Filter size={14} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Format Filters */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto">
            {["All", "Vinyl", "CD", "Cassette"].map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format === "All" ? "all" : format.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                  selectedFormat === (format === "All" ? "all" : format.toLowerCase())
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-300 hover:border-black"
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Album Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAlbums.map((album) => (
            <div key={album.id} className="bg-white group cursor-pointer">
              {/* Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden mb-4">
                <img 
                  src={album.image} 
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-2 py-1 rounded text-xs font-medium border-0">
                    {album.condition}
                  </div>
                  <div className="bg-black/95 text-white px-2 py-1 rounded text-xs font-medium border-0">
                    {album.format}
                  </div>
                </div>

                {/* Like Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart size={18} className="text-gray-600 hover:text-red-500" />
                </button>
              </div>
              
              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg leading-tight">
                    {album.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-1 mt-1">
                    {album.artist}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                    <span className="text-gray-600">@{album.seller}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin size={12} />
                    <span className="text-xs">{album.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-black">${album.price}</div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Heart size={14} />
                    <span>{album.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}