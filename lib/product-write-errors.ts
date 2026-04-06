import { Prisma } from "@prisma/client";

type ProductWriteErrorPayload = {
  error: string;
  hint: string;
  status: number;
};

function getTargetFields(meta: unknown) {
  if (!meta || typeof meta !== "object" || !("target" in meta)) {
    return [];
  }

  const target = (meta as { target?: unknown }).target;
  return Array.isArray(target) ? target.map((entry) => String(entry)) : [];
}

export function getProductWriteErrorPayload(error: unknown, action: "create" | "update"): ProductWriteErrorPayload {
  const defaultMessage = action === "create" ? "Product could not be created." : "Product could not be updated.";
  const defaultHint = "Please check required fields and try again.";

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const targetFields = getTargetFields(error.meta);

      if (targetFields.includes("sku")) {
        return {
          error: defaultMessage,
          hint: "SKU already exists.",
          status: 400
        };
      }

      if (targetFields.includes("slug")) {
        return {
          error: defaultMessage,
          hint: "Slug already exists.",
          status: 400
        };
      }

      return {
        error: defaultMessage,
        hint: "A unique field already exists.",
        status: 400
      };
    }

    if (error.code === "P2003") {
      return {
        error: defaultMessage,
        hint: "Selected category is invalid.",
        status: 400
      };
    }

    if (error.code === "P2025") {
      return {
        error: defaultMessage,
        hint: "Product record was not found.",
        status: 404
      };
    }
  }

  return {
    error: defaultMessage,
    hint: defaultHint,
    status: 400
  };
}
