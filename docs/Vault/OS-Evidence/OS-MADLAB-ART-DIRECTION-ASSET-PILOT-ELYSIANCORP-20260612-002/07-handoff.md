# OS-MADLAB-ART-DIRECTION-ASSET-PILOT-ELYSIANCORP-20260612-002
## ME8 — Handoff to Design / Effects / Web (Updated with Non-Generic Candidates)

Este documento fornece as diretrizes, restrições e especificações técnicas de integração para os assets aprovados neste piloto. 

> [!NOTE]
> **Aviso de Escopo:** Este handoff define contratos cênicos e limites de performance; **não** promove nem instrui a implementação direta de código nesta OS, servindo como base técnica para a abertura da futura OS de Integração Visual.

---

### Asset 01 — Context Loss / Dispersion Field (Variant C)

#### Design
- **Uso visual:** Textura e máscara de fundo (background overlay) da Câmara 1 (C01_Dispersion).
- **Área segura:** 50% esquerdo da tela completamente livre de partículas de alto contraste para garantir a legibilidade do título e da copy principal.
- **Cuidados de contraste:** O contraste entre o texto em serif preto puro e os fragmentos do fundo deve ser mantido acima de 4.5:1.
- **Risco de competir com texto:** Baixo, contanto que as partículas maiores de nanquim fiquem concentradas no terço direito do container.

#### Effects
- **Movimento permitido:** Micro-deslocamento linear horizontal/vertical (drift) elástico e lento, simulando flutuação natural de poeira ou grafite.
- **Movimento proibido:** Rotações tridimensionais no eixo Z, flashes cromáticos, mudanças bruscas de escala (explosões) ou acelerações caóticas.
- **Intensidade máxima:** 10% de amplitude máxima de translação vertical em relação à altura do container.
- **Reduced motion:** Exibição da imagem estática de forma absoluta, desativando qualquer transformação cinemática CSS ou GSAP.

#### Web
- **Formato:** AVIF (principal) com fallback em WebP.
- **Lazy loading:** Eager (carregamento imediato, pois a Câmara 1 é a primeira seção visível pós-hero).
- **Fallback:** Cor sólida creme (#F8F7F3) com grid técnico de 1px em cinza leve.
- **Crop mobile:** Foco centralizado horizontalmente, comprimindo as margens para manter os fragmentos e fibras de papel visíveis no aspect ratio 9:16.
- **Feature flag sugerida:** `enable-high-fidelity-dispersion-particles`.

---

### Asset 02 — Fail-Closed Trust Boundary (Variant A v2 - Embossing Stamp)

#### Design
- **Uso visual:** Detalhe de relevo físico e marca de fechamento na Câmara 2 (C02_FailClosed).
- **Área segura:** Terço esquerdo e terço direito livres de detalhes do carimbo para abrigar a telemetria monospace de auditoria.
- **Cuidados de contraste:** O carimbo e a dobra do papel localizam-se na borda, mantendo a safe area central para exibição das colunas de texto claras sobre o papel creme.
- **Risco de competir com texto:** Muito Baixo. A textura clara do papel e a marca física de baixo contraste facilitam a legibilidade.

#### Effects
- **Movimento permitido:** Efeito sutil de compressão ou recuo linear rápido (easing de impacto curto de 80ms) ao rolar para a área de travamento.
- **Movimento proibido:** Rotações tridimensionais ou vibrações contínuas da folha de papel.
- **Intensidade máxima:** Recuo mecânico rápido horizontal sob o scroll trigger.
- **Reduced motion:** Imagem estática do carimbo de ferro fundido já pressionado e a folha de papel selada estaticamente.

#### Web
- **Formato:** WebP com canal Alpha se necessário para composição de camadas, ou AVIF comprimido.
- **Lazy loading:** Lazy (Câmara 2).
- **Fallback:** Grid esquemático estático dourado sob preto com linhas finas.
- **Crop mobile:** Foco estrito no ponto central do feixe e na junção das placas metálicas, resultando em crop 1:1.
- **Feature flag sugerida:** `enable-kinetic-fail-closed-boundary`.

---

### Asset 03 — Governed Factory / Operational Truth (Variant A v2 - Concrete Wall Corner)

#### Design
- **Uso visual:** Fundo panorâmico e profundidade da Câmara 3 (C03_GovernedFactory).
- **Área segura:** 50% esquerdo da visualização dedicado à exibição de painéis informativos de agentes e logs técnicos.
- **Cuidados de contraste:** As sombras profundas do concreto no terço esquerdo devem ser mantidas escuras e sem luz difusa para maximizar o contraste com o texto monospace claro.
- **Risco de competir com texto:** Baixo. O detalhe do concreto brutalista localiza-se no terço direito/central, deixando a margem esquerda livre e de alto contraste.

#### Effects
- **Movimento permitido:** Efeito de paralaxe bidimensional suave (drift no X e Y) simulando movimento de câmera de mão muito sutil e de baixa intensidade, em vez do avanço linear infinito Z.
- **Movimento proibido:** Movimento de trepidação lateral da câmera (camera shake), pan rápido, zoom abrupto ou rotações de câmera.
- **Intensidade máxima:** Deslocamento em X/Y proporcional a 5% da largura total do container por viewport scrolled.
- **Reduced motion:** Imagem estática focalizada no canto da parede, com paralaxe completamente desligado.

#### Web
- **Formato:** AVIF com depth map integrado para paralaxe de camadas CSS.
- **Lazy loading:** Lazy (Câmara 3).
- **Fallback:** JPG comprimido de alta definição com gradiente de escurecimento à esquerda.
- **Crop mobile:** Crop 9:16 focado no canto da parede de concreto e na marcação moss-green.
- **Feature flag sugerida:** `enable-brutalist-corridor-interactive`.
