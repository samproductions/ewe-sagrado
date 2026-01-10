
# Ewé Sagrado - Ewe Expert

Este projeto identifica plantas e ervas de axé utilizando a API do Google Gemini.

## Configuração para GitHub e Vercel

### 1. GitHub
Suba todos os arquivos para o seu repositório. O arquivo `.gitignore` já está configurado para não enviar pastas desnecessárias.

### 2. Vercel
Ao importar o projeto no Vercel:
- **Framework Preset**: Escolha `Vite` ou deixe em `Other` (ele detectará o Vite).
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**IMPORTANTE:** Adicione a variável de ambiente nas configurações do projeto no Vercel:
- Key: `API_KEY`
- Value: `SUA_CHAVE_DA_API_GEMINI`

## Acesso de Teste
- **E-mail**: `admin@ewe.com`
- **Senha**: `ogum123`
