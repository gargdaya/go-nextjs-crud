import UserInterface from "@/components/UserInterface";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <UserInterface backendName="go" />
        </div>
    );
}
