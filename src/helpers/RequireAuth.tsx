import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";
import { useEffect, useState } from "react";

export function RequireAuth() {
	const auth = useUserAuth();
	const [loaded, setLoaded] = useState(false);
	const location = useLocation();

	useEffect(() => {
		if (auth) {
			setLoaded(true);
		}
	}, [auth]);

	if (!loaded) {
		return <h1>Cargando...</h1>;
	}

	if (!auth.user && loaded) {
		return (
			<Navigate
				to={"login"}
				relative="path"
				replace={true}
				state={{ from: location }}
			/>
		);
	}

	return <Outlet />;
}
