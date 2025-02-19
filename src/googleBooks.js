/**
 * Google Books API Search Module
 * A module for searching books using Google Books API
 */

// Base URL for Google Books API
const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Main search function for Google Books API
 * @param {Object} params - Search parameters
 * @param {string} params.query - Main search query
 * @param {string} [params.field] - Specific field to search in (title, author, publisher, subject, isbn)
 * @param {number} [params.maxResults=10] - Maximum number of results (max 40)
 * @param {number} [params.startIndex=0] - Start index for pagination
 * @param {string} [params.orderBy='relevance'] - Order by 'relevance' or 'newest'
 * @param {string} [params.printType='all'] - Filter by 'all', 'books', or 'magazines'
 * @param {string} [params.projection='lite'] - Projection 'full' or 'lite'
 * @param {string} [params.apiKey] - Your Google API key (optional)
 * @returns {Promise<Object>} - Promise resolving to search results
 */
async function searchBooks({
  query,
  field,
  maxResults = 10,
  startIndex = 0,
  orderBy = 'relevance',
  printType = 'all',
  projection = 'lite',
  apiKey
}) {
  // Construct the query string based on field if provided
  let queryString = query;
  if (field) {
    queryString = `${field}:${query}`;
  }

  // Build URL with search parameters also append api key
  let url = `${API_BASE_URL}?q=${encodeURIComponent(queryString)}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`;
  
  // Add optional parameters
  url += `&maxResults=${maxResults}`;
  url += `&startIndex=${startIndex}`;
  url += `&orderBy=${orderBy}`;
  url += `&printType=${printType}`;
  url += `&projection=${projection}`;
  
  // Add API key if provided
  if (apiKey) {
    url += `&key=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

/**
 * Search books by title
 * @param {string} title - Book title to search for
 * @param {Object} options - Additional search options
 * @returns {Promise<Object>} - Promise resolving to search results
 */
function searchByTitle(title, options = {}) {
  return searchBooks({ ...options, query: title, field: 'intitle' });
}

/**
 * Search books by author
 * @param {string} author - Author name to search for
 * @param {Object} options - Additional search options
 * @returns {Promise<Object>} - Promise resolving to search results
 */
function searchByAuthor(author, options = {}) {
  return searchBooks({ ...options, query: author, field: 'inauthor' });
}

/**
 * Search books by publisher
 * @param {string} publisher - Publisher name to search for
 * @param {Object} options - Additional search options
 * @returns {Promise<Object>} - Promise resolving to search results
 */
function searchByPublisher(publisher, options = {}) {
  return searchBooks({ ...options, query: publisher, field: 'inpublisher' });
}

/**
 * Search books by subject/category
 * @param {string} subject - Subject/category to search for
 * @param {Object} options - Additional search options
 * @returns {Promise<Object>} - Promise resolving to search results
 */
function searchBySubject(subject, options = {}) {
  return searchBooks({ ...options, query: subject, field: 'subject' });
}

/**
 * Search books by ISBN
 * @param {string} isbn - ISBN number to search for
 * @param {Object} options - Additional search options
 * @returns {Promise<Object>} - Promise resolving to search results
 */
function searchByISBN(isbn, options = {}) {
  return searchBooks({ ...options, query: isbn, field: 'isbn' });
}

/**
 * Get a specific book by its ID
 * @param {string} bookId - Google Books volume ID
 * @param {string} [apiKey] - Your Google API key (optional)
 * @returns {Promise<Object>} - Promise resolving to book details
 */
async function getBookById(bookId, apiKey) {
  let url = `${API_BASE_URL}/${bookId}`;
  
  if (apiKey) {
    url += `?key=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
}

/**
 * Search for new releases
 * @param {Object} options - Additional search options
 * @returns {Promise<Object>} - Promise resolving to search results
 */
function getNewReleases(options = {}) {
  return searchBooks({
    ...options,
    query: '',
    orderBy: 'newest'
  });
}

/**
 * Search for free ebooks
 * @param {string} query - Search query
 * @param {Object} options - Additional search options
 * @returns {Promise<Object>} - Promise resolving to search results
 */
function searchFreeEbooks(query, options = {}) {
  const url = `${API_BASE_URL}?q=${encodeURIComponent(query)}&filter=free-ebooks`;
  return searchBooks({
    ...options,
    query
  });
}

/**
 * Extract and format book information from API response
 * @param {Object} book - Book volume from API response
 * @returns {Object} - Formatted book information
 */
function formatBookInfo(book) {
  const { volumeInfo, saleInfo, accessInfo, id } = book;
  
  return {
    id,
    title: volumeInfo.title,
    subtitle: volumeInfo.subtitle || null,
    authors: volumeInfo.authors || [],
    publisher: volumeInfo.publisher || null,
    publishedDate: volumeInfo.publishedDate || null,
    description: volumeInfo.description || null,
    pageCount: volumeInfo.pageCount || null,
    categories: volumeInfo.categories || [],
    averageRating: volumeInfo.averageRating || null,
    ratingsCount: volumeInfo.ratingsCount || null,
    thumbnail: volumeInfo.imageLinks?.thumbnail || null,
    language: volumeInfo.language || null,
    previewLink: volumeInfo.previewLink || null,
    infoLink: volumeInfo.infoLink || null,
    canonicalVolumeLink: volumeInfo.canonicalVolumeLink || null,
    saleInfo: {
      isEbook: saleInfo?.isEbook || false,
      saleability: saleInfo?.saleability || null,
      listPrice: saleInfo?.listPrice || null,
      retailPrice: saleInfo?.retailPrice || null,
      buyLink: saleInfo?.buyLink || null
    },
    accessInfo: {
      webReaderLink: accessInfo?.webReaderLink || null,
      accessViewStatus: accessInfo?.accessViewStatus || null,
      isAvailableForDownload: accessInfo?.epub?.isAvailable || false,
      isPdfAvailable: accessInfo?.pdf?.isAvailable || false
    }
  };
}

/**
 * Format search results to extract relevant information
 * @param {Object} searchResult - Full search result from Google Books API
 * @returns {Object} - Formatted search results
 */
function formatSearchResults(searchResult) {
  if (!searchResult.items) {
    return {
      totalItems: 0,
      books: []
    };
  }
  
  return {
    totalItems: searchResult.totalItems || 0,
    books: searchResult.items.map(formatBookInfo)
  };
}

export {
  searchBooks,
  searchByTitle,
  searchByAuthor,
  searchByPublisher,
  searchBySubject,
  searchByISBN,
  getBookById,
  getNewReleases,
  searchFreeEbooks,
  formatBookInfo,
  formatSearchResults
};