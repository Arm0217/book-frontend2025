import './App.css';
import { useState, useEffect } from 'react';
function App() {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://glorious-yodel-jjq6xxv6g56jf5jx9-5000.app.github.dev/books");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        let fetched = result.books || [];
        // reassign categories: all action or fantasy books except ids 6 & 7 become romance
        fetched = fetched.map(bk => {
          const id = bk.id;
          const cat = (bk.category || bk.genre || '').toLowerCase();
          if ((cat === 'action' || cat === 'fantasy') && id !== 6 && id !== 7) {
            return { ...bk, category: 'romance' };
          }
          return bk;
        });
        setBooks(fetched);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, []);

  // derive the books to display based on the selected category
  const filteredBooks = (() => {
    if (!selectedCategory) return books;

    // predefined id sets per requirement
    const actionFantasyIds = new Set([1, 2, 3, 4, 5, 8]);
    const romanceIds = new Set([6, 7]);

    switch (selectedCategory) {
      case 'action':
      case 'fantasy':
        return books.filter(b => actionFantasyIds.has(b.id));
      case 'romance':
        return books.filter(b => romanceIds.has(b.id));
      default:
        // fallback to original behavior if new categories are added
        const cat = (b => (b.category || b.genre || '').toLowerCase());
        return books.filter(b => cat(b) === selectedCategory);
    }
  })();

  const bookList = filteredBooks.map((b, idx) => (
    <article className="book-card" key={b.id ?? idx}>
      <div className="book-image">
        <img src={b.image_url} alt={b.title} />
      </div>
      <div className="book-info">
        <h3 className="book-title">{b.title}</h3>
        <p className="book-author">{b.author}</p>
        {b.price ? <p className="book-price">${b.price}</p> : null}
      </div>
    </article>
  ));

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-top">
          <h1>Anime Ebook</h1>
        </div>
        <div className="header-bottom">
          <nav className="categories">
            {/* category buttons trigger filtering via state */}
            <button
              type="button"
              className={selectedCategory === 'action' ? 'active' : ''}
              onClick={() => setSelectedCategory('action')}
            >
              Action
            </button>
            <button
              type="button"
              className={selectedCategory === 'romance' ? 'active' : ''}
              onClick={() => setSelectedCategory('romance')}
            >
              Romance
            </button>
            <button
              type="button"
              className={selectedCategory === 'mystery' ? 'active' : ''}
              onClick={() => setSelectedCategory('mystery')}
            >
              Mystery
            </button>
            <button
              type="button"
              className={selectedCategory === 'fantasy' ? 'active' : ''}
              onClick={() => setSelectedCategory('fantasy')}
            >
              Fantasy
            </button>
            <button
              type="button"
              className={selectedCategory === 'slice-of-life' ? 'active' : ''}
              onClick={() => setSelectedCategory('slice-of-life')}
            >
              Slice of Life
            </button>
            {selectedCategory && (
              <button
                type="button"
                className="clear-category"
                onClick={() => setSelectedCategory('')}
              >
                All
              </button>
            )}
          </nav>
          <div className="search-box">
            <input type="text" placeholder="Search books..." />
            <button>🔍</button>
          </div>
        </div>
      </header>

      <main>
        <section className="book-grid">
          {bookList}
        </section>
      </main>

      <footer className="App-footer">
        <p>&copy; 2026 Anime Ebook. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
