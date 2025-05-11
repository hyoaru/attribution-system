import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthenticationService from "@/services/AuthenticationService";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleButtonClick = async () => {
        setError("");

        try {

            const response = await AuthenticationService.signIn({
                email,
                password,
            });
            console.log("Response:", response);

            navigate("/page");
        } catch (err: any) {
            console.error("Login Error:", err);

            if (err.response) {
                if (err.response.status === 500) {
                    setError("Invalid email or password.");
                } else if (err.response.status === 400) {
                    setError("Invalid email or password.");
                } else {
                    setError(
                        `Error: ${
                            err.response.data?.message || "An error occurred."
                        }`
                    );
                }
            } else if (err.request) {
                // Request was made but no response received
                setError(
                    "No response from server. Please check your connection."
                );
            } else {
                // Other errors (e.g., bad request config)
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <div className="mt-2 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full text-white font-bold py-2 px-4 rounded"
                        style={{
                            background:
                                "linear-gradient(105deg, rgba(207,0,255,1) 0%, rgba(255,0,149,1) 100%)",
                        }}
                        onClick={handleButtonClick}
                    >
                        Login
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
