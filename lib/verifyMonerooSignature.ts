import crypto from "crypto";

/**
 * Vérifie la signature Moneroo envoyée dans le header `X-Moneroo-Signature`.
 * @param payload - le corps JSON reçu (stringifié)
 * @param signatureHeader - valeur du header reçu
 * @returns true si la signature est valide
 */
export function verifyMonerooSignature(
  payload: string,
  signatureHeader: string | undefined
): boolean {
  if (!signatureHeader || !process.env.MONEROO_WEBHOOK_SECRET) return false;

  // Signature attendue = HMAC SHA256 du payload avec la clé secrète du webhook
  const expectedSignature = crypto
    .createHmac("sha256", process.env.MONEROO_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return expectedSignature === signatureHeader;
}
