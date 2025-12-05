export type AttendanceStatus = "Present" | "Absent" | "Late" | "On Leave";
export type WorkMode = "WFO" | "WFH";

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    name: string;
    email: string;
    role: string;
    department: string;
    date: string; // YYYY-MM-DD
    loginTime: string; // "09:15"
    logoutTime: string; // "18:00"
    totalHours: number;
    workMode: WorkMode;
    status: AttendanceStatus;
    notes?: string;

    // Geo-fencing fields
    geoLat?: number;
    geoLng?: number;
    geoVerified?: boolean;
    geoDistanceMeters?: number;
}

// Example office geofence (Chennai approx)
export const OFFICE_LOCATION = { lat: 13.0827, lng: 80.2707 };
export const OFFICE_RADIUS_METERS = 300;


// ---------- Quick View Modal ----------
export interface AttendanceQuickViewModalProps {
    open: boolean;
    record: AttendanceRecord | null;
    onClose: () => void;
}

// ---------- Edit Modal with Geo-fencing ----------
export interface AttendanceEditModalProps {
    open: boolean;
    record: AttendanceRecord | null;
    onClose: () => void;
    onSave: (updated: AttendanceRecord) => void;
}

function toRad(deg: number) {
    return (deg * Math.PI) / 180;
}
// Haversine distance in meters
export function distanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
) {
    const R = 6371e3; // Earth radius in m
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) *
        Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}