async(page)=>{
 return await page.evaluate(()=>({active:document.activeElement.outerHTML,open:document.getElementById('admin-manager-menu').matches(':popover-open'),inert:document.getElementById('admin-manager-menu').inert,style:document.getElementById('admin-manager-menu').getAttribute('style')}));
}
