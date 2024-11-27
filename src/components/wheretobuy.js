import React, { useState, useEffect } from 'react';


const slides = [
    {
        imageUrl: '/images/8000vintages.jpg',
        text: '8000 მოსავალი, მისამართი: ს. წინანდალის ქუჩა ნომერი 26, თბილისი.'
    },
    {
        imageUrl: '/images/meidan.jpg',
        text: 'ღვინის კოშკი, მისამართი: შარდენის ქუჩა ნომერი 1, თბილისი.'
    },
    {
        imageUrl: '/images/8000vintages.jpg',
        text: 'ჭაჭატური, მისამართი: მეტეხის აღმართი ნომერი 3, თბილისი.'
    },
    {
        imageUrl: '/images/meidan.jpg',
        text: 'მეიდან ბაზარი, მისამართი: გორგასალის ქუჩა ნომერი 1, თბილისი.'
    }
];

function Wheretobuy() {
    const [activeSlide, setActiveSlide] = useState(0);

    const handleSlide = (direction) => {
        if (direction === 'next') {
            setActiveSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
        } else {
            setActiveSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleSlide('next'); // Automatically slide to the next one
        }, 3000); // Change slide every 3 seconds (adjust as needed)
    
        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [activeSlide]);

    return (
        <div className='where-to-buy-content'>
            <div className='where-to-buy'>
                <div style={{ position: 'relative', width: '100%', height: '40vw', minHeight: '300px' }}>
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`buy-box ${activeSlide === index ? 'active' : ''}`}
                            style={{
                                backgroundImage: `url('${slide.imageUrl}')`, // No need for !important here
                            }}
                            >
                            <p className="byu-box-1-text">შეიძინეთ ღვინო</p>
                            <p className="byu-box-1-text">{slide.text}</p>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Wheretobuy;
