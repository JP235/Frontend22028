import { useContext } from "react";
import { HotelsAPIContext } from "../contexts/HotelContext";

export const useHotelsAPI = () => {
	const context = useContext(HotelsAPIContext);
	if (!context) {
		throw new Error("useHotels must be used within a HotelsProvider");
	}
	return context;
};