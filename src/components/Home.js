import Header from './Header';
import SuddenLogo from './SuddenLogo';
import WineSlider from './WineSlider';
import Info from './Info';
import Wheretobuy from './wheretobuy';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Home = () => {

  return (
    <>
      <Header />
      <SuddenLogo />
      <Info />
      <div className='find-your-wine'>
        <Link to="/find-your-wine" style={{color: 'white', textAlign: 'center'}}>მოძებნე შენი ღვინო</Link>
        <Link to="/find-your-wine"><FontAwesomeIcon icon={faSearch} style={{paddingTop: '5px', paddingLeft: '10px', color: 'white'}}/></Link>
      </div>
      <WineSlider />
      <Wheretobuy />
    </>
  );
};
export default Home;
