
import React from 'react';
import { COLLEGE_NAME } from '../constants';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <h1 className="text-4xl md:text-5xl font-bold font-serif text-center mb-6 text-brand-amber">About PEC Arts & Sports</h1>
      <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-8 space-y-6 text-white/80 leading-relaxed mb-16">
        <p>
          Welcome to the official Arts & Sports portal of the {COLLEGE_NAME}. This platform is a celebration of talent, teamwork, and the vibrant spirit that defines our college community. We believe that extracurricular activities are integral to holistic education, fostering creativity, discipline, and sportsmanship among students.
        </p>
        <p>
          Our mission is to provide a seamless and engaging digital experience for all participants. Through this portal, students can discover upcoming events, register for competitions, and track their performance. The house system is at the core of our culture, igniting friendly rivalries and building a strong sense of belonging among students of the Red, Blue, Green, and Yellow houses.
        </p>
        <h2 className="text-2xl font-bold font-serif text-brand-orange pt-4">Our Vision</h2>
        <p>
          We envision a campus where every student has the opportunity to explore their potential beyond academics. The PEC Arts & Sports portal is more than just a registration system; it's a dynamic hub that connects students, administrators, and judges, ensuring a fair, transparent, and exciting competition season every year. From the thrill of the racetrack to the elegance of the stage, we are here to champion every talent.
        </p>
        <p>
          Join us as we celebrate the passion, dedication, and excellence of our students. Let the games begin!
        </p>
      </div>

      <div id="contact" className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-4">Get in Touch</h2>
        <p className="text-center text-white/60 mb-8">Have a question or feedback? Drop us a message.</p>
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-8">
            <form className="space-y-6">
                <Input id="name" name="name" type="text" label="Name" placeholder="Your Name" required />
                <Input id="email" name="email" type="email" label="Email" placeholder="your.email@example.com" required />
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">Message</label>
                    <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    className="w-full bg-white/5 border border-white/20 rounded-md py-2 px-4 text-white placeholder-white/40 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber focus:outline-none transition-colors" 
                    placeholder="Your message..." 
                    required
                    ></textarea>
                </div>
                <div className="text-center pt-2">
                    <Button type="submit">Send Message</Button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;