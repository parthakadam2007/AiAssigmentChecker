import type { FC, FormEvent } from 'react';
import {  useState } from 'react';
import useManualFetch from '../../../../shared/hooks/useManualFetch';


import { updateAuth } from '../../authSlice';
import { useDispatch } from "react-redux";
import { Link,useNavigate } from 'react-router-dom';

const SignupTeacher: FC = () => {

    const dispath = useDispatch();
    const navigate= useNavigate()

    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const { execute, data, status, error } = useManualFetch()
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await execute('http://localhost:3000/api/auth/signupStudent', 'POST', { first_name: firstName, last_name: lastName, email, password }).then();
        console.log('data', data)
        if (status !== 'error') {
            console.log('authenticating')
            dispath(updateAuth({
                authenticated: true,
                user: firstName + ' ' + lastName
            }))
            navigate('/student')
        }else{
            console.log(error)
        }
    }



    return (
        <div className="flex my-20 justify-center  bg-white-100">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full p-8 bg-white shadow-xl rounded-[2vw] ">
                <span className="font-semibold  text-gray-00  text-3xl py-3  text-gray-800">For Student</span>
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name 
                </label>
                <input
                    type="text"
                    name="firstName"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border border-gray-300 rounded-[3vw] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                </label>
                <input
                    type="text"
                    name="lastName"
                    onChange={(e) => setLastName(e.target.value)}
                    className="border border-gray-300 rounded-[3vw] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="text"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-[3vw] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="text"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-[3vw] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    type='submit'
                    className="bg-blue-600 text-white py-2 rounded-[3vw] hover:bg-blue-800 transition-colors"
                >
                    Submit
                </button>
                <Link className="text-blue-600 px-24"  to={'/auth/signin'}>Already have an account?</Link>
            </form>
        </div>

    )

}

export default SignupTeacher;