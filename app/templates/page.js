/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";

export default function MediaGallery() {
  const [mediaData, setMediaData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [filters, setFilters] = useState({
    movieName: "",
    heroName: "",
    category: "",
  });

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const response = await fetch("/api/media");
        const data = await response.json();
        setMediaData(data);
        setFilteredMedia(data); // Initialize filtered media with all data
      } catch (error) {
        console.error("Error fetching media data:", error);
      }
    };

    fetchMediaData();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters change
    let filtered = mediaData.filter((item) => {
      return (
        (filters.movieName === "" || item.movieName === filters.movieName) &&
        (filters.heroName === "" || item.heroName === filters.heroName) &&
        (filters.category === "" || item.category === filters.category)
      );
    });
    setFilteredMedia(filtered);
  }, [filters, mediaData]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const response = await fetch("/api/media");
        const data = await response.json();
        setMediaData(data);
        setFilteredMedia(data); // Initialize filtered media with all data
      } catch (error) {
        console.error("Error fetching media data:", error);
      }
    };

    fetchMediaData();
  }, []);

  useEffect(() => {
    // Filter based on search query
    let filtered = mediaData.filter((item) =>
      [item.dialogue, item.movieName, item.heroName, item.category]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredMedia(filtered);
  }, [searchQuery, mediaData]);

  const handleDownload = (filePath, fileName) => {
    const link = document.createElement("a");
    link.href = filePath; // File URL
    link.download = fileName || "download"; // Default filename if not provided
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Media Gallery</h2>

      <div className="flex gap-4 mb-4">
        <select name="movieName" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Movies</option>
          {Array.from(new Set(mediaData.map((item) => item.movieName))).map((movie) => (
            <option key={movie} value={movie}>{movie}</option>
          ))}
        </select>

        <select name="heroName" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Heroes</option>
          {Array.from(new Set(mediaData.map((item) => item.heroName))).map((hero) => (
            <option key={hero} value={hero}>{hero}</option>
          ))}
        </select>

        <select name="category" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Categories</option>
          {Array.from(new Set(mediaData.map((item) => item.category))).map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by dialogue, movie, hero, or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {filteredMedia.length === 0 ? (
        <p className="text-gray-500 text-center">No Templates found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMedia.map((item, index) => (
            <div key={index} className="border p-2 rounded shadow-md">
              {item.filePath.endsWith(".mp4") ? (
                <video controls className="w-full">
                  <source src={item.filePath} type="video/mp4" />
                </video>
              ) : item.filePath.endsWith(".mp3") ? (
                <audio controls className="w-full">
                  <source src={item.filePath} type="audio/mp3" />
                </audio>
              ) : (
                <img
                  src={item.filePath}
                  alt="Uploaded Media"
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-2 text-center">
                <p className="text-sm font-bold">{item.dialogue}</p>
                <p className="text-xs text-gray-600">
                  {item.heroName} | {item.movieName} | {item.category}
                </p>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(item.filePath, item.dialogue)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <div className="flex gap-4">Download <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-arrow-down"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg></div>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
