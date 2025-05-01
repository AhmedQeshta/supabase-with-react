import { Button } from '@/components/ui/button';
import { HeaderProps } from '@/lib/types';
import { supabase } from '@/supabase-client';

const Header: React.FC<HeaderProps> = ({ session, setSession }) => {
  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      return;
    }
    setSession(null);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-bold">Supabase React Project</div>
          {session && (
            <ul className="flex space-x-4">
              <li>
                <Button onClick={() => handleLogOut()} className="bg-red-600 hover:bg-red-700">
                  <span className="text-white">Logout</span>
                </Button>
              </li>
            </ul>
          )}
        </div>
      </nav>
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold my-5">Task Manager</h1>
        <p className="text-gray-600 mb-5">Manage your tasks efficiently!</p>
      </div>
    </>
  );
};

export default Header;
