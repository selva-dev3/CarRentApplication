'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useLogin } from '@/features/auth/hooks/useAuth';

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const data = await loginMutation.mutateAsync(formData);
      if (data.user.role === 'admin' || data.user.role === 'superadmin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch {
      // Error handled by mutation
    }
  };

  const handleDemoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'admin') {
      setFormData({
        email: 'admin@carrent.com',
        password: 'admin123',
      });
      setErrors({});
    } else if (val === 'customer') {
      setFormData({
        email: 'customer@carrent.com',
        password: 'customer123',
      });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Quick Demo Accounts
        </label>
        <select
          onChange={handleDemoSelect}
          className="w-full bg-gray-50 border border-gray-300 text-gray-700 px-3 py-2 rounded-md font-medium text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled>Select a demo account...</option>
          <option value="admin">Admin Demo (admin@carrent.com)</option>
          <option value="customer">Customer Demo (customer@carrent.com)</option>
        </select>
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
        error={errors.email}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
        error={errors.password}
      />
      {loginMutation.isError && (
        <p className="text-sm text-red-600">{loginMutation.error?.message || 'Login failed'}</p>
      )}
      <Button
        type="submit"
        className="w-full"
        isLoading={loginMutation.isPending}
      >
        Sign In
      </Button>
    </form>
  );
}
