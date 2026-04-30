const KEY = "ddteach_bookmarks";

// 📥 GET
export const getBookmarks = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

// ➕ ADD
export const addBookmark = (item) => {
  const bookmarks = getBookmarks();

  const exists = bookmarks.find((b) => b.id === item.id);
  if (exists) return;

  bookmarks.push(item);
  localStorage.setItem(KEY, JSON.stringify(bookmarks));
};

// ❌ REMOVE
export const removeBookmark = (id) => {
  const bookmarks = getBookmarks().filter((b) => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(bookmarks));
};

// 🧹 CLEAR
export const clearBookmarks = () => {
  localStorage.removeItem(KEY);
};