'use client';

import { useState } from 'react';
import { login } from '@/app/admin/login/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, LogIn, KeySquare, Mail, Fingerprint } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanningFingerprint, setScanningFingerprint] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setScanningFingerprint(true);
      
      // Simulate fingerprint scan with delay before actual login
      await new Promise(resolve => setTimeout(resolve, 1500));
      setScanningFingerprint(false);
      
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      await login(formData);
    } catch {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
      setScanningFingerprint(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      return;
    }
    
    try {
      setIsLoading(true);
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally call your reset password API
      // await resetPasswordFunction(resetEmail);
      
      setResetSubmitted(true);
      setIsLoading(false);
    } catch {
      setError('Error resetting password. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-2">Sign in to access the admin dashboard</p>
        </div>
        
        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-white text-center">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          
          {/* Fingerprint scanner - moved outside of form, above form content */}
          <div className="relative flex justify-center mb-2">
            <div className="fingerprint-scanner-container">
              <div className={`fingerprint-scanner ${scanningFingerprint ? 'scanning' : ''}`}>
                <Fingerprint className="fingerprint-icon" />
                <div className="scanner-glow"></div>
                <div className="scanner-line"></div>
              </div>
            </div>
          </div>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-200">Password</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      {scanningFingerprint ? (
                        <>
                          <div className="flex items-center">
                            <span>Verifying identity...</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Signing in...</span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-indigo-400 hover:text-indigo-300 hover:bg-transparent"
                >
                  <KeySquare className="mr-2 h-4 w-4" />
                  Forgot password?
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Reset Password</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {!resetSubmitted 
                      ? "Enter your email address and we'll send you a link to reset your password."
                      : "If an account with that email exists, we've sent a password reset link."
                    }
                  </DialogDescription>
                </DialogHeader>
                
                {!resetSubmitted ? (
                  <form onSubmit={handleResetPassword} className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="text-gray-200">Email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="admin@example.com"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Sending...
                          </>
                        ) : "Reset Password"}
                      </Button>
                    </DialogFooter>
                  </form>
                ) : (
                  <div className="py-4 text-center">
                    <div className="mb-4 rounded-full bg-indigo-900/20 p-3 w-12 h-12 mx-auto flex items-center justify-center">
                      <Mail className="h-6 w-6 text-indigo-400" />
                    </div>
                    <p className="text-gray-200">Check your email for a reset link.</p>
                    <Button 
                      className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => {
                        setResetSubmitted(false);
                        setResetEmail('');
                      }}
                    >
                      Back to Reset
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} AI Haven Labs. All rights reserved.
        </div>
      </div>
    </div>
  );
}