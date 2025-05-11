import { LoginForm } from "@/components/login-form";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function Login() {
    return (
        <div className="relative h-screen w-full flex items-center justify-center px-4">
            <div className="absolute inset-0 -z-10">
                <BackgroundGradientAnimation />
            </div>

            <div className="flex flex-col items-center ">
                <img
                    src="/gad_cover.png"
                    alt="logo"
                    className="mx-auto filter drop-shadow-[0_0_4px_white] max-w-xs md:max-w-sm h-auto"
                />
                <LoginForm />
            </div>
        </div>
    );
}