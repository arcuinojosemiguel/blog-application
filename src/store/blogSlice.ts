import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase";
import type { BlogState, Blog } from "../types";

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
};

const BLOGS_PER_PAGE = 10;

// Fetch blogs with pagination
export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const from = (page - 1) * BLOGS_PER_PAGE;
      const to = from + BLOGS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("blogs")
        .select("*", { count: "exact" })
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        blogs: data as Blog[],
        totalCount: count || 0,
        currentPage: page,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create blog
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (
    { title, content }: { title: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("blogs")
        .insert([
          {
            title,
            content,
            author_id: user.id,
            status: "active",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data as Blog;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async (
    { id, title, content }: { id: string; title: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data as Blog;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete blog (soft delete - updates status to 'deleted')
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("blogs")
        .update({ status: "deleted", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch single blog
export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlogById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .eq("status", "active")
        .single();

      if (error) throw error;

      return data as Blog;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create blog
    builder
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update blog
    builder
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.loading = false;
        const index = state.blogs.findIndex(
          (blog) => blog.id === action.payload.id
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        state.currentBlog = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete blog
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch blog by ID
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBlogById.fulfilled,
        (state, action: PayloadAction<Blog>) => {
          state.loading = false;
          state.currentBlog = action.payload;
        }
      )
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
