import {useState} from 'react'
import logo from "../../../../assets/logo.svg"
import {Link} from "react-router-dom"
import userlogo from "../../../../assets/userlogo.svg"
const navItems = [
  { name: 'Products', dropdown: ['Classroom', 'Docs', 'Slides'] },
  { name: 'AI', dropdown: ['AI Chatbot', 'Assistant', 'Vision'] },
  { name: 'Resource', dropdown: ['Guides', 'Tutorials', 'Support'] },
];
const Navbar = () => {
    const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
     const handleDropdown = (idx: number | null) => setDropdownIndex(idx);
  return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all"
        style={{ minWidth: '100vw', height: 64 }}>
        <div className="w-full flex justify-between items-center px-8 h-16">
          <div className="flex items-center">
            <span className="rounded-md p-2">
              <img className="w-6 h-6" src={logo} alt="Logo" />
            </span>
            <span className="ml-1 text-xl font-medium tracking-tight text-gray-700">Classroom</span>

            {/* Nav Menu */}
            <ul className="ml-20 mt-2 flex gap-2 items-center justify-center font-medium text-gray-600">
              {navItems.map((item, idx) => (
                <li key={item.name} className="relative group"
                  onMouseEnter={() => handleDropdown(idx)}
                  onMouseLeave={() => handleDropdown(null)}>
                  <button className="px-2 pb-2 focus:outline-none transition-colors relative">
                    {item.name}
                    <span
                      className="transition-all absolute left-0 right-0 -bottom-0.5 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 rounded-4xl"
                      style={{ transformOrigin: 'left', transition: 'transform 0.2s cubic-bezier(.4,0,.2,1)' }}
                    ></span>
                  </button>
                  {/* Dropdown */}
                  {item.dropdown && dropdownIndex === idx && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-white rounded-xl shadow-xl py-2 text-sm animate-fadeIn z-50">
                      {item.dropdown.map((drop, di) => (
                        <a key={di} href="#" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition">
                          {drop}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <nav className="space-x-2 flex items-center">
            <Link to="/login">
            <button className="px-4 py-2 rounded-full text-blue-600 font-medium hover:bg-blue-50 transition flex items-center gap-2"><img className="font-bold" src={userlogo}></img>Log In</button>
            </Link>
            <Link to="/contacts">
            <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition">
              Contact Us
            </button>
            </Link>
          </nav>
        </div>
      </header>
  )
}

export default Navbar