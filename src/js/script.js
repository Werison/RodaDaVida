// Estrutura dos setores da roda da vida
const setores = [
    { nome: 'Saúde e Disposição', cor: '#f78da7', grupo: 'Pessoal' },
    { nome: 'Desenvolvimento Intelectual', cor: '#f78da7', grupo: 'Pessoal' },
    { nome: 'Equilíbrio Emocional', cor: '#f78da7', grupo: 'Pessoal' },
    { nome: 'Recursos Financeiros', cor: '#7ed957', grupo: 'Profissional' },
    { nome: 'Realização e Propósito', cor: '#7ed957', grupo: 'Profissional' },
    { nome: 'Contribuição Social', cor: '#7ed957', grupo: 'Profissional' },
    { nome: 'Família', cor: '#fbb040', grupo: 'Relacionamentos' },
    { nome: 'Relacionamento Amoroso', cor: '#fbb040', grupo: 'Relacionamentos' },
    { nome: 'Vida Social', cor: '#fbb040', grupo: 'Relacionamentos' },
    { nome: 'Saúde Física', cor: '#4a90e2', grupo: 'Qualidade de Vida' },
    { nome: 'Espiritualidade', cor: '#4a90e2', grupo: 'Qualidade de Vida' },
    { nome: 'Recreação/Lazer', cor: '#4a90e2', grupo: 'Qualidade de Vida' }
];

const niveis = 10;
let selecao = Array(setores.length).fill(null).map(() => Array(niveis).fill(false));

const canvas = document.getElementById('rodaDaVidaCanvas');
const ctx = canvas.getContext('2d');
canvas.addEventListener('click', handleCanvasClick);

drawRodaDaVida();

function drawRodaDaVida() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const raioExterno = 310;
    const raioInterno = 70;
    const setorAngle = (2 * Math.PI) / setores.length;
    const raioStep = (raioExterno - raioInterno) / niveis;

    // Desenha círculos concêntricos (níveis)
    for (let n = 1; n <= niveis; n++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, raioInterno + n * raioStep, 0, 2 * Math.PI);
        ctx.strokeStyle = '#bbb';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Números dos níveis
        ctx.save();
        ctx.font = '12px Segoe UI';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n, centerX, centerY - (raioInterno + n * raioStep) + 10);
        ctx.restore();
    }

    // Desenha setores
    for (let i = 0; i < setores.length; i++) {
        for (let n = 0; n < niveis; n++) {
            const startAngle = i * setorAngle;
            const endAngle = (i + 1) * setorAngle;
            const r0 = raioInterno + n * raioStep;
            const r1 = raioInterno + (n + 1) * raioStep;
            ctx.beginPath();
            ctx.arc(centerX, centerY, r1, startAngle, endAngle, false);
            ctx.arc(centerX, centerY, r0, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = selecao[i][n] ? setores[i].cor : '#fff';
            ctx.globalAlpha = selecao[i][n] ? 0.7 : 1.0;
            ctx.strokeStyle = setores[i].cor;
            ctx.lineWidth = 1.2;
            ctx.fill();
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }
    }

    // Desenha números dos níveis em cada setor
    for (let i = 0; i < setores.length; i++) {
        const angle = i * setorAngle + setorAngle / 2;
        for (let n = 1; n <= niveis; n++) {
            const numRadius = raioInterno + n * raioStep - raioStep / 2;
            ctx.save();
            ctx.font = 'bold 11px Segoe UI';
            ctx.fillStyle = '#888';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.translate(centerX + Math.cos(angle) * numRadius, centerY + Math.sin(angle) * numRadius);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillText(n, 0, 0);
            ctx.restore();
        }
    }

    // Desenha linhas divisórias dos setores
    for (let i = 0; i < setores.length; i++) {
        const angle = i * setorAngle;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * raioExterno, centerY + Math.sin(angle) * raioExterno);
        // Destaca separadores de grupo
        if (i % 3 === 0) {
            ctx.strokeStyle = setores[i].cor;
            ctx.lineWidth = 4.5;
        } else {
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1.2;
        }
        ctx.stroke();
    }

    // Desenha nomes dos setores ao longo do arco
    for (let i = 0; i < setores.length; i++) {
        const labelRadius = raioExterno + 10;
        drawCurvedText(
            setores[i].nome,
            centerX,
            centerY,
            labelRadius,
            i * setorAngle,
            (i + 1) * setorAngle,
            setores[i].cor
        );
    }

    // Desenha os grandes grupos envolvendo o círculo
    const grupos = [
        { nome: 'PESSOAL', cor: '#f78da7', start: 0, end: Math.PI / 2 },
        { nome: 'PROFISSIONAL', cor: '#7ed957', start: Math.PI / 2, end: Math.PI },
        { nome: 'RELACIONAMENTOS', cor: '#fbb040', start: Math.PI, end: 3 * Math.PI / 2 },
        { nome: 'QUALIDADE DE VIDA', cor: '#4a90e2', start: 3 * Math.PI / 2, end: 2 * Math.PI }
    ];
    const grupoRadius = raioExterno + 30; // Aproxima os grupos das subcategorias
    for (const grupo of grupos) {
        drawCurvedText(
            grupo.nome,
            centerX,
            centerY,
            grupoRadius,
            grupo.start,
            grupo.end,
            grupo.cor,
            true // Maior fonte para grupo
        );
    }
}

function drawCurvedText(text, cx, cy, radius, startAngle, endAngle, color, isGroup) {
    ctx.save();
    let fontSize = isGroup ? 15 : 12;
    ctx.font = (isGroup ? 'bold ' : 'bold ') + fontSize + 'px Segoe UI';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let arcLen = radius * (endAngle - startAngle);
    ctx.font = (isGroup ? 'bold ' : 'bold ') + fontSize + 'px Segoe UI';

    let lines = [];
    if (isGroup) {
        // Quebra o texto em múltiplas linhas para garantir que cada linha caiba no arco
        let words = text.split(' ');
        let currentLine = words[0];
        for (let i = 1; i < words.length; i++) {
            let testLine = currentLine + ' ' + words[i];
            if (ctx.measureText(testLine).width > arcLen * 0.95) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        // Diminui a fonte até todas as linhas caberem
        let maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
        while (maxLineWidth > arcLen * 0.98 && fontSize > 9) {
            fontSize -= 1;
            ctx.font = 'bold ' + fontSize + 'px Segoe UI';
            maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
        }
    } else {
        // Subcategoria: apenas uma linha
        lines = [text];
        while (ctx.measureText(text).width > arcLen && fontSize > 8) {
            fontSize -= 1;
            ctx.font = 'bold ' + fontSize + 'px Segoe UI';
        }
    }

    // Espaçamento mínimo entre linhas e centralização em arco
    let lineSpacing = isGroup ? fontSize - 7 : fontSize + 1;
    // Centraliza o bloco de texto no arco
    let blocoAltura = (lines.length - 1) * lineSpacing;
    let baseRadius = radius - blocoAltura / 2;
    for (let l = 0; l < lines.length; l++) {
        let line = lines[l];
        let r = baseRadius + l * lineSpacing;
        const chars = line.split('');
        let totalWidth = 0;
        for (let c of chars) totalWidth += ctx.measureText(c).width;
        let anglePerPixel = (endAngle - startAngle) / totalWidth;
        let currentAngle = startAngle + ((endAngle - startAngle) - anglePerPixel * totalWidth) / 2;
        for (let c of chars) {
            let charWidth = ctx.measureText(c).width;
            let charAngle = charWidth * anglePerPixel;
            let angle = currentAngle + charAngle / 2;
            ctx.save();
            ctx.translate(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillText(c, 0, 0);
            ctx.restore();
            currentAngle += charAngle;
        }
    }
    ctx.restore();
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const setorAngle = (2 * Math.PI) / setores.length;
    let a = angle < 0 ? angle + 2 * Math.PI : angle;
    let setorIdx = Math.floor(a / setorAngle);
    let raioInterno = 70;
    let raioExterno = 310;
    let raioStep = (raioExterno - raioInterno) / niveis;
    let nivelIdx = Math.floor((dist - raioInterno) / raioStep);
    // Permite seleção em todos os setores, mas ignora cliques muito próximos das linhas de separação de grupo
    const separadorMargin = 0.035; // margem angular para considerar "em cima" do separador
    if ([0,3,6,9].some(idx => Math.abs(a - idx * setorAngle) < separadorMargin)) return;
    if (nivelIdx >= 0 && nivelIdx < niveis && setorIdx >= 0 && setorIdx < setores.length && dist >= raioInterno && dist <= raioExterno) {
        for (let n = 0; n < niveis; n++) {
            selecao[setorIdx][n] = n <= nivelIdx;
        }
        drawRodaDaVida();
    }
}

// --- Exportar respostas para PDF ---
const exportarBtn = document.getElementById('exportarPDF');
if (exportarBtn) {
    exportarBtn.addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const canvas = document.getElementById('rodaDaVidaCanvas');
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgProps = doc.getImageProperties(imgData);
        const maxImgWidth = 180;
        const imgWidth = Math.min(maxImgWidth, pageWidth - 30);
        const imgHeight = imgProps.height * (imgWidth / imgProps.width);
        doc.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 15, imgWidth, imgHeight);
        let y = 20 + imgHeight;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Roda da Vida - Plano de Ação', pageWidth / 2, y, { align: 'center' });
        y += 10;
        doc.setLineWidth(0.5);
        doc.line(15, y, pageWidth - 15, y);
        y += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        function addArea(nome, id) {
            const valor = document.getElementById(id).value.trim();
            doc.setFont('helvetica', 'bold');
            // Se não couber o bloco, adiciona nova página
            if (y + 30 > pageHeight) {
                doc.addPage();
                y = 20;
            }
            doc.text(nome, 18, y);
            y += 8;
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(valor || '(Sem ações registradas)', pageWidth - 36);
            for (let i = 0; i < lines.length; i++) {
                if (y + 10 > pageHeight) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(lines[i], 18, y);
                y += 7;
            }
            y += 8;
        }
        addArea('PESSOAL', 'acao-pessoal');
        addArea('PROFISSIONAL', 'acao-profissional');
        addArea('RELACIONAMENTOS', 'acao-relacionamentos');
        addArea('QUALIDADE DE VIDA', 'acao-qualidade');
        doc.save('roda_da_vida_acoes.pdf');
    });
}
