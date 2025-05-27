import { api } from "@/lib/axios";

/**
 * Obtém as quadras mais alugadas
 * @param status - Status da reserva (PAGO_PRESENCIALMENTE, PAGO_SPORTMAP)
 * @returns Array de quadras mais alugadas
 */
export async function getMostRentedCourts(status?: string) {
  const { data } = await api.get("/dashboards/most-rented", {
    params: status ? { status } : {},
  });
  return data;
}

/**
 * Busca reservas ativas do proprietário (owner)
 */
export async function getActiveReservationsByOwner() {
  const { data } = await api.get("/dashboards/reservations/active/owner");
  return data;
}

/**
 * Busca reservas ativas por quadra
 * @param courtId - ID da quadra
 */
export async function getActiveReservationsByCourt() {
  const { data } = await api.get(`/dashboards/reservations/active/by-court`);
  return data;
}
