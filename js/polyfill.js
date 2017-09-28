
let promises = [];
if(! ('append' in Element.prototype) || ! ('replaceWith' in Element.prototype)
	|| ! ('matches' in Element.prototype) || ! ('closest' in Element.prototype)) {
	promises.push(import(/* webpackChunkName: "dom4" */ 'mara/polyfill/standard'));
}

if(! window.customElements || ! ('attachShadow' in Element.prototype)) {
	promises.push(import(/* webpackChunkName: "webcomponents" */ 'mara/polyfill/webcomponents'));
}

export default Promise.all(promises);
