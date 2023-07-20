import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { UserAuthProvider } from "./contexts/UserAuthContext.tsx";
import { HotelsAPIProvider } from "./contexts/HotelContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<UserAuthProvider>
			<HotelsAPIProvider>
				<App />
			</HotelsAPIProvider>
		</UserAuthProvider>
	</React.StrictMode>
);
