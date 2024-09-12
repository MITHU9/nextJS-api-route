import connectToDB from "@/database";
import Blog from "@/models/blog";
import Joi from "joi";
import { NextResponse } from "next/server";

const editBlog = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

export async function PUT(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const currentId = searchParams.get("id");

    if (!currentId) {
      return NextResponse.json({
        success: false,
        message: "Missing required parameter: id",
      });
    }

    // Update the record here
    const { title, description } = await req.json();
    const { error } = editBlog.validate({ title, description });
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updateBlog = await Blog.findByIdAndUpdate(
      {
        _id: currentId,
      },
      {
        title,
        description,
      },
      { new: true }
    );

    if (!updateBlog) {
      return NextResponse.json({
        success: false,
        message: "Blog not found",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      data: updateBlog,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "An error occurred",
      success: false,
    });
  }
}
