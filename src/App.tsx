import "./App.css";
import {
    Routes,
    Route,
    BrowserRouter,
    Link
} from "react-router-dom";
import { LoginForm } from "./components/LoginForm/LoginForm";
import { NotFound } from "./components/NotFound/NotFound";
import { RequireAuth } from "./helpers/RequireAuth";
import AdminDash from "./components/AdminDash/AdminDash";
import CreateHotel from "./components/Hotel/CreateHotel/CreateHotel";
import HotelEdit from "./components/Hotel/HotelEdit/HotelEdit";
import HotelDisplay from "./components/Hotel/HotelDisplay/HotelDisplay";
import RoomEdit from "./components/Rooms/RoomEdit/RoomEdit";
import {
    ReservationDetails,
    HotelReservations,
} from "./components/HotelReservation/HotelReservation";
import Traveler from "./components/Travelers/Traveler";
import TravelerSearch from "./components/Travelers/TravelerSearch/TravelerSearch";
import TravelerReservationDialog from "./components/Travelers/TravelerReservationDialog/TravelerReservationDialog";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<h1>
					<Link to="/">Principal</Link>
				</h1>
				<Routes>
					<Route path="" element={<AppEntry />} />
					<Route path="/agencia">
						<Route path="login" element={<LoginForm />} />
						<Route element={<RequireAuth />}>
							<Route path="" element={<AdminDash />}>
								<Route path="create_new_hotel" element={<CreateHotel />} />
								<Route path="hotel">
									<Route path=":hotelId">
										<Route path="" element={<HotelDisplay />} />
										<Route path="reservas" element={<HotelReservations />}>
											<Route
												path=":reservationId"
												element={<ReservationDetails />}
											/>
										</Route>

										<Route path="edit" element={<HotelEdit />}>
											<Route path=":roomId" element={<RoomEdit />} />
											<Route path="new_room" element={<RoomEdit />} />
										</Route>
									</Route>
								</Route>
							</Route>
						</Route>

						<Route path="*" element={<NotFound />} />
					</Route>
					<Route path="/viajero" element={<Traveler />}>
						<Route path="buscar" element={<TravelerSearch />} />
						<Route path="reservar" element={<TravelerReservationDialog />} />
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;

function AppEntry() {
	return (
		<>
			<h2>
				<Link to="/agencia">Agencia</Link>
			</h2>
			<h2>
				<Link to="/viajero">Viajero</Link>
			</h2>
		</>
	);
}
