import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';


function Wheretobuy() {
    const [activeBox, setActiveBox] = useState(1);

    const handleSlide = (direction) => {
        console.log('Direction:', direction);
        if (direction === 'next') {
            setActiveBox((prev) => (prev === 4 ? 1 : prev + 1));
        } else {
            setActiveBox((prev) => (prev === 1 ? 4 : prev - 1));
        }
        console.log('Active Box:', activeBox);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleSlide('next'); // Automatically slide to the next one
        }, 3000); // Change slide every 3 seconds (adjust as needed)
    
        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [activeBox]); // Added activeBox to the dependencies array
    

    return (
        <div className='where-to-buy-content'>
            <h2 className='buy-title'>სად შეძლებთ შეიძინოთ ჩვენი ღვინო?</h2>
            <div className='where-to-buy'>
                <div className='div-1'>
                    <div className={`buy-box buy-box-1 ${activeBox === 1 ? 'active' : ''}`}>
                        <p className='byu-box-1-text'>
                            8000 მოსავალი, მისამართი: ს. წინანდალის ქუჩა ნომერი 26, თბილისი.
                        </p>
                    </div>
                    <div className={`buy-box buy-box-2 ${activeBox === 2 ? 'active' : ''}`}>
                        <p className='byu-box-1-text'>
                            ღვინის კოშკი, მისამართი: შარდენის ქუჩა ნომერი 1, თბილისი.
                        </p>
                    </div>
                    <div className={`buy-box buy-box-3 ${activeBox === 3 ? 'active' : ''}`}>
                        <p className='byu-box-1-text'>
                            ჭაჭატური, მისამართი: მეტეხის აღმართი ნომერი 3, თბილისი.
                        </p>
                    </div>
                    <div className={`buy-box buy-box-4 ${activeBox === 4 ? 'active' : ''}`}>
                        <p className='byu-box-1-text'>
                            მეიდან ბაზარი, მისამართი: გორგასალის ქუჩა ნომერი 1, თბილისი.
                        </p>
                    </div>
                </div>
            </div>
            <div className='navigation-buttons'>
                <button onClick={() => handleSlide('prev')}><FontAwesomeIcon icon={faChevronLeft} size='2xl'/></button>
                <button onClick={() => handleSlide('next')}><FontAwesomeIcon icon={faChevronRight} size='2xl' /></button>
            </div>
        </div>
    );
}

export default Wheretobuy;
