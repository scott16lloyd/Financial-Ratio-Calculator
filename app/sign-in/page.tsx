import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import appleIcon from '@/public/appleIcon.png';
import googleIcon from '@/public/googleIcon.png';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage() {
  return (
    <div className="h-screen w-screen py-4 px-3">
      <Card className="h-full w-full ring-zinc-700 ring-1">
        <CardContent className="p-4 h-full flex flex-col space-y-4">
          <div className="flex flex-col gap-5 flex-grow-1">
            <div className="flex flex-col w-max text-left">
              <span className="text-3xl font-light">Welcome back</span>
              <span className="text-md font-light text-zinc-500">
                Sign in to your account
              </span>
            </div>
            <div className="w-full flex flex-col gap-4 h-full justify-evenly">
              <Button
                variant="outline"
                className="w-full p-5 bg-background ring-zinc-700 ring-1 border-none rounded-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="relative w-6 h-6">
                    <Image
                      src={appleIcon}
                      alt="Apple Login"
                      layout="fill"
                      objectFit="contain"
                    />{' '}
                  </div>
                  <span className="text-lg font-light">Apple</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full p-5 bg-background ring-zinc-700 ring-1 border-none rounded-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="relative w-6 h-6">
                    <Image
                      src={googleIcon}
                      alt="Google Login"
                      layout="fill"
                      objectFit="contain"
                    />{' '}
                  </div>
                  <span className="text-lg font-light">Google</span>
                </div>
              </Button>
            </div>
            <div className="w-full flex flex-row items-center justify-center gap-2 overflow-hidden">
              <Separator className="w-1/2" />
              <span className="text-xs font-medium text-zinc-700">or</span>
              <Separator className="w-1/2" />
            </div>
          </div>
          <div className="flex flex-col flex-grow-2 gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email" className="text-zinc-500 font-light">
                Email
              </Label>
              <Input
                type="email"
                placeholder="Email"
                className="rounded-sm"
              ></Input>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password" className="text-zinc-500 font-light">
                Password
              </Label>
              <Input
                type="password"
                placeholder="Password"
                className="rounded-sm"
              ></Input>
            </div>
            <Button className="bg-white">Sign In</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
