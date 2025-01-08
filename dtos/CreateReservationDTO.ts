export interface CreateReservationDTO {
  ownerId: string;
  courtId: string;
  reservedStartTime: string;
  status: "requested" | "approved" | "rejected" | "cancelled";
  dayOfWeek: string;
}
