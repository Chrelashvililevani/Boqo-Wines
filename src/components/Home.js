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
      <WineSlider />
      <Wheretobuy />
    </>
  );
};
export default Home;
