"use client";
import AddNewBlog from "../add-new-blog";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";

const initialBlogFormData = {
  title: "",
  description: "",
};

export default function BlogOverview({ blogsList }) {
  const [openBlogDialog, setOpenBlogDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blogFormData, setBlogFormData] = useState(initialBlogFormData);
  const [editBLogId, setEditBlogId] = useState(null);

  const router = useRouter();

  //console.log(blogFormData);
  const handleSaveBlogData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(true);
      // Simulate API call to add blog data
      const response =
        editBLogId !== null
          ? await fetch(`/api/update-blog?id=${editBLogId}`, {
              method: "PUT",
              body: JSON.stringify(blogFormData),
            })
          : await fetch("/api/add-blog", {
              method: "POST",
              body: JSON.stringify(blogFormData),
            });
      const data = await response.json();
      //console.log(data);
      if (data?.success) {
        setOpenBlogDialog(false);
        setBlogFormData(initialBlogFormData);
        setLoading(false);
        setEditBlogId(null);
        router.refresh();
      }

      if (!response.ok) {
        throw new Error("Failed to add blog");
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      alert("Failed to add blog");
      setLoading(false);
      setBlogFormData(initialBlogFormData);
    } finally {
      setLoading(false);
      setBlogFormData(initialBlogFormData);
    }
  };

  const handleDeleteById = async (id) => {
    try {
      const response = await fetch(`/api/delete-blog?id=${id}`, {
        method: "DELETE",
      });
      const blog = await response.json();

      if (blog?.success) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (blog) => {
    setEditBlogId(blog?._id);
    setBlogFormData({ title: blog.title, description: blog.description });
    setOpenBlogDialog(true);
  };
  //console.log(editBLog);

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-10 bg-gradient-to-r from-purple-500 to-blue-600 p-10">
      <AddNewBlog
        openBlogDialog={openBlogDialog}
        setOpenBlogDialog={setOpenBlogDialog}
        loading={loading}
        blogFormData={blogFormData}
        setBlogFormData={setBlogFormData}
        setLoading={setLoading}
        handleSaveBlogData={handleSaveBlogData}
        editBLogId={editBLogId}
        setEditBlogId={setEditBlogId}
      />
      <div className="flex flex-wrap items-center gap-5">
        {blogsList && blogsList.length ? (
          blogsList.map((blog, index) => (
            <Card key={index} className="py-4 px-3">
              <CardContent>
                <CardTitle className="mb-3">{blog.title}</CardTitle>
                <CardDescription>{blog.description}</CardDescription>
                <div className="flex items-center gap-5 mt-4">
                  <Button onClick={() => handleEdit(blog)}>Edit</Button>
                  <Button onClick={() => handleDeleteById(blog._id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Label className="text-3xl text-white font-bold">
            No Blog Found Add one
          </Label>
        )}
      </div>
    </div>
  );
}
