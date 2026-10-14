import { AdminPopover } from "@/components/ui/admin-popover";

export function AdminHelpPopover({ id }: { id: string }) {
  return (
    <AdminPopover id={id} title="Ajuda e suporte">
      <p>Esta é uma prévia do painel com dados de demonstração.</p>
      <p className="mt-2">
        Busque pelo número do pedido ou pelo nome do cliente. O relatório
        exporta os pedidos exibidos no período selecionado.
      </p>
      <p className="mt-2">
        Em Cardápio, filtre os pratos e use Novo Item ou Editar. As alterações
        da prévia ficam disponíveis até recarregar a página.
      </p>
      <p className="mt-2">
        Em Clientes, busque por nome, e-mail ou telefone e use Novo Cliente ou
        as ações da listagem para testar cadastro, edição e status.
      </p>
      <p className="mt-2">
        Em Configurações, preencha o cadastro do estabelecimento. Finalizar
        Cadastro valida a prévia; Novo Cadastro limpa os campos. O endereço é
        preenchido manualmente, e os dados duram até recarregar.
      </p>
    </AdminPopover>
  );
}
