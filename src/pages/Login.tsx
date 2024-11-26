import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
});

type LoginForm = z.infer<typeof schema>;

// Mock user data for demonstration
const MOCK_USERS = [
  { id: '1', email: 'worker@example.com', password: 'password', name: '山田 太郎', role: 'worker', points: 0 },
  { id: '2', email: 'admin@example.com', password: 'password', name: '鈴木 管理者', role: 'admin' },
];

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const user = MOCK_USERS.find(
        (u) => u.email === data.email && u.password === data.password
      );

      if (!user) {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }

      const { password, ...userWithoutPassword } = user;
      login(userWithoutPassword);
      
      toast.success('ログインしました');
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ログインに失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <TrendingUp className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          pointmoney
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ポイント管理システム
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  テスト用アカウント
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="text-sm text-gray-500">
                <p>ワーカー:</p>
                <p>worker@example.com</p>
                <p>password</p>
              </div>
              <div className="text-sm text-gray-500">
                <p>管理者:</p>
                <p>admin@example.com</p>
                <p>password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}