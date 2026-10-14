async (page) => {
  const errors = [];
  const checks = [];
  const menus = [];
  const captures = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  const check = (name, condition, details) => {
    checks.push({ name, passed: Boolean(condition), details });
    if (!condition) throw new Error(name + ": " + JSON.stringify(details));
  };
  async function load(route, width, height) {
    await page.setViewportSize({ width, height });
    await page.goto("http://localhost:3001" + route);
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole("heading", { level: 1 }).waitFor();
  }
  async function open(trigger, name, capture) {
    await trigger.click();
    const id = await trigger.getAttribute("popovertarget");
    await page.waitForFunction(id => {
      const menu = document.getElementById(id);
      return menu.matches(":popover-open") && getComputedStyle(menu).opacity === "1";
    }, id);
    const metrics = await page.locator("#" + id).evaluate(menu => {
      const trigger = [...document.querySelectorAll("button[popovertarget]")]
        .find(button => button.getAttribute("popovertarget") === menu.id && button.getAttribute("popovertargetaction") !== "hide");
      const r = menu.getBoundingClientRect();
      const a = trigger.getBoundingClientRect();
      const style = getComputedStyle(menu);
      return { id:menu.id, rect:r.toJSON(), anchor:a.toJSON(), side:menu.dataset.side,
        x:style.getPropertyValue("--popover-slide-x"), y:style.getPropertyValue("--popover-slide-y"),
        viewport:{width:document.documentElement.clientWidth,height:innerHeight},
        transition:style.transition, transform:style.transform,
        scrollHeight:menu.scrollHeight, clientHeight:menu.clientHeight,
        focused:document.activeElement.getAttribute("aria-label") };
    });
    check(name + " visível dentro da tela", metrics.rect.x >= 11 && metrics.rect.y >= 11 &&
      metrics.rect.right <= metrics.viewport.width - 11 && metrics.rect.bottom <= metrics.viewport.height - 11, metrics);
    check(name + " junto ao botão", Math.abs(metrics.side === "bottom"
      ? metrics.rect.top - metrics.anchor.bottom - 8
      : metrics.anchor.top - metrics.rect.bottom - 8) < 2, metrics);
    check(name + " slide conforme o lado", metrics.side === "bottom" ? parseFloat(metrics.y) < 0 : parseFloat(metrics.y) > 0, metrics);
    menus.push({name,...metrics});
    if (capture) {
      const path = "output/playwright/admin-menus/" + capture + ".png";
      await page.screenshot({path}); captures.push(path);
    }
    return {id,metrics};
  }
  async function escape(id) {
    await page.keyboard.press("Escape");
    const state = await page.locator("#" + id).evaluate(menu => ({
      closed:!menu.matches(":popover-open"), inert:menu.inert,
      pointer:getComputedStyle(menu).pointerEvents,
      focus:document.activeElement.getAttribute("popovertarget") }));
    check("Escape fecha e desativa " + id, state.closed && state.inert && state.pointer === "none", state);
    check("Escape restaura foco " + id, state.focus === id, state);
  }

  await load("/dashboard/clientes",1280,900);
  const notification = page.getByRole("button", {name:"Ver notificações",exact:true});
  let result = await open(notification,"Notificações desktop","desktop-notifications");
  await escape(result.id);
  result = await open(page.getByRole("button",{name:"Abrir ajuda",exact:true}),"Ajuda toolbar");
  await page.getByRole("heading",{name:"Base de Clientes",exact:true}).click();
  check("Clique fora fecha ajuda", await page.locator("#"+result.id).evaluate(menu=>!menu.matches(":popover-open")));
  const profile = page.getByRole("button",{name:"Abrir menu do gerente Marcus V.",exact:true});
  result = await open(profile,"Perfil desktop","desktop-profile");
  await escape(result.id);
  const actions = page.getByRole("button",{name:"Ações de Ana Beatriz Silva",exact:true}).first();
  result = await open(actions,"Ações cliente desktop","desktop-client");
  await page.evaluate(()=>window.scrollBy({top:100,behavior:"instant"}));
  await page.waitForFunction(id => {
    const p=document.getElementById(id), t=[...document.querySelectorAll("button[popovertarget]")].find(b=>b.getAttribute("popovertarget")===id);
    const r=p.getBoundingClientRect(),a=t.getBoundingClientRect();
    return Math.abs(p.dataset.side==="bottom" ? r.top-a.bottom-8 : a.top-r.bottom-8)<2;
  },result.id);
  check("Menu acompanha scroll",true);
  await page.evaluate(()=>window.scrollBy({top:900,behavior:"instant"}));
  await page.waitForFunction(id=>!document.getElementById(id).matches(":popover-open"),result.id);
  check("Menu fecha quando botão sai da visão",true);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
  result=await open(page.getByRole("button",{name:"Suporte",exact:true}),"Suporte desktop","desktop-support");
  await escape(result.id);

  // Check the entire running motion, rather than just its final coordinates.
  await notification.click();
  const animation = await page.locator("#admin-notifications").evaluate(menu=>{
    const effects=menu.getAnimations().filter(a=>["opacity","transform"].includes(a.transitionProperty));
    return effects.map(a=>({property:a.transitionProperty,timing:a.effect.getTiming(),frames:a.effect.getKeyframes()}));
  });
  check("Fade e slide reais na entrada",animation.some(a=>a.property==="opacity")&&animation.some(a=>a.property==="transform"),animation);
  check("Duração de entrada 180ms",animation.every(a=>a.timing.duration===180),animation);
  await page.keyboard.press("Escape");
  await notification.click(); await notification.click(); await notification.click();
  check("Reabertura rápida utilizável",await page.locator("#admin-notifications").evaluate(p=>p.matches(":popover-open")&&!p.inert));
  await page.keyboard.press("Escape");

  await load("/dashboard/cardapio",768,1024);
  result=await open(page.getByRole("button",{name:"Abrir ajuda",exact:true}),"Ajuda tablet","tablet-help");
  await escape(result.id);
  result=await open(page.getByRole("button",{name:"Abrir menu do gerente Marcus V.",exact:true}),"Perfil tablet");
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>document.getElementById("admin-manager-menu").getBoundingClientRect().right<document.documentElement.clientWidth);
  check("Menu se reposiciona no resize",true);
  await escape(result.id);

  await load("/dashboard/clientes",390,844);
  const mobileActions=page.getByRole("button",{name:"Ações de Mariana Costa",exact:true}).last();
  await mobileActions.scrollIntoViewIfNeeded();
  const targetId=await mobileActions.getAttribute("popovertarget");
  await mobileActions.evaluate(button=>window.scrollBy({top:button.getBoundingClientRect().top-720,behavior:"instant"}));
  result=await open(mobileActions,"Ações cliente mobile no rodapé","mobile-client-bottom");
  check("Inverte para cima perto da borda inferior",result.metrics.side==="top",result.metrics);
  await page.getByRole("button",{name:"Editar cliente",exact:true}).click();
  check("Editar cliente continua abrindo formulário",await page.getByRole("dialog",{name:"Editar cliente",exact:true}).isVisible());
  await page.keyboard.press("Escape");
  await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
  result=await open(page.getByRole("button",{name:"Ver notificações",exact:true}),"Notificações mobile","mobile-notifications");
  await escape(result.id);
  await page.getByRole("button",{name:"Abrir menu do painel",exact:true}).click();
  result=await open(page.getByRole("button",{name:"Suporte",exact:true}),"Suporte dentro do drawer","mobile-drawer-support");
  await escape(result.id);
  check("Escape do popover preserva drawer",await page.getByRole("dialog",{name:"Menu do painel",exact:true}).isVisible());
  await page.keyboard.press("Escape");

  await load("/dashboard",320,500);
  await page.getByRole("button",{name:"Abrir menu do painel",exact:true}).click();
  result=await open(page.getByRole("button",{name:"Suporte",exact:true}),"Suporte mobile baixo","small-support");
  check("Conteúdo alto recebe scroll interno",result.metrics.scrollHeight>result.metrics.clientHeight,result.metrics);
  await page.locator("#"+result.id).evaluate(p=>p.scrollTop=p.scrollHeight);
  check("Texto final alcançável no menu",await page.locator("#"+result.id).evaluate(p=>p.scrollTop>0));
  await escape(result.id); await page.keyboard.press("Escape");

  await load("/dashboard/configuracoes",1280,900);
  const cursor=await page.evaluate(()=>({
    wrong:[...document.querySelectorAll('[data-admin-shell] button:not(:disabled), [data-admin-shell] a[href], [data-admin-shell] select, [data-admin-shell] input[type="checkbox"], [data-admin-shell] input[type="time"]')]
      .filter(e=>e.getClientRects().length>0&&getComputedStyle(e).cursor!=="pointer").map(e=>e.outerHTML),
    text:getComputedStyle(document.getElementById("establishment-name")).cursor,
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  }));
  check("Cursor pointer em todos controles ativos",cursor.wrong.length===0,cursor);
  check("Campos de escrita preservam cursor de texto",cursor.text==="text",cursor);
  check("Sem overflow horizontal",!cursor.overflow,cursor);
  const keyTrigger=page.getByRole("button",{name:"Abrir menu do gerente Marcus V.",exact:true});
  await keyTrigger.focus(); await page.keyboard.press("Enter");
  await page.waitForFunction(()=>document.activeElement.getAttribute("aria-label")==="Fechar marcus v.");
  check("Teclado abre perfil e move foco para fechar",await page.getByRole("button",{name:"Fechar marcus v.",exact:true}).evaluate(b=>document.activeElement===b));
  await page.keyboard.press("Tab");
  check("Tab alcança ação do perfil",await page.getByRole("link",{name:"Sair do painel",exact:true}).evaluate(l=>document.activeElement===l));
  await escape("admin-manager-menu");
  await page.emulateMedia({reducedMotion:"reduce"});
  result=await open(keyTrigger,"Perfil movimento reduzido");
  check("Movimento reduzido remove slide",result.metrics.transform==="none",result.metrics);
  check("Movimento reduzido mantém fade curto",result.metrics.transition.includes("0.1s")&&!result.metrics.transition.includes("transform"),result.metrics);
  await escape(result.id); await page.emulateMedia({reducedMotion:"no-preference"});
  check("Sem erros de console",errors.length===0,errors);
  return {checks,menus,animation,captures,errors};
}
