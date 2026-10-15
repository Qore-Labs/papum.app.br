import "server-only";

import { ApiError } from "@/lib/api/errors";

export const MAX_IMAGE_BYTES = 1_048_576;
const acceptedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export async function validateImageFile(value: unknown): Promise<File> {
  if (
    !(value instanceof File) ||
    !acceptedTypes.includes(value.type) ||
    value.size === 0 ||
    value.size > MAX_IMAGE_BYTES
  ) {
    throw new ApiError(
      "invalid_image",
      "Envie uma imagem JPEG, PNG, GIF ou WebP de até 1 MB.",
      422,
      { image: ["Confira o formato e o tamanho da imagem."] },
    );
  }
  const bytes = new Uint8Array(await value.slice(0, 12).arrayBuffer());
  const ascii = (from: number, to: number) =>
    String.fromCharCode(...bytes.slice(from, to));
  const matches =
    value.type === "image/png"
      ? [137, 80, 78, 71, 13, 10, 26, 10].every(
          (byte, index) => bytes[index] === byte,
        )
      : value.type === "image/gif"
        ? ["GIF87a", "GIF89a"].includes(ascii(0, 6))
        : value.type === "image/webp"
          ? ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP"
          : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (!matches)
    throw new ApiError(
      "invalid_image",
      "O conteúdo do arquivo não corresponde ao formato informado.",
      422,
    );
  return value;
}
