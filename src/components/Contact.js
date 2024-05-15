import React from 'react';

function AboutUs() {
    return (
        <div className='contact-content'>
            <div className='header-contact'></div>
                <div className='contact-content-inside'>
                    <div className='contact-image-content'>
                        <img className='contact-image' src='./images/map.jpg' />
                    </div>
                    <div className='contact-text-content'>
                        <h2>კონტაქტი</h2>
                        <p>მისამართი: ბოდბისხები, სიღნაღის რაიონი, საქართველო, 4200</p>
                        <p>მობილური: 597 75 88 18</p>
                        <p>ელექტრონული ფოსტა: boqo.boqola@gmail.com</p>
                    </div>
                </div>
        </div>
    )
}

export default AboutUs;
