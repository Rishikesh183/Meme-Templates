import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
// console.log("SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function GET() {
  try {
    const { data, error } = await supabase.from("media").select("*");
    // console.log("the data in media page is",data)
    if (error) {
      console.error("Supabase Error:", error);
      throw new Error(error.message);
    }
    // console.log("Fetched Data:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching media data:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}