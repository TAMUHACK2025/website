import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Search, ExternalLink, Disc3, Disc, CassetteTape } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function GridCatalogDesign() {
  const albums = [
    { 
      title: "Random Access Memories", 
      artist: "Daft Punk", 
      year: "2013",
      image: "https://images.unsplash.com/photo-1653383454515-0b42b711ed7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MDgxNjEzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      vinyl: { price: 45, available: true },
      cd: { price: 15, available: true },
      cassette: { price: 12, available: false }
    },
    { 
      title: "Abbey Road", 
      artist: "The Beatles", 
      year: "1969",
      image: "https://images.unsplash.com/photo-1618034100983-e1d78be0dc80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZCUyMGFsYnVtJTIwbXVzaWN8ZW58MXx8fHwxNzYwODE2MTM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      vinyl: { price: 38, available: true },
      cd: { price: 12, available: true },
      cassette: { price: 25, available: true }
    },
    { 
      title: "To Pimp a Butterfly", 
      artist: "Kendrick Lamar", 
      year: "2015",
      image: "https://images.unsplash.com/photo-1573566472937-1fa7a6230e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNzZXR0ZSUyMHRhcGVzfGVufDF8fHx8MTc2MDgxNjEzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      vinyl: { price: 52, available: true },
      cd: { price: 18, available: true },
      cassette: { price: 15, available: true }
    },
    { 
      title: "Rumours", 
      artist: "Fleetwood Mac", 
      year: "1977",
      image: "https://images.unsplash.com/photo-1653383454515-0b42b711ed7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MDgxNjEzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      vinyl: { price: 35, available: true },
      cd: { price: 14, available: true },
      cassette: { price: 28, available: true }
    },
    { 
      title: "Igor", 
      artist: "Tyler, The Creator", 
      year: "2019",
      image: "https://images.unsplash.com/photo-1618034100983-e1d78be0dc80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZCUyMGFsYnVtJTIwbXVzaWN8ZW58MXx8fHwxNzYwODE2MTM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      vinyl: { price: 42, available: true },
      cd: { price: 16, available: false },
      cassette: { price: 18, available: true }
    },
    { 
      title: "The Dark Side of the Moon", 
      artist: "Pink Floyd", 
      year: "1973",
      image: "https://images.unsplash.com/photo-1573566472937-1fa7a6230e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNzZXR0ZSUyMHRhcGVzfGVufDF8fHx8MTc2MDgxNjEzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      vinyl: { price: 40, available: true },
      cd: { price: 13, available: true },
      cassette: { price: 30, available: true }
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl mb-1">SPOTIFY_TO_PHYSICAL</h1>
              <p className="text-zinc-500 text-sm">your_digital_library.to_analog()</p>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-black">
              CONNECT_SPOTIFY
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <Input 
              placeholder="search_albums()" 
              className="bg-zinc-900 border-zinc-800 pl-10 font-mono text-zinc-300 placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-zinc-500 text-sm">// Found {albums.length} albums in library</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album, idx) => (
            <Card key={idx} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors">
              <div className="aspect-square relative overflow-hidden bg-zinc-800">
                <ImageWithFallback 
                  src={album.image} 
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white border-zinc-700 font-mono text-xs">
                    {album.year}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 truncate">{album.title}</h3>
                <p className="text-sm text-zinc-500 mb-4 truncate">{album.artist}</p>
                
                <div className="space-y-2">
                  <button 
                    disabled={!album.vinyl.available}
                    className="w-full flex items-center justify-between p-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Disc3 size={14} />
                      <span className="text-sm">vinyl</span>
                    </div>
                    <span className="text-sm">${album.vinyl.price}</span>
                  </button>
                  
                  <button 
                    disabled={!album.cd.available}
                    className="w-full flex items-center justify-between p-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Disc size={14} />
                      <span className="text-sm">cd</span>
                    </div>
                    <span className="text-sm">${album.cd.price}</span>
                  </button>
                  
                  <button 
                    disabled={!album.cassette.available}
                    className="w-full flex items-center justify-between p-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CassetteTape size={14} />
                      <span className="text-sm">cassette</span>
                    </div>
                    <span className="text-sm">${album.cassette.price}</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
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
