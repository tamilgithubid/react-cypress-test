import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const { token, user } = await res.json();
      login(token, user);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Sign In</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} data-cy="login-form">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-cy="email-input"
                required
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password" type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-cy="password-input"
                required
              />
            </div>
            {error && (
              <p data-cy="error-message" className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
            <Button
              type="submit"
              data-cy="submit-btn"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
