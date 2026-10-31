import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidade | Papum Delivery",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <main className="landing-page min-h-svh pt-40 pb-24">
      <article className="landing-container max-w-200 space-y-8 text-base leading-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Sua privacidade importa.
        </h1>
        <p>
          A Papum Delivery utiliza os dados informados no cadastro para
          responder ao seu interesse e enviar informações sobre a plataforma. O
          cadastro não cria uma conta operacional nem gera cobrança.
        </p>
        <section>
          <h2 className="mb-4 text-2xl!">O e-mail que você informa</h2>
          <p>
            Seu endereço e a origem do cadastro, como a entrada pelo link do
            Instagram, são encaminhados à equipe e usados para enviar a
            confirmação pelo Resend. Nesta etapa, não há banco de leads no site.
            Para cancelar mensagens, solicitar exclusão ou tirar dúvidas,
            responda ao e-mail recebido ou escreva para{" "}
            <a className="underline" href="mailto:contato@binaryinc.com.br">
              contato@binaryinc.com.br
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="mb-4 text-2xl!">Como entendemos a navegação</h2>
          <p>
            Quando configurados, Google Analytics e Microsoft Clarity utilizam
            inicialmente o modo sem cookies de análise. Eles podem receber
            informações técnicas e de interação com as páginas públicas para
            ajudar a entender o uso do site. Sem cookies, a continuidade entre
            visitas e os recursos de gravação ficam limitados. Não tratamos essa
            análise como anônima em todos os aspectos.
          </p>
          <p className="mt-4">
            Campos do formulário e mensagens ficam mascarados para o Clarity.
            Não enviamos seu e-mail, tokens de verificação ou valores dos campos
            em eventos de analytics. Login e painel administrativo não recebem
            essas tags.
          </p>
        </section>
        <section>
          <h2 className="mb-4 text-2xl!">Você tem o controle</h2>
          <p>
            Em “Preferências de privacidade”, no rodapé, você pode desativar a
            análise ou permitir cookies de análise. A desativação interrompe
            novos eventos e gravações. A escolha fica guardada no navegador;
            recursos de publicidade permanecem desativados. O cadastro funciona
            independentemente dessa escolha.
          </p>
          <p className="mt-4">
            Quando permitidos, os cookies de análise ajudam a conectar páginas
            de uma mesma visita. Os fornecedores também aplicam as próprias
            regras de consentimento e localização. Consulte as políticas de{" "}
            <a
              className="underline"
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google (nova aba)
            </a>
            ,{" "}
            <a
              className="underline"
              href="https://privacy.microsoft.com/privacystatement"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft (nova aba)
            </a>{" "}
            e{" "}
            <a
              className="underline"
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resend (nova aba)
            </a>
            .
          </p>
        </section>
        <p>
          <Link href="/" className="underline underline-offset-4">
            Voltar para a Papum
          </Link>
        </p>
      </article>
    </main>
  );
}
