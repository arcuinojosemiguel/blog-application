import { useState, FormEvent } from "react";
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
    } catch (err) {
      // Error handled by Redux
    }
  };

  const handleCancel = () => {
    navigate("/blogs");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Blog Post
          </h1>
          <p className="text-gray-600 mt-2">
            Share your thoughts with the world
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Blog Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-lg"
                placeholder="Enter an engaging title..."
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                {title.length} characters
              </p>
            </div>

            {/* Content Field */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Blog Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none resize-none"
                placeholder="Write your blog content here..."
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                {content.length} characters
              </p>
            </div>

            {/* Error Messages */}
            {(validationError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {validationError || error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  "Publish Blog"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Writing Tips
          </h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Keep your title clear and descriptive</li>
            <li>• Break content into paragraphs for better readability</li>
            <li>• Proofread before publishing</li>
            <li>• Use engaging language to connect with readers</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
