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
    

    <div className="max-w-md mx-auto my-50 space-y-4">
      {role === 'student' ? (
        <LoginForm
          role={'Student'}
          url={'http://localhost:3000/api/auth/loginStudent'}
        />
      ) : (
        <LoginForm
          role={'Teacher'}
          url={'http://localhost:3000/api/auth/loginTeacher'}
        />
      )}    <div className="flex justify-center ">
      
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

export default SigninPage