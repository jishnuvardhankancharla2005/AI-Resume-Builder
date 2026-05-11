import React, { useState } from "react"
import { Lock, Mail, User2 } from "lucide-react"
import { useDispatch } from "react-redux"
import { login } from "../app/features/authSlice"
import { useNavigate } from "react-router-dom"
import api from "../configs/api"
import toast from "react-hot-toast"

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Determine if page is login or register from URL query
  const query = new URLSearchParams(window.location.search)
  const urlState = query.get("state")?.toLowerCase()
  const initialState =
    urlState === "login" || urlState === "register" ? urlState : "login"

  const [state, setState] = useState(initialState)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const endpoint = state === "login" ? "login" : "register"
      const payload =
        state === "login"
          ? { email: formData.email, password: formData.password }
          : formData

      const { data } = await api.post(`/api/users/${endpoint}`, payload)

      // Save token in Redux and localStorage
      dispatch(login({ token: data.token, user: data.user }))
      localStorage.setItem("token", data.token)

      toast.success(data.message || "Success")
      navigate("/app")
    } catch (error) {
      console.error("Login/Register Error:", error)
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Please {state} to continue
        </p>

        {state === "register" && (
          <div className="flex items-center mt-6 w-full border h-12 rounded-full pl-6 gap-2">
            <User2 size={16} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="outline-none flex-1"
            />
          </div>
        )}

        <div className="flex items-center mt-4 w-full border h-12 rounded-full pl-6 gap-2">
          <Mail size={13} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="outline-none flex-1"
          />
        </div>

        <div className="flex items-center mt-4 w-full border h-12 rounded-full pl-6 gap-2">
          <Lock size={13} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="outline-none flex-1"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-500 text-sm mt-3 mb-11 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span className="text-green-500 hover:underline">click here</span>
        </p>
      </form>
    </div>
  )
}

export default Login
