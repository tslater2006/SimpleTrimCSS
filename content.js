/* Looks through all styleSheets on the document and only returns rules 
   that applies to elements on the page. If the rule is a media query it will inspect
   the rules inside that query and only keep the ones that match elements on the page
*/
function getUsedCSSRules() {
    let usedRules = [];
    let styleSheets = document.styleSheets;

    for (let i = 0; i < styleSheets.length; i++) {
        let cssRules = styleSheets[i].cssRules;

        for (let j = 0; j < cssRules.length; j++) {
            let rule = cssRules[j];
            
            if (rule instanceof CSSMediaRule) {
                // Handle media query rules
                let mediaRules = Array.from(rule.cssRules);
                let usedMediaRules = [];

                for (let mediaRule of mediaRules) {
                    let matches = document.querySelectorAll(mediaRule.selectorText);

                    if (matches.length) {
                        usedMediaRules.push(mediaRule.cssText);
                    }
                }

                if (usedMediaRules.length) {
                    usedRules.push(`@media ${rule.media} { ${usedMediaRules.join(' ')} }`);
                }
            } else {
                // Handle regular rules
                let matches = document.querySelectorAll(rule.selectorText);
                if (matches.length || rule.cssText.startsWith("@")) {
                    usedRules.push(rule.cssText);
                }
            }
        }
    }
    return usedRules;
}

function removeAllStylesheets() {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style');
    for (const sheet of stylesheets) {
        sheet.remove();
    }
}

function createNewStylesheet(cssRules) {
    const styleElement = document.createElement('style');
    styleElement.setAttribute("type", "text/css");
    const cssText = cssRules.join('\n');
    styleElement.appendChild(document.createTextNode(cssText));
    return styleElement;
}
const usedCSSRules = getUsedCSSRules();
removeAllStylesheets();
document.head.append(createNewStylesheet(usedCSSRules));

alert("CSS rules have been trimmed. If it still looks the same then it is (probably?) OK");