import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const mediaFile = path.join(process.cwd(), "public/uploads/media.json");

export async function GET() {
  try {
    // Check if the file exists, if not return an empty array
    if (!fs.existsSync(mediaFile)) {
      console.log("media.json file does not exist, returning empty array.");
      return NextResponse.json([], { status: 200 });
    }

    // Read the file
    const fileData = fs.readFileSync(mediaFile, "utf-8");

    // If the file is empty, return an empty array
    if (!fileData.trim()) {
      console.log("media.json file is empty, returning empty array.");
      return NextResponse.json([], { status: 200 });
    }

    // Parse JSON data
    const data = JSON.parse(fileData);

    // Ensure it's an array
    if (!Array.isArray(data)) {
      console.error("media.json contains invalid data.");
      return NextResponse.json({ error: "Invalid data format" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error reading media.json:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
