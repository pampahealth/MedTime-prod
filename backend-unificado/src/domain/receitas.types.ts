export type Tomada = {
  data_hora: string;
  data: string | null;
  hora: string | null;
};

export type ReceitaMedicamentoCompat = {
  nome_medicamento: string;
  nome_imagem_medicamento: string;
  imagem_medicamento: string;
  horario: string | null;
  horarios: string[];
  data_hora_tomada: string | null;
  datas_hora_tomadas: string[];
  tomadas: Tomada[];
};

export type ReceitaCompat = {
  data_receita: string | null;
  cartao_sus: string;
  nome_paciente: string;
  medicamentos: ReceitaMedicamentoCompat[];
};
