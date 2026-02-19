import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Users', value: '2,847', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { label: 'Revenue', value: '$48,250', icon: DollarSign, color: 'text-green-600 bg-green-50' },
  { label: 'Orders', value: '1,024', icon: ShoppingCart, color: 'text-purple-600 bg-purple-50' },
  { label: 'Growth', value: '+12.5%', icon: TrendingUp, color: 'text-orange-600 bg-orange-50' },
];

export default function HomePage() { // HomePage component
  const { user } = useAuth();

  return (
    <div data-cy="home-page">
      <h1 data-cy="welcome-message" className="text-2xl font-bold mb-6">
        Welcome back, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-cy="stat-cards">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} data-cy={`stat-${label.toLowerCase()}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{label}</span>
                <div className={`p-2 rounded-lg ${color}`}>
                  <Icon size={18} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
