import { Environments, EnvironmentType } from "@/model/Environments";

export default function VersionFlag() {
    const envType: EnvironmentType = process.env.NEXT_PUBLIC_ENVIRONMENT as EnvironmentType;
    const env = Environments.find(e => e.type === envType);

    return (
        env &&
        <div
            className="fixed top-[2rem] right-[-12rem] transform rotate-45 text-white text-xs font-bold px-10 py-2 shadow-lg min-w-[30rem] text-center"
            style={{ backgroundColor: env.color, opacity: 0.8 }}
        >
            {env.name}
        </div>
    );
}