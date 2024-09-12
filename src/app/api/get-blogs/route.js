import connectToDB from "@/database";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const allBlogsFromDB = await Blog.find({});
    if (allBlogsFromDB) {
      return NextResponse.json({
        success: true,
        data: allBlogsFromDB,
      });
    } else {
      return NextResponse.json({
        message: "No blogs found",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Something went wrong! Please try again",
      success: false,
    });
  }
}
