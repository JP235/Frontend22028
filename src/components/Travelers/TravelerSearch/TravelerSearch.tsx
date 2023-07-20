import "./TravelerSearch.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHotelsAPI } from "../../../hooks/useHotelsApi";
import { Hotel } from "../../../types";
import RoomsDisplay from "../../Rooms/RoomsDisplay/RoomDisplay";

function TravelerSearch() {
	const [results, setResults] = useState<Hotel[]>([]);
	const location = useLocation();
	const { filterRoomsByOccupantsAndDates } = useHotelsAPI();

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const occupants = searchParams.get("occupants");
		const checkInDate = searchParams.get("checkInDate");
		const checkOutDate = searchParams.get("checkOutDate");
		if (!occupants || !checkInDate || !checkOutDate) return;

		filterRoomsByOccupantsAndDates(
			parseInt(occupants),
			checkInDate,
			checkOutDate
		).then((rooms) => {
			setResults(rooms);
		});
	}, [location]);

	return (
		<div className="traveler-search-results">
			<ul className="hotel-list">
				{results.length === 0 && "Ningún Hotel Encontrado"}
				{results.map((result) => (
					<li key={result.id}>
						<div className="main-info">
							<h1>{result.name}</h1>
							<h2>
								<div>
									<span>Localización:</span> <span>{result.location}</span>
								</div>
							</h2>
						</div>
						<RoomsDisplay rooms={result.rooms} actionButton="reserve" />
					</li>
				))}
			</ul>
		</div>
	);
}
export default TravelerSearch;
