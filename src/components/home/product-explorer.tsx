"use client";

import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { useState } from "react";

import { PRODUCT_FEATURES } from "@/utils/contents/landing";

const menuSections = [
  { id: "categorias", label: "Categorias" },
  { id: "produtos", label: "Seus produtos" },
] as const;

function MenuIllustration() {
  return (
    <div className="menu-illustration" aria-hidden="true">
      <div>
        <BookOpen size={28} />
        <strong>Seu cardápio</strong>
      </div>
      {menuSections.map((item) => (
        <div key={item.id} className="menu-illustration-row">
          <span />{" "}
          <div>
            <b>{item.label}</b>
            <i />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductExplorer() {
  const [selected, setSelected] = useState(PRODUCT_FEATURES[0].id);
  const feature = PRODUCT_FEATURES.find((item) => item.id === selected)!;

  return (
    <div className="product-explorer">
      <div className="product-options" aria-label="Conheça os recursos">
        {PRODUCT_FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected === item.id}
              aria-controls="product-detail"
              onClick={() => setSelected(item.id)}
              className="product-option"
            >
              <Icon size={22} aria-hidden="true" />
              <span>{item.label}</span>
              <ArrowRight size={20} className="ml-auto" aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div
        id="product-detail"
        className="product-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <div key={feature.id} className="product-detail-content">
          {feature.image ? (
            <Image
              src={feature.image}
              alt=""
              width={340}
              height={255}
              sizes="(max-width: 767px) 260px, 320px"
              className="h-auto w-full max-w-80"
            />
          ) : (
            <MenuIllustration />
          )}
          <div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <p className="product-detail-note">{feature.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
