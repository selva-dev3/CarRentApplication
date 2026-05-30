'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useRegister } from '@/features/auth/hooks/useAuth';

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = 'Phone must be 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await registerMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      router.push('/dashboard');
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
        error={errors.name}
      />
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
        error={errors.email}
      />
      <Input
        label="Phone"
        type="tel"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
        error={errors.phone}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        value={formData.password}
        onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
        error={errors.password}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
        error={errors.confirmPassword}
      />
      {registerMutation.isError && (
        <p className="text-sm text-red-600">{registerMutation.error?.message || 'Registration failed'}</p>
      )}
      <Button
        type="submit"
        className="w-full"
        isLoading={registerMutation.isPending}
      >
        Create Account
      </Button>
    </form>
  );
}
