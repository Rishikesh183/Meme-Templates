"use client"
import { useEffect, useState } from "react";
import MediaGallery from "./templates/page";
import axios from "axios";

export default function UploadPage() {

  const [openForm, setOpenForm] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get("/api/media");
        // console.log("Fetched media data:", res.data); // ✅ Ensure this logs correct data
        setMediaData(res.data || []);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, []);
  // console.log("media data is the ", mediaData)
  const [form, setForm] = useState({
    movieName: "",
    dialogue: "",
    heroName: "",
    category: "",
    file: null,
    otherHero: "",
    otherCategory: "",
  });

  const OpenForm = () => {
    setOpenForm(true)
  }
  const closeForm = () => {
    setOpenForm(false)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleHeroChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, heroName: value, otherHero: value === "Other" ? "" : form.otherHero });
  };
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, category: value, otherCategory: value === "others" ? "" : form.otherCategory });
  };


  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("movieName", form.movieName);
    formData.append("dialogue", form.dialogue);
    formData.append("heroName", form.heroName === "Other" ? form.otherHero : form.heroName);
    formData.append("category", form.category === "others" ? form.otherCategory : form.category);
    formData.append("file", form.file);

    await axios.post("https://meme-templates-lemon.vercel.app/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("submitted succesfully")
    closeForm()
  };

  return (
    <>
      <h1 className=' p-3 text-2xl font-bold justify-between bg-gray-50 text-center text-red-500'>Save Your Meme Templates</h1>
      <div className="flex items-center justify-center p-4">
        <button onClick={OpenForm} type="button" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Click Here To Upload</button>

        {openForm && <button onClick={closeForm} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-6 py-2 text-center me-2 mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></button>}        
      </div>
      {openForm &&
        <div className="m-3 p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Upload Templates</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="movieName"
              placeholder="Movie Name"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="dialogue"
              placeholder="Dialogue"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <select name="heroName" onChange={handleHeroChange} className="w-full p-2 border rounded">
              <option value="">Select Hero</option>
              <option value="prabhas">Prabhas</option>
              <option value="allu arjun">Allu Arjun</option>
              <option value="ntr">NTR</option>
              <option value="mahesh babu">Mahesh Babu</option>
              <option value="ram charan">Ram Charan</option>
              <option value="pawan kalyan">Pawan Kalyan</option>
              <option value="Other">Other</option>
            </select>
            {form.heroName === "Other" && (
              <input
                type="text"
                name="otherHero"
                placeholder="Enter Hero Name"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            )}
            <select name="category" onChange={handleCategoryChange} className="w-full p-2 border rounded">
              <option value="">Select Category</option>
              <option value="hype">hype</option>
              <option value="mass">mass</option>
              <option value="comedy">comedy</option>
              <option value="violence">violence</option>
              <option value="intelligence">intelligence</option>
              <option value="sad">sad</option>
              <option value="others">Others</option>
            </select>
            {form.category === "others" && (
              <input
                type="text"
                name="otherCategory"
                placeholder="Enter Category Name"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            )}
            <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Upload</button>
          </form>

        </div>
      }
      <div>
        {mediaData.length > 0 ? (
          <MediaGallery />
        ) : (
          <p className="text-center text-gray-500">No Templates Found</p>
        )}
      </div>
    </>
  );
}
