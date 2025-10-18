import { useState , useEffect , useRef } from 'react';
import {Link} from "react-router-dom";
import logo from '../../../assets/logo.svg';
import TeacherClass from "../../../assets/TeacherClass.png"
import ClassRoomCreate from "../../../assets/ClassroomCreate.png"
import AiChatbox from "../../../assets/AiChatBox.png"
import TeacherAnalysis from '../../../assets/TeacherAnalytics.png';
import Youtube from "./youtube-videos/Youtube"
import Footer from "./footer/Footer"
import Header from './header/Navbar';
const featureImages = [
  TeacherClass, 
  ClassRoomCreate, 
  AiChatbox, 
  TeacherAnalysis, 
];

const features = [
  "Support differentiated instruction with the help of AI",
  "Help students build independent reading skills",
  "Reinforce concepts with self-paced learning",
  "Enhance lessons with popular integrations"
];

const featureDescriptions = [
  "Easily find, add, use and grade content with add-ons from popular EdTech tools, right within Classroom.",
  "Easily find, add, use and grade content with add-ons from popular EdTech tools, right within Classroom.",
  "Easily find, add, use and grade content with add-ons from popular EdTech tools, right within Classroom.",
  "Easily find, add, use and grade content with add-ons from popular EdTech tools, right within Classroom."
];
function LandingPage() {
   const [activeIdx, setActiveIdx] = useState(0);
  const highlightRef = useRef<HTMLLIElement>(null);
  const [,setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (highlightRef.current) {
      observer.observe(highlightRef.current);
    }
    return () => observer.disconnect();
  }, []);


  return (
    <div className="font-sans bg-white min-h-screen flex flex-col">
    <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-b from-white to-blue-50 mt-22"
        style={{ paddingTop: 80 }}>
        <div className="flex flex-col items-center space-y-4 max-w-5xl w-full">
          {/* Unique logo section */}
          <span className="mb-2 flex items-center gap-2">
            <img className="w-10 h-10" src={logo} alt="Logo" />
            <h1 className="text-2xl font-medium tracking-tight text-gray-700">Classroom</h1>
          </span>
          <h1 className="text-6xl font-bold text-gray-900 leading-tight w-full whitespace-pre-line">
            Where teaching and learning{'\n'}come together
          </h1>
          <p className="text-lg max-w-3xl text-gray-600 mt-3 mx-auto">
            Empower educators and students with engaging, personalized learning experiences. Easily manage classes, share resources, and track progress—all in one platform.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link to="/contacts">
            <button className="px-7 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition">
              Contact Us
            </button>
            </Link>
            <Link to="/login">
            <button className="px-7 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-full shadow hover:bg-blue-100 transition">
              Sign In to Classroom
            </button>
            </Link>
          </div>
        </div>
      </main>
      
      <div className="py-18">
       <h1 className="text-5xl font-bold text-gray-900 mt-6 w-full mx-auto text-center">
            Where teaching and learning{'\n'}come together
        </h1>
          <p className="text-lg max-w-4xl mx-auto text-gray-600 mt-6 text-center">
            Empower educators and students with engaging, personalized learning experiences. Easily manage classes, share resources, and track progress—all in one platform.
          </p>
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-16 justify-center items-stretch">
          {/* Educators Card */}
          <div className="bg-gray-50 rounded-3xl shadow-md flex-1 flex flex-col items-center pb-8 overflow-hidden">
            {/* Stylized framed image area */}
            <div className="w-full bg-gradient-to-br from-blue-100 to-blue-200 p-6 pb-0 rounded-t-3xl flex justify-center overflow-hidden">
              <div className="rounded-t-2xl overflow-hidden border border-blue-100 w-[410px] h-[235px] bg-white shadow">
                {/* Replace src with the actual illustrative image exported from your screenshot or use a similar SVG/mock */}
                <img
                  src={ClassRoomCreate}
                  alt="Outline a lesson plan"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center px-8 mt-6">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4 text-center">AI tools built for educators</h3>
              <p className="text-lg text-gray-600 mb-8 text-center">
                Plan lessons, personalize learning, and tackle everyday tasks faster with help from Gemini, your AI assistant for education.
              </p>
              <Link
                to="/login"
                className="flex items-center text-blue-700 font-semibold hover:underline space-x-1 text-lg"
              >
                <span>Try now</span>
                <svg className="w-5 h-5 text-blue-600 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
          {/* Students Card */}
          <div className="bg-gray-50 rounded-3xl shadow-md flex-1 flex flex-col items-center pb-8 overflow-hidden">
            {/* Framed image */}
            <div className="w-full bg-gradient-to-br from-blue-100 to-blue-200 p-6 pb-0 rounded-t-3xl flex justify-center relative overflow-hidden">
              <div className="rounded-t-2xl overflow-hidden border border-blue-100 w-[410px] h-[235px] bg-white shadow">
                <img
                  src={TeacherClass}
                  alt="Class learning tools"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center px-8 mt-6">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
                Teacher-led AI experiences for students
              </h3>
              <p className="text-lg text-gray-600 mb-8 text-center">
                Enable interactive learning tools using
                <a href="#" className="text-blue-700 underline mx-1">NotebookLM</a>
                and
                <a href="#" className="text-blue-700 underline mx-1">Gems</a>
                , grounded on class materials.
              </p>
              <Link
                to="/login"
                className="flex items-center text-blue-700 font-semibold hover:underline space-x-1 text-lg"
              >
                <span>Learn more</span>
                <svg className="w-5 h-5 text-blue-600 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
      
      <div>
      <h2 className="text-4xl font-bold mb-3 text-center">
          Enrich and personalize learning
        </h2>
        <p className="text-lg text-gray-600 mb-6 text-center">
          Drive student agency with tools that meet students where they are – and build skills for their future.
        </p>
      <section className="max-w-6xl mx-auto py-16 px-6 flex flex-col md:flex-row items-center gap-12">
      {/* Left: Features */}
      <div className="flex-1 min-w-[300px]">
        <ul className="space-y-6 max-w-xl">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className={`group relative flex cursor-pointer transition-all`}
              onClick={() => setActiveIdx(idx)}
            >
              <span
                className={`
                  absolute left-0 top-0 h-full w-1 rounded transition-all duration-500
                  ${activeIdx === idx ? 'bg-green-600 scale-y-100' : 'bg-gray-200 scale-y-0'}
                  ${activeIdx === idx ? 'origin-top' : 'origin-bottom'}
                `}
                style={{
                  background: activeIdx === idx ? '#34a853' : '#e5e7eb', // Google green or gray
                  transitionProperty: 'transform, background'
                }}
              />
              <div className={`pl-6 text-lg ${activeIdx === idx ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                {feature}
                {featureDescriptions[idx] && activeIdx === idx && (
                  <div className="text-sm text-gray-500 mt-1">
                    {featureDescriptions[idx]}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex justify-center">
        <img
          src={featureImages[activeIdx]}
          alt={features[activeIdx]}
          className="rounded-xl shadow-lg max-w-full h-full"
        />
      </div>
    </section>
    </div>
       <Youtube />
      <Footer />
    </div>
  );
}

export default LandingPage;
