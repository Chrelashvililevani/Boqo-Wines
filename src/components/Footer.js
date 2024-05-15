// Define the Footer component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';



const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-contact">
          <div className='contact-text-content'>
            <h2>კონტაქტი</h2>
            <p>მისამართი: ბოდბისხევი, სიღნაღის რაიონი, საქართველო, 4200</p>
            <p>მობილური: 597 75 88 18</p>
            <p>ელექტრონული ფოსტა: boqo.boqola@gmail.com</p>
            <FontAwesomeIcon icon={faFacebook} size="2x"/>
            {' '}
            <FontAwesomeIcon icon={faInstagram} size="2x"/>
          </div>
        </div>
        <div className="footer-inst-fb"></div>
      </div>
    </footer>
  );
}
export default Footer;
