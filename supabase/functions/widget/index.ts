import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const userId = url.searchParams.get("uid");

  if (!userId) {
    return new Response("Missing uid parameter", { status: 400, headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const CHAT_URL = `${SUPABASE_URL}/functions/v1/chat`;

  const widgetJS = `
(function() {
  if (window.__botdesk_loaded) return;
  window.__botdesk_loaded = true;

  var OWNER = "${userId}";
  var CHAT_URL = "${CHAT_URL}";
  var ANON_KEY = "${ANON_KEY}";

  var style = document.createElement('style');
  style.textContent = \`
    #botdesk-widget-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer;
      background: linear-gradient(135deg, #e8683a 0%, #e89030 100%);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s;
    }
    #botdesk-widget-btn:hover { transform: scale(1.08); }
    #botdesk-widget-btn svg { width: 24px; height: 24px; fill: white; }
    #botdesk-chat-window {
      position: fixed; bottom: 96px; right: 24px; z-index: 99999;
      width: 370px; max-width: calc(100vw - 40px); height: 500px;
      border-radius: 16px; overflow: hidden; display: none;
      flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      box-shadow: 0 12px 40px rgba(0,0,0,0.2); background: #fff;
    }
    #botdesk-chat-window.open { display: flex; }
    #botdesk-header {
      background: linear-gradient(135deg, #1a2340 0%, #2a3555 50%, #2d2d5e 100%);
      padding: 16px 20px; display: flex; align-items: center; gap: 12px;
    }
    #botdesk-header .avatar {
      width: 36px; height: 36px; border-radius: 50%; display: flex;
      align-items: center; justify-content: center;
      background: linear-gradient(135deg, #e8683a 0%, #e89030 100%);
    }
    #botdesk-header .avatar svg { width: 20px; height: 20px; fill: white; }
    #botdesk-header .info h3 { margin: 0; font-size: 14px; font-weight: 600; color: #f1f5f9; }
    #botdesk-header .info p { margin: 2px 0 0; font-size: 11px; color: rgba(241,245,249,0.6); }
    #botdesk-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex;
      flex-direction: column; gap: 10px;
    }
    .bd-msg { max-width: 78%; padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; word-wrap: break-word; white-space: pre-wrap; }
    .bd-msg.assistant { background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px; align-self: flex-start; }
    .bd-msg.user { background: linear-gradient(135deg, #e8683a 0%, #e89030 100%); color: #fff; border-bottom-right-radius: 4px; align-self: flex-end; }
    #botdesk-input-area {
      padding: 12px 16px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px;
    }
    #botdesk-input {
      flex: 1; border: none; background: #f1f5f9; border-radius: 12px;
      padding: 10px 14px; font-size: 14px; outline: none;
    }
    #botdesk-send {
      width: 40px; height: 40px; border: none; border-radius: 12px; cursor: pointer;
      background: linear-gradient(135deg, #e8683a 0%, #e89030 100%);
      display: flex; align-items: center; justify-content: center;
    }
    #botdesk-send:disabled { opacity: 0.5; cursor: default; }
    #botdesk-send svg { width: 16px; height: 16px; fill: white; }
    .bd-typing { display: flex; gap: 4px; padding: 12px 14px; background: #f1f5f9; border-radius: 16px; border-bottom-left-radius: 4px; align-self: flex-start; }
    .bd-typing span { width: 7px; height: 7px; background: #94a3b8; border-radius: 50%; animation: bdpulse 1.2s infinite; }
    .bd-typing span:nth-child(2) { animation-delay: 0.15s; }
    .bd-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes bdpulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
  \`;
  document.head.appendChild(style);

  // Chat icon SVGs
  var chatSVG = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';
  var closeSVG = '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" fill="none"/></svg>';
  var sendSVG = '<svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>';
  var botSVG = '<svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7v1a2 2 0 01-2 2h-1v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1H5a2 2 0 01-2-2v-1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM9.5 14a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>';

  var btn = document.createElement('button');
  btn.id = 'botdesk-widget-btn';
  btn.innerHTML = chatSVG;
  document.body.appendChild(btn);

  var win = document.createElement('div');
  win.id = 'botdesk-chat-window';
  win.innerHTML = '<div id="botdesk-header"><div class="avatar">' + botSVG + '</div><div class="info"><h3>BotDesk AI</h3><p>Always online • Powered by AI</p></div></div><div id="botdesk-messages"></div><div id="botdesk-input-area"><input id="botdesk-input" placeholder="Type your message..." /><button id="botdesk-send">' + sendSVG + '</button></div>';
  document.body.appendChild(win);

  var messages = [{ role: 'assistant', content: 'Hi! 👋 How can I help you today?' }];
  var isLoading = false;
  var msgsEl = win.querySelector('#botdesk-messages');
  var inputEl = win.querySelector('#botdesk-input');
  var sendBtn = win.querySelector('#botdesk-send');

  function render() {
    msgsEl.innerHTML = '';
    messages.forEach(function(m) {
      var d = document.createElement('div');
      d.className = 'bd-msg ' + m.role;
      d.textContent = m.content;
      msgsEl.appendChild(d);
    });
    if (isLoading && messages[messages.length-1].role === 'user') {
      var t = document.createElement('div');
      t.className = 'bd-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      msgsEl.appendChild(t);
    }
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  render();

  btn.onclick = function() {
    var open = win.classList.toggle('open');
    btn.innerHTML = open ? closeSVG : chatSVG;
  };

  async function send() {
    var text = inputEl.value.trim();
    if (!text || isLoading) return;
    inputEl.value = '';
    messages.push({ role: 'user', content: text });
    isLoading = true;
    render();

    try {
      var resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ANON_KEY },
        body: JSON.stringify({ messages: messages, widget_user_id: OWNER })
      });
      if (!resp.ok) throw new Error('Error ' + resp.status);
      var reader = resp.body.getReader();
      var decoder = new TextDecoder();
      var buf = '';
      var assistantContent = '';

      while (true) {
        var result = await reader.read();
        if (result.done) break;
        buf += decoder.decode(result.value, { stream: true });
        var idx;
        while ((idx = buf.indexOf('\\n')) !== -1) {
          var line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.startsWith('data: ')) {
            var json = line.slice(6).trim();
            if (json === '[DONE]') break;
            try {
              var parsed = JSON.parse(json);
              var c = parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
              if (c) {
                assistantContent += c;
                if (messages[messages.length-1].role === 'assistant') {
                  messages[messages.length-1].content = assistantContent;
                } else {
                  messages.push({ role: 'assistant', content: assistantContent });
                }
                render();
              }
            } catch(e) {}
          }
        }
      }
    } catch(e) {
      messages.push({ role: 'assistant', content: 'Sorry, something went wrong. Please try again.' });
    }
    isLoading = false;
    render();
  }

  sendBtn.onclick = send;
  inputEl.addEventListener('keydown', function(e) { if (e.key === 'Enter') send(); });
})();
`;

  return new Response(widgetJS, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
});
