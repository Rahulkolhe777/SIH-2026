import crypto from "crypto";

/**
 * Generates a unique, human-readable 8-character token code (e.g. TKN-7821)
 */
export function generateBookingToken(prefix = "TKN"): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomDigits}`;
}

/**
 * Creates a signed verification hash for QR code generation
 */
export function generateQrPayload(bookingId: string, token: string, slotId: string): string {
  const data = `${bookingId}:${token}:${slotId}`;
  return Buffer.from(data).toString("base64");
}

/**
 * Decodes and verifies QR code payload
 */
export function parseQrPayload(qrData: string): { bookingId?: string; token?: string; slotId?: string } | null {
  try {
    const decoded = Buffer.from(qrData, "base64").toString("utf-8");
    const [bookingId, token, slotId] = decoded.split(":");
    if (bookingId && token && slotId) {
      return { bookingId, token, slotId };
    }
    return null;
  } catch {
    return null;
  }
}
