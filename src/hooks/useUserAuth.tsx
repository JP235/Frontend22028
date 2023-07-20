import { useContext } from "react";
import { UserAuthContext } from "../contexts/UserAuthContext";

export function useUserAuth() {
	return useContext(UserAuthContext);
}
