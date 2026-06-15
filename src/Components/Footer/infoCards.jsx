import React from 'react';

const infoCards = [
  {
    icon: 'https://res.cloudinary.com/dvvshh1iv/image/upload/v1743268396/freeshipicon_rfglok.png',
    title: 'Vận chuyển miễn phí',
    description: 'Hóa đơn trên 5 triệu'
  },
  {
    icon: "https://res.cloudinary.com/dvvshh1iv/image/upload/v1743268976/exchangeicon_lk4qr6.png", 
    title: 'Đổi trả miễn phí',
    description: 'Trong vòng 7 ngày'
  },
  {
    icon: "https://res.cloudinary.com/dvvshh1iv/image/upload/v1743269149/refundicon_g4zgd4.png",
    title: '100% Hoàn tiền',
    description: 'Nếu sản phẩm lỗi'
  },
  {
    icon: "https://res.cloudinary.com/dvvshh1iv/image/upload/v1743269438/supporticon_wpgxwg.png",
    title: 'Hotline: 1900 6750',
    description: 'Hỗ trợ 24/7'
  }
];

const InfoCards = () => {
  return (
    <div style={styles.container}>
      {infoCards.map((card, index) => (
        <div key={index} style={styles.card}>
          <img src={card.icon} alt={card.title} style={{...styles.icon, width: '80px', height: '80px'}} />
          <div style={styles.textContainer}>
            <h4 style={styles.title}>{card.title}</h4>
            <p style={styles.description}>{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    margin: '0 auto',
    boxSizing: 'border-box',
    overflow: 'hidden',
    marginTop: '5px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f1f2f6',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '10px',
    minWidth: '250px',
    textAlign: 'center'
  },
  icon: {
    marginBottom: '10px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '2px solid #FFC1C1'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color : '#FFC1C1',
    fontSize: '16px'
  },
  description: {
    color: '#666666',
    fontSize: '14px'
  }
};

export default InfoCards;
