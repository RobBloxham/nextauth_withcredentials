import { FC, ReactNode } from 'react';
import { Button } from './ui/button';

interface FacebookSignInButtonProps {
  children: ReactNode;
}
const FacebookSignInButton: FC<FacebookSignInButtonProps> = ({ children }) => {
  const loginWithFacebook = () => console.log('login with facebook');

  return (
    <Button onClick={loginWithFacebook} className='w-full'>
      {children}
    </Button>
  );
};

export default FacebookSignInButton;
