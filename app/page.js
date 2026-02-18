"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import CategoryFilter from "@/components/CategoryFilter";
import { authService } from "@/lib/auth";
import { bookmarkService } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get("error");
        const message = urlParams.get("message");
        const debug = urlParams.get("debug");
        if (error) {
          setAuthError(message || error);
          if (debug) {
            console.log("Debug info:", decodeURIComponent(debug));
          }
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    const {
      data: { subscription },
    } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    const loadBookmarks = async () => {
      try {
        const userBookmarks = await bookmarkService.getUserBookmarks(user.id);
        setBookmarks(userBookmarks);
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      }
    };

    loadBookmarks();
    const sub = bookmarkService.subscribeToUserBookmarks(user.id, (payload) => {
      console.log("Real-time update:", payload);
      loadBookmarks();
    });

    setSubscription(sub);

    return () => {
      if (sub) sub.unsubscribe();
    };
  }, [user]);

  const addBookmark = async (bookmark) => {
    if (!user) return;

    try {
      const newBookmark = {
        user_id: user.id,
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || "",
        category: bookmark.category || "General",
        created_at: new Date().toISOString(),
      };

      const data = await bookmarkService.addBookmark(newBookmark);
      setBookmarks([data, ...bookmarks]);
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const deleteBookmark = async (id) => {
    if (!user) return;

    try {
      await bookmarkService.deleteBookmark(id);
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const updateBookmark = async (id, updatedData) => {
    if (!user) return;

    try {
      const data = await bookmarkService.updateBookmark(id, updatedData);
      setBookmarks(bookmarks.map((b) => (b.id === id ? data : b)));
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesCategory =
      selectedCategory === "all" || bookmark.category === selectedCategory;
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bookmark.description &&
        bookmark.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["all", ...new Set(bookmarks.map((b) => b.category))];
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <Header onSearch={setSearchQuery} user={user} onAuthChange={setUser} />
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
          <div
            style={{
              textAlign: "center",
              padding: "2rem 1rem",
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1f2937",
                marginBottom: "1rem",
              }}
            >
              Welcome to Smart Bookmarks
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#6b7280",
                marginBottom: "2rem",
              }}
            >
              Please sign in with Google to manage your bookmarks
            </p>
            {authError && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.375rem",
                  padding: "0.75rem",
                  marginBottom: "1rem",
                  color: "#dc2626",
                }}
              >
                Authentication error: {authError}
              </div>
            )}
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              Your bookmarks are private and only visible to you
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Header onSearch={setSearchQuery} user={user} onAuthChange={setUser} />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
          }}
        >
          <aside style={{ display: "grid", gap: "1.5rem" }}>
            <BookmarkForm onAdd={addBookmark} />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </aside>
          <section>
            <div style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                Your Bookmarks
              </h2>
              <p style={{ color: "#6b7280" }}>
                {filteredBookmarks.length} bookmark
                {filteredBookmarks.length !== 1 ? "s" : ""}
              </p>
            </div>

            {filteredBookmarks.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem 1rem",
                  backgroundColor: "#ffffff",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                }}
              >
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                  No bookmarks found. Start by adding one!
                </p>
              </div>
            ) : (
              <BookmarkList
                bookmarks={filteredBookmarks}
                onDelete={deleteBookmark}
                onUpdate={updateBookmark}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
