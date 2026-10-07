CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT DEFAULT '',
  language TEXT DEFAULT 'bn',
  format TEXT NOT NULL,
  total_pages INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  page_no INTEGER NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_pages_book_page ON pages(book_id, page_no);
CREATE VIRTUAL TABLE IF NOT EXISTS pages_fts USING fts5(id UNINDEXED, book_id UNINDEXED, page_no UNINDEXED, content);
