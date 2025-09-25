import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-yellow-500 hover:bg-yellow-600 text-black',
              card: 'bg-gray-800 border-gray-700',
              headerTitle: 'text-yellow-400',
              headerSubtitle: 'text-gray-300',
              socialButtonsBlockButton: 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600',
              formFieldInput: 'bg-gray-700 border-gray-600 text-white',
              footerActionLink: 'text-yellow-400 hover:text-yellow-300'
            }
          }}
        />
      </div>
    </div>
  );
}

