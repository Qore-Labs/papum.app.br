async(page)=>{
  const log=[];
  log.push(await page.evaluate(()=>({scrollY,viewport:visualViewport?.toJSON?.(),
    menu:[...document.querySelectorAll(':popover-open')].map(p=>({id:p.id,rect:p.getBoundingClientRect().toJSON(),styles:p.getAttribute('style'),auto:p.querySelector('button').outerHTML,focus:document.activeElement.outerHTML})),
    trigger:document.querySelector('button[popovertarget="admin-desktop-help"]').getBoundingClientRect().toJSON()})));
  await page.keyboard.press('Escape');
  const t=page.getByRole('button',{name:'Suporte',exact:true});
  await t.scrollIntoViewIfNeeded();
  log.push({before:await t.evaluate(b=>({scrollY,rect:b.getBoundingClientRect().toJSON()}))});
  await t.click();
  log.push({afterClick:await t.evaluate(b=>({scrollY,rect:b.getBoundingClientRect().toJSON()}))});
  await page.waitForTimeout(300);
  log.push({afterSettle:await page.evaluate(()=>({scrollY,trigger:document.querySelector('button[popovertarget="admin-desktop-help"]').getBoundingClientRect().toJSON(),menu:document.getElementById('admin-desktop-help').getBoundingClientRect().toJSON(),open:document.getElementById('admin-desktop-help').matches(':popover-open')}))});
  return log;
}
