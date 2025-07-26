import { useState } from 'react'

import SignupTeacher from "../component/SignupTeacher"
import SignupStudent from "../component/SignupStudent"


const SignupPage = () => {
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const handleRole = () => {
    if (role == 'student') {
      setRole('teacher')
    } else {
      setRole('student')
    }
  }

  return (
    <>
      

      <div className="mx-auto">
        {role === 'student' ? (
          <SignupStudent />

        ) : (
          <SignupTeacher />
        )}
        <div className="flex flex-col items-center ">
        
        <button
          onClick={handleRole}
          className="px-2 py-2  bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {role === 'student' ? 'Teacher ' : 'Student '}
        </button>
      </div>
      </div>
      
    </>
  );
}

export default SignupPage