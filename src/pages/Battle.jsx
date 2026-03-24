import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Battle = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white gap-6">
      <h1 className="text-4xl font-bold font-inter">Battle Arena</h1>
      <p className="text-accent">Real-time battles coming soon.</p>
      <Button onClick={() => navigate('/')} variant="outline">
        Back Home
      </Button>
    </div>
  );
};

export default Battle;
