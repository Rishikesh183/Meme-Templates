import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir, readFile, appendFile } from "fs/promises";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public/uploads");
const mediaFile = path.join(uploadDir, "media.json");

export async function POST(req) {
  try {
    await mkdir(uploadDir, { recursive: true });

    const formData = await req.formData();
    const file = formData.get("file");
    const movieName = formData.get("movieName");
    const dialogue = formData.get("dialogue");
    const heroName = formData.get("heroName");
    const category = formData.get("category");

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, file.name);

    await writeFile(filePath, buffer);

    // Save metadata
    let mediaList = [];
    if (fs.existsSync(mediaFile)) {
      mediaList = JSON.parse(await readFile(mediaFile, "utf-8"));
    }
    mediaList.push({ filePath: `/uploads/${file.name}`, movieName, dialogue, heroName, category });

    await writeFile(mediaFile, JSON.stringify(mediaList, null, 2));

    return NextResponse.json({ message: "Upload successful", filePath: `/uploads/${file.name}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
