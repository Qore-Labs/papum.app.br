import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LogoWhite } from "@/components/ui/icons";

export const alt =
  "Papum Delivery. Seu delivery, menos bagunça, mais controle.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const illustration = await readFile(
    join(process.cwd(), "public/home/product/orders.svg"),
  );
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#ffc400",
        padding: "64px",
        color: "#1b1c1c",
        flexDirection: "column",
      }}
    >
      <LogoWhite width={200} height={78} fill="#1b1c1c" />
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 730 }}>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: "-2px",
            }}
          >
            Seu delivery.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: "-2px",
            }}
          >
            Menos bagunça.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: "-2px",
            }}
          >
            Mais controle.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 24,
              maxWidth: 680,
            }}
          >
            Seu app. Seu cardápio. Pedidos e contatos em um só painel.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            background: "#191817",
            padding: "28px",
            borderRadius: 24,
          }}
        >
          {/* This is the original local Figma SVG, embedded for the generated social image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/svg+xml;base64,${illustration.toString("base64")}`}
            width={280}
            height={210}
            alt=""
          />
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 20 }}>papum.app.br</div>
    </div>,
    size,
  );
}
