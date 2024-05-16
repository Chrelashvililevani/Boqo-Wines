import Header from './Header';
import SuddenLogo from './SuddenLogo';
import WineSlider from './WineSlider';
import Info from './Info';
import Wheretobuy from './wheretobuy';
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <>
      <Header />
      <SuddenLogo />
      <Info />
      <div className='find-your-wine'>
        <Link to="/find-your-wine" style={{color: 'white', textAlign: 'center'}}>მოძებნე შენი ღვინო</Link>
      </div>
      <WineSlider />
      <Wheretobuy />
    </>
  );
};
export default Home;
