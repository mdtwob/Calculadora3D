// Inicialização dos Lucide Icons
lucide.createIcons();

// Arrays para guardar múltiplos itens
let filamentos = [
  { id: 1, nome: "PLA Premium", precoRolo: 100, freteRolo: 15, impostoRolo: 0, pesoRolo: 1000, gramasUsadas: 80 }
];

let insumos = [
  { id: 1, nome: "Acrílico / Parafusos / Embalagem", custo: 5.00 }
];

// Renderiza lista de filamentos
function renderizarFilamentos() {
  const container = document.getElementById('listaFilamentos');
  container.innerHTML = '';

  filamentos.forEach((fil, index) => {
    const div = document.createElement('div');
    div.className = "bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 text-xs space-y-3 relative";
    div.innerHTML = `
      <div class="flex justify-between items-center border-b border-slate-800 pb-2">
        <span class="font-semibold text-slate-300">Filamento #${index + 1}</span>
        ${filamentos.length > 1 ? `
          <button onclick="removerFilamento(${fil.id})" class="text-rose-400 hover:text-rose-300 font-medium">
            Remover
          </button>
        ` : ''}
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        <div class="col-span-2 sm:col-span-1 md:col-span-2">
          <label class="block text-slate-400 mb-0.5">Descrição</label>
          <input type="text" value="${fil.nome}" oninput="atualizarFilamento(${fil.id}, 'nome', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200">
        </div>
        <div>
          <label class="block text-slate-400 mb-0.5">Gramas Peça</label>
          <input type="number" value="${fil.gramasUsadas}" oninput="atualizarFilamento(${fil.id}, 'gramasUsadas', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200">
        </div>
        <div>
          <label class="block text-slate-400 mb-0.5">Rolo (R$)</label>
          <input type="number" value="${fil.precoRolo}" oninput="atualizarFilamento(${fil.id}, 'precoRolo', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200">
        </div>
        <div>
          <label class="block text-slate-400 mb-0.5">Frete Rolo (R$)</label>
          <input type="number" value="${fil.freteRolo}" oninput="atualizarFilamento(${fil.id}, 'freteRolo', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200">
        </div>
        <div>
          <label class="block text-slate-400 mb-0.5">Imposto Rolo (R$)</label>
          <input type="number" value="${fil.impostoRolo}" oninput="atualizarFilamento(${fil.id}, 'impostoRolo', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Renderiza lista de insumos
function renderizarInsumos() {
  const container = document.getElementById('listaInsumos');
  container.innerHTML = '';

  insumos.forEach((ins) => {
    const div = document.createElement('div');
    div.className = "flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 rounded-lg p-2 text-xs";
    div.innerHTML = `
      <input type="text" value="${ins.nome}" placeholder="Nome do item extra" oninput="atualizarInsumo(${ins.id}, 'nome', this.value)" class="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200">
      <input type="number" value="${ins.custo}" placeholder="Valor (R$)" oninput="atualizarInsumo(${ins.id}, 'custo', this.value)" class="w-28 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200">
      <button onclick="removerInsumo(${ins.id})" class="text-rose-400 hover:text-rose-300 p-1">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    `;
    container.appendChild(div);
  });
  lucide.createIcons();
}

function adicionarFilamento() {
  filamentos.push({
    id: Date.now(),
    nome: "Novo Filamento",
    precoRolo: 100,
    freteRolo: 0,
    impostoRolo: 0,
    pesoRolo: 1000,
    gramasUsadas: 50
  });
  renderizarFilamentos();
  calcular();
}

function removerFilamento(id) {
  filamentos = filamentos.filter(f => f.id !== id);
  renderizarFilamentos();
  calcular();
}

function atualizarFilamento(id, campo, valor) {
  const item = filamentos.find(f => f.id === id);
  if (item) {
    item[campo] = campo === 'nome' ? valor : parseFloat(valor) || 0;
    calcular();
  }
}

function adicionarInsumo() {
  insumos.push({ id: Date.now(), nome: "Item Extra", custo: 0 });
  renderizarInsumos();
  calcular();
}

function removerInsumo(id) {
  insumos = insumos.filter(i => i.id !== id);
  renderizarInsumos();
  calcular();
}

function atualizarInsumo(id, campo, valor) {
  const item = insumos.find(i => i.id === id);
  if (item) {
    item[campo] = campo === 'nome' ? valor : parseFloat(valor) || 0;
    calcular();
  }
}

// Função Principal de Cálculo
function calcular() {
  // 1. Custo Filamentos
  let custoFilamentoTotal = 0;
  filamentos.forEach(fil => {
    const custoTotalRolo = (fil.precoRolo || 0) + (fil.freteRolo || 0) + (fil.impostoRolo || 0);
    const custoPorGrama = custoTotalRolo / (fil.pesoRolo || 1000);
    custoFilamentoTotal += custoPorGrama * (fil.gramasUsadas || 0);
  });

  // 2. Energia
  const horasImpressao = parseFloat(document.getElementById('horasImpressao').value) || 0;
  const potenciaWatts = parseFloat(document.getElementById('potenciaWatts').value) || 0;
  const custoKwh = parseFloat(document.getElementById('custoKwh').value) || 0;
  const consumoKwh = (potenciaWatts / 1000) * horasImpressao;
  const custoEnergiaTotal = consumoKwh * custoKwh;

  // 3. Depreciação / Manutenção Impressora
  const taxaDepreciacao = parseFloat(document.getElementById('taxaDepreciacao').value) || 0;
  const custoDepreciacaoTotal = horasImpressao * taxaDepreciacao;

  // 4. Mão de Obra
  const valorHoraMaoObra = parseFloat(document.getElementById('valorHoraMaoObra').value) || 0;
  const tempoPreparacaoMin = parseFloat(document.getElementById('tempoPreparacaoMin').value) || 0;
  const tempoAcabamentoMin = parseFloat(document.getElementById('tempoAcabamentoMin').value) || 0;
  const horasMaoObra = (tempoPreparacaoMin + tempoAcabamentoMin) / 60;
  const custoMaoObraTotal = horasMaoObra * valorHoraMaoObra;

  // 5. Insumos Extras
  let custoInsumosTotal = 0;
  insumos.forEach(i => custoInsumosTotal += (i.custo || 0));

  // 6. Subtotal de Custos Base
  const subtotalCustos = custoFilamentoTotal + custoEnergiaTotal + custoDepreciacaoTotal + custoMaoObraTotal + custoInsumosTotal;

  // 7. Margem de Risco / Falha
  const margemRisco = parseFloat(document.getElementById('margemRisco').value) || 0;
  const valorRisco = subtotalCustos * (margemRisco / 100);

  // CUSTO TOTAL DIRETO
  const custoTotalDireto = subtotalCustos + valorRisco;

  // 8. Margem de Lucro Desejada
  const margemLucro = parseFloat(document.getElementById('margemLucro').value) || 0;
  const valorLucroDesejado = custoTotalDireto * (margemLucro / 100);
  const valorComLucro = custoTotalDireto + valorLucroDesejado;

  // 9. Cálculo de Impostos & Taxas de Venda "Por Dentro"
  const taxaVendaPct = parseFloat(document.getElementById('taxaVenda').value) || 0;
  const impostoNFPct = parseFloat(document.getElementById('impostoNF').value) || 0;
  
  const somaPorcentagensImposto = (taxaVendaPct + impostoNFPct) / 100;

  let valorFinalCliente = 0;
  let valorTaxaVenda = 0;
  let valorImpostoNF = 0;

  if (somaPorcentagensImposto < 1) {
    valorFinalCliente = valorComLucro / (1 - somaPorcentagensImposto);
    valorTaxaVenda = valorFinalCliente * (taxaVendaPct / 100);
    valorImpostoNF = valorFinalCliente * (impostoNFPct / 100);
  } else {
    valorFinalCliente = valorComLucro;
  }

  // Atualização na Interface Visual
  document.getElementById('resumoFilamento').innerText = fmt(custoFilamentoTotal);
  document.getElementById('resumoEnergia').innerText = fmt(custoEnergiaTotal);
  document.getElementById('resumoDepreciacao').innerText = fmt(custoDepreciacaoTotal);
  document.getElementById('resumoMaoObra').innerText = fmt(custoMaoObraTotal);
  document.getElementById('resumoInsumos').innerText = fmt(custoInsumosTotal);
  document.getElementById('resumoRisco').innerText = fmt(valorRisco);
  document.getElementById('resumoCustoTotal').innerText = fmt(custoTotalDireto);

  document.getElementById('resumoLucroLiquido').innerText = fmt(valorLucroDesejado);
  document.getElementById('resumoTaxaVenda').innerText = fmt(valorTaxaVenda);
  document.getElementById('resumoImpostoNF').innerText = fmt(valorImpostoNF);

  document.getElementById('resumoValorFinal').innerText = fmt(valorFinalCliente);
}

function fmt(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function salvarConfiguracoesPadrao() {
  const config = {
    potenciaWatts: document.getElementById('potenciaWatts').value,
    custoKwh: document.getElementById('custoKwh').value,
    taxaDepreciacao: document.getElementById('taxaDepreciacao').value,
    valorHoraMaoObra: document.getElementById('valorHoraMaoObra').value,
    margemRisco: document.getElementById('margemRisco').value,
    margemLucro: document.getElementById('margemLucro').value,
    impostoNF: document.getElementById('impostoNF').value
  };
  localStorage.setItem('printcalc_config', JSON.stringify(config));
  alert("Valores padrão salvos com sucesso!");
}

function carregarConfiguracoesPadrao() {
  const saved = localStorage.getItem('printcalc_config');
  if (saved) {
    const config = JSON.parse(saved);
    if (config.potenciaWatts) document.getElementById('potenciaWatts').value = config.potenciaWatts;
    if (config.custoKwh) document.getElementById('custoKwh').value = config.custoKwh;
    if (config.taxaDepreciacao) document.getElementById('taxaDepreciacao').value = config.taxaDepreciacao;
    if (config.valorHoraMaoObra) document.getElementById('valorHoraMaoObra').value = config.valorHoraMaoObra;
    if (config.margemRisco) document.getElementById('margemRisco').value = config.margemRisco;
    if (config.margemLucro) document.getElementById('margemLucro').value = config.margemLucro;
    if (config.impostoNF) document.getElementById('impostoNF').value = config.impostoNF;
  }
}

function limparCampos() {
  document.getElementById('nomeProjeto').value = '';
  document.getElementById('nomeCliente').value = '';
  document.getElementById('horasImpressao').value = 1;
  document.getElementById('tempoPreparacaoMin').value = 10;
  document.getElementById('tempoAcabamentoMin').value = 0;
  filamentos = [{ id: 1, nome: "PLA Premium", precoRolo: 100, freteRolo: 0, impostoRolo: 0, pesoRolo: 1000, gramasUsadas: 50 }];
  insumos = [];
  renderizarFilamentos();
  renderizarInsumos();
  calcular();
}

function copiarOrcamentoCliente() {
  const projeto = document.getElementById('nomeProjeto').value || 'Impressão 3D Customizada';
  const cliente = document.getElementById('nomeCliente').value ? `Atn: ${document.getElementById('nomeCliente').value}\n` : '';
  const horas = document.getElementById('horasImpressao').value;
  const valorTotal = document.getElementById('resumoValorFinal').innerText;
  const impostoNFPct = document.getElementById('impostoNF').value;

  let filamentoStr = filamentos.map(f => `- ${f.nome}: ${f.gramasUsadas}g`).join('\n');

  const texto = `📋 *ORÇAMENTO DE IMPRESSÃO 3D*\n${cliente}----------------------------------\n🔹 *Projeto:* ${projeto}\n⏱️ *Tempo Estimado:* ${horas}h de produção\n🧵 *Material:* \n${filamentoStr}\n\n📄 *Nota Fiscal (NF-e/NFS-e):* Incluída (${impostoNFPct}%)\n----------------------------------\n💰 *VALOR TOTAL:* ${valorTotal}\n----------------------------------\n\n_Orçamento válido por 7 dias._\nQualquer dúvida estou à disposição!`;

  navigator.clipboard.writeText(texto).then(() => {
    alert("Resumo formatado copiado para a área de transferência!");
  });
}

// Inicialização ao carregar página
window.onload = function() {
  carregarConfiguracoesPadrao();
  renderizarFilamentos();
  renderizarInsumos();
  calcular();
};