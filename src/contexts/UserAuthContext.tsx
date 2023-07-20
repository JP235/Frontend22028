import { createContext, useEffect, useState } from "react";

type UserAuthValue = {
	user: string | null;
	login: (username: string) => void;
	logout: (callback?: VoidFunction) => void;
};

export const UserAuthContext = createContext<UserAuthValue>(null!);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<string | null>(null);
	useEffect(() => {
		// Simular userAuth
		const userFromStorage = window.localStorage.getItem("user") ?? null;
		setUser(userFromStorage);
         
        return () => {
            // window.localStorage.removeItem("user");
        }
	}, []);

	const login = (username: string) => {
		console.log(username);
		window.localStorage.setItem("user", username);
		setUser(username);
	};

	const logout = (callback?: VoidFunction) => {
		window.localStorage.removeItem("user");
		setUser(null);
		callback && callback();
	};

	return (
		<UserAuthContext.Provider value={{ user, login, logout }}>
			{children}
		</UserAuthContext.Provider>
	);
}
