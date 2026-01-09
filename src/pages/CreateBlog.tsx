import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createBlog } from "../store/blogSlice";
import Layout from "../components/Layout";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.blog);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setValidationError("Title is required");
      return false;
    }

    if (title.trim().length < 3) {
      setValidationError("Title must be at least 3 characters long");
      return false;
    }

    if (!content.trim()) {
      setValidationError("Content is required");
      return false;
    }

    if (content.trim().length < 10) {
      setValidationError("Content must be at least 10 characters long");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(
        createBlog({ title: title.trim(), content: content.trim() })
      ).unwrap();
      navigate("/blogs");
    } catch {
      // Error handled by Redux
    }
  };

  const handleCancel = () => {
    navigate("/blogs");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create New Blog Post
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Share your thoughts with the world
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Title Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="title"
                  className="text-sm sm:text-base font-bold text-gray-900"
                >
                  Blog Title
                </label>
                <span className="text-xs sm:text-sm text-gray-500 mr-2">
                  {title.length} characters
                </span>
              </div>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-base sm:text-lg"
                placeholder="Enter an engaging title..."
                disabled={loading}
              />
            </div>

            {/* Content Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="content"
                  className="text-sm sm:text-base font-bold text-gray-900"
                >
                  Blog Content
                </label>
                <span className="text-xs sm:text-sm text-gray-500 mr-2">
                  {content.length} characters
                </span>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none resize-y text-base sm:text-lg"
                placeholder="Write your blog content here..."
                disabled={loading}
              />
            </div>

            {/* Error Messages */}
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {validationError}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-medium text-sm sm:text-base"
              >
                {loading ? "Creating..." : "Create Blog"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 sm:flex-none px-6 sm:px-8 py-2 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition duration-200 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
            Writing Tips:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800 text-xs sm:text-sm">
            <li>Make your title clear and compelling</li>
            <li>Use paragraphs to organize your thoughts</li>
            <li>Proofread before publishing</li>
            <li>
              Minimum requirements: 3 characters for title, 10 for content
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
