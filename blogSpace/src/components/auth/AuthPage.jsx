import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LogInForm from "./LogInForm";
import RegisterForm from "./RegisterForm";

const AuthPage = ({ loggedIn, setLoggedIn, setUsername, setCurrentUserId }) => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) navigate('/');
  }, [loggedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full bg-background hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-center">
            {showRegister ? "Join BlogWave" : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground text-center">
            {showRegister
              ? "Create your account to start sharing"
              : "Sign in to continue your journey"}
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {showRegister ? (
            <RegisterForm
              setLoggedIn={setLoggedIn}
              setUsername={setUsername}
              setCurrentUserId={setCurrentUserId}
            />
          ) : (
            <LogInForm
              setLoggedIn={setLoggedIn}
              setUsername={setUsername}
              setCurrentUserId={setCurrentUserId} // Add this
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <Separator className="mb-4" />
          <Button
            variant="link"
            className="text-primary font-medium"
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister
              ? "Existing user? Sign in"
              : "New user? Create account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;