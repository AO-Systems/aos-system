
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-6">
        <div className="ember-logo text-6xl font-bold">404</div>
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-ember-600 hover:bg-ember-700"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
