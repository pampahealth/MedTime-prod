export type Paciente = {
  id: string;
  cartao_sus: string;
  nome: string;
  celular: string | null;
  data_nascimento: string | null;
};

export type Medicamento = {
  id: string;
  nome: string;
  imagem_base64: string | null;
  ativo: boolean;
};

export type ReceitaHorario = {
  id: string;
  id_rm: string;
  data_hora_disparo: string;
  tomou: boolean | null;
  tentativas: number;
};
