import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchBlogById,
  deleteBlog,
  clearCurrentBlog,
} from "../store/blogSlice";
import Layout from "../components/Layout";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentBlog, loading, error } = useAppSelector((state) => state.blog);
  const { user } = useAppSelector((state) => state.auth);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }

    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [id, dispatch]);

  const isOwner = user && currentBlog && user.id === currentBlog.author_id;

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(deleteBlog(id)).unwrap();
      navigate("/blogs");
    } catch {
      setIsDeleting(false);
      alert("Failed to delete blog. Please try again.");
    }
  };

  if (loading) {
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

  if (error || !currentBlog) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-semibold mb-2">Error Loading Blog</h3>
            <p>{error || "Blog post not found"}</p>
          </div>
          <Link
            to="/blogs"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to All Blogs
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Link */}
        <Link
          to="/blogs"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition duration-200 text-sm sm:text-base"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to All Blogs
        </Link>

        {/* Blog Content Card */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 text-left">
              {currentBlog.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center text-blue-100 gap-2 sm:gap-0">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs sm:text-sm">
                  Published on{" "}
                  {new Date(currentBlog.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
              {currentBlog.updated_at !== currentBlog.created_at && (
                <span className="text-xs sm:text-sm sm:ml-4">
                  (Updated{" "}
                  {new Date(currentBlog.updated_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                  )
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap text-left">
                {currentBlog.content}
              </p>
            </div>
          </div>

          {/* Action Buttons (Only for Owner) */}
          {isOwner && (
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4">
                <Link
                  to={`/blogs/${currentBlog.id}/edit`}
                  className="w-full sm:w-auto text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 transform hover:scale-105 text-sm sm:text-base"
                >
                  Edit Blog
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isDeleting ? (
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
                      Deleting...
                    </span>
                  ) : (
                    "Delete Blog"
                  )}
                </button>
              </div>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
}
