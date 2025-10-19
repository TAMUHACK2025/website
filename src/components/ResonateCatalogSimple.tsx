"use client";

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
  isLiked?: boolean;
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
    likes: 95,
    isLiked: false
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
    likes: 23,
    isLiked: true
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
    likes: 145,
    isLiked: false
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
    likes: 34,
    isLiked: false
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
    likes: 189,
    isLiked: true
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
    likes: 67,
    isLiked: false
  },
  { 
    id: 7,
    title: "Abbey Road", 
    artist: "The Beatles", 
    year: "1969",
    image: "https://images.unsplash.com/photo-1598387993441-6f2c0f6b48c9?w=400&h=400&fit=crop",
    price: 48,
    format: "Vinyl",
    condition: "Very Good",
    location: "London, UK",
    seller: "beatlesforever",
    likes: 203,
    isLiked: false
  },
  { 
    id: 8,
    title: "Nevermind", 
    artist: "Nirvana", 
    year: "1991",
    image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop",
    price: 55,
    format: "Vinyl",
    condition: "Near Mint",
    location: "Seattle, WA",
    seller: "grunge_era",
    likes: 98,
    isLiked: false
  }
];

// Consistent avatar colors based on seller name
const getAvatarColor = (seller: string) => {
  const colors = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a8edea, #fed6e3)',
    'linear-gradient(135deg, #d299c2, #fef9d7)',
    'linear-gradient(135deg, #89f7fe, #66a6ff)'
  ];
  
  let hash = 0;
  for (let i = 0; i < seller.length; i++) {
    hash = seller.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export function ResonateCatalogSimple() {
  const [searchQuery, setSearchQuery] = useState("");
  const [albums, setAlbums] = useState<Album[]>(mockAlbums);
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Toggle like functionality
  const toggleLike = (albumId: number) => {
    setAlbums(prevAlbums => 
      prevAlbums.map(album => 
        album.id === albumId 
          ? { 
              ...album, 
              isLiked: !album.isLiked,
              likes: album.isLiked ? album.likes - 1 : album.likes + 1
            }
          : album
      )
    );
  };

  // Filter albums based on search and format
  const filteredAlbums = albums.filter(album => {
    const matchesSearch = searchQuery === "" || 
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFormat = selectedFormat === "all" || 
      album.format.toLowerCase() === selectedFormat.toLowerCase();
    
    return matchesSearch && matchesFormat;
  });

  // Simulate search with delay
  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const SoundWaveIcon = () => (
    <div className="sound-wave">
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
    </div>
  );

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Mint": return "#10b981";
      case "Near Mint": return "#3b82f6";
      case "Very Good": return "#8b5cf6";
      case "Good": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case "Vinyl": return "#1f2937";
      case "CD": return "#374151";
      case "Cassette": return "#4b5563";
      default: return "#6b7280";
    }
  };

  return (
    <div className="resonate-app" suppressHydrationWarning>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <SoundWaveIcon />
              <h1 className="logo-text">RESONATE</h1>
            </div>
            
            <nav className="nav">
              <button className="nav-button">Discover</button>
              <button className="nav-button">Vinyl</button>
              <button className="nav-button">CDs</button>
              <button className="nav-button">Cassettes</button>
              <button className="nav-button">Brands</button>
            </nav>
            
            <div className="header-actions">
              <button className="icon-button">
                <span className="icon">♥</span>
                <span className="badge">3</span>
              </button>
              <button className="icon-button">
                <span className="icon">🛍️</span>
                <span className="badge">1</span>
              </button>
              <button className="sign-in-button">
                <span className="user-icon">👤</span>
                <span>Sign In</span>
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-box">
              <div className="search-icon">🔍</div>
              <input 
                type="text"
                placeholder="Search vinyl, CDs, artists, genres..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Shuffle & Discover Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">DISCOVER</h2>
            <div className="section-actions">
              <button className="filter-button">
                <span className="filter-icon">⚙️</span>
                <span>Filters</span>
              </button>
              <div className="results-count">
                {filteredAlbums.length} items
              </div>
            </div>
          </div>

          {/* Format Filters */}
          <div className="format-filters">
            {["All", "Vinyl", "CD", "Cassette"].map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format === "All" ? "all" : format.toLowerCase())}
                className={`format-button ${
                  selectedFormat === (format === "All" ? "all" : format.toLowerCase()) ? "active" : ""
                }`}
              >
                {format}
                {format !== "All" && (
                  <span className="format-count">
                    {albums.filter(a => a.format === format).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching through collections...</p>
        </div>
      )}

      {/* Album Grid */}
      <main className="container">
        {!isLoading && (
          <>
            {filteredAlbums.length > 0 ? (
              <div className="grid">
                {filteredAlbums.map((album) => (
                  <div key={album.id} className="card">
                    {/* Image */}
                    <div className="card-image">
                      <img 
                        src={album.image} 
                        alt={album.title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop';
                        }}
                      />
                      
                      {/* Badges */}
                      <div className="badges">
                        <div 
                          className="badge badge-condition"
                          style={{ backgroundColor: getConditionColor(album.condition) }}
                        >
                          {album.condition}
                        </div>
                        <div 
                          className="badge badge-format"
                          style={{ backgroundColor: getFormatColor(album.format) }}
                        >
                          {album.format}
                        </div>
                      </div>

                      {/* Like Button */}
                      <button 
                        className={`like-button ${album.isLiked ? 'liked' : ''}`}
                        onClick={() => toggleLike(album.id)}
                      >
                        {album.isLiked ? '❤️' : '🤍'}
                      </button>

                      {/* Quick Actions */}
                      <div className="quick-actions">
                        <button className="quick-action-btn">🛒</button>
                        <button className="quick-action-btn">📦</button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="card-content">
                      <h3 className="album-title">{album.title}</h3>
                      <p className="album-artist">{album.artist} • {album.year}</p>
                      
                      <div className="seller-info">
                        <div className="seller">
                          <div 
                            className="avatar"
                            style={{ 
                              background: getAvatarColor(album.seller)
                            }}
                          ></div>
                          <span className="seller-name">@{album.seller}</span>
                        </div>
                        <div className="location">
                          <span className="location-icon">📍</span>
                          <span>{album.location}</span>
                        </div>
                      </div>

                      <div className="price-info">
                        <div className="price">${album.price}</div>
                        <div className="engagement">
                          <div className="likes">
                            <span className="like-icon">❤️</span>
                            <span>{album.likes}</span>
                          </div>
                          <button className="buy-button">
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎵</div>
                <h3>No items found</h3>
                <p>Try adjusting your search or filters</p>
                <button 
                  className="reset-button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFormat("all");
                  }}
                >
                  Show All Items
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <SoundWaveIcon />
                <span>RESONATE</span>
              </div>
              <p className="footer-description">
                The marketplace for music collectors. Find rare vinyl, CDs, and cassettes from sellers worldwide.
              </p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Shop</h4>
                <a href="#">All Formats</a>
                <a href="#">New Arrivals</a>
                <a href="#">Trending</a>
                <a href="#">Brands</a>
              </div>
              <div className="link-group">
                <h4>Sell</h4>
                <a href="#">Start Selling</a>
                <a href="#">Seller Guide</a>
                <a href="#">Community</a>
                <a href="#">Resources</a>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact Us</a>
                <a href="#">Shipping</a>
                <a href="#">Returns</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 RESONATE. Keep music playing, keep records spinning.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .resonate-app {
          min-height: 100vh;
          background: white;
          color: #1a1a1a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Header Styles */
        .header {
          border-bottom: 1px solid #f0f0f0;
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          z-index: 100;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sound-wave {
          display: flex;
          align-items: end;
          gap: 3px;
          height: 28px;
        }

        .wave-bar {
          width: 3px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 2px;
        }

        .wave-bar:nth-child(1) { height: 10px; }
        .wave-bar:nth-child(2) { height: 16px; }
        .wave-bar:nth-child(3) { height: 22px; }
        .wave-bar:nth-child(4) { height: 16px; }
        .wave-bar:nth-child(5) { height: 10px; }

        .logo-text {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-button {
          font-size: 16px;
          font-weight: 500;
          color: #666;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          padding: 8px 0;
        }

        .nav-button:hover {
          color: #000;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-button {
          position: relative;
          padding: 10px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .icon-button:hover {
          background: #f5f5f5;
        }

        .badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .sign-in-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 2px solid #e5e5e5;
          border-radius: 25px;
          background: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sign-in-button:hover {
          border-color: #667eea;
          background: #f8faff;
        }

        /* Search Styles */
        .search-container {
          max-width: 600px;
          margin: 0 auto 20px;
        }

        .search-box {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 16px 50px 16px 50px;
          background: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 16px;
          font-size: 16px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          background: white;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 18px;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
        }

        .clear-search:hover {
          color: #666;
        }

        /* Section Styles */
        .section {
          border-bottom: 1px solid #f0f0f0;
          padding: 30px 0;
          background: #fafafa;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .section-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .filter-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 2px solid #e5e5e5;
          border-radius: 20px;
          background: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-button:hover {
          border-color: #667eea;
        }

        .results-count {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        /* Format Filters */
        .format-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .format-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: 2px solid #e5e5e5;
          border-radius: 25px;
          background: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .format-button.active {
          background: #1a1a1a;
          color: white;
          border-color: #1a1a1a;
        }

        .format-button:hover:not(.active) {
          border-color: #1a1a1a;
        }

        .format-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #666;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f1f5f9;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Grid Styles */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          padding: 40px 0;
        }

        /* Card Styles */
        .card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          border-color: #e5e5e5;
        }

        .card-image {
          position: relative;
          aspect-ratio: 1;
          background: #f8fafc;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .card:hover .card-image img {
          transform: scale(1.05);
        }

        .badges {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: flex;
          gap: 6px;
        }

        .badge {
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          color: white;
          backdrop-filter: blur(10px);
        }

        .like-button {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .like-button:hover {
          background: white;
          transform: scale(1.1);
        }

        .like-button.liked {
          background: rgba(239, 68, 68, 0.1);
        }

        .quick-actions {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          gap: 6px;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }

        .card:hover .quick-actions {
          opacity: 1;
          transform: translateY(0);
        }

        .quick-action-btn {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .quick-action-btn:hover {
          background: white;
          transform: scale(1.1);
        }

        .card-content {
          padding: 20px;
        }

        .album-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .album-artist {
          font-size: 14px;
          color: #666;
          line-height: 1.3;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .seller-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .seller {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .seller-name {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #999;
        }

        .price-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .price {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
        }

        .engagement {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .likes {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .buy-button {
          padding: 8px 16px;
          background: #1a1a1a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .buy-button:hover {
          background: #000;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #666;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 16px;
          margin-bottom: 24px;
        }

        .reset-button {
          padding: 12px 24px;
          background: #1a1a1a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .reset-button:hover {
          background: #000;
        }

        /* Footer Styles */
        .footer {
          background: #1a1a1a;
          color: white;
          padding: 60px 0 30px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
          margin-bottom: 40px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .footer-logo .sound-wave .wave-bar {
          background: white;
        }

        .footer-logo span {
          font-size: 20px;
          font-weight: 700;
        }

        .footer-description {
          color: #a0a0a0;
          line-height: 1.6;
          font-size: 14px;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .link-group h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: white;
        }

        .link-group a {
          display: block;
          color: #a0a0a0;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .link-group a:hover {
          color: white;
        }

        .footer-bottom {
          border-top: 1px solid #333;
          padding-top: 30px;
          text-align: center;
          color: #a0a0a0;
          font-size: 14px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav {
            display: none;
          }
          
          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .footer-links {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 640px) {
          .header-content {
            flex-direction: column;
            gap: 16px;
          }
          
          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .section-actions {
            width: 100%;
            justify-content: space-between;
          }
          
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}