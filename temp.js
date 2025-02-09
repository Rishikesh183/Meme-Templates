/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";

export default function MediaGallery() {
  const [mediaData, setMediaData] = useState([]);
  const [filters, setFilters] = useState({
    movieName: "",
    heroName: "",
    category: "",
  });
  const [filteredMedia, setFilteredMedia] = useState([]);

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}