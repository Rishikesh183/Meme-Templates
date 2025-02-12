import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // To generate unique filenames

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const formData = await req.formData();

    const movieName = formData.get("movieName");
    const dialogue = formData.get("dialogue");
    const heroName = formData.get("heroName");
    const category = formData.get("category");
    const file = formData.get("file"); // Get uploaded file

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer for upload
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${uuidv4()}-${file.name}`;

    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media-uploads") // Use correct bucket name
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage.from("media-uploads").getPublicUrl(fileName);
    // console.log("public url data is",publicUrlData)
    const imageUrl = publicUrlData.publicUrl;


    // Store metadata in the 'media' table
    const { data, error } = await supabase.from("media").insert([
      { movieName, dialogue, heroName, category, imageUrl }
    ]);

    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "File uploaded successfully", data }, { status: 200 });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}