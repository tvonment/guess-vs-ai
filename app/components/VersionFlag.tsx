export default function VersionFlag() {
    const versionText = process.env.APP_VERSION_TEXT;

    return (
        versionText &&
        <div className="fixed top-[2rem] right-[-12rem] transform rotate-45 bg-version text-white text-xs font-bold px-10 py-2 shadow-lg min-w-[30rem] text-center">
            {versionText}
        </div>
    );
}