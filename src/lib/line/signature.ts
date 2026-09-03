import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * LINE Messaging API の x-line-signature を検証する。
 * 署名は「チャネルシークレットを鍵とした本文の HMAC-SHA256（Base64）」。
 */
export function verifyLineSignature(
  rawBody: string,
  signature: string | null,
  channelSecret: string,
): boolean {
  if (!signature) {
    return false;
  }

  const expected = createHmac("sha256", channelSecret)
    .update(rawBody, "utf8")
    .digest();

  let received: Buffer;
  try {
    received = Buffer.from(signature, "base64");
  } catch {
    return false;
  }

  if (received.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(received, expected);
}
