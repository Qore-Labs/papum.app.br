import Image from "next/image";
import { ArrowDown, Check, Plus, Store } from "lucide-react";

import { WaitlistForm } from "@/components/forms/waitlist-form";
import { LogoWhite, BrandBoltIcon } from "@/components/ui/icons";
import { SiteStructuredData } from "@/components/seo/site-structured-data";
import { subscribeToLaunch } from "@/lib/actions/subscribe-to-launch";
import { CHANNEL_EVIDENCE, LANDING_FAQ } from "@/utils/contents/landing";
import type { LeadEntry } from "@/utils/config/attribution";

import { ProductExplorer } from "./product-explorer";
import { SignupLink } from "./signup-link";

function ProductArtwork() {
  return (
    <figure
      className="landing-art"
      aria-label="Ilustração da proposta: app do restaurante conectado a pedidos e contatos no painel Papum"
    >
      <div className="art-orbit" aria-hidden="true" />
      <div className="art-app">
        <div className="art-app-brand">
          <span aria-hidden="true">
            <Store size={36} aria-hidden="true" />
          </span>
          <strong>
            Sua marca.
            <br />
            Seu app.
          </strong>
        </div>
        <div className="art-menu" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="art-order">
        <Image
          src="/home/product/orders.svg"
          alt=""
          width={340}
          height={255}
          sizes="(max-width: 767px) 220px, 300px"
          className="h-auto w-full"
          preload
        />
        <span>
          <Check size={16} aria-hidden="true" /> Pedidos organizados
        </span>
      </div>
      <div className="art-contacts">
        <Image
          src="/home/product/contacts.svg"
          alt=""
          width={340}
          height={255}
          sizes="(max-width: 767px) 170px, 220px"
          className="h-auto w-full"
        />
        <span>Contatos por perto.</span>
      </div>
      <figcaption>
        Seu restaurante na frente.
        <br />A Papum nos bastidores.
      </figcaption>
    </figure>
  );
}

export function LandingPage({ entry = "home" }: { entry?: LeadEntry }) {
  return (
    <main className="landing-page">
      <SiteStructuredData />
      <section
        data-header-zone="hero"
        className="landing-hero"
        aria-labelledby="landing-title"
      >
        <Image
          src="/home/product/lightning.svg"
          alt=""
          width={720}
          height={720}
          className="hero-lightning"
        />
        <div className="landing-container hero-grid">
          <div className="hero-copy">
            <h1 id="landing-title">
              Seu delivery.
              <br />
              Menos bagunça.
              <br />
              <span>Mais controle.</span>
            </h1>
            <p className="hero-description">
              Um app com a sua marca e um painel para organizar cardápio,
              pedidos e contatos.
            </p>
            <div id="cadastro" className="hero-signup">
              <WaitlistForm
                subscribeAction={subscribeToLaunch}
                turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                variant="landing"
                entry={entry}
              />
            </div>
            <a className="hero-explore" href="#produto">
              Conheça a Papum <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
          <ProductArtwork />
        </div>
      </section>

      <section
        id="produto"
        data-header-zone="light"
        className="landing-product landing-container"
        aria-labelledby="product-title"
      >
        <div className="product-introduction">
          <h2 id="product-title">
            A marca é sua.
            <br />A estrutura é Pápum.
          </h2>
          <p>
            Do que seu cliente vê ao que você precisa acompanhar: cada parte do
            delivery tem seu lugar.
          </p>
        </div>
        <div className="product-relationship">
          <div>
            <span className="restaurant-symbol" aria-hidden="true">
              <Store size={36} aria-hidden="true" />
            </span>
            <h3>Na mão do cliente.</h3>
            <p>O app do seu restaurante, com seu cardápio e sua identidade.</p>
          </div>
          <BrandBoltIcon className="relationship-bolt" aria-hidden="true" />
          <div>
            <LogoWhite className="relationship-logo" aria-hidden="true" />
            <h3>Na sua operação.</h3>
            <p>O painel Papum para reunir pedidos, cardápio e contatos.</p>
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        data-header-zone="dark"
        className="landing-features"
        aria-labelledby="features-title"
      >
        <div className="landing-container">
          <div className="features-heading">
            <h2 id="features-title">
              Menos espalhado.
              <br />
              Mais conectado.
            </h2>
            <p>Conheça as três partes que dão forma à proposta da Papum.</p>
          </div>
          <ProductExplorer />
          <div className="features-cta">
            <span>Faz sentido para o seu restaurante?</span>
            <SignupLink location="benefits" />
          </div>
        </div>
      </section>

      <section
        className="landing-channel landing-container"
        data-header-zone="light"
        aria-labelledby="channel-title"
      >
        <div>
          <h2 id="channel-title">
            Um app próprio.
            <br />
            Mais motivos para voltar.
          </h2>
          <p>
            Esteja no celular de quem já conhece seu restaurante. Um canal com a
            sua marca deixa o próximo pedido mais perto — e o relacionamento com
            o cliente também.
          </p>
        </div>
        <div className="channel-evidence">
          <p>
            <strong>{CHANNEL_EVIDENCE.value}</strong> {CHANNEL_EVIDENCE.result}
          </p>
        </div>
      </section>

      <section
        className="landing-faq landing-container"
        data-header-zone="light"
        aria-labelledby="faq-title"
      >
        <h2 id="faq-title">Dúvidas frequentes</h2>
        <div>
          {LANDING_FAQ.map((item) => (
            <details key={item.id}>
              <summary>
                {item.question}
                <Plus size={22} aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section
        data-header-zone="yellow"
        className="landing-final"
        aria-labelledby="final-cta-title"
      >
        <div className="landing-container">
          <div>
            <h2 id="final-cta-title">
              Seu próximo passo
              <br />
              pode ser Pápum.
            </h2>
            <p>
              Deixe seu e-mail e conheça uma nova forma de organizar seu
              delivery.
            </p>
          </div>
          <SignupLink location="final_cta" />
        </div>
      </section>
    </main>
  );
}
