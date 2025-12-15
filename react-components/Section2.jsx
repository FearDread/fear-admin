import React from 'react';

function Section2() {
  return (
    <section className="py-4">
      <div className="container">
        <h3 className="d-none">Google Map</h3>
        <div className="contact-map p-3 bg-dark-1 rounded-0 shadow-none">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d805184.6319269302!2d144.49269200596396!3d-37.971237009163936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad646b5d2ba4df7%3A0x4045675218ccd90!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sin!4v1618835176130!5m2!1sen!2sin" className="w-100" height="450" style={{'border':0}} allowfullscreen="" loading="lazy"></iframe>
        </div>
      </div>
    </section>
  );
}

export default Section2;
