import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    // Initialize Supabase client inside the function
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // Ensure the request is multipart form-data
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const formData = await req.formData();
    const movieName = formData.get("movieName");
    const dialogue = formData.get("dialogue");
    const heroName = formData.get("heroName");
    const category = formData.get("category");
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const fileArrayBuffer = await file.arrayBuffer(); // Returns an ArrayBuffer
    const fileBuffer = Buffer.from(fileArrayBuffer);  // Convert to Buffer
    const fileName = `${uuidv4()}-${file.name}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media-uploads") // Use correct bucket name
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL and check for errors
    const { data: publicUrlData, error: urlError } = supabase.storage
      .from("media-uploads")
      .getPublicUrl(fileName);

    if (urlError) {
      console.error("Error fetching public URL:", urlError);
      return NextResponse.json({ error: urlError.message }, { status: 500 });
    }

    const imageUrl = publicUrlData.publicUrl;

    // Insert metadata into Supabase database
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
