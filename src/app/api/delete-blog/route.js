import connectToDB from "@/database";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const currentId = searchParams.get("id");

    if (!currentId) {
      return NextResponse.json({
        success: false,
        message: "No blog post ID provided",
      });
    }
    const deletedBlog = await Blog.findByIdAndDelete(currentId);

    if (deletedBlog) {
      return NextResponse.json({
        success: true,
        message: "Blog post deleted successfully",
      });
    }
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
