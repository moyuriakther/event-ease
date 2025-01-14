// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useAuth } from '../contexts/AuthContext';

const Commonlayout = ({ children }) => {
  // const { user, logout } = useAuth();
  // const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100"> 
      {children}
    </div>
  );
};

export default Commonlayout;

