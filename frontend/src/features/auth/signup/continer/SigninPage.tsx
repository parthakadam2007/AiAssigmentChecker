import LoginForm from '../../../../shared/components/login/LoginForm'
import { useState } from 'react'


const SigninPage = () => {
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
    <div className="relative">
      {/* Toggle Button - positioned at top right like signup page */}
      <button
        onClick={handleRole}
        className="px-4 py-2 underline text-blue-600 rounded absolute top-6 right-6 hover:text-blue-800 transition-colors z-10"
      >
        {role === 'student' ? 'Teacher Login?' : 'Student Login?'}
      </button>

      {role === 'student' ? (
        <LoginForm
          role={'Student'}
          url={`${import.meta.env.VITE_BACKEND_URL}/auth/loginStudent`}
        />
      ) : (
        <LoginForm
          role={'Teacher'}
          url={`${import.meta.env.VITE_BACKEND_URL}/auth/loginTeacher`}
        />
      )}
    </div>
  </>
);

}

export default SigninPage