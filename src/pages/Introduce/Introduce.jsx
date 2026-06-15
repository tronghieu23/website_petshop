/* eslint-disable no-unused-vars */
import React from 'react';
import AppBarComponent from '../../Components/AppBar/AppBar';
import Footer from '../../Components/Footer/Footer';
import AboutStore from './About/AboutStore';
import AboutText from './About/AboutText';
import AboutLabel from './About/AboutLabel';
import ChatAI from '../../Components/ChatAI/ChatAI';

const Introduce = () => {
  return (
    <>
    <AppBarComponent/>
    <div style={styles.container}>
      <section style={styles.section}>
        <img src="/src/img/banner.png" alt="Chất lượng và an toàn cho thú cưng" style={styles.image} />
        <div style={styles.textBlock}>
          <h2 style={styles.title}>PETSHOP FOOD</h2>
          <h3 style={styles.subtitle}>Chất lượng và an toàn cho thú cưng</h3>
          <p style={styles.paragraph}>
          Thức ăn và đồ dùng cho thú cưng ngày càng được quan tâm, đặc biệt là các sản phẩm hữu cơ và tự nhiên. Tại nhiều quốc gia phát triển, xu hướng sử dụng thức ăn hữu cơ cho thú cưng đang trở nên phổ biến. Các chuyên gia chăm sóc thú cưng cho rằng đã có những thay đổi lớn trong thói quen nuôi dưỡng vật nuôi, khi ngày càng nhiều chủ nuôi ưu tiên sản phẩm sạch, không chứa hóa chất và phụ gia nhân tạo. Trước đây, thức ăn hữu cơ cho thú cưng chỉ có ở một số cửa hàng chuyên biệt, nhưng hiện nay đã được bày bán rộng rãi. Ở châu Âu, thực phẩm hữu cơ cho thú cưng được xem là tiêu chuẩn của chế độ ăn lành mạnh, và nhiều trang trại đã áp dụng quy trình sản xuất đạt chuẩn để cung cấp các sản phẩm chất lượng cao cho vật nuôi.
          </p>
        </div>
      </section>
      <div style={styles.containerStyle}>
      <div style={styles.textSectionStyle}>
        <h2 style={styles.heading2Style}>TẦM NHÌN</h2>
        <h1 style={styles.heading1Style}>Tầm nhìn của chúng tôi</h1>
        <p style={styles.paragraphStyle}>
        Hiểu được tầm quan trọng của dinh dưỡng và chất lượng sản phẩm dành cho thú cưng, tôi và những người bạn cùng chung đam mê đã thành lập PetShop Food. Chúng tôi mong muốn mang đến những sản phẩm thức ăn và đồ dùng chất lượng cao, an toàn, có chứng nhận đảm bảo sức khỏe cho thú cưng tại Việt Nam. PetShop Food không ngừng tìm kiếm và hợp tác với các thương hiệu uy tín, phù hợp với nhu cầu chăm sóc vật nuôi cũng như điều kiện kinh tế của người Việt, góp phần nâng cao chất lượng sống cho thú cưng và cộng đồng yêu thú cưng.        </p>
      </div>
      <div style={styles.imageSectionStyle}>
        <img
          src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/about4_banner.jpg?1716945232631"
          alt="Tầm nhìn"
          style={styles.imageStyle}
        />
      </div>
    </div>
    <section style={styles.section}>
        <img src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/about5_banner.jpg?1716945232631" alt="Chất lượng và tươi xanh" style={styles.image} />
        <div style={styles.textBlock}>
          <h2 style={styles.heading2Style}>MỤC TIÊU</h2>
          <h3 style={styles.heading1Style}>Mục tiêu của chúng tôi</h3>
          <p style={styles.paragraph}>
          Thật may mắn, hiện tại chúng tôi đã kết nối và phân phối cho các đối tác lớn ở Tp. Hồ Chí Mình và Hà Nội. Trong tương lai gần, chúng sẽ tôi sẽ đẩy mạnh phân phối sản phẩm về các tỉnh thành khác.
          </p>
        </div>
      </section>
      <AboutStore/>
      <AboutText/>
      <AboutLabel/>
    </div>
    <ChatAI/>
    <Footer/>
    </>
  );
};
        
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    color: '#565656',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '40px',
    width: '100%',
    backgroundColor: 'white',
  },
  image: {
    width: '40%',
    marginRight: '20px',
    marginLeft : '200px',
    borderRadius : '8px'
  },
  textBlock: {
    width: '50%',
  },
  title: {
    color: '#f39c12',
    fontSize: '24px',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#FFC1C1',
    fontSize: '20px',
    marginBottom: '20px',
  },
  paragraph: {
    color: '#565656',
  },
 // card 2 
    containerStyle : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px'
      },
    
       textSectionStyle : {
        flex: 1,
        paddingRight: '20px',
        marginLeft : '200px',
      },
    
      heading2Style : {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: 0,
      
      },
    
       heading1Style : {
        fontSize: '30px',
        color: '#FFC1C1',
        margin: '10px 0'
      },
    
       paragraphStyle : {
        fontSize: '16px',
        lineHeight: 1.5,
        marginRight : '50px'
      },
    
      imageSectionStyle : {
        width : '45%',
         borderRadius : '8px',
        paddingRight : '50px'
      },
    
       imageStyle : {
        width: '100%',
        borderRadius: '8px'
      },


}



export default Introduce;
