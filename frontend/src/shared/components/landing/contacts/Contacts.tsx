import React, { useState } from "react";
import logo from "../../../../assets/logo.svg";
import userlogo from "../../../../assets/userlogo.svg";
import SearchIcon from "../../../../assets/SearchIcon.svg"; // SVG for search, assumed as component or static file

const teamContacts = [
  {
    name: "Prashik Sasane",
    phone: "+91 7498760502",
    email: "prashik.sasane@vit.edu",
    role: "Guide Us",
  },
  {
    name: "Pruthviraj Gawande",
    phone: "+91 9423190104",
    email: "pruthvirajgawande@gmail.com",
    role: "General Enquiries",
  },
  {
    name: "Parth Kadam",
    phone: "+91 7028874211",
    email: "parthkadam@vit.edu",
    role: "Technical Support",
  },
  {
    name: "Pranav Gawade",
    phone: "+91 8010770930",
    email: "pranavgawade@gmail.com",
    role: "Emergency Helpline",
  },
];

const ContactsHelpLayout: React.FC = () => {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredContacts = teamContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  // Optionally, search box in main area can filter main text/instructions if you expand the feature

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-7 h-7"/>
          <span className="text-lg font-semibold text-gray-800">ClassRoom Account Help</span>
        </div>
        <div className="flex-1 mx-8 flex items-center max-w-lg">
          <img src={SearchIcon} alt="Search" className="w-5 h-5 absolute ml-4 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search team contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <img src={userlogo} alt="User" className="w-9 h-9 rounded-full border-gray-200"/>
      </header>
      
      {/* Navigation Tabs */}
      <nav className="bg-white px-6 border-b border-gray-200 flex space-x-8 pt-1 text-sm font-medium">
        <button className="py-3 border-b-2 border-blue-600 text-blue-600 focus:outline-none">Help Center</button>
        <button className="py-3 hover:text-blue-600">Community</button>
        <button className="py-3 hover:text-blue-600">Improve your Account</button>
      </nav>

      {/* Main Content */}
      <main className="flex justify-center bg-gray-50 px-2 py-10">
        <div className="flex gap-10 w-full max-w-7xl">
          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 p-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">Team Contact Information</h1>
            <p className="text-gray-700 mb-6">
              Here you can find the contact information for the support and administration team. Click the plus icon (+) beside each person to view their details!
            </p>
            <div className="grid gap-6 mt-8">
              {filteredContacts.map((c, idx) => (
                <div key={c.email} className="rounded-lg border border-blue-100 shadow-sm bg-blue-50/50 px-6 py-4 transition hover:shadow-lg">
                  <button 
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <div>
                      <span className="text-lg font-medium text-blue-900">{c.name}</span>
                      <span className="text-sm ml-3 text-gray-500">{c.role}</span>
                    </div>
                    <span className={`transition transform text-3xl text-blue-600 font-bold select-none ${openIndex === idx ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {openIndex === idx && (
                    <div className="mt-4 flex flex-col gap-2 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-red-500">phone</span>
                        <a className="text-blue-800 hover:underline" href={`tel:${c.phone}`}>{c.phone}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-green-500">email</span>
                        <a className="text-green-800 hover:underline" href={`mailto:${c.email}`}>{c.email}</a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filteredContacts.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  No team member found for your search.
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <aside className="w-[320px] hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Team Contacts</h3>
              <ul className="space-y-3 text-blue-700 text-[15px]">
                {filteredContacts.map((c, idx) => (
                  <li key={c.email}>
                    <button 
                      onClick={() => setOpenIndex(idx)}
                      className="flex items-center w-full gap-2 hover:text-blue-600"
                    >
                      <span className="font-medium">{c.name}</span>{" "}
                      <span className="text-xs text-gray-500">({c.role})</span>
                    </button>
                  </li>
                ))}
                {filteredContacts.length === 0 && <li className="text-gray-400">No contacts</li>}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ContactsHelpLayout;
