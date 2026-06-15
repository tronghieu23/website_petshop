import React from 'react';

const brandImages = [
  'https://res.cloudinary.com/dvvshh1iv/image/upload/v1743351630/Royal-Canin-Logo_wopyuh.png',
  'https://res.cloudinary.com/dvvshh1iv/image/upload/v1743351985/Smart_Heart_CMYK_na685l.png',
  'https://res.cloudinary.com/dvvshh1iv/image/upload/v1743352139/whiskas_p5u58l.png',
  'https://res.cloudinary.com/dvvshh1iv/image/upload/v1743352216/Me-O-e1628584648517_bwk6us.png',
  'https://res.cloudinary.com/dvvshh1iv/image/upload/v1743352287/nekkologo_ppyqmq.png',
  'https://res.cloudinary.com/dvvshh1iv/image/upload/v1743352351/ganadorlogo_q5iqjc.png '
];

const PartnerLogos = () => {
  return (
    <div style={styles.container}>
      <h3 style={{...styles.heading, textAlign: 'left', fontSize: '30px'}}>Đối tác của chúng tôi</h3>
      <div style={styles.logoContainer}>
        {brandImages.map((src, index) => (
          <img key={index} src={src} alt={`Brand ${index + 1}`} style={{...styles.logo, height: '60px', imageRendering: 'pixelated'}} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 50px',
    backgroundColor: '#f7f7f7',
    margin: '0 auto',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  heading: {
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center', // Chỉnh thành căn giữa
    alignItems: 'center', 
    width: '100%',
    maxWidth: '1000px',
    flexWrap: 'wrap',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  logo: {
    margin: '10px',
    objectFit: 'contain',
    borderRadius: '8px',
    flexShrink: 0
  }
};

export default PartnerLogos;
