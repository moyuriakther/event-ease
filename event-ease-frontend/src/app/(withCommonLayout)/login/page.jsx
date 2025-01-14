'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { storeUserInfo } from '../../store/authServices'
import { userLogin } from '../../store/actions/loginUser'
import { toast } from 'sonner'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState('login')
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { email, password };
    console.log({formData})
    try {
      const res = await userLogin(formData);
      console.log({res})
      if (res?.token) {
        storeUserInfo({ accessToken: res?.token });
        toast.success(res.message || "Login successful!");
        router.push('/dashboard');
      } else {
        setError(res?.message);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  }
    const handleRegisterClick = () => {
    router.push('/register')
    }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[420px] space-y-6 sm:space-y-8">        
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          {/* Tabs with responsive padding and text size */}
          <div className="flex space-x-2 mb-6 sm:mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 sm:py-2.5 text-center rounded-md text-sm sm:text-base font-medium transition-colors
                ${activeTab === 'login' 
                  ? 'bg-[#1e62b3] text-white' 
                  : 'bg-white text-gray-600 border border-gray-300'}`}
            >
              Login
            </button>
            <button
              onClick={handleRegisterClick}
              className={`flex-1 py-2 sm:py-2.5 text-center rounded-md text-sm sm:text-base font-medium transition-colors
                ${activeTab === 'register' 
                  ? 'bg-[#1e62b3] text-white' 
                  : 'bg-white text-gray-600 border border-gray-300'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter Your E-mail address"
                className="text-black w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm 
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e62b3] 
                  focus:border-transparent transition-shadow"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={password ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter Your Password"
                  className="text-black w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm 
                    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e62b3] 
                    focus:border-transparent transition-shadow pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPassword(!password)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                    hover:text-gray-700 transition-colors p-1"
                >
                  {password ? (
                    <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 sm:py-2.5 px-4 bg-[#1e62b3] text-white text-sm sm:text-base 
                font-medium rounded-md hover:bg-[#1854a1] focus:outline-none focus:ring-2 
                focus:ring-[#1e62b3] focus:ring-offset-2 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

