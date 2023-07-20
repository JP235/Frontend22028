export interface Room {
	id: number;
    hotelId: number;
	occupants: number;
	active: boolean;
	initial_price: number;
	tax: number;
	final_price: number;
}

export interface Hotel {
	id: number;
	name: string;
	location: string;
	active: boolean;
	rooms: Room[];
}

export interface Reservation {
	id: number;
	hotelId: number;
	roomId: number;
	checkInDate: string;
	checkOutDate: string;
	guestData: GuestData;
}

export interface GuestData {
	firstName: string;
	lastName: string;
	birthDate: string;
	gender: string;
	documentType: string;
	documentNumber: string;
	email: string;
	phone: string;
	emergencyContactName: string;
	emergencyContactPhone: string;
}
