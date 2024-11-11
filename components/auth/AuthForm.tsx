"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { LoginSchema, RegisterSchema } from "@/lib/auth/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, User } from "lucide-react";

type FormData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const loginForm = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onLogin = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
        return;
      }

      window.location.href = callbackUrl;
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Auto login after successful registration
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Error signing in after registration");
        return;
      }

      window.location.href = callbackUrl;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Login to your account to continue shopping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="name@example.com"
                            className="pl-9"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input {...field} type="password" className="pl-9" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <div className="text-sm text-red-500">{error}</div>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Sign in"}
                </Button>
              </form>
            </Form>
            <div className="mt-6">
              <SocialAuth isLoading={isLoading} />
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="register">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Sign up to start shopping with us</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input {...field} className="pl-9" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input {...field} className="pl-9" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="name@example.com"
                            className="pl-9"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input {...field} type="password" className="pl-9" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <div className="text-sm text-red-500">{error}</div>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>
            <div className="mt-6">
              <SocialAuth isLoading={isLoading} />
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
