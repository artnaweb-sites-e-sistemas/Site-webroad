# WebRoad Landing Page - Configuração do Servidor

## 🚀 Como Configurar no Seu Servidor

### **Opção 1: Acesso Direto (Mais Simples)**
Acesse diretamente: `https://seudominio.com/lp.html`

### **Opção 2: Configurar .htaccess com WordPress**

1. **Backup do .htaccess atual** do WordPress
2. **Substitua** por uma das opções:

#### **A) Se você quer manter WordPress na raiz:**
- Use o arquivo `.htaccess-wordpress` 
- Renomeie para `.htaccess`
- WordPress funcionará normalmente
- Landing page acessível em `/lp.html`

#### **B) Se você quer WordPress em subpasta:**
- Mova WordPress para `/wp/` ou `/blog/`
- Use o arquivo `.htaccess` atual
- Landing page será a página principal

### **Opção 3: Teste Local**

#### **PowerShell (Windows):**
```powershell
cd "C:\Users\biras\OneDrive\Desktop\WEbROad\Site-webroad"
python -m http.server 8000
```
Acesse: `http://localhost:8000/lp.html`

#### **Node.js (se tiver instalado):**
```powershell
cd "C:\Users\biras\OneDrive\Desktop\WEbROad\Site-webroad"
node server.js
```
Acesse: `http://localhost:3000`

## 📱 Funcionalidades do Menu Mobile

✅ **Hamburger branco** destacado  
✅ **Menu desliza da esquerda**  
✅ **Links centralizados**  
✅ **Fechamento automático**  
✅ **Scroll bloqueado** quando aberto  

## 🔧 Solução de Problemas

### **Erro 404:**
- Verifique se `lp.html` está na raiz do servidor
- Confirme que `.htaccess` está configurado corretamente

### **Menu não funciona:**
- Teste localmente primeiro
- Verifique se JavaScript está carregando
- Abra DevTools (F12) para ver erros

### **Conflito com WordPress:**
- Use `.htaccess-wordpress` para compatibilidade
- Mantenha WordPress funcionando normalmente

## 📞 Suporte

Se ainda não funcionar, me informe:
1. **URL do seu site**
2. **Estrutura de pastas** (WordPress onde?)
3. **Erro específico** que aparece
