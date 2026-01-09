import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchBlogById,
  updateBlog,
  clearCurrentBlog,
} from "../store/blogSlice";
import Layout from "../components/Layout";

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentBlog, loading, error } = useAppSelector((state) => state.blog);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }

    return () => {
      dispatch(clearCurrentBlog());
      setIsLoaded(false);
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentBlog && !isLoaded) {
      // Check if user is the owner
      if (user && currentBlog.author_id !== user.id) {
        alert("You do not have permission to edit this blog.");
        navigate("/blogs");
        return;
      }

      // Use a microtask to batch state updates
      Promise.resolve().then(() => {
        setTitle(currentBlog.title);
        setContent(currentBlog.content);
        setOriginalTitle(currentBlog.title);
        setOriginalContent(currentBlog.content);
        setIsLoaded(true);
      });
    }
  }, [currentBlog, navigate, user, isLoaded]);

  // Check if there are any changes
  const hasChanges = title !== originalTitle || content !== originalContent;

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

    if (!id || !validateForm()) return;

    try {
      await dispatch(
        updateBlog({ id, title: title.trim(), content: content.trim() })
      ).unwrap();
      navigate(`/blogs/${id}`);
    } catch {
      // Error handled by Redux
    }
  };

  const handleCancel = () => {
    navigate(`/blogs/${id}`);
  };

  if (loading && !isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
            <p className="text-gray-600">Loading blog...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentBlog) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            Blog post not found
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Edit Blog Post
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Update your blog content
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none resize-none text-sm sm:text-base"
                placeholder="Write your blog content here..."
                disabled={loading}
              />
            </div>

            {/* Error Messages */}
            {(validationError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {validationError || error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !hasChanges}
                className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
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
                    Updating...
                  </span>
                ) : (
                  "Update Blog"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
            Note
          </h3>
          <p className="text-xs sm:text-sm text-blue-800">
            Changes will be saved with the current timestamp. Readers will see
            when the blog was last updated.
          </p>
        </div>
      </div>
    </Layout>
  );
}
