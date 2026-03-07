'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    Loader2,
    LogIn,
    Eye,
    EyeOff,
    ClipboardList,
    Sparkles,
} from 'lucide-react';

// import { useAuth } from '@/core/contexts/auth.context';
import { useNavigate } from 'react-router-dom';

import './Login.css';

export default function Login() {
    // const { login, user } = useAuth();

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // useEffect(() => {
    //     if (user) {
    //         navigate(`/${user.role}`);
    //     }
    // }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!loginId.trim() || !password) return;

        // setError('');
        // setLoading(true);

        // try {
        //     await login({
        //         loginId: loginId.trim(),
        //         password,
        //     });
        // } catch (err) {
        //     setError(err?.message || 'Invalid login ID or password');
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <div className="min-h-[100svh] grid lg:grid-cols-2">

            {/* LEFT PANEL */}
            <div className="hidden lg:flex flex-col bg-primary text-primary-foreground relative overflow-hidden">

                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/5" />

                <div className="relative flex-1 flex flex-col justify-center p-12 xl:p-20">

                    <div className="max-w-xl">

                        {/* Logo */}
                        <div className="flex items-center gap-5 mb-12">
                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center text-4xl font-black shadow-xl">
                                SAP
                            </div>

                            <div>
                                <h1 className="text-5xl font-extrabold tracking-tight">
                                    Sampath Academy
                                </h1>
                                <p className="text-2xl font-medium opacity-90 mt-1">
                                    Operations System
                                </p>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-6">

                            <div className="flex items-center gap-3">
                                <ClipboardList className="h-10 w-10 opacity-90" />
                                <h2 className="text-4xl font-bold leading-tight">
                                    Daily Operations Dashboard
                                </h2>
                            </div>

                            <p className="text-xl leading-relaxed opacity-90">
                                Manage daily tasks, track staff workflows, and ensure smooth
                                operations across Sampath Academy. Everything you need to run
                                the centre efficiently in one place.
                            </p>

                            <div className="flex items-center gap-4 mt-10 opacity-90">
                                <Sparkles className="h-5 w-5" />
                                <p className="text-lg font-medium">
                                    Built for efficiency • Designed for educators
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="relative px-12 pb-10 text-sm opacity-70">
                    © {new Date().getFullYear()} Sampath Academy
                </div>

            </div>

            {/* RIGHT PANEL LOGIN */}
            <div className="flex min-h-[100svh] items-center justify-center px-4 py-6 sm:px-6 bg-background">

                <div className="w-full max-w-md space-y-8 sm:space-y-10">

                    {/* Mobile Header */}
                    <div className="text-center lg:hidden">

                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-3xl font-black shadow-xl">
                            SAP
                        </div>

                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Sampath Academy
                        </h2>

                        <p className="mt-2 text-base text-muted-foreground">
                            Operations Dashboard Login
                        </p>

                    </div>

                    {/* LOGIN CARD */}
                    <Card className="border shadow-xl sm:shadow-2xl">

                        <CardHeader className="pb-6 text-center space-y-3">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                <ClipboardList className="h-7 w-7 text-primary" />
                            </div>

                            <CardTitle className="text-2xl sm:text-3xl font-bold">
                                Staff Login
                            </CardTitle>

                            <CardDescription className="text-sm sm:text-base">
                                Enter your login credentials to continue
                            </CardDescription>

                        </CardHeader>

                        <CardContent className="space-y-6">

                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* LOGIN ID */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">
                                        Email
                                    </Label>

                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="Enter your email"
                                        value={loginId}
                                        onChange={(e) => setLoginId(e.target.value)}
                                        disabled={loading}
                                        required
                                        autoComplete="username"
                                        className="h-11 sm:h-12"
                                        autoFocus
                                    />
                                </div>

                                {/* PASSWORD */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="password">
                                        Password
                                    </Label>

                                    <div className="relative">

                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            required
                                            autoComplete="current-password"
                                            className="h-11 sm:h-12 pr-11"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>

                                    </div>
                                </div>

                                {/* ERROR */}
                                {error && (
                                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2">
                                        <p className="text-center text-sm font-medium text-destructive">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {/* LOGIN BUTTON */}
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={loading || !loginId.trim() || !password}
                                    className="h-11 sm:h-12 w-full font-semibold"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="mr-2 h-4 w-4" />
                                            Open Task Dashboard
                                        </>
                                    )}
                                </Button>

                            </form>

                        </CardContent>

                        <CardFooter className="text-center">
                            <p className="text-xs sm:text-sm text-muted-foreground w-full">
                                Sampath Academy Internal System
                            </p>
                        </CardFooter>

                    </Card>

                </div>

            </div>

        </div>
    );
}