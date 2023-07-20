import { useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";

export function LoginForm() {
	const [username, setUsername] = useState("");
	const auth = useUserAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const state = location.state as { from: Location };
	const from = state.from.pathname ?? "/";

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		auth.login(username);
		navigate(from, { replace: true });
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Username:
				<input
					type="text"
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				/>
			</label>
			<button type="submit">Login</button>
		</form>
	);
}
