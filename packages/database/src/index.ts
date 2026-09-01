export { getDb } from "./client";
export {
  createShipment,
  createTrackingEvent,
  getShipmentIdByReference,
  getShipmentWithEvents,
  listShipments,
  searchCustomersByEmail,
} from "./queries";
export type {
  CreateShipmentInput,
  CreateTrackingEventInput,
  CustomerSummary,
  ShipmentSummary,
  ShipmentWithEvents,
} from "./queries";
export * as schema from "./schema";
export type {
  Customer,
  CustomerAccount,
  CustomerSession,
  CustomerVerificationToken,
  HealthCheck,
  NewCustomer,
  NewCustomerAccount,
  NewCustomerSession,
  NewCustomerVerificationToken,
  NewHealthCheck,
  NewShipment,
  NewStaff,
  NewStaffAccount,
  NewStaffSession,
  NewStaffVerificationToken,
  NewTrackingEvent,
  Shipment,
  Staff,
  StaffAccount,
  StaffSession,
  StaffVerificationToken,
  TrackingEvent,
} from "./schema";
