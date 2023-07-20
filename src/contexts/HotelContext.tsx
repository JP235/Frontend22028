import { createContext, useEffect, useState } from "react";
import { Hotel, Reservation, Room } from "../types";
import hotelsData from "./data/hotels.json";
import reservationsData from "./data/reservations.json";

interface HotelsAPIType {
	getHotels: () => Promise<Hotel[]>;
	getHotel: (hotelId: string) => Promise<Hotel | undefined>;
	getRoom: (hotelId: string, roomId: string) => Promise<Room | undefined>;
	getReservation: (reservationId: string) => Promise<Reservation | undefined>;
	createHotel: (newHotel: Pick<Hotel, "name" | "location">) => Promise<Hotel>;
	updateHotel: (
		hotelId: string,
		updates: Partial<Hotel>
	) => Promise<Hotel | undefined>;
	createRoom: (
		hotelId: number,
		newRoom: Omit<Room, "id">
	) => Promise<Room | undefined>;
	updateRoom: (
		hotelId: string,
		roomId: string,
		updates: Partial<Room>
	) => Promise<Room | undefined>;
	getReservationsForHotel: (hotelId: string) => Promise<Reservation[]>;
	getReservationsForRoom: (
		hotelId: string,
		roomId: string
	) => Promise<Reservation[]>;
	createReservation: (
		newReservation: Omit<Reservation, "id">
	) => Promise<Reservation>;
	updateReservation: (
		reservationId: string,
		updates: Partial<Reservation>
	) => Promise<Reservation | undefined>;
	getTakenDatesForRoom: (hotelId: string, roomId: string) => Promise<string[]>;
	filterRoomsByOccupantsAndDates: (
		occupants: number,
		startDate: string,
		endDate: string
	) => Promise<Hotel[]>;
	deleteRoom: (hotelId: string, roomId: string) => Promise<void>;
}

export const HotelsAPIContext = createContext<HotelsAPIType>(null!);

export const HotelsAPIProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [reservations, setReservations] = useState<Reservation[]>([]);

	useEffect(() => {
		const hotelsFromStorage = window.sessionStorage.getItem("hotels");
		const reservaionsFromStorage =
			window.sessionStorage.getItem("reservations");

		// Aqui seria el fetch de los hoteles y reservas a los que tiene acceso
		// el usuario que inicio sesion.
		setHotels(hotelsFromStorage ? JSON.parse(hotelsFromStorage) : hotelsData);
		setReservations(
			reservaionsFromStorage
				? JSON.parse(reservaionsFromStorage)
				: reservationsData
		);
		return () => {
			window.sessionStorage.removeItem("hotels");
			window.sessionStorage.removeItem("reservations");
		};
	}, []);

	useEffect(() => {
		if (hotels.length > 0 && reservations.length > 0) {
			window.sessionStorage.setItem("hotels", JSON.stringify(hotels));
			window.sessionStorage.setItem(
				"reservations",
				JSON.stringify(reservations)
			);
		}
	}, [hotels, reservations]);

	const getHotels = async () => {
		return hotels ?? [];
	};

	const getHotel = async (hotelId: string) =>
		hotels.find((hotel) => hotel.id === Number(hotelId));

	const getRoom = async (hotelId: string, roomId: string) => {
		const hotel = await getHotel(hotelId);
		if (!hotel) throw new Error("No hotel found");
		return hotel.rooms.find((room) => room.id === Number(roomId));
	};

	const getReservation = async (reservationId: string) =>
		reservations.find(
			(reservation) => reservation.id === Number(reservationId)
		);

	const createHotel = async (newHotel: Pick<Hotel, "name" | "location">) => {
		const nextId =
			hotels.length > 0 ? Math.max(...hotels.map((hotel) => hotel.id)) + 1 : 1;
		const hotel = { ...newHotel, active: true, id: nextId, rooms: [] };
		setHotels((prevHotels) => [...prevHotels, hotel]);
		return hotel;
	};

	const updateHotel = async (hotelId: string, updates: Partial<Hotel>) => {
		setHotels((prevHotels) =>
			prevHotels.map((hotel) =>
				hotel.id === Number(hotelId) ? { ...hotel, ...updates } : hotel
			)
		);
		return getHotel(hotelId);
	};

	const createRoom = async (hotelId: number, newRoom: Omit<Room, "id">) => {
		const activeHotel = await getHotel(hotelId.toString());
		if (!activeHotel) throw new Error("Hotel not found");
		const nextId =
			activeHotel.rooms.length > 0
				? Math.max(...activeHotel.rooms.map((room) => room.id)) + 1
				: 1;
		const room: Room = { ...newRoom, id: nextId };

		setHotels((prevHotels) =>
			prevHotels.map((hotel) => {
				if (hotel.id === Number(hotelId)) {
					return { ...hotel, rooms: [...hotel.rooms, room] };
				}
				return hotel;
			})
		);
		return room;
	};
	const updateRoom = async (
		hotelId: string,
		roomId: string,
		updates: Partial<Room>
	) => {
		setHotels((prevHotels) =>
			prevHotels.map((hotel) => {
				if (hotel.id === Number(hotelId)) {
					return {
						...hotel,
						rooms: hotel.rooms.map((room) =>
							room.id === Number(roomId) ? { ...room, ...updates } : room
						),
					};
				}
				return hotel;
			})
		);
		return getRoom(hotelId, roomId);
	};
	const deleteRoom = async (hotelId: string, roomId: string) => {
		setHotels((prevHotels) =>
			prevHotels.map((hotel) => {
				if (hotel.id === Number(hotelId)) {
					return {
						...hotel,
						rooms: hotel.rooms.filter((room) => room.id !== Number(roomId)),
					};
				}
				return hotel;
			})
		);
	};

	const createReservation = async (newReservation: Omit<Reservation, "id">) => {
		const nextId =
			Math.max(...reservations.map((reservation) => reservation.id)) + 1;
		const reservation = { ...newReservation, id: nextId };
		setReservations((prevReservations) => [...prevReservations, reservation]);
		return reservation;
	};

	const updateReservation = async (
		reservationId: string,
		updates: Partial<Reservation>
	) => {
		setReservations((prevReservations) =>
			prevReservations.map((reservation) =>
				reservation.id === Number(reservationId)
					? { ...reservation, ...updates }
					: reservation
			)
		);
		return getReservation(reservationId);
	};

	const getReservationsForHotel = async (hotelId: string) =>
		reservations.filter(
			(reservation) => reservation.hotelId === Number(hotelId)
		);

	const getReservationsForRoom = async (hotelId: string, roomId: string) =>
		reservations.filter(
			(reservation) =>
				reservation.hotelId === Number(hotelId) &&
				reservation.roomId === Number(roomId)
		);

	const getTakenDatesForRoom = async (hotelId: string, roomId: string) => {
		const roomReservations = await getReservationsForRoom(hotelId, roomId);
		const takenDates = roomReservations.flatMap((reservation) => {
			const startDate = new Date(reservation.checkInDate);
			const endDate = new Date(reservation.checkOutDate);
			const dates = [];
			for (
				let date = startDate;
				date <= endDate;
				date.setDate(date.getDate() + 1)
			) {
				dates.push(date.toISOString().split("T")[0]);
			}
			// console.log(dates);
			return dates;
		});
		return takenDates;
	};

	const filterRoomsByOccupantsAndDates = async (
		occupants: number,
		startDate: string,
		endDate: string
	) => {
		const hotels = await getHotels();
		if (!hotels) return [];
		const result: Hotel[] = [];

		for (let hotel of hotels) {
			if (!hotel.active) continue;
			const filteredRooms: Room[] = [];
			for (let room of hotel.rooms) {
				if (!room.active) continue;
				if (room.occupants !== occupants) continue;
				const takenDates = await getTakenDatesForRoom(
					String(hotel.id),
					String(room.id)
				);
				const start = new Date(startDate);
				const end = new Date(endDate);
				let isAvailable = true;
				for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
					if (takenDates.includes(date.toISOString().split("T")[0])) {
						isAvailable = false;
						break;
					}
				}
				if (isAvailable) filteredRooms.push(room);
			}
			if (filteredRooms.length > 0)
				result.push({ ...hotel, rooms: filteredRooms });
		}

		return result;
	};

	return (
		<HotelsAPIContext.Provider
			value={{
				getHotels,
				getHotel,
				getRoom,
				getReservation,
				createHotel,
				updateHotel,
				createRoom,
				updateRoom,
				deleteRoom,
				createReservation,
				updateReservation,
				getReservationsForHotel,
				getReservationsForRoom,
				getTakenDatesForRoom,
				filterRoomsByOccupantsAndDates,
			}}
		>
			{children}
		</HotelsAPIContext.Provider>
	);
};
