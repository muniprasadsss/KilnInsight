import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "../axiosinstance";
import { useLocation } from "wouter";  // ✅ use wouter for navigation
import logo from '../../../../public/logo-shot.png';
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [region, setRegion] = useState("India");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [, setLocation] = useLocation(); // ✅ replaces useNavigate

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axiosInstance.post(
                "/auth/login",
                { email, password, region },
                { withCredentials: true }
            );

            if (response) {
                const data = response;
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userData", JSON.stringify(data.data.user));
                localStorage.setItem("user", JSON.stringify(data.data.user.name));
                if (data.data.token) {
                    localStorage.setItem("token", data.data.token);
                }

                toast({
                    title: "Login successful",
                    description: "Welcome back!",
                });

                setLocation("/dashboard"); // ✅ navigate with wouter
            } else {
                toast({
                    title: "Login failed",
                    description: "Invalid email or password",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Unable to connect to server",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center px-12 py-8 max-w-md ml-32">
                {/* Visionaize Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <img
                        src={logo}
                        alt="Visionaize Logo"
                        className="w-8 h-8 object-contain"
                    />
                    <span className="text-2xl font-bold text-gray-900">Visionaize</span>
                </div>

                {/* Login Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Login with your account
                    </h1>
                    <div className="text-gray-400 space-y-1 text-sm">
                        <p>Welcome back! Please enter your credentials to access</p>
                        <p>your account and continue working on your projects.</p>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-900 mb-2"
                        >
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter here"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg 
                            focus:border-[#088ed1] focus:ring-1 focus:ring-[#088ed1] 
                            text-black placeholder-gray-300 bg-transparent"              
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-900 mb-2"
                        >
                            Enter your Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Type your password here"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg 
                                focus:border-[#088ed1] focus:ring-1 focus:ring-[#088ed1] 
                                text-black placeholder-gray-300 bg-transparent"  
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="region"
                            className="block text-sm font-medium text-gray-900 mb-2"
                        >
                            Region
                        </label>
                        <Select value={region} onValueChange={setRegion}>
                            <SelectTrigger className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#088ed1] focus:ring-1 focus:ring-[#088ed1] bg-white text-black">
                                <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="NorthAmerica">North America</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#088ed1] hover:bg-[#0670a8] text-white font-medium rounded"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </div>

            {/* Right Side - Visual Panel */}
            <div className="hidden md:flex w-[50rem] bg-[#008cd1] items-center justify-center p-8 ml-auto">
                <div className="w-full h-[75vh] flex items-center justify-center">
                    <div className="bg-white/10 rounded-2xl w-full">
                        <video
                            className="w-full h-auto rounded-xl"
                            src="https://visionaize.com/wp-content/uploads/2024/03/signal-miner-2.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>
    );
}
