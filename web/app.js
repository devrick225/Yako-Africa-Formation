'use strict';
const el = id => document.getElementById(id);
let services = [], events = [], businessAvailable = false;
const descriptions = {Assistance:'Un point de contact pour vous accompagner.',Information:'Les informations utiles, au même endroit.'};
function node(tag, text, className){ const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n; }
function renderServices(){
 const list=el('services');list.replaceChildren();
 const query=el('search').value.trim().toLocaleLowerCase('fr');
 const filtered=services.filter(s=>`${s.nom} ${s.id}`.toLocaleLowerCase('fr').includes(query));
 el('count').textContent=businessAvailable?`${filtered.length} / ${services.length} service${services.length>1?'s':''}`:'Indisponible';
 if(!businessAvailable)return;
 if(!filtered.length){list.append(node('p',query?'Aucun service ne correspond à votre recherche.':'Le catalogue ne contient aucun service.','empty'));return;}
 for(const service of filtered){
  const card=node('article',undefined,'service-card');
  const symbol=node('div',service.nom==='Assistance'?'☏':service.nom==='Information'?'ⓘ':'◇','service-icon');symbol.setAttribute('aria-hidden','true');
  card.append(symbol,node('h3',service.nom),node('p',descriptions[service.nom]||'Service du catalogue de formation.'),node('p',`Identifiant ${service.id}`),node('span',service.actif?'Actif':'Inactif',`service-state${service.actif?'':' inactive'}`));list.append(card);
 }
}
async function request(url){
 const start=performance.now();
 try{const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(5000)});let data;try{data=await response.json();}catch{return{ok:false,status:response.status,error:'Réponse JSON invalide'};}return{ok:response.ok,status:response.status,data,ms:Math.round(performance.now()-start)};}
 catch{return{ok:false,status:null,error:'Connexion impossible ou délai dépassé'};}
}
function statusCode(id,result){el(id).textContent=result.status??'Hors ligne';el(id).className=`http-code ${result.ok?'good':'bad'}`;}
async function refresh(){
 const button=el('refresh');if(button.disabled)return;button.disabled=true;
 try{
  const [info,health,business]=await Promise.all([request('/api/info'),request('/health'),request('/api/services')]);
  el('environment').textContent=info.ok?info.data.environment:'Non disponible';
  el('version').textContent=info.ok?info.data.version:'—';
  el('origin').textContent=location.origin;
  const validCatalogue=business.ok&&Array.isArray(business.data.services)&&business.data.services.every(s=>s&&typeof s.nom==='string'&&typeof s.id==='string'&&typeof s.actif==='boolean');
  businessAvailable=validCatalogue;services=validCatalogue?business.data.services:[];
  statusCode('health-code',health);statusCode('business-code',business);
  const healthy=health.ok&&validCatalogue;
  el('overall-dot').className=`status-dot ${healthy?'':'bad'}`;
  el('overall-title').textContent=healthy?'Le catalogue répond correctement':health.ok?'Le catalogue rencontre un incident':'L’application ne répond pas correctement';
  el('overall-detail').textContent=healthy?`Health et catalogue disponibles. Version observée : ${business.data.version}.`:'Comparez les réponses HTTP et consultez les logs du conteneur.';
  const message=el('catalogue-message');message.replaceChildren();
  if(!validCatalogue)message.append(node('div',business.status===503?'Le catalogue est temporairement indisponible (HTTP 503). Le point de santé peut rester accessible.':business.ok?'Le format du catalogue reçu est invalide.':`Impossible de charger le catalogue : ${business.status?'HTTP '+business.status:business.error}.`,'message'));
  const time=new Date().toLocaleTimeString('fr-FR');el('checked-at').textContent=time;
  events.unshift(`${time} · health ${health.status??'—'} · catalogue ${business.status??'—'} · ${business.data?.version??'version inconnue'}`);events=events.slice(0,5);
  el('history').replaceChildren(...events.map(event=>node('li',event)));
  renderServices();
 }finally{button.disabled=false;}
}
el('refresh').addEventListener('click',refresh);el('search').addEventListener('input',renderServices);refresh();setInterval(refresh,15000);
