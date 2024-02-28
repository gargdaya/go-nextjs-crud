import axios from "axios";
import { useEffect, useState } from "react";
import CardComponent from "./CardComponent";

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserInterfaceProps {
    backendName: string; // go
}

const UserInterface: React.FC<UserInterfaceProps> = ({ backendName }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ name: "", email: "" });
    const [updateUser, setUpdateUser] = useState<User | null>(null);

    // define styles
    const backgroundColors: { [key: string]: string } = {
        go: "bg-cyan-500",
    };
    const buttonColors: { [key: string]: string } = {
        go: "bg-cyan-700 hover:bg-blue-600",
    };

    const bgColor = backgroundColors[backendName] || "bg-gray-500";
    const btnColor =
        buttonColors[backendName] || "bg-gray-700 hover:bg-gray-600";

    useEffect(() => {
        axios
            .get<User[]>(`${apiUrl}/api/${backendName}/users`)
            .then((response) => {
                setUsers(response.data.reverse());
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);

    // create a new user

    const handleCreateUser = () => {
        if (!newUser.name || !newUser.email) return;
        axios
            .post(`${apiUrl}/api/${backendName}/users`, newUser)
            .then((response) => {
                setUsers([response.data, ...users]);
                setNewUser({ name: "", email: "" });
            })
            .catch((error) => {
                console.error("Error creating user: ", error);
            });
    };

    // delete user
    const handleDeleteUser = (id: number) => {
        axios
            .delete(`${apiUrl}/api/${backendName}/users/${id}`)
            .then(() => {
                const updatedUsers = users.filter((user) => user.id !== id);
                setUsers(updatedUsers);
            })
            .catch((error) => {
                console.error("Error deleting user: ", error);
            });
    };

    // update user
    const handleUpdateUser = () => {
        if (updateUser)
            axios
                .put(
                    `${apiUrl}/api/${backendName}/users/${updateUser.id}`,
                    updateUser
                )
                .then((response) => {
                    const updatedUsers = users.map((user) => {
                        if (user.id === Number(updateUser.id)) {
                            return response.data;
                        }
                        return user;
                    });
                    setUsers(updatedUsers);
                    setUpdateUser(null);
                })
                .catch((error) => {
                    console.error("Error updating user: ", error);
                });
    };

    return (
        <div
            className={`user-interface ${bgColor} ${backendName} w-full max-w-md p-4 my-4 rounded shadow`}
        >
            <h2 className="text-xl font-bold text-center text-white mb-6">
                {backendName.toUpperCase()} Backend
            </h2>

            <div className="flex items-center mb-4 rounded shadow bg-blue-100">
                {}
                <input
                    type="text"
                    placeholder="Name"
                    value={updateUser ? updateUser.name : newUser.name}
                    onChange={(e) =>
                        updateUser
                            ? setUpdateUser({
                                  ...updateUser,
                                  name: e.target.value,
                              })
                            : setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full p-2 mr-2 text-gray-700 rounded shadow"
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={updateUser ? updateUser.email : newUser.email}
                    onChange={(e) =>
                        updateUser
                            ? setUpdateUser({
                                  ...updateUser,
                                  email: e.target.value,
                              })
                            : setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full p-2 mr-2 text-gray-700 rounded shadow"
                />
                <button
                    onClick={updateUser ? handleUpdateUser : handleCreateUser}
                    className={`${btnColor} text-white py-2 px-4`}
                >
                    {updateUser ? "Update" : "Create"}
                </button>
            </div>

            <div className="space-y-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
                    >
                        <CardComponent card={user} />
                        <div className="flex flex-col items-center ">
                            <button
                                className={`${btnColor} my-2 text-white py-2 px-2`}
                                onClick={handleDeleteUser.bind(null, user.id)}
                            >
                                Delete
                            </button>
                            <button
                                className={`${btnColor} text-white py-2 px-2`}
                                onClick={setUpdateUser.bind(null, user)}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserInterface;
