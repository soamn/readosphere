"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Invalid credentials");
        return;
      }

      router.push("/admin/dashboard");
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-background text-foreground">
      <h1 className="text-primary text-3xl font-extrabold mb-6">
        Readosphere.com
      </h1>

      <Card className="w-full max-w-sm shadow-lg  dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
        <CardHeader>
          <CardTitle className="text-center text-xl text-black dark:text-white">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              className=" dark:bg-zinc-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
