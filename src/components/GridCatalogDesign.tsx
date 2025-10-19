"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Search, ExternalLink, Disc3, CassetteTape, ShoppingCart, Package, DollarSign, Tag, CircleEllipsis, Truck } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose } from './ui/drawer'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
// Use server-side auth route instead of importing server-only helpers
import { useCallback, useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";

interface PriceInfo {
  currency: string;
  price: number;
  condition: string;
  thumbnail?: string;
  seller?: string;
}

interface FormatPricing {
  format: string;
  lowestPrice?: PriceInfo;
  medianPrice?: number;
  available: number;
}

interface Album {
  id: number;
  title: string;
  year?: string;
  type: string;
  cover_image: string;
  thumb: string;
  uri?: string;
  formats?: Array<{
    name: string;
    qty: string;
    descriptions?: string[];
  }>;
  pricing?: {
    vinyl?: FormatPricing;
    cd?: FormatPricing;
  };
}

export function GridCatalogDesign() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Album[]>([]);
  const [featuredAlbums, setFeaturedAlbums] = useState<Album[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [albumPricing, setAlbumPricing] = useState<Record<number, Album['pricing']>>({});

  // Fetch featured albums on component mount
  useEffect(() => {
    const fetchFeaturedAlbums = async () => {
      try {
        setIsLoadingFeatured(true);
        console.log('Starting featured albums fetch...');
        
        const response = await fetch('/api/discogs/featured');
        console.log('API Response status:', response.status);
        
        const data = await response.json();
        console.log('Raw API data:', data);
        
        if (data && Array.isArray(data.results)) {
          console.log('Found', data.results.length, 'albums');
          setFeaturedAlbums(data.results);
        } else {
          console.error('Invalid data structure:', data);
          setFeaturedAlbums([]);
        }
      } catch (error) {
        console.error('Failed to fetch featured albums:', error);
        setFeaturedAlbums([]);
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    fetchFeaturedAlbums();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/discogs/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data && Array.isArray(data.results)) {
        setSearchResults(data.results);
      } else {
        console.error('Invalid search results structure:', data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button
                type="button"
                className="flex flex-col items-start gap-1 group no-underline text-left"
                onClick={() => {
                  // Hard reset the website by forcing a full navigation to root
                  window.location.assign('/');
                }}
              >
                <h1 className="text-xl mb-0 font-bold cursor-pointer group-hover:underline flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M2 12h2M6 8v8M10 6v12M14 8v8M18 10v4M22 12h-2" stroke="#F8FAFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Resonate
                </h1>
                <p className="text-zinc-500 text-sm cursor-pointer">what do you want in your hands?</p>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Drawer>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  {/* Popover manages hover tooltip; Drawer manages click-to-open */}
                  <PopoverTrigger asChild>
                    <div onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
                      <DrawerTrigger asChild>
                        <Button variant="ghost" className="!bg-transparent p-2">
                          {/* Spotify logo (green circle with white arcs) */}
                          <img src="/spotify-logo.svg" alt="Spotify" width={20} height={20} className="block" />
                        </Button>
                      </DrawerTrigger>
                    </div>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-2 bg-zinc-900 text-white rounded-md border border-zinc-700 z-[9999]">
                    <span className="text-sm">Login in with spotify to view your collection</span>
                  </PopoverContent>
                </Popover>

                <DrawerContent className="w-full max-w-sm" >
                  <DrawerHeader>
                    <DrawerTitle>Login with Spotify</DrawerTitle>
                    <DrawerDescription className="text-sm text-zinc-500">Connect your Spotify account to view and import your collection.</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <p className="mb-4 text-sm text-zinc-400">Signing in with Spotify allows us to access your saved albums and match them to Discogs releases.</p>
                    <a href="/api/auth/login" className="inline-block w-full">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-black flex items-center justify-center gap-2">
                        <img src="/spotify-logo.svg" alt="Spotify" width={18} height={18} className="mr-2" />
                        Login with Spotify
                      </Button>
                    </a>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline" className="w-full">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <Input 
              placeholder="search any artist, album, or track" 
              className="bg-zinc-900 border-zinc-800 pl-10 font-mono text-zinc-300 placeholder:text-zinc-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-zinc-500 text-sm">
            {isLoadingFeatured ? (
              "// Loading featured albums..."
            ) : (
              `// Found ${searchResults.length || featuredAlbums.length} albums ${searchResults.length ? 'in search' : 'featured'}`
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoadingFeatured ? (
            // Loading skeleton
            [...Array(6)].map((_, idx) => (
              <Card key={idx} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors animate-pulse">
                <div className="aspect-square bg-zinc-800" />
                <div className="p-4">
                  <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </div>
              </Card>
            ))
          ) : (
            (searchResults.length > 0 ? searchResults : featuredAlbums).map((album: Album, idx) => (
              <Card key={idx} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors">
                <div className="aspect-square relative overflow-hidden bg-zinc-800">
                  {album.cover_image && (
                    <ImageWithFallback 
                      src={album.cover_image}
                      alt={album.title || 'Album cover'}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white border-zinc-700 font-mono text-xs">
                      {album.year || 'N/A'}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 truncate font-medium text-zinc-500">{album.title || 'Untitled'}</h3>
                  <p className="text-sm text-zinc-500 mb-4 truncate">
                    {/* Show release format and catalog number */}
                    {album.type || 'Unknown format'}
                  </p>
                  
                  <div className="space-y-2">
                    {/* Purchase options dropdown with animation */}
                    <div className="relative">
                      <DropdownMenu onOpenChange={async (open) => {
                        if (open && !albumPricing[album.id]) {
                          try {
                            console.log('Fetching pricing for album:', album.id);
                            const response = await fetch(`/api/discogs/pricing?releaseId=${album.id}`);
                            const data = await response.json();
                            console.log('Received pricing data:', data);
                            if (data.pricing) {
                              setAlbumPricing(prev => ({
                                ...prev,
                                [album.id]: data.pricing
                              }));
                            }
                          } catch (error) {
                            console.error('Failed to fetch pricing:', error);
                          }
                        }
                      }}>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            className="w-full bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white hover:text-white transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <div className="flex items-center gap-2">
                              <ShoppingCart size={14} className="shrink-0" />
                              <span className="text-sm">Purchase Options</span>
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          className="w-[400px] bg-zinc-900/95 backdrop-blur border border-zinc-700 animate-in fade-in-0 zoom-in-95 duration-100"
                          align="end"
                          sideOffset={5}
                        >
                          <div className="p-4">
                            <h3 className="text-lg font-medium mb-2 font-mono truncate">{album.title}</h3>
                            <div className="grid grid-cols-2 gap-4">
                              {/* Vinyl Section */}
                              <div className="space-y-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-800 transition-colors group">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Disc3 className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                                    <span className="font-mono">Vinyl</span>
                                  </div>
                                  <Badge variant="outline" className="bg-zinc-900/50 font-mono">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {albumPricing[album.id]?.vinyl?.lowestPrice?.price || '??'}
                                  </Badge>
                                </div>
                                <div className="space-y-2 text-sm text-zinc-400">
                                  <div className="flex items-center gap-2">
                                    <Tag className="h-3 w-3" />
                                    <span>From ${albumPricing[album.id]?.vinyl?.lowestPrice?.price || '??.??'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CircleEllipsis className="h-3 w-3" />
                                    <span>Median ${albumPricing[album.id]?.vinyl?.medianPrice || '??.??'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Truck className="h-3 w-3" />
                                    <span>{albumPricing[album.id]?.vinyl?.available || '0'} available</span>
                                  </div>
                                </div>
                                <Button 
                                  className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-500 mt-2"
                                  onClick={() => window.open(`https://www.discogs.com/sell/release/${album.id}?format=Vinyl`, '_blank')}
                                >
                                  View Vinyl Listings
                                </Button>
                              </div>

                              {/* CD Section */}
                              <div className="space-y-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-800 transition-colors group">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-mono">CD</span>
                                  </div>
                                  <Badge variant="outline" className="bg-zinc-900/50 font-mono">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {albumPricing[album.id]?.cd?.lowestPrice?.price || '??'}
                                  </Badge>
                                </div>
                                <div className="space-y-2 text-sm text-zinc-400">
                                  <div className="flex items-center gap-2">
                                    <Tag className="h-3 w-3" />
                                    <span>From ${albumPricing[album.id]?.cd?.lowestPrice?.price || '??.??'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CircleEllipsis className="h-3 w-3" />
                                    <span>Median ${albumPricing[album.id]?.cd?.medianPrice || '??.??'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Truck className="h-3 w-3" />
                                    <span>{albumPricing[album.id]?.cd?.available || '0'} available</span>
                                  </div>
                                </div>
                                <Button 
                                  className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 mt-2"
                                  onClick={() => window.open(`https://www.discogs.com/sell/release/${album.id}?format=CD`, '_blank')}
                                >
                                  View CD Listings
                                </Button>
                              </div>
                            </div>

                            <DropdownMenuSeparator className="bg-zinc-700 my-4" />
                            
                            <Button 
                              className="w-full bg-zinc-800 hover:bg-zinc-750 group"
                              onClick={() => window.open(`https://www.discogs.com/release/${album.id}`, '_blank')}
                            >
                              <ExternalLink className="mr-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                              View Full Details on Discogs
                            </Button>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Format indicators */}
                    <div className="flex gap-2 mt-2">
                      {album.type?.toLowerCase().includes('vinyl') && (
                        <Badge variant="secondary" className="bg-zinc-800 flex items-center gap-1 text-white">
                          <Disc3 className="h-3 w-3" />
                          <span className="text-white">Vinyl</span>
                        </Badge>
                      )}
                      {!album.type?.toLowerCase().includes('digital') && (
                        <Badge variant="secondary" className="bg-zinc-800 flex items-center gap-1 text-white">
                          <CassetteTape className="h-3 w-3" />
                          <span className="text-white">Physical</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-zinc-600 text-sm">// Powered by Spotify API + Discogs</p>
        </div>
      </div>
    </div>
  );
}
