"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    // Call your signup logic here
    console.log("Sign Up with", email, password)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="text-green-700" />
        <h2 className="text-2xl font-semibold text-green-700">Sign Up for EcoSnap</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <Input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button onClick={handleSignUp} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Sign up
          </Button>

      </div>
    </div>
  )
}
