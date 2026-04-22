/* ============================================================
   MASSA ALEGRE — script.js v3
   Ajustado para imagens reais + fallback por emoji
   ============================================================ */

// ============================================================
// LOGO
// ============================================================
(function () {
  const img = document.getElementById('logo-img');
  if (img) {
    img.src = 'logo.png';
  }
})();

// ============================================================
// DADOS
// ============================================================

const WHATSAPP_NUMBER = '5524999766820';

const TAXA_ENTREGA = {
  'vista alegre': 3,
  'vila nova': 5,
  'agua comprida': 6,
  'saudade': 7,
  'vila maria': 8,
  'vila brigida': 6,
  'vila coringa': 7,
  'ano bom': 15,
  'centro': 15,
  'boa vista': 10,
};

const PRODUTOS = {
  salgados: [
    { id: 's1', nome: 'Carne', preco: 8.0, emoji: '🥩', imagem: 'carne.jpg' },
    { id: 's2', nome: 'Carne c/ Cheddar', preco: 9.0, emoji: '🧀', imagem: 'carne.jpg' },
    { id: 's3', nome: 'Carne c/ Requeijão', preco: 9.0, emoji: '🧀', imagem: 'carne.jpg' },
    { id: 's4', nome: 'Carne c/ Queijo', preco: 10.0, emoji: '🧀', imagem: 'carne.jpg' },

    { id: 's5', nome: 'Calabresa c/ Cheddar', preco: 9.0, emoji: '🌶️', imagem: 'calabresa.jpg' },
    { id: 's6', nome: 'Calabresa c/ Requeijão', preco: 9.0, emoji: '🌶️', imagem: 'calabresa.jpg' },
    { id: 's7', nome: 'Calabresa c/ Queijo', preco: 10.0, emoji: '🌶️', imagem: 'calabresa.jpg' },

    { id: 's8', nome: 'Frango', preco: 8.0, emoji: '🍗', imagem: 'frango.jpg' },
    { id: 's9', nome: 'Frango c/ Cheddar', preco: 9.0, emoji: '🍗', imagem: 'frango.jpg' },
    { id: 's10', nome: 'Frango c/ Requeijão', preco: 9.0, emoji: '🍗', imagem: 'frango.jpg' },
    { id: 's11', nome: 'Frango c/ Queijo', preco: 10.0, emoji: '🍗', imagem: 'frango.jpg' },

    { id: 's12', nome: 'Queijo', preco: 8.0, emoji: '🧀', imagem: 'queijo.jpg' },
    { id: 's14', nome: '4 Queijos', preco: 10.0, emoji: '🧀', imagem: 'queijo.jpg' },
    { id: 's15', nome: '4 Queijos c/ Calabresa', preco: 12.0, emoji: '🌶️', imagem: 'queijo.jpg' },
    { id: 's16', nome: '4 Queijos c/ Carne', preco: 12.0, emoji: '🥩', imagem: 'queijo.jpg' },
    { id: 's17', nome: '4 Queijos c/ Frango', preco: 12.0, emoji: '🍗', imagem: 'queijo.jpg' },
	{ id: 's13', nome: 'Pizza', preco: 14.0, emoji: '🍕', imagem: 'pizza.jpg' },
    { id: 's18', nome: 'Sem Miséria (Especial)', preco: 12.0, emoji: '⭐', imagem: 'images/especial.jpg' },
  ],

  doces: [
    { id: 'd1', nome: 'Banana c/ Canela', preco: 8.0, emoji: '🍌', imagem: 'banana.jpg' },
    { id: 'd2', nome: 'Banana c/ Queijo e Canela', preco: 10.0, emoji: '🍌', imagem: 'banana.jpg' },
    { id: 'd3', nome: 'Doce de Leite', preco: 8.0, emoji: '🍯', imagem: 'doce.jpg' },
    { id: 'd4', nome: 'Doce de Leite c/ Queijo', preco: 10.0, emoji: '🍯', imagem: 'doce.jpg' },
    { id: 'd5', nome: 'Doce de Leite c/ Paçoca', preco: 10.0, emoji: '🍯', imagem: 'doce.jpg' },
    { id: 'd6', nome: 'Goiabada', preco: 8.0, emoji: '🍓', imagem: 'goiabada2.jpg' },
    { id: 'd7', nome: 'Goiabada c/ Queijo', preco: 10.0, emoji: '🍓', imagem: 'goiabada2.jpg' },
    { id: 'd8', nome: 'Nutella', preco: 9.0, emoji: '🍫', imagem: 'nutela.jpg' },
    { id: 'd9', nome: 'Nutella c/ Banana', preco: 10.0, emoji: '🍫', imagem: 'nutela.jpg' },
  ],

  caldo: [
    { id: 'c1', nome: 'Copo 300 ml', preco: 5.0, emoji: '🥤', imagem: 'cana.jpg', isCaldo: true },
    { id: 'c2', nome: 'Copo 400 ml', preco: 6.0, emoji: '🥤', imagem: 'cana.jpg', isCaldo: true },
    { id: 'c3', nome: 'Copo 500 ml', preco: 7.0, emoji: '🥤', imagem: 'cana.jpg', isCaldo: true },
    { id: 'c4', nome: 'Garrafa 500 ml', preco: 8.0, emoji: '🍶', imagem: 'cana.jpg', isCaldo: true },
    { id: 'c5', nome: 'Garrafa 1 Litro', preco: 14.0, emoji: '🍶', imagem: 'cana.jpg', isCaldo: true },
  ],
};

// ============================================================
// ESTADO
// ============================================================

let carrinho = [];
let tipoEntrega = 'retirada';
let pagamento = 'dinheiro';
let taxaEntrega = 0;
let caldoPendente = null;

// ============================================================
// UTILS
// ============================================================

function fmt(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function normalizeBairro(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function calcSubtotal() {
  return carrinho.reduce((soma, item) => soma + item.preco * item.qty, 0);
}

function calcTaxaCartao() {
  return pagamento === 'cartao' ? 1 : 0;
}

function calcFrete() {
  if (tipoEntrega === 'retirada') return 0;
  return taxaEntrega >= 0 ? taxaEntrega : 0;
}

function calcTotal() {
  return calcSubtotal() + calcFrete() + calcTaxaCartao();
}

function buscarProdutoPorId(id) {
  return Object.values(PRODUTOS).flat().find((p) => p.id === id);
}

// ============================================================
// RENDERIZAR PRODUTOS
// ============================================================

function renderProdutos() {
  ['salgados', 'doces', 'caldo'].forEach((cat) => {
    const grid = document.getElementById('grid-' + cat);
    if (!grid) return;

    grid.innerHTML = '';

    PRODUTOS[cat].forEach((p) => {
      const itensMesmoId = carrinho.filter((c) => c.id === p.id);
      const qty = itensMesmoId.reduce((s, i) => s + i.qty, 0);

      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.id = p.id;

      card.innerHTML = `
        <div class="card-img">
          <img
            src="${p.imagem}"
            alt="${p.nome}"
            loading="lazy"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          >
          <span class="fallback-emoji" style="display:none;">${p.emoji}</span>
        </div>

        ${qty > 0 ? `<span class="card-badge">${qty}</span>` : ''}

        <div class="card-body">
          <p class="card-name">${p.nome}</p>
          <p class="card-price">${fmt(p.preco)}</p>

          <div class="card-actions">
            ${
              qty === 0
                ? `<button class="btn-add" data-id="${p.id}" data-caldo="${p.isCaldo ? '1' : '0'}">+</button>`
                : `<div class="qty-control">
                     <button class="qty-btn minus" data-id="${p.id}">−</button>
                     <span class="qty-num">${qty}</span>
                     <button class="qty-btn plus" data-id="${p.id}" data-caldo="${p.isCaldo ? '1' : '0'}">+</button>
                   </div>`
            }
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  });

  atualizarCartBar();
}

// ============================================================
// EVENTOS CARDS
// ============================================================

document.addEventListener('click', (e) => {
  const btnAdd = e.target.closest('.btn-add, .qty-btn.plus');
  if (btnAdd && btnAdd.dataset.id) {
    if (btnAdd.dataset.caldo === '1') {
      abrirModalSabor(btnAdd.dataset.id);
    } else {
      adicionarAoCarrinho(btnAdd.dataset.id, null);
    }
    return;
  }

  const btnMinus = e.target.closest('.qty-btn.minus');
  if (btnMinus && btnMinus.dataset.id) {
    diminuirNoCarrinho(btnMinus.dataset.id);
  }
});

function adicionarAoCarrinho(id, sabor) {
  const produto = buscarProdutoPorId(id);
  if (!produto) return;

  const chave = produto.isCaldo ? `${id}_${sabor}` : id;
  let item = carrinho.find((c) => c.chave === chave);

  if (item) {
    item.qty++;
  } else {
    const nomeDisplay = produto.isCaldo ? `${produto.nome} (${sabor})` : produto.nome;
    carrinho.push({
      id,
      chave,
      nome: nomeDisplay,
      preco: produto.preco,
      emoji: produto.emoji,
      imagem: produto.imagem,
      qty: 1,
    });
  }

  flashCard(id);
  renderProdutos();
  atualizarCartBar();
}

function diminuirNoCarrinho(id) {
  const idx = carrinho.findIndex((c) => c.id === id);
  if (idx !== -1) {
    if (carrinho[idx].qty > 1) carrinho[idx].qty--;
    else carrinho.splice(idx, 1);
  }

  renderProdutos();
  atualizarCartBar();
}

function flashCard(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (card) {
    card.classList.remove('flash');
    void card.offsetWidth;
    card.classList.add('flash');
    setTimeout(() => card.classList.remove('flash'), 500);
  }
}

// ============================================================
// CART BAR
// ============================================================

function atualizarCartBar() {
  const bar = document.getElementById('cart-bar');
  if (!bar) return;

  const totalItens = carrinho.reduce((s, i) => s + i.qty, 0);

  if (totalItens === 0) {
    bar.style.display = 'none';
    return;
  }

  bar.style.display = 'flex';
  document.getElementById('cart-count').textContent = totalItens;
  document.getElementById('cart-total').textContent = fmt(calcSubtotal());
}

function irParaCheckout() {
  document.getElementById('tela-cardapio').classList.remove('ativa');
  document.getElementById('tela-checkout').classList.add('ativa');
  renderCheckout();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarParaCardapio() {
  document.getElementById('tela-checkout').classList.remove('ativa');
  document.getElementById('tela-cardapio').classList.add('ativa');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('cart-bar')?.addEventListener('click', irParaCheckout);
document.getElementById('btn-voltar')?.addEventListener('click', voltarParaCardapio);

// ============================================================
// NAV CATEGORIAS
// ============================================================

document.querySelectorAll('.cat-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const sec = document.getElementById('cat-' + btn.dataset.cat);
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============================================================
// MODAL SABOR
// ============================================================

function abrirModalSabor(id) {
  const produto = buscarProdutoPorId(id);
  if (!produto) return;

  caldoPendente = id;
  document.getElementById('modal-product-name').textContent = `${produto.nome} — ${fmt(produto.preco)}`;
  document.querySelectorAll('.sabor-btn').forEach((b) => b.classList.remove('selected'));
  document.getElementById('modal-sabor').style.display = 'flex';
}

function fecharModalSabor() {
  document.getElementById('modal-sabor').style.display = 'none';
  caldoPendente = null;
}

document.getElementById('modal-close')?.addEventListener('click', fecharModalSabor);

document.querySelectorAll('.sabor-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sabor-btn').forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');

    if (caldoPendente) {
      adicionarAoCarrinho(caldoPendente, btn.dataset.sabor);
      fecharModalSabor();
    }
  });
});

document.getElementById('modal-sabor')?.addEventListener('click', (e) => {
  if (e.target.id === 'modal-sabor') fecharModalSabor();
});

// ============================================================
// TIPO ENTREGA
// ============================================================

document.querySelectorAll('.tipo-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    tipoEntrega = btn.dataset.tipo;
    document.querySelectorAll('.tipo-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const secaoEndereco = document.getElementById('secao-endereco');
    if (secaoEndereco) secaoEndereco.style.display = tipoEntrega === 'entrega' ? '' : 'none';

    if (tipoEntrega === 'retirada') {
      taxaEntrega = 0;
      const status = document.getElementById('bairro-status');
      if (status) {
        status.textContent = '';
        status.className = 'bairro-status';
      }
    } else {
      verificarBairro();
    }

    atualizarResumoTotais();
    atualizarBotaoFinalizar();
  });
});

// ============================================================
// CEP
// ============================================================

document.getElementById('btn-buscar-cep')?.addEventListener('click', buscarCEP);
document.getElementById('campo-cep')?.addEventListener('blur', () => {
  const cep = document.getElementById('campo-cep').value.replace(/\D/g, '');
  if (cep.length === 8) buscarCEP();
});

async function buscarCEP() {
  const campoCep = document.getElementById('campo-cep');
  const status = document.getElementById('cep-status');

  if (!campoCep || !status) return;

  const cep = campoCep.value.replace(/\D/g, '');

  if (cep.length !== 8) {
    status.textContent = 'Informe um CEP válido.';
    status.className = 'cep-status err';
    return;
  }

  status.textContent = 'Buscando CEP...';
  status.className = 'cep-status';

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();

    if (data.erro) {
      status.textContent = 'CEP não encontrado.';
      status.className = 'cep-status err';
      return;
    }

    document.getElementById('campo-rua').value = data.logradouro || '';
    document.getElementById('campo-bairro').value = data.bairro || '';
    document.getElementById('campo-cidade').value = data.localidade || '';
    document.getElementById('campo-estado').value = data.uf || '';

    status.textContent = 'CEP localizado com sucesso.';
    status.className = 'cep-status ok';

    verificarBairro();
  } catch (err) {
    status.textContent = 'Erro ao buscar o CEP.';
    status.className = 'cep-status err';
  }
}

// ============================================================
// BAIRRO
// ============================================================

document.getElementById('campo-bairro')?.addEventListener('input', verificarBairro);

function verificarBairro() {
  if (tipoEntrega !== 'entrega') return;

  const bairroRaw = document.getElementById('campo-bairro').value;
  const bairroNorm = normalizeBairro(bairroRaw);
  const status = document.getElementById('bairro-status');

  const chave = Object.keys(TAXA_ENTREGA).find((k) => normalizeBairro(k) === bairroNorm);

  if (!bairroRaw.trim()) {
    taxaEntrega = 0;
    status.textContent = '';
    status.className = 'bairro-status';
  } else if (chave !== undefined) {
    taxaEntrega = TAXA_ENTREGA[chave];
    status.textContent = `✓ Taxa de entrega: ${fmt(taxaEntrega)}`;
    status.className = 'bairro-status ok';
  } else {
    taxaEntrega = -1;
    status.textContent = 'No momento não entregamos para esse bairro.';
    status.className = 'bairro-status err';
  }

  atualizarResumoTotais();
  atualizarBotaoFinalizar();
}

// ============================================================
// PAGAMENTO
// ============================================================

document.querySelectorAll('.pag-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    pagamento = btn.dataset.pag;

    document.querySelectorAll('.pag-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    document.getElementById('taxa-cartao-info').style.display = pagamento === 'cartao' ? 'block' : 'none';
    document.getElementById('secao-troco').style.display = pagamento === 'dinheiro' ? '' : 'none';

    atualizarResumoTotais();
    atualizarBotaoFinalizar();
  });
});

// ============================================================
// TROCO
// ============================================================

document.querySelectorAll('input[name="troco"]').forEach((r) => {
  r.addEventListener('change', () => {
    const sim = document.querySelector('input[name="troco"]:checked').value === 'sim';
    document.getElementById('campo-troco-valor').style.display = sim ? 'block' : 'none';
    if (!sim) document.getElementById('troco-calc').textContent = '';
  });
});

document.getElementById('campo-troco')?.addEventListener('input', () => {
  const val = parseFloat(document.getElementById('campo-troco').value) || 0;
  const total = calcTotal();
  const calc = document.getElementById('troco-calc');

  if (val >= total) {
    calc.textContent = `Troco: ${fmt(val - total)}`;
    calc.style.color = 'var(--green)';
  } else if (val > 0) {
    calc.textContent = 'Valor insuficiente para cobrir o pedido.';
    calc.style.color = 'var(--err)';
  } else {
    calc.textContent = '';
  }
});

// ============================================================
// CHECKOUT — RENDER
// ============================================================

function renderCheckout() {
  const resumoItens = document.getElementById('resumo-itens');
  resumoItens.innerHTML = '';

  carrinho.forEach((item) => {
    const sub = item.preco * item.qty;
    const div = document.createElement('div');
    div.className = 'resumo-item';

    div.innerHTML = `
      <span class="resumo-item-emoji">${item.emoji}</span>
      <div class="resumo-item-info">
        <p class="resumo-item-name">${item.nome}</p>
        <p class="resumo-item-sub">${item.qty}x ${fmt(item.preco)}</p>
      </div>
      <span class="resumo-item-price">${fmt(sub)}</span>
    `;

    resumoItens.appendChild(div);
  });

  atualizarResumoTotais();
  atualizarBotaoFinalizar();
}

function atualizarResumoTotais() {
  const div = document.getElementById('resumo-totais');
  if (!div) return;

  const sub = calcSubtotal();
  const taxaCartao = calcTaxaCartao();
  const frete = calcFrete();
  const total = sub + frete + taxaCartao;

  let html = `
    <div class="total-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
    <div class="total-row ${tipoEntrega === 'retirada' ? 'gratis' : ''}">
      <span>Taxa de Entrega</span>
      <span>${tipoEntrega === 'retirada' ? 'Grátis' : (taxaEntrega >= 0 ? fmt(taxaEntrega) : '—')}</span>
    </div>
  `;

  if (taxaCartao) {
    html += `<div class="total-row"><span>Taxa Cartão</span><span>${fmt(taxaCartao)}</span></div>`;
  }

  html += `<div class="total-row destaque"><span>Total</span><span>${fmt(total)}</span></div>`;

  div.innerHTML = html;
  atualizarBotaoFinalizar();
}

function atualizarBotaoFinalizar() {
  const el = document.getElementById('btn-total-label');
  if (el) el.textContent = fmt(calcTotal());
}

// ============================================================
// FINALIZAR
// ============================================================

document.getElementById('btn-finalizar')?.addEventListener('click', finalizarPedido);

function finalizarPedido() {
  const erros = [];

  if (carrinho.length === 0) erros.push('Seu carrinho está vazio.');

  const nome = document.getElementById('campo-nome').value.trim();
  const telefone = document.getElementById('campo-telefone').value.trim();

  if (!nome) erros.push('Informe seu nome.');
  if (!telefone) erros.push('Informe seu telefone.');

  let rua = '';
  let numero = '';
  let complemento = '';
  let bairro = '';
  let cep = '';
  let cidade = '';
  let estado = '';

  if (tipoEntrega === 'entrega') {
    rua = document.getElementById('campo-rua').value.trim();
    numero = document.getElementById('campo-numero').value.trim();
    complemento = document.getElementById('campo-complemento').value.trim();
    bairro = document.getElementById('campo-bairro').value.trim();
    cep = document.getElementById('campo-cep').value.trim();
    cidade = document.getElementById('campo-cidade').value.trim();
    estado = document.getElementById('campo-estado').value.trim();

    if (!rua) erros.push('Informe um CEP válido para preencher a rua.');
    if (!numero) erros.push('Informe o número do endereço.');
    if (!bairro) erros.push('Informe o bairro.');
    if (taxaEntrega < 0) erros.push('No momento não entregamos para esse bairro.');
  }

  if (pagamento === 'dinheiro') {
    const precisaTroco = document.querySelector('input[name="troco"]:checked')?.value === 'sim';
    const valorTroco = parseFloat(document.getElementById('campo-troco').value) || 0;

    if (precisaTroco && valorTroco < calcTotal()) {
      erros.push('O valor informado para troco é insuficiente.');
    }
  }

  const errosBox = document.getElementById('erros-checkout');
  if (erros.length) {
    errosBox.style.display = 'block';
    errosBox.innerHTML = erros.map((e) => `<p>${e}</p>`).join('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  errosBox.style.display = 'none';
  errosBox.innerHTML = '';

  const subtotal = calcSubtotal();
  const frete = calcFrete();
  const taxaCartao = calcTaxaCartao();
  const total = calcTotal();

  let mensagem = `*NOVO PEDIDO - MASSA ALEGRE*\n\n`;
  mensagem += `*Nome:* ${nome}\n`;
  mensagem += `*Telefone:* ${telefone}\n\n`;
  mensagem += `*Tipo do pedido:* ${tipoEntrega === 'retirada' ? 'Retirada' : 'Entrega'}\n\n`;

  if (tipoEntrega === 'entrega') {
    mensagem += `*Endereço:*\n`;
    mensagem += `Rua ${rua}, ${numero}\n`;
    if (complemento) mensagem += `Complemento: ${complemento}\n`;
    mensagem += `Bairro: ${bairro}\n`;
    mensagem += `CEP: ${cep}\n`;
    mensagem += `Cidade: ${cidade} - ${estado}\n\n`;
  }

  mensagem += `*Itens do pedido:*\n`;
  carrinho.forEach((item) => {
    const sub = item.preco * item.qty;
    mensagem += `${item.qty}x ${item.nome} — ${fmt(sub)}\n`;
  });

  mensagem += `\n*Subtotal:* ${fmt(subtotal)}\n`;
  mensagem += `*Taxa de Entrega:* ${tipoEntrega === 'retirada' ? 'Grátis' : fmt(frete)}\n`;
  mensagem += `*Taxa Cartão:* ${fmt(taxaCartao)}\n`;
  mensagem += `*Total:* ${fmt(total)}\n\n`;
  mensagem += `*Pagamento:* ${pagamento === 'dinheiro' ? 'Dinheiro' : pagamento === 'cartao' ? 'Cartão' : 'Pix'}\n`;

  if (pagamento === 'dinheiro') {
    const precisaTroco = document.querySelector('input[name="troco"]:checked')?.value === 'sim';
    const valorTroco = parseFloat(document.getElementById('campo-troco').value) || 0;

    if (precisaTroco) {
      mensagem += `*Vai pagar com:* ${fmt(valorTroco)}\n`;
      mensagem += `*Troco:* ${fmt(valorTroco - total)}\n`;
    } else {
      mensagem += `*Troco:* Não precisa\n`;
    }
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

renderProdutos();
atualizarCartBar();
atualizarResumoTotais();
atualizarBotaoFinalizar();