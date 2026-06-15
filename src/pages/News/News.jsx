import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import AppBarComponent from '../../Components/AppBar/AppBar';
import Footer from '../../Components/Footer/Footer';
import ChatAI from '../../Components/ChatAI/ChatAI';
import { fetchAllNewsAPI } from '../../apis';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Trạng thái cho từ khóa tìm kiếm
  const [filteredPosts, setFilteredPosts] = useState([]); // Trạng thái cho các bài viết đã lọc

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetchAllNewsAPI();
        setPosts(response || []);
        setFilteredPosts(response || []); // Khởi tạo filteredPosts với tất cả bài viết
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setPosts([]);
        setFilteredPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = () => {
    const filtered = posts.filter(post => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchTermLower) || 
        post.description.toLowerCase().includes(searchTermLower) ||
        post.id.toString().includes(searchTermLower) // Tìm kiếm theo ID (nếu cần)
      );
    });
    setFilteredPosts(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Gọi hàm tìm kiếm khi nhấn phím Enter
    }
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  return (
    <>
      <AppBarComponent />
      <div style={styles.container}>
        <div style={styles.mainContent}>
          {filteredPosts.map((post, index) => (
            <div key={index} style={styles.post}>
              <img src={post.image} alt={post.title} style={styles.postImage} />
              <div style={styles.postInfo}>
                <h2 style={styles.postTitle}>{post.title}</h2>
                <p style={styles.postDate}>{post.date}</p>
                <p style={styles.postDescription}>
                  {truncateDescription(post.description, 90)}
                </p>
                {/* Use Link for navigation */}
                <Link to={`/news/${post.id}`} style={styles.readMore}>
                  Đọc tiếp
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.sidebar}>
          <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            style={styles.searchInput}
            value={searchTerm} // Liên kết giá trị với trạng thái
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật trạng thái khi người dùng nhập
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); // Gọi hàm tìm kiếm khi nhấn phím Enter
              }
            }} // Thêm sự kiện nhấn phím
          />
          <button style={styles.searchButton} onClick={handleSearch}>🔍</button> {/* Gọi hàm tìm kiếm khi nhấn nút */}
          </div>
          <div style={styles.widget}>
            <h3 style={styles.widgetTitle}>BÀI VIẾT MỚI</h3>
            <ul style={styles.widgetList}>
              {posts.map((post, index) => (
                <li key={index} style={styles.widgetItem}>
                  <img
                    src={post.image}
                    alt={post.title}
                    style={styles.widgetImage}
                  />
                  <div>
                    {/* Use Link for navigation */}
                    <Link to={`/news/${post.id}`} style={styles.widgetLink}>
                      {post.title}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
      <ChatAI />
      <Footer />
    </>
  );
};

const tags = [
  'Công dụng khoai tây',
  'Măng tây',
  'Salad dưa chuột',
  'Sức khỏe',
  'Tác dụng ớt chuông',
];

const styles = {
  container: {
    display: 'flex',
    padding: '20px',
  },
  mainContent: {
    flex: 2,
    marginRight: '20px',
  },
  post: {
    display: 'flex',
    marginBottom: '20px',
  },
  postImage: {
    width: '350px',
    height: '200px',
    marginRight: '20px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  postInfo: {
    flex: 1,
  },
  postTitle: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  postDate: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#888',
  },
  postDescription: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#555',
  },
  readMore: {
    color: 'FFC1C1',
    textDecoration: 'none',
  },
  sidebar: {
    flex: 1,
  },
  searchBox: {
    display: 'flex',
    marginBottom: '20px',
    width: '300px',
    marginLeft: '150px',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px',
    outline: 'none',
    backgroundColor: '#f5f6fa',
    color: '#2f3640',
  },
  searchButton: {
    padding: '10px 20px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '0 4px 4px 0',
    backgroundColor: 'FFC1C1',
    color: 'white',
    cursor: 'pointer',
    outline: 'none',
  },
  widget: {
    borderRadius: '8px',
    border: ' 1px solid #7f8fa6',
    marginBottom: '20px',
    width: '300px',
    marginLeft: '150px',
  },
  widgetTitle: {
    backgroundColor: '#FFC1C1',
    margin: '0 0 10px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '10px',
  },
  widgetList: {
    listStyle: 'none',
    padding: '0',
  },
  widgetItem: {
    display: 'flex',
    marginBottom: '10px',
  },
  widgetImage: {
    width: '80px',
    height: '80px',
    marginRight: '10px',
    objectFit: 'cover',
    marginLeft: '10px',
    borderRadius: '5px',
  },
  widgetLink: {
    color: '#000',
    textDecoration: 'none',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '10px',
  },
  tag: {
    margin: '0 10px 10px 0',
    padding: '5px 10px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    border: ' 1px solid #FFC1C1',
    color: '#2f3640',
  },
};

export default BlogPage;
